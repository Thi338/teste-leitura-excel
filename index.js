const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const reader = require('xlsx')
const path = require('path')

app.use('/publicfiles', express.static(__dirname + '/publicfiles'))
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.post("/upload", (req, res) => {
    let base64 = req.body.base64

    let fileExtension = req.body.ext

    let filename = Date.now().toString() + fileExtension
    if (base64) {
        let arr = base64.split(',')
        fs.writeFile("publicfiles/" + filename, arr[1], 'base64', function(err) {
            if (err) {
                res.send(err)
            } else {
                console.log("uploaded!");
                res.send("http://localhost:3000/publicfiles/" + filename)
            }
        })
    }
})

 app.get("/readexcelfile", (req, res) => {
    
    const dir = './publicfiles'
     
    //console.log(path.basename(notes, path.extname(notes)) );

     fs.readdir(dir , (err, arquivos) => {
        arquivos.forEach(arquivo => {
            
            console.log(arquivo);
            let data = []
        try {
        
            const fileName = arquivo
            const file = reader.readFile("publicfiles/" + fileName)
            
            const sheetNames = file.SheetNames

            for (let i = 0; i < sheetNames.length; i++) {
                const arr = reader.utils.sheet_to_json(
                    file.Sheets[sheetNames[i]])
                arr.forEach((res) => {
                    data.push(res)
                })
            }

            res.send(data)
        } catch (err) {
            res.send(err)
        }
        });
      }); //req.query.filename
      
    
})

app.listen(3000, function() {
    console.log("running on port 3000!");
})