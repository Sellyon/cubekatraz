'use strict';
window.document.addEventListener('DOMContentLoaded', function () {

	// web socket stuff
    //var socket = io('https://two-prisoners.herokuapp.com/');
    var socket = io('http://localhost:8080/');

    socket.on('connect', function () {
    	console.log('Navigateur dit : Connect� au serveur');

	    socket.on('redirectToLobby', function () {
	    	window.location.href = '/lobby';
		});
    
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		canvas.width = 800;
		canvas.height = 600;

		var player1;
		var player2;
		var walls;
		var finishZone;
		var instanceCounter;
		var switches;

		var levelTitle = document.getElementById('levelTitle');

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
				socket.emit('playerMove', moves);
			}
		}

		window.onkeyup = function(event) {
			var e = event || window.event;
			var key = e.which || e.keyCode;
			var moves;

			switch(key) {
			case 38 : case 122 : case 119 : case 90 : case 87 : // up, z, w, Z, W
				moves = {
					movingUp: false
				};
				break;

			case 40 : case 115 : case 83 : // down, s, S
				moves = {
					movingDown: false
				};
				break;

			case 37 : case 113 : case 97 : case 81 : case 65 : // left, q, a, Q, A
				moves = {
					movingLeft: false
				};
				break;

			case 39 : case 100 : case 68 : // right, d, D
				moves = {
					movingRight: false
				};
				break;
			}
			if (moves) {
				socket.emit('playerMove', moves);
			}
		}

		socket.addEventListener('updateFrontElements', function(data){
			player1 = data.rules.player1;
			player2 = data.rules.player2;
			walls = data.rules.walls;
			switches = data.rules.switches;
			instanceCounter = data.rules.instanceCounter;
			finishZone = data.rules.finishZone;

			// update level title
			if (data.level === 1) {
				levelTitle.innerHTML = 'Niveau 1 : les cellules'
			}

			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw background
			context.fillStyle = '#D9D1D7';
			context.fillRect(0, 0, canvas.width, canvas.height);

			// draw walls
			for (var i = 0; i < walls.length; i++) {
				if (walls[i].isDoor && walls[i].isDoor.isActivated) {
					context.fillStyle = '#86949C';
				} else {
					context.fillStyle = walls[i].color;
				}
				context.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
			}

			// draw switches
			var opacitySwitches = ((Math.sin(instanceCounter / 1) + 2) / 2) / 2;
			for (var i = 0; i < switches.length; i++) {
				if (!switches[i].activated) {
					context.fillStyle = 'rgba('+ switches[i].color[0] + ',' + switches[i].color[1] + ',' + switches[i].color[2] + ',' + opacitySwitches + ')';
					context.fillRect(switches[i].x, switches[i].y, switches[i].width, switches[i].height);
				}
				context.strokeStyle = "#86949C";
				context.lineWidth = '1';
				context.strokeRect(switches[i].x + 2, switches[i].y + 2, switches[i].width - 4, switches[i].height - 4);
			}

			// draw finish zone
			var opacityFinishZone = (Math.sin(instanceCounter / 1) + 1) / 2;
			context.beginPath();
			context.lineWidth = '6';
			context.strokeStyle = 'red';
			context.strokeStyle = 'rgba(255, 154, 63, ' + opacityFinishZone + ')';
			context.rect(finishZone.x, finishZone.y, 100, 100); 
			context.stroke();
			context.fillStyle = '#FF9A3F';
			context.font = '24px Arial';
			context.fillText('SORTIE', finishZone.x + 5, finishZone.y + 60);

			// draw players
			let avatar;
			let player;
			for (var i = 0; i < 2; i++) {
				if (i === 0) {
					avatar = data.player1Avatar;
					player = player1;
				} else {
					avatar = data.player2Avatar;
					player = player2;
				}
				for (var j = 0; j < avatar.length; j++) {
					context.fillStyle = avatar[j].color;
					context.fillRect(player.x + avatar[j].x, player.y + avatar[j].y, avatar[j].width, avatar[j].height);
				}
			}

			// draw players names
			context.fillStyle = 'black';
			context.font = '12px Arial';
			context.fillText(data.player1Name, player1.x, player1.y - 12);
			context.fillText(data.player2Name, player2.x, player2.y - 12);
		});
	});
});