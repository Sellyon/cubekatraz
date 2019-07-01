'use strict';
window.document.addEventListener('DOMContentLoaded', function () {

	// web socket stuff
    //var socket = io('https://two-prisoners.herokuapp.com/');
    var socket = io('localhost:8080');

    socket.on('connect', function () {
    	console.log('Navigateur dit : Connect� au serveur');

	    socket.on('redirectToLobby', function () {
	    	window.location.href = '/lobby';
		});
    
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		canvas.width = 800;
		canvas.height = 500;

		var player1;
		var player2;
		var walls;

		window.onkeydown = function(event) {
			var e = event || window.event;
			var key = e.which || e.keyCode;
			var moves;

			switch(key) {
				case 38 : case 122 : case 119 : case 90 : case 87 : // up, z, w, Z, W
					moves = {
						movingUp: true,
						movingDown: false
					};
					break;

				case 40 : case 115 : case 83 : // down, s, S
					moves = {
						movingUp: false,
						movingDown: true
					};
					break;

				case 37 : case 113 : case 97 : case 81 : case 65 : // left, q, a, Q, A
					moves = {
						movingLeft: true,
						movingRight: false
					};
					break;

				case 39 : case 100 : case 68 : // rigth, d, D
					moves = {
						movingLeft: false,
						movingRight: true
					};
					break;

				default : 
				//console.log(key);
				
				return true;
			}
			if (moves) {
				console.log(moves);
				socket.emit('playerMove', moves);
			}
		}

		window.onkeyup = function(event) {
			var e = event || window.event;
			var key = e.which || e.keyCode;

			switch(key) {
			case 38 : case 122 : case 119 : case 90 : case 87 : // Fl�che haut, z, w, Z, W
				// joueur.movingUp = false;
				break;

			case 40 : case 115 : case 83 : // Fl�che bas, s, S
				// joueur.movingDown = false;
				break;

			case 37 : case 113 : case 97 : case 81 : case 65 : // Fl�che gauche, q, a, Q, A
				// joueur.movingLeft = false;
				break;

			case 39 : case 100 : case 68 : // Fl�che droite, d, D
				// joueur.movingRight = false;
				break;
			}
		}

		socket.addEventListener('updateFrontElements', function(data){
			player1 = data.player1;
			player2 = data.player2;
			walls = data.walls;

			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw players
			context.fillRect(player1.x, player1.y, player1.width, player1.height);
			context.fillRect(player2.x, player2.y, player2.width, player2.height);

			// draw walls
			for (var i = 0; i < walls.length; i++) {
				if (walls[i].isFire) {
					context.fillStyle = "red";
				}
				if (walls[i].key) {
					context.fillStyle = "yellow";
				}
				context.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
				context.fillStyle = "black";
			}
		});
	});
});