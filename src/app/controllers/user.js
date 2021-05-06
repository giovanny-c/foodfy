const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const crypto = require('crypto')
const user = require("../validators/user")
const Users = require("../models/Users")

module.exports = {

    async listUsers(req, res){

        const results = await User.all()
        const users = results.rows

        if(req.session.success){

            res.render("admin/user/users", {
                users,
                success: req.session.success     
            })

            req.session.success = ''
            return
        }

        if(req.session.error){

            res.render("admin/user/users", {
                users,
                error: req.session.error    
            })

            req.session.error = ''
            return
        }
        
        

        return res.render("admin/user/users", {users})

    },

    createUser(req, res){//onlyadmin

        return res.render("admin/user/create")

    },

    async editUser(req, res){//onlyadmin

        const id = req.params.id

        const user = await User.findOne({WHERE: {id} })

        if(req.session.success){

            res.render("admin/user/edit", {
                user,
                success: req.session.success     
            })

            req.session.success = ''
            return
        }

        if(req.session.error){

            res.render("admin/user/edit", {
                user,
                error: req.session.error    
            })

            req.session.error = ''
            return
        }
        


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
    
                req.session.success = "Conta cadastrada! A senha de acesso foi enviada para o email cadastrado."
    
                return res.redirect('/admin/users')
    
    
            } catch (err) {
                console.error(err)
    
                req.session.error = "Conta cadastrada! Não foi possivel enviar a senha para o email cadastrado, solicite uma redefinição de senha"
                
                return res.redirect('/admin/users')
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

           

            req.session.success = "Conta atualizada com sucesso!"
    
            return res.redirect(`/admin/users/${id}/edit`)//para pagina do uusr
          
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

            req.session.success = `Conta deletada com sucesso!` 

            return res.redirect("/admin/users")
            
        } catch (err) {
            console.error(err)
            return res.render("admin/user/edit", {
                user: req.body,
                error: "Não foi posso deletar esta conta. Tente novamente."
            })
        }
        
    }


}