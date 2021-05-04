

module.exports = {

    onlyUsers(req, res, next){

        if(!req.session.userId){  

            return res.redirect("/")

            
        }

        next()
    },

    onlyAdmin(req, res, next){

    }


}