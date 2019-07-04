const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var router = express.Router();
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';

const store = new MongoDBStore({
	uri: uri,
	databaseName: 'twoPrisoners',
	collection: 'sessions'
});
  store.on('error', function(error) {
	console.log(error);
});

router.use(session({
	secret: secret,
	store: store,
	saveUninitialized : true,
	resave: false
}));

const getUserName = function (req) {
	if (req.session && req.session.user) {
		return req.session.user
	} else {
		return 'mysterieux inconnu'
	}
}


/**
 * Page d'accueil
*/

router.get('/', function(req, res) {
	if (req.session && req.session.user) {
		res.redirect('/lobby');
	}
    res.render('index', { profil: getUserName(req), title: 'index', message: getUserName(req)});
});

// Autres routes
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/lobby", require("./lobby"));
router.use("/profil", require("./profil"));
router.use("/profil/:profilName", require("./profil"));
router.use("/game", require("./game"));
router.use("/game/:number", require("./game"));
router.use("/hallOfFame", require("./hallOfFame"));

module.exports = router;