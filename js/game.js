'use strict';
window.document.addEventListener('DOMContentLoaded', function () {

	// web socket stuff
    //var socket = io('https://two-prisoners.herokuapp.com/');
    var socket = io('localhost:8080');

    socket.on('connect', function () {
    	console.log('Navigateur dit : Connecté au serveur');

	    socket.on('redirectToLobby', function () {
	    	window.location.href = '/lobby';
	    });
    });

	var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

	var joueur = {
		x: 50,
		y: 50,
		width: 100,
		height: 100,
		movingLeft: false,
		movingRight: false,
		movingUp: false,
		movingDown: false,
	}

	var murs = [
	{
		x: 200,
		y: 0,
		width: 50,
		height: 350,
		deFeu: false,
	},
	{
		x: 400,
		y: 150,
		width: 50,
		height: 350,
		deFeu: false,
	},
	{
		x: 600,
		y: 0,
		width: 50,
		height: 350,
		deFeu: false,
	},
	{
		x: 215,
		y: 200,
		width: 250,
		height: 50,
		deFeu: true,
	},
	{
		x: 700,
		y: 50,
		width: 50,
		height: 50,
		deFeu: false,
		clef: true
	}];

	var compteurMursDeFeu = 0;


	window.onkeydown = function(event) {
		var e = event || window.event;
		var key = e.which || e.keyCode;

		switch(key) {
		case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
			joueur.movingUp = true;
			joueur.movingDown = false;
			joueur.attacking = false;
			break;

		case 40 : case 115 : case 83 : // Flèche bas, s, S
			joueur.movingDown = true;
			joueur.movingUp = false;
			joueur.attacking = false;
			break;

		case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
			joueur.movingLeft = true;
			joueur.movingRight = false;
			joueur.attacking = false;
			break;

		case 39 : case 100 : case 68 : // Flèche droite, d, D
			joueur.movingRight = true;
			joueur.movingLeft = false;
			joueur.attacking = false;
			break;

		default : 
		//console.log(key);
		
		return true;
		}
	}

	window.onkeyup = function(event) {
		var e = event || window.event;
		var key = e.which || e.keyCode;

		switch(key) {
		case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
			joueur.movingUp = false;
			break;

		case 40 : case 115 : case 83 : // Flèche bas, s, S
			joueur.movingDown = false;
			break;

		case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
			joueur.movingLeft = false;
			break;

		case 39 : case 100 : case 68 : // Flèche droite, d, D
			joueur.movingRight = false;
			break;
		}
	}

	var mainLoop = (function () {
		setInterval(function() {
			var collisionHorizontaleDetectee = false;
			var collisionVerticaleDetectee = false;
			var vecteurX = 0;
			var vecteurY = 0;
			context.clearRect(0, 0, canvas.width, canvas.height);

			if (joueur.movingLeft) {
				vecteurX = -8;
			}
			if (joueur.movingRight) {
				vecteurX = 8;
			}
			if (joueur.movingUp) {
				vecteurY = -8;
			}
			if (joueur.movingDown) {
				vecteurY = 8;
			}

			// test collisions bordures
			// test horizontal, axe x
			if (joueur.x + vecteurX > 0 && joueur.x + joueur.width + vecteurX < canvas.width) {
				collisionHorizontaleDetectee = false;
			} else {
				collisionHorizontaleDetectee = true;
			}
			// test vertical, axe y
			if (joueur.y + vecteurY > 0 && joueur.y + joueur.height + vecteurY < canvas.height) {
				collisionVerticaleDetectee = false;
			} else {
				collisionVerticaleDetectee = true;
			}

			// test collisions décors
			for (var i = 0; i < murs.length; i++) {
				// On compare les coordonnées min et max de x et y du joueur et de chaque collision du decors
				if (
					joueur.y + joueur.height + vecteurY > murs[i].y
					&& joueur.y + vecteurY < murs[i].y + murs[i].height
					&& joueur.x + joueur.width + vecteurX > murs[i].x
					&& joueur.x + vecteurX < murs[i].x + murs[i].width
					) {
					// On verouille par les variables le mouvement en x et/ou y (on n'interdit pas forcement tous les mouvements pour permettre au joueur de "glisser" sur les murs)
					// Collision horizontale détectée, on bloque le mouvement sur l'axe x
					if (joueur.y + joueur.height > murs[i].y && joueur.y < murs[i].y + murs[i].height) {
						collisionHorizontaleDetectee = true;
						// gestion collision avec mur de feu
						if (murs[i].deFeu) {
							document.location.reload(true);
						}
						// gestion victoire
						if (murs[i].clef) {
							alert('victoire !')
						}
					}
					// Collision verticale détectée, on bloque le mouvement sur l'axe y
					if (joueur.x + joueur.width > murs[i].x && joueur.x < murs[i].x + murs[i].width) {
						collisionVerticaleDetectee = true;
						// gestion collision avec mur de feu
						if (murs[i].deFeu) {
							document.location.reload(true);
						}
						// gestion victoire
						if (murs[i].clef) {
							alert('victoire !')
						}
					}
					// Aucune collision détectée, c'est que le joueur fait un mouvement en diagonale sur le coin de la colision
					if (!collisionHorizontaleDetectee && !collisionVerticaleDetectee) {
						collisionHorizontaleDetectee = true;
						collisionVerticaleDetectee = true;
						// gestion collision avec mur de feu
						if (murs[i].deFeu) {
							document.location.reload(true);
						}
						// gestion victoire
						if (murs[i].clef) {
							alert('victoire !')
						}
					}
				}
			}

			// déplacement joueur
			if (!collisionHorizontaleDetectee) {
				joueur.x += vecteurX;
			}
			if (!collisionVerticaleDetectee) {
				joueur.y += vecteurY;
			}

			// déplacement murs de feu
			compteurMursDeFeu += 0.05;
			for (var i = 0; i < murs.length; i++) {
				if (murs[i].deFeu) {
					murs[i].x += Math.sin(compteurMursDeFeu) * 4
				}
			}

			// dessiner rectangle joueur
			context.fillRect(joueur.x, joueur.y, joueur.width, joueur.height);

			// dessiner murs
			for (var i = 0; i < murs.length; i++) {
				if (murs[i].deFeu) {
					context.fillStyle = "red";
				}
				if (murs[i].clef) {
					context.fillStyle = "yellow";
				}
				context.fillRect(murs[i].x, murs[i].y, murs[i].width, murs[i].height);
				context.fillStyle = "black";
			}
		}, 40);
	}());
});