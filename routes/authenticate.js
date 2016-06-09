var express = require('express');
var router = express.Router();

module.exports = function(passport){

    // redirect success
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null}) ;
    });

    // redirect failure
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message: 'Invalid username or password'});
    });

    // check login status
    router.post('/isloggedin', function(req, res){  
        if (req.isAuthenticated()){

            res.send({state: 'success', user: req.user});
        } else {
         
            res.send({state: 'failure', user: null});
        }
    });
    
    // login
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    // sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    // logout
    router.get('/signout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    return router;
}