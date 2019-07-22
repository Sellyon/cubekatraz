const express = require('express');
const session = require('express-session');
var router = express.Router();

router.get('/', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect("/login");
	});
});

module.exports = router;