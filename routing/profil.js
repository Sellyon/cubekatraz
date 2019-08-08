const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
var myDB;
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

const getAvatar = function (req) {
	if (req.session && req.session.avatar) {
		return req.session.avatar
	} else {
		return '/images/usersAvatars/placeholderAvatar.png'
	}
}

const editDescription = function (req, res, collection) {
	collection.updateOne(
		{name: req.params.profilName},
		{ $set: { description: req.body.editDescription } }, function(err,records){
			renderProfile(req, res);
	});
}

const editAvatar = function (req, res, collection) {
	collection.updateOne(
		{name: req.params.profilName},
		{ $set: { avatar: req.body.editAvatar } }, function(err,records){
			req.session.avatar = req.body.editAvatar;
			renderProfile(req, res);
	});
}

const addRequestFriend = function (req, res, collection, userName) {
	let consultedProfile = req.body.addFriend;
	collection.updateOne(
		{name: userName},
		{ $push: { friendsYouRequest: consultedProfile } }, function(err,records){
		collection.updateOne(
			{name: consultedProfile},
			{ $push: { RequestYouForFriend: userName } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const acceptRecievedRequest = function (req, res, collection, userName) {
	let newFriend = req.body.acceptRecievedRequest;
	collection.find({name: userName}).toArray(function(err, data){
	 	if (err) throw err;
	 	console.log(data[0].friends[newFriend]);
		if (data[0].friends[newFriend] === undefined){
			console.log('personne');
			collection.updateOne(
				{name: userName},
				{ $push: { friends: newFriend } }, function(err,records){
				collection.updateOne(
					{name: newFriend},
					{ $push: { friends: userName } }, function(err,records){
					collection.updateOne(
						{name: newFriend},
						{ $pull: { friendsYouRequest: userName } }, function(err,records){
						collection.updateOne(
							{name: userName},
							{ $pull: { RequestYouForFriend: newFriend } }, function(err,records){
								renderProfile(req, res);
						});
					});
				});
			});
		} else {
			console.log('quelq un');
			renderProfile(req, res);
		}
	});
}

const refuseRecievedRequest = function(req, res, collection, userName) {
	let refusedFriend = req.body.refuseRecievedRequest;
	collection.updateOne(
		{name: refusedFriend},
		{ $pull: { friendsYouRequest: userName } }, function(err,records){
		collection.updateOne(
			{name: userName},
			{ $pull: { RequestYouForFriend: refusedFriend } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const cancelRequestSent = function(req, res, collection, userName) {
	let canceledFriend = req.body.cancelRequestSent;
	collection.updateOne(
		{name: canceledFriend},
		{ $pull: { RequestYouForFriend: userName } }, function(err,records){
		collection.updateOne(
			{name: userName},
			{ $pull: { friendsYouRequest: canceledFriend } }, function(err,records){
				renderProfile(req, res);
		});
	});
}

const renderProfile = function (req, res) {
	let connected = false;
	let userName = routMod.getUserName(req);
	if (req.session && req.session.user) {
		connected = true
	}

	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	let hideIcon = false;
		  	if (userName === data[0].name) {
		  		var titleprofil = 'Votre matricule';
		  	} else {
		  		var titleprofil = 'Matricule de ' + req.params.profilName;
		  	}

		  	// System to show "add a new friend" button when visiting his profile
		  	if (userName === 'mysterieux inconnu' || data[0].name === userName) {
				hideIcon = true;
			} else {

				// Here we check if this profile is not already a friend of user
				for (var i = 0; i < data[0].friends.length; i++) {

					if (data[0].friends[i] === userName) {
						hideIcon = true;
					}
				}

				// Here we check if a request has not already sent
				for (var i = 0; i < data[0].RequestYouForFriend.length; i++) {
					if (data[0].RequestYouForFriend[i] === userName) {
						hideIcon = true;
					}
				}
			}

			res.render('profil', { 
				profil: userName,
				consultedProfile: req.params.profilName,
				title: 'profil ' + req.params.profilName,
				titleprofil: titleprofil,
				friends: data[0].friends,
				friendsYouRequest: data[0].friendsYouRequest,
				requestYouForFriend: data[0].RequestYouForFriend,
				description: data[0].description,
				bestScore: data[0].bestScore,
				matchPlayed: data[0].matchPlayed,
				gameFinished: data[0].gameFinished,
				bestTime: routMod.msToTime(data[0].bestTime*40),
				avatarProfil: data[0].avatar,
				avatar: getAvatar(req),
				connected: connected,
				hideIcon: hideIcon
			});
		  } else {
		  	res.redirect('/unknowned');
		  }
		  client.close();
		});
	});
}

router.get('/', [routMod.requireLogin], function (req, res) {
	res.redirect('/profil/' + routMod.getUserName(req));
});

router.get('/:profilName', function (req, res) {
	renderProfile(req, res);
});

router.post('/:profilName', function(req, res) {
	let connected = false;
	let userName = routMod.getUserName(req);
	if (req.session && req.session.user) {
		connected = true
	}

	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		// If a request to modify description is done AND the user in session is the owner of the profile the request is accepted
		if (req.params.profilName === userName && req.body.editDescription) {
			editDescription (req, res, collection);
		}
		// If a request to modify avatar is done AND the user in session is the owner of the profile the request is accepted
		if (req.params.profilName === userName && req.body.editAvatar) {
			editAvatar (req, res, collection);
		}
		// If a request to add consulted profile is done AND the user in session is NOT the owner of the profile the request is accepted
		else if (req.body.addFriend && userName !== req.body.addFriend) {
			addRequestFriend(req, res, collection, userName);
		}

		// System to accept a friend request from someone to the user
		else if (req.body.acceptRecievedRequest) {
			acceptRecievedRequest(req, res, collection, userName);
		}

		// System to refuse a friend request from someone to the user
		else if (req.body.refuseRecievedRequest) {
			refuseRecievedRequest(req, res, collection, userName);
		}

		// System to cancel a friend request sent from user to someone
		else if (req.body.cancelRequestSent) {
			cancelRequestSent(req, res, collection, userName);
		}

		// You should not pass here, there is a problem with post method
		else {
			console.log('You should not pass here, there is a problem with post method, look at req.body : ' + req.body);
			renderProfile(req, res);
		}
	});
})

module.exports = router;
