module.exports = {


    showLoginForm(req, res){

        return res.render('login/login')

    },  

    showForgotForm(req, res){

        return res.render('login/forgot')

    },

    showResetForm(req, res){

        return res.render('login/reset-password.njk')
    },

    login(req, res){
        return res.redirect("/admin")

    },

    recoveryPassword(req, res){

        return res.send("ok")

    },

    resetPassword(req, res){

        return res.send("ok")
    }

}