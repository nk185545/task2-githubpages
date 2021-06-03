const fetch = require('node-fetch');
require('dotenv').config();
const express = require("express") ;
const path = require("path") ;
const hbs = require("hbs") ;
const app = express() ;
const user = 'nk185545';
const repo = 'task2-githubpages';
const port= process.env.PORT || 8000;
const octokit = require("octokit")
const template_path = path.join(__dirname, "templates/views") ;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine","hbs") ;
app.set("views",template_path)


const getIssues = async function(res) {
    var result = [] ;
    //JSON.stringify(json[0]["title"])  , JSON.stringify(json[0]["body"])
    await fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
        .then(res => res.json() )
        .then(json => {
            
            for(let i=0;i<json.length;i++){
                var obj = {
                    "title": JSON.stringify(json[i]["title"]),
                    "description":JSON.stringify(json[i]["body"]),
                }
                result.push(obj)
            }
            
        })

        var assigns = [] ;
        await fetch(`https://api.github.com/repos/${user}/${repo}/assignees`)
            .then(res => res.json() )
            .then(json => {
                assigns = json ;
            })
    
        res.render('index',{result:result,assigns:assigns})
 }


app.get("",(req,res)=> {
    getIssues(res);
}) ;


const createIssuesFromJSON = async function(issue, res) {
         await fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
             method: 'post',
             body:    JSON.stringify(issue),
             headers: {'Content-Type': 'application/json', 'Authorization': `token ${process.env.TOKEN}`},
         
         })
         .then(res =>  res.json())
         .then(json => {
             console.log(`Issue created at ${json.url}`)
         })

         getIssues(res);
 }
 
 app.post("/fetchdata",(req,res)=> {
     var title = req.body.text;
     var des = req.body.description;
     var assignee = req.body.assignee;
     const issue = {"title":title,"body":des,"assignees":[assignee]}
     createIssuesFromJSON(issue,res);
    
     //res.render('index')
 }) ;

app.listen(port,() => {
    console.log(`listening to the port at ${port} `)
})
