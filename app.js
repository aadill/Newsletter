const express = require ("express");
const bodyParse = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html")
});

app.post("/", function(req, res) {
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields:{
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/3ca110dabe";
    const option = {
        method: "POST",
        auth:"Adil:cf91cb253deb21ab3369d58836eec3ef-us5"
    }
    const request = https.request(url,option, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running at port 3000.")
})

// apiKey = cf91cb253deb21ab3369d58836eec3ef-us5
// listId = 3ca110dabe