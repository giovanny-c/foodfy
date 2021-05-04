const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const crypto = require('crypto')
const user = require("../validators/user")
const Users = require("../models/Users")

module.exports = {

    async listUsers(req, res){

        const results = await User.all()
        const users = results.rows

        

        return res.render("admin/user/users", {users})

    },

    createUser(req, res){//onlyadmin

        return res.render("admin/user/create")

    },

    async editUser(req, res){//onlyadmin

        const id = req.params.id

        const user = await User.findOne({WHERE: {id} })

        


        return res.render("admin/user/edit", {user})

    },


    async post(req, res){
    
        const user = req.body

        try {

            //se o admin nao for marcado/nao existir
            if(!req.body.is_admin) req.body.is_admin = 0

            //criando a senha

            const password = crypto.randomBytes(5).toString('hex')
            
            const data = {
                ...req.body,
                password
            }
            
            await User.create(data)

            try {

                //enviando a senha por email
                await mailer.sendMail({
                to: data.email,
                from:'no-reply@foodfy.com.br',
                subject: "Senha de acesso foodfy",
                html:`
                
                <p>Sua senha é:</p>
                <h2> ${data.password} </h2>
                <p>clique 
                <a href="http://localhost:3000/login" target="_blank">
                        AQUI
                </a> para fazer o login
                </p>
                
                `
    
                })
                
                //res.redirect("/admin") 
    
                return res.render('admin/user/create', {
                    user: user,
                    success: "Conta cadastrada! A senha de acesso foi enviada para o email cadastrado."
                })
    
    
            } catch (err) {
                console.error(err)
    
                return res.render('admin/user/create', {
                    user: user,
                    error: "Conta cadastrada! Não foi possivel enviar a senha para o email cadastrado, solicite uma redefinição de senha"
                })
            }
        
        } catch (err) {
            console.error(err)

            return res.render("admin/user/create", {
                user: user,
                error: "Algum erro ocorreu, tente novamente"
            })
        }


    },

    async put(req, res){
       //check se esta logado e é checkar se é admin (validator isAdmin)

       try {

           if(!req.body.is_admin) req.body.is_admin = 0

           const {name, email, id, is_admin} = req.body

           await User.update(id, {
               name,
               email,
               is_admin
               
               
           })

           

           return res.render("admin/user/edit", {
            user: req.body,
            success: "Cadastro atualizado com sucesso!"
        })
          
       } catch (err) {
           console.error(err)
           
           return res.render("admin/user/edit", {
               user: req.body,
               error: "Nao foi possivel atualizar este cadastro. Tente novamente"
           })
       }

       

    },

    async delete(req, res){

        const {user} = req

        
        try {


            await User.delete(user.id)
            
            const results = await User.all()
            const users = results.rows

            return res.render("admin/user/users", {
                users,
                success: "Conta deletada!"
            })
            
        } catch (err) {
            console.error(err)
            return res.render("admin/user/edit", {
                user: req.body,  //refazer admin/user/edit
                error: "Não foi posso deletar esta conta. Tente novamente."
            })
        }
        
    }


}