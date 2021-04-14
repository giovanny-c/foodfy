const express = require("express")
const routes = express.Router()

//===imports=====

//arquivos de rotas
const admin = require('./admin')
const site = require('./site')



//====ROTAS DO SITE=========

routes.use(site)

//=====ROTAS DO ADMIN========

routes.use("/admin", admin)


module.exports = routes

