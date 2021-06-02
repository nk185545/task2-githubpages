const fetch = require('node-fetch');
require('dotenv').config();
const express = require("express") ;
const path = require("path") ;
const hbs = require("hbs") ;
const app = express() ;
const user = 'nk185545';
const repo = 'task2-githubpages';
const port= process.env.PORT || 8000;

const template_path = path.join(__dirname, "templates/views") ;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine","hbs") ;
app.set("views",template_path)
app.get("",(req,res)=> {
    res.render('index')
}) ;


createIssuesFromJSON = function(issue) {
   console.log(issue);
        fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
            method: 'post',
            body:    JSON.stringify(issue),
            headers: {'Content-Type': 'application/json', 'Authorization': `token ${process.env.TOKEN}`},
        
        })
        .then(res =>  res.json())
        .then(json => {
            console.log(`Issue created at ${json.url}`)
        })
    
}

app.post("/fetchdata",(req,res)=> {
    var title = req.body.text;
    var des = req.body.description;
    const issue = {"title":title,"body":des,"assignees":["nk185545"]}
    createIssuesFromJSON(issue);
    res.render('index')
}) ;



app.listen(port,() => {
    console.log(`listening to the port at ${port} `)
})