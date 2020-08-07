module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/');
    }else{
        res.locals.user = 1;
    }
    next();
}