module.exports = {
    ehAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.ehAdmin){
            return next()
        }

        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/")
    }
}