const express = require('express');
const session = require('express-session');
const routMod = require(__dirname + '/routerModules/routerModule.js');
const MongoDBStore = require('connect-mongodb-session')(session);
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
var router = express.Router();

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

router.get('/', [routMod.requireLogin], function(req, res) {
    res.render('lobby', { profil: routMod.getUserName(req), title: 'index', message: routMod.getUserName(req)});
})

module.exports = router;
