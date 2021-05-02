module.exports = {


    showLoginForm(req, res){

        return res.render('session/login')

    },  

    showForgotForm(req, res){

        return res.render('session/forgot')

    },

    showResetForm(req, res){

        return res.render('session/reset-password.njk')
    },

    login(req, res){

        req.session.userId = req.user.id

        req.session.isAdmin = req.user.is_admin

        

        return res.redirect("/admin")

    },

    logout(req, res){

        req.session.destroy()

        return res.redirect("/")
    },

    recoveryPassword(req, res){

        return res.send("ok")

    },

    resetPassword(req, res){

        return res.send("ok")
    }

}