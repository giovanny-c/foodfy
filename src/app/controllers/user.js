const User = require("../models/Users")
const Recipes = require("../models/Recipes")
const Files = require("../models/Files")

const mailer = require("../../lib/mailer")

const fs = require("fs")
const crypto = require('crypto')
const { file } = require("../models/Chefs")


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
//criar view recipes do use
//quando o user remove o admin, ele continua pois so pega isadmin no login

//remover as files do sistema e da tb files

            //remove as files
            try{
        
                
                let recipes = await Recipes.allFromOneUser(user.id)//pega as receitas


                if(recipes){

                    const allFiles = recipes.map(async recipe => {  //promise para pegar as files
                        
                        let results = await Recipes.files(recipe.id)
                        let files = results.rows

                        return files

                    })

                    const allFilesPromise = await Promise.all(allFiles)

                    if(allFilesPromise){//se achar files

                        const deleteFiles = allFilesPromise.map(async files => {//promise para remover as files

                            files.map( async file => {

                                await Files.deleteFiles(file.id)//remove do bd
                            
                                fs.unlinkSync(file.path)//remove do sistema

                                return
                            })
                        }) 

                        await Promise.all(deleteFiles)
                
                    }

                }

            }catch(err){
                console.error(err)
                req.session.error = "Não foi possivel deletar. Tente novamente."
                
                return res.redirect(`/admin/users/${req.body.id}/edit`)
            }



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