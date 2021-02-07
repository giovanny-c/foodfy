const express = require("express")
const nunjucks = require("nunjucks")

const server = express()

const recipes = require("./data")

server.use(express.static("public"))

server.set("view engine", "njk")

nunjucks.configure("views",{

    express: server,
    noCache: true,
    autoescape: false

})

server.get("/",function(req, res){


    return res.render("index", {recipes})

})

server.get("/about", function(req, res){

    return res.render("about")

})

server.get("/recipes", function(req, res){

    return res.render("recipes", {recipes})

})

server.get("/recipes/:id",function(req, res){

    const id = req.params.id

    const recipe = recipes.find(rcp => rcp.id == id)

    

    return res.render("recipe", {recipe})

})

server.use(function(req, res){

    res.status(404).render("not-found")

})

server.listen(5000, function(){

    console.log("server is running")

})