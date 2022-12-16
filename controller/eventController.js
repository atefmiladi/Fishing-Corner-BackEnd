
const formidable = require('formidable')
var path = require('path')
const fs = require("fs")

const addEvent = async (req, res) => {

    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {


        let idUser = fields.iduser
        let description = fields.description
        let title = fields.title
        let dateEvent = fields.dateEvent

        let image = files.file

        let imageFileName = Date.now() + path.extname(image.name);

        const queryString = "INSERT INTO event (title,description,user_iduser,imageEvent,dateEvent) values (?,?,?,?,?)"

        pool.query(queryString, [title, description, idUser, imageFileName,dateEvent], (err, rows, fields) => {
            if (err) {

                console.log(err)
                res.status(500).end()

            }
            else {

                if (image) {

                    let rawDataImage = fs.readFileSync(image.path)
                    let filePathImage = getEventImagesPath() + imageFileName

                    fs.writeFile(filePathImage, rawDataImage, function (err) {
                        if (err) {

                            res.status(400).end()
                            console.log(err)

                        } else {

                            res.status(200).end();

                        }
                    })

                }
            }

        })



    })




}


const deleteEvent = async (req, res) => {
   
    let idevent = req.body.idevent
    
    const queryString = "delete FROM event where idevent = ?"

    pool.query(queryString, [idevent], (err, rows, fields) => {
      
        if (err) {
        
        res.status(500).end()
        console.log(err)

      }else{

        res.status(200).send(rows)

      }
    })
  
  }

const getAllEvent = async (req, res) => {


    let iduser = req.body.iduser 

    const queryString = "SELECT *, (select count(*) from participation where event_idevent = event.idevent and user_iduser = ? and type = 'INTEREST') as myinterest,(select count(*) from participation where event_idevent = event.idevent and user_iduser = ? and type = 'ONGOING') as myongoing from event inner join user on event.user_iduser = user.iduser order by dateEvent asc"

    pool.query(queryString, [iduser,iduser], (err, rows, fields) => {

        if (err) {

            res.status(500).end()
            console.log(err)

        } else {

            let events = []
            rows.forEach(element => {

                let event = { idevent: element.idevent, title: element.title, dateEvent: element.dateEvent, description: element.description,imageEvent:element.imageEvent,my_ongoing :element.myongoing,my_interest :element.myinterest, user: {iduser: element.iduser, phone: element.phone + "", email: element.email, firstname: element.firstname, lastname: element.lastname, adress: element.adress ?? "", image: element.image ?? "" } }

                events.push(event)
            });
            res.status(200).send(events)

        }
    })

}




const addOrDeleteParticipation = async (req, res) => {


    let iduser = req.body.iduser
    let idevent = req.body.idevent
    let type = req.body.type


    const queryString = "SELECT * from participation where event_idevent = ? and user_iduser = ? "

    pool.query(queryString, [idevent,iduser], (err, rows, fields) => {

        if (err) {

            res.status(500).end()
            console.log(err)

        } else {


            if(rows.length != 0 )
            {


                if(type == rows[0].type)
                {

                    const queryString = "delete FROM participation where event_idevent = ? and user_iduser = ?"

                    pool.query(queryString, [idevent,iduser], (err, rows, fields) => {
                      
                        if (err) {
                        
                        res.status(500).end()
                        console.log(err)
                
                      }else{
                
                        res.status(202).end()
                
                      }
                    })


                }else{

                    const queryString = "update participation set type = ? where event_idevent = ? and user_iduser = ?"

                    pool.query(queryString, [type,idevent,iduser], (err, rows, fields) => {
                      
                        if (err) {
                        
                        res.status(500).end()
                        console.log(err)
                
                      }else{
                
                        if(type == "INTEREST")
                        {
    
                            res.status(200).end()
               
                        }else if (type == "ONGOING")
                        {
                            res.status(201).end()
                        }

                      }
                    })


                }
              


            }else{

                const queryString = "insert into participation(event_idevent,user_iduser,type) values(?,?,?)"

                pool.query(queryString, [idevent,iduser,type], (err, rows, fields) => {
                  
                    if (err) {
                    
                    res.status(500).end()
                    console.log(err)
            
                  }else{
            
                    if(type == "INTEREST")
                    {

                        res.status(200).end()
           
                    }else if (type == "ONGOING")
                    {
                        res.status(201).end()
                    }
            
                  }
                })

            }
          
            

        }
    })

}


function getEventImagesPath() {
    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath + '/uploads/imageEvent/'

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

    addEvent, getAllEvent,addOrDeleteParticipation,deleteEvent

}