const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const crypto = require('crypto')
const user = require("../validators/user")
const Users = require("../models/Users")

module.exports = {

    async index(req, res){
            

        const id = req.session.userId

        const user = await User.findOne({WHERE: {id}})

        //req.session error passado no middlewares/session.onlyAdmin
        if(req.session.error) {

            res.render('admin/user/profile', {
              user: req.session.reqBody,
              error: req.session.error
            })

            req.session.error = ''
            req.session.reqBody = ''
            
            return
        }

        if(req.session.success) {

            res.render('admin/user/profile', {
              user,
              success: req.session.success
            })

            req.session.success = ''
            return
        }

        return res.render("admin/user/profile", {user})

    },

    

    async put(req, res){

       try {

            const {name, email} = req.body   


            const id = req.session.userId


            await User.update(id, {
                name,
                email,
            })

            

            req.session.success = "Seu cadastro foi atualizado com sucesso!"

            return res.redirect("/admin/users/profile") 
            
        
          
       } catch (err) {
           console.error(err)
           
           req.session.error = "Nao foi possivel atualizar seu cadastro. Tente novamente."
           req.session.reqBody = req.body
        
           return res.redirect("/admin/users/profile") 
            
        }
       

    },

   

}