const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const crypto = require('crypto')
const user = require("../validators/user")
const Users = require("../models/Users")

module.exports = {

    async index(req, res){//onlyadmin

        const id = req.session.userId

        const user = await User.findOne({WHERE: {id}})
        

        return res.render("admin/user/profile", {user})

    },

    

    async put(req, res){
       //check se esta logado e é checkar se é admin (validator isAdmin)

       try {

            const {name, email} = req.body   

            console.log(req.user)

            const id = req.session.userId


            await User.update(id, {
                name,
                email,
            })

           

           return res.render("admin/user/profile", {
            user: req.body,
            success: "Seu cadastro foi atualizado com sucesso!"
        })
          
       } catch (err) {
           console.error(err)
           
           return res.render("admin/user/profile", {
               user: req.body,
               error: "Nao foi possivel atualizar seu cadastro. Tente novamente."
           })
       }

       

    },

   

}