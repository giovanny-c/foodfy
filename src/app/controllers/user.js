module.exports = {

    listUsers(req, res){

        return res.render("admin/user/users")

    },

    createUser(req, res){

        return res.render("admin/user/create")

        //ver se ja existe um admin, se sim nao mostra o checkbox
    },


    post(req, res){

        return res.send(req.body)

        //a senha será criada automáticamente

    }


}