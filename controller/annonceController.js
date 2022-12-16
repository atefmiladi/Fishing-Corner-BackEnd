const formidable = require('formidable')
var path = require('path')
const fs = require("fs")

  
const getAllAnnonce = async (req, res) => {
   
    const queryString = "SELECT * from annonce inner join user on annonce.user_iduser = user.iduser order by created_at desc"

    pool.query(queryString, [], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        console.log(err)      
      
      }else{

        let annonces = []
        rows.forEach(element => {

        let annonce = {idannonce :element.idannonce ,title:element.title,price:element.price+"",adress:element.adressAnnonce ?? "",description:element.description,image:element.imageAnnonce ?? "",created_at:element.created_at ?? "",user: {iduser: element.iduser,phone:element.phone+"",email:element.email,firstname:element.firstname,lastname:element.lastname,adress:element.adress ?? "",image:element.image ?? ""} }

        annonces.push(annonce)
        });


        res.status(200).send(annonces)

      }
    })
  
  }

  const getAnnonceByUser = async (req, res) => {
   
    let iduser = req.body.iduser
    
    const queryString = "SELECT * FROM annonce where user_iduser = ?"

    pool.query(queryString, [iduser], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        console.log(err)      
      
      }else{

      let annonces = []
        rows.forEach(element => {
          
        let annonce = {name:element.title,price:element.price,adress:element.adress,description:element.description,image:element.image,user: {phone:element.phone,email:element.email,firstname:element.firstname,lastname:element.lastname,adress:element.adress,image:element.image} }

        annonces.push(annonce)
        });
        res.status(200).send(annonces)


      }
    })
  
  }

  const deleteAnnonce = async (req, res) => {
   
    let idannonce = req.body.idannonce
    
    const queryString = "delete FROM annonce where idannonce = ?"

    pool.query(queryString, [idannonce], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        console.log(err)

      }else{

        res.status(200).send(rows)

      }
    })
  
  }


  const addAnnonce= async (req, res) => {
  
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      
      let name = fields.title
      let description = fields.description
      let iduser = fields.iduser
      let price = fields.price
      let adress = fields.adres


      let annonceImage = files.file

      let annonceImageFileName = Date.now() + path.extname(annonceImage.name);

      let annonce= {name,description,iduser,price,adress,annonceImageFileName}

      const queryString = "INSERT INTO annonce (title,description,price,adressAnnonce,user_iduser,imageAnnonce,created_at) values (?,?,?,?,?,?,now())"
      
      pool.query(queryString, [annonce.name,annonce.description,annonce.price,annonce.adress,annonce.iduser,annonce.annonceImageFileName], (err, rows, fields) => {
        if (err) {
    
          console.log(err)
          res.status(500).end()
          
        }
        else {
      
          if(annonceImage){
  
            let rawDataImage = fs.readFileSync(annonceImage.path)
            let filePathImage = getAnnonceImagesPath() + annonceImageFileName
      
            fs.writeFile(filePathImage, rawDataImage, function (err) {
              if (err) {
      
                res.status(400).end()
                console.log(err)
      
              } else {
                
              }
            })
      
          }
      
      
          res.status(200).end()

        }
      })


  
    })
  
  }


function getAnnonceImagesPath()
{
    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath+'/uploads/imageAnnonce/'

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
    
    addAnnonce,deleteAnnonce,getAnnonceByUser,getAllAnnonce

}