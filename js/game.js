'use strict';
window.document.addEventListener('DOMContentLoaded', function () {

	// web socket stuff
    var socket = io('https://cubekatraz.herokuapp.com/');
    //var socket = io('http://localhost:8080/');

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
		var coins;
		var elapsedTime;
		var player1Score;
		var player2Score;
		var player1Name;
		var player2Name;

		var levelTitle = document.getElementById('levelTitle');
		var player1NameInGame = document.getElementById('player1NameInGame');
		var player1ScoreInGame = document.getElementById('player1ScoreInGame');
		var player2NameInGame = document.getElementById('player2NameInGame');
		var player2ScoreInGame = document.getElementById('player2ScoreInGame');
		var elapsedTimeInGame = document.getElementById('elapsedTimeInGame');
		var disconnectionIssues = document.getElementById('disconnectionIssues');
		var disconnectionText = document.getElementById('disconnectionText');

		window.onkeydown = function(event) {
			var e = event || window.event;
			var key = e.which || e.keyCode;
			var moves;

			switch(key) {
				case 38 : case 122 : case 119 : case 90 : case 87 : // up, z, w, Z, W
					event.preventDefault();
					moves = {
						movingUp: true,
						movingDown: false
					};
					break;

				case 40 : case 115 : case 83 : // down, s, S
					event.preventDefault();
					moves = {
						movingUp: false,
						movingDown: true
					};
					break;

				case 37 : case 113 : case 97 : case 81 : case 65 : // left, q, a, Q, A
					event.preventDefault();
					moves = {
						movingLeft: true,
						movingRight: false
					};
					break;

				case 39 : case 100 : case 68 : // rigth, d, D
					event.preventDefault();
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
			coins = data.rules.coins;
			elapsedTime = data.elapsedTime * 40;
			player1Score = data.player1Score;
			player2Score = data.player2Score;
			player1Name = data.player1Name;
			player2Name = data.player2Name;

			// UPDATE TEXTS
			// update level title
			levelTitle.innerHTML = data.rules.levelTitle;

			// update HUD
			elapsedTimeInGame.innerHTML = (function() {
			    var milliseconds = parseInt((elapsedTime%1000)/100)
			        , seconds = parseInt((elapsedTime/1000)%60)
			        , minutes = parseInt((elapsedTime/(1000*60))%60)
			        , hours = parseInt((elapsedTime/(1000*60*60))%24);
			
			    hours = (hours < 10) ? "0" + hours : hours;
			    minutes = (minutes < 10) ? "0" + minutes : minutes;
			    seconds = (seconds < 10) ? "0" + seconds : seconds;
			
			    return hours + ":" + minutes + ":" + seconds;
			})();

			player1NameInGame.innerHTML = player1Name;
			player1ScoreInGame.innerHTML = player1Score;
			player2NameInGame.innerHTML = player2Name;
			player2ScoreInGame.innerHTML = player2Score;

			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw background
			context.fillStyle = data.rules.levelColor;
			context.fillRect(0, 0, canvas.width, canvas.height);

			// draw switches
			if (switches) {
				var opacitySwitches = ((Math.sin(instanceCounter / 2) + 2) / 2) / 2;
				for (var i = 0; i < switches.length; i++) {
					if (!switches[i].activated) {
						context.fillStyle = 'rgba('+ switches[i].color[0] + ',' + switches[i].color[1] + ',' + switches[i].color[2] + ',' + opacitySwitches + ')';
						context.fillRect(switches[i].x, switches[i].y, switches[i].width, switches[i].height);
					}
					context.strokeStyle = "#86949C";
					context.lineWidth = '1';
					context.strokeRect(switches[i].x + 2, switches[i].y + 2, switches[i].width - 4, switches[i].height - 4);
				}
			}

			// draw walls
			if (walls) {
				for (var i = 0; i < walls.length; i++) {
					if (walls[i].isDoor && walls[i].isDoor.isActivated && !walls[i].isFire) {
						context.fillStyle = '#86949C';
					} else if (walls[i].isFire) {
						context.fillStyle = 'rgb(255, ' + (0 + (Math.round((Math.sin(instanceCounter * 2) + 1) * 122.5))) + ', 0)';
					} else {
						context.fillStyle = walls[i].color;
					}
					context.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
				}
			}

			// draw coins
			if (coins) {
				for (var i = 0; i < coins.length; i++) {
					context.fillStyle = 'rgb(255, ' + (200 + (Math.round((Math.sin(instanceCounter * 2) + 1) * 22.5))) + ', 77)';
					context.strokeStyle = "#86949C";
					context.fillRect(coins[i].x, coins[i].y, 25, 25);
					context.fillStyle = 'rgb(255, ' + (130 + (Math.round((Math.sin(instanceCounter * 2) + 1) * 22.5))) + ', 77)';
					context.font = '24px Arial';
					context.fillText('€', coins[i].x + 6, coins[i].y + 21);
				}
			}

			// draw finish zone
			if (finishZone) {
				var opacityFinishZone = (Math.sin(instanceCounter * 2) + 1) / 2;
				context.beginPath();
				context.lineWidth = '6';
				context.strokeStyle = 'red';
				context.strokeStyle = 'rgba(255, 154, 63, ' + opacityFinishZone + ')';
				context.rect(finishZone.x, finishZone.y, finishZone.width, finishZone.height); 
				context.stroke();
				context.fillStyle = '#FF9A3F';
				context.font = '24px Arial';
				context.fillText('SORTIE', finishZone.x + 5, finishZone.y + finishZone.height / 2 + 10);
			}

			// draw players
			if (player1 && player2 && data.player1Avatar && data.player2Avatar) {
				var avatar;
				var player;
				var playerOpacity;
				for (var i = 0; i < 2; i++) {
					if (i === 0) {
						avatar = data.player1Avatar;
						player = player1;
						playerOpacity = data.player1Opacity;
					} else {
						avatar = data.player2Avatar;
						player = player2;
						playerOpacity = data.player2Opacity;
					}
					for (var j = 0; j < avatar.length; j++) {
						context.fillStyle = 'rgba(' + avatar[j].color[0] + ',' + avatar[j].color[1] + ',' + avatar[j].color[2] + ',' + playerOpacity + ')';
						context.fillRect(player.x + avatar[j].x, player.y + avatar[j].y, avatar[j].width, avatar[j].height);
					}
				}

				// draw players names
				context.fillStyle = 'black';
				context.font = '12px Arial';
				context.fillText(data.player1Name, player1.x, player1.y - 12);
				context.fillText(data.player2Name, player2.x, player2.y - 12);
			}

			// show connection issues
			if (data.player1Disconnected || data.player2Disconnected) {
				var onScreenTimer = (Math.round(data.disconnectionTimer * 40 / 1000));
				disconnectionIssues.style.visibility = 'visible';
				if (data.player1Disconnected) {
					disconnectionText.innerHTML = data.player1Name + ' est déconnecté, ' + onScreenTimer + 's avant la fermeture de la partie.';
				}
				if (data.player2Disconnected) {
					disconnectionText.innerHTML = data.player2Name + ' est déconnecté, ' + onScreenTimer + 's avant la fermeture de la partie.';
				}
				// this message is created for potential spectators
				if (data.player1Disconnected && data.player2Disconnected) {
					disconnectionText.innerHTML = data.player1Name + ' et ' + data.player2Name + ' sont déconnectés, ' + onScreenTimer + 's avant la fermeture de la partie.';
				}

				// if disconnection timer reach 0 we send all spectators to the lobby :
				if (data.disconnectionTimer <= 0) {
					window.location.href = '/lobby';
				}
			} else {
				disconnectionIssues.style.visibility = 'hidden';
			}
		});
		socket.addEventListener('setVictoryScreen', function(data){
			console.log('victory front side');
			var finalTime = data.elapsedTime * 40;
			finalTime = (function() {
			    var milliseconds = parseInt((finalTime%1000)/100)
			        , seconds = parseInt((finalTime/1000)%60)
			        , minutes = parseInt((finalTime/(1000*60))%60)
			        , hours = parseInt((finalTime/(1000*60*60))%24);
			
			    hours = (hours < 10) ? "0" + hours : hours;
			    minutes = (minutes < 10) ? "0" + minutes : minutes;
			    seconds = (seconds < 10) ? "0" + seconds : seconds;
			
			    return hours + ":" + minutes + ":" + seconds;
			})();

			// draw background
			context.fillStyle = 'bisque';
			context.fillRect(0, 0, canvas.width, canvas.height);

			// draw texts
			context.fillStyle = 'black';
			context.font = '24px Arial';
			context.fillText('Evasion réussie !', 300, 50);

			context.fillStyle = 'black';
			context.font = '16px Arial';
			context.fillText('Score de ' + data.player1Name + ' : ' + data.player1Score, 250, 100);
			context.fillText('Score de ' + data.player2Name + ' : ' + data.player2Score, 250, 125);
			context.fillText('Score total : ' + (data.player1Score +  data.player2Score), 250, 150);
			context.fillText('Temps écoulé : ' + finalTime, 300, 175);
			document.getElementById('victoryButton').style.visibility = 'visible';
		});
	});
});