
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	subscribed: {
		type: Boolean,
		default: false
	},
	add1: String,
	add2: String,
	city: String,
	state: String,
	zipcode: String,
	img: {
		type: String,
		default: 'avatar.png'
	}
});
