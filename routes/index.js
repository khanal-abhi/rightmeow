var express = require('express');
var router = express.Router();

var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* Main page. No need to have a user account. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', {
			title: 'RightMeow',
			message: req.flash('message'),
			user: req.user
		});
	});

	/* handle Loging GET */
	router.get('/login', function(req, res){
		if(req.user) {
			res.redirect('/profile');
		}
		res.render('login', {
			title: 'RightMeow - Login',
			message: req.flash('message'),
			user: req.user
		})
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('signup',{
			title: 'RightMeow - Sign Up',
			message: req.flash('message'),
			user: req.user
		});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/profile', isAuthenticated, function(req, res){
		res.render('profile', {
			title: 'RightMeow - Home',
			message: req.flash('message'),
			user: req.user
		});
	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	//===========================================
	//EDIT routes here ==========================
	//===========================================

	router.get('/edit/profile', isAuthenticated, function(req, res){
		res.render('edit_profile', {
			title: 'RightMeow - Home',
			message: req.flash('message'),
			user: req.user
		});
	});

	router.post('/edit/profile', isAuthenticated, function(req, res){
		var username = req.body.username;
		console.log(req.body);
		User.findOne({username: username}, function(err, user){
			if(err) {
				res.redirect('/edit/profile');
			}
			if(!user) {
				req.flash('message', 'User not found. Please try loggin in again!');
				res.redirect('/login');
			}
			if(user) {
				user.firstName = req.body.firstName || user.firstName;
				user.lastName = req.body.lastName || user.lastName;
				user.email = req.body.email || user.email;
				user.add1 = req.body.add1 || user.add1;
				user.add2 = req.body.add2 || user.add2;
				user.city = req.body.city || user.city;
				user.state = req.body.state || user.state;
				user.zipcode = req.body.zipcode || user.zipcode;

				user.save(function(err, user){
					if(err) {
						throw err;
					}
					if(user) {
						req.flash('message', 'Profile update successfull!');
						res.redirect('/profile');
					}
				});
			}
		});
	});

	return router;
}
