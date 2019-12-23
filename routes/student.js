var express = require('express')
var router = express.Router()
const fs = require('fs')

var nestedProperty = require("nested-property");


// router.put("/*", function(req, res) {
//       console.log(req);
// })


router.put('/*', async (req, res)=>{
    let insert_state = "no"
    let paramArray = req.path.split('/')
    let path = "./data/"+ paramArray[1] + ".json"
    let dataKey =  paramArray.splice(2,paramArray.length)

    
    try{
        if(fs.existsSync(path)){
            fs.readFile(path, 'utf8', function(err, data) {
                var createStream = fs.createWriteStream(path);
                let insertData = JSON.parse(data)
                Object.keys(req.body).map(item=>{
                    let arrayDataKey = dataKey.join(".") + "."+item
                    nestedProperty.set(insertData, arrayDataKey, req.query[item])
                })
                insertData = JSON.stringify(insertData)
                console.log("get data : ",data, insertData)
                createStream.write(insertData)
                createStream.end()
                insert_state = "yes"
                res.json({path, insert_state, success:true})
            });
        }else{

            if(paramArray.length>1){
                var createStream = fs.createWriteStream(path);
                let insertData = {}
                Object.keys(req.body).map(item=>{
                    let arrayDataKey = dataKey.length? dataKey.join(".") + "."+item : item
                    nestedProperty.set(insertData, arrayDataKey, req.query[item])
                })
                createStream.write(JSON.stringify(insertData));
                createStream.end();
            }
            insert_state = "created"
            res.json({path, insert_state, success:true})

        }


    }catch(err){

        res.statusCode = 404
        console.log("error : ", err)
    }

})

router.get('/*', async (req, res, next)=>{

    let paramArray = req.path.split('/')
    let path = "./data/"+ paramArray[1] + ".json"
    let dataKey =  paramArray.splice(2,paramArray.length)


    try{
        if(fs.existsSync(path)){

            fs.readFile(path, 'utf8', function(err, data) {
                let insertData = JSON.parse(data)
                let arrayDataKey = dataKey.join(".")
                nestedProperty.get(insertData, arrayDataKey)

                insertData.success = true
                res.json(insertData) 
            });

        }else{
            res.statusCode('404').json({"failed": "failed"})            
        }


    }catch(err){

        res.statusCode('404').json({"failed": "failed"})
        console.log("error : ", err)

    }

})

router.delete('/*', async (req, res, next)=>{

    let paramArray = req.path.split('/')
    let path = "./data/"+ paramArray[1] + ".json"
    let dataKey =  paramArray.splice(2,paramArray.length)


    try{
        if(fs.existsSync(path)){

            fs.readFile(path, 'utf8', function(err, data) {
                let insertData = JSON.parse(data)
                let arrayDataKey = dataKey.join(".")
                nestedProperty.set(insertData, arrayDataKey, null)

                var createStream = fs.createWriteStream(path)
                createStream.write(JSON.stringify(insertData))
                createStream.end()

                res.json({success: true})
            });

        }else{
            res.statusCode('404').json({"failed": "failed"})            
        }


    }catch(err){

        res.statusCode('404').json({"failed": "failed"})
        console.log("error : ", err)

    }

})

module.exports = router