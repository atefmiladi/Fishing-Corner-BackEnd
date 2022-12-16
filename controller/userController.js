
var bcrypt = require('bcryptjs');
const formidable = require('formidable')
var path = require('path')
const fs = require("fs")



const signup = async (req, res) => {

  var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      
      let email = fields.email

      let password = await bcrypt.hash(fields.password, 10)

      let firstname = fields.firstname
      let lastname =  fields.lastname
      let userImage = files.file
      
      let user = {email,password,firstname,lastname,userImage}
      console.log(user)
      
    const queryStringEmail = "SELECT * FROM user WHERE email = ? "
    
    pool.query(queryStringEmail, [user.email], (err, rows, fields) => {
  
      if (err) {
      
        res.status(500).end()
        throw err
  
      }
  
      if (rows.length != 0) {
    
            res.status(203).send({ auth: false })
      
        }
      else { 
  
            const queryString = "INSERT INTO user (email,firstname,lastname,password) values (?,?,?,?)"
    
            pool.query(queryString, [email,firstname,lastname, password], (err, rows, fields) => {
            if (err) {
    
                console.log(err)
                res.status(500).end()
                throw err
    
            }
            else {

              let iduser = rows.insertId
                        
              let rawData = fs.readFileSync(user.userImage.path)
              let filePath = getUserImagesPath()+'/'+iduser+path.extname(user.userImage.name);
              
              fs.writeFile(filePath, rawData, function(err){
                if(err){
    
                  res.status(500).end()
                  throw err
    
                }else{
    
                  
                  res.status(200).send({ auth: true, user: {iduser,email,password,firstname,lastname} });

                }
    
           
              }) 
        
            }
    
    
            })
  
      }
  
    })

  
    })
  }

  
const signin = async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;

  const queryString = "SELECT * FROM user WHERE email = ? "

  pool.query(queryString, [email], async (err, rows, fields) => {

    if (err) {
      
      res.status(500).end()
      throw err
    }

    if (rows.length == 0) {

      res.status(201).end()
    
    }
    else {

      const match = await bcrypt.compare(password, rows[0].password);

      if(match)
      {
      
        res.status(200).send({  iduser: rows[0].iduser,  email: rows[0].email,firstname: rows[0].firstname,lastname:rows[0].lastname,image:rows[0].image ?? "",adress:rows[0].adress ?? "", phone:rows[0].phone +""  });
        
      }else{

        res.status(201).end()

      }

    }
  })

}


const updateUser = async (req, res) => {

  var form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    
    let iduser = fields.iduser
    let firstname = fields.firstname
    let lastname =  fields.lastname
    let phone =  fields.phone
    let adress =  fields.adress

    let userImage = files.file
    let userImageFileName = Date.now() + path.extname(userImage.name);

    let user = {iduser,firstname,lastname,userImage,phone,adress}
  
    const queryString = "UPDATE user SET firstname = ?, lastname = ?, phone = ?,adress = ?,image=? WHERE iduser = ? "

    pool.query(queryString, [user.firstname,user.lastname,user.phone,user.adress,userImageFileName,user.iduser], (err, rows, fields) => {
      if (err) {
        
        res.status(500).end()
        console.log(err)
      }
      else {
      
        let rawData = fs.readFileSync(user.userImage.path)

        let filePath = getUserImagesPath()+'/'+ userImageFileName
        
        fs.writeFile(filePath, rawData, function(err){
          if(err){

            res.status(500).end()
            console.log(err)

          }else{

            res.status(200).send({  iduser: parseInt(iduser ),firstname: firstname,lastname,image:userImageFileName ?? "",adress:adress ?? "", phone:phone +""  });

          }


        })
  
      }
    })
  })

}

function getUserImagesPath()
{

    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath+'/uploads/imageUser/'

    if (!fs.existsSync(imageUploadsPath)) {
        
        fs.mkdirSync(imageUploadsPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return imageUploadsPath

}



module.exports = {
    
    signup,signin,updateUser

}