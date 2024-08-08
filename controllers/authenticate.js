function isUser(req, res, next){
if(req.isAuthenticated()){
    next()
} else {
    res.send('you aint a user!')
}
}

module.exports = { isUser };