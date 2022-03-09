'use strict';

const socket = io("http://localhost:42069", {
withCredentials: false,
});

var canvas;
var game;
var anim;
var init = -1;
var gameId = "-1";
var matchmaking = 0;
//0 not using
//1 in search
//2 wait for confirm
//3 wait for opponent
//4 you play
var confirm_id = -1;
var ready_usefull = 0;
var nb_confirm = 0;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 12;

function textDraw(str, color) {
	var context = canvas.getContext('2d');

	// Draw field
	context.fillStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = 'white';
	context.textAlign = 'center';
	context.textBaseLine = 'middle';
	context.fillText(str, canvas.width / 2, canvas.height / 2)
	matchmaking = 0;
}

function draw() {
	var context = canvas.getContext('2d');

	// Draw field
	context.fillStyle = 'blue';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// Draw players
	context.fillStyle = 'white';
	context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

	// Draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();
}

function changeDirection(playerPosition) {
	var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
	var ratio = 100 / (PLAYER_HEIGHT / 2);

	// Get a value between 0 and 10
	game.ball.speed.y = Math.round(impact * ratio / 10);
}

function playerMove(event) {
	var p_pos;
	// Get the mouse location in the canvas
	var canvasLocation = canvas.getBoundingClientRect();
	var mouseLocation = event.clientY - canvasLocation.y;

	if (mouseLocation < PLAYER_HEIGHT / 2) {
		p_pos = (0);
	} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
		p_pos = (canvas.height - PLAYER_HEIGHT);
	} else {
		p_pos = (mouseLocation - PLAYER_HEIGHT / 2);
	}
	socket.emit('player_pos_right', { gameId: gameId, player_pos_right: p_pos })
}

socket.on('player_pos_left', function(data) {
	game.player.y = data;
});
socket.on('player_pos_right', function(data) {
	game.computer.y = data;
});

socket.on('score_update', function(r, l) {
	console.log('score update', r , ' ', l);
	game.computer.score = l;
	game.player.score = r;
	document.querySelector('#computer-score').textContent = game.computer.score;
	document.querySelector('#player-score').textContent = game.player.score;
})

socket.on('reset', function(speed_x, speed_y) {
	game.ball.x = canvas.width / 2;
	game.ball.y = canvas.height / 2;
	
	game.ball.speed.x = speed_x ;
	game.ball.speed.y = speed_y ;
})

socket.on('speed_update', function(speed_x, speed_y) {
	console.log('speed update');
	game.ball.speed.x = speed_x;
	game.ball.speed.y = speed_y;
})

function collide(player) {
	// The player does not hit the ball
	if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {

		// Update score
		if (player == game.player) {
			socket.emit('left_miss', gameId);
		} else {
			socket.emit('right_miss', gameId);
		}
	} else {
		// Change direction
		game.ball.speed.x *= -1;
		changeDirection(player.y);
 
		// Increase speed if it has not reached max speed
		if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
			game.ball.speed.x *= 1.2;
		}
		socket.emit('bonce', { gameId: gameId, speed_x: game.ball.speed.x, speed_y :game.ball.speed.y });
	}
}

socket.on('gameEnd', function() {
	cancelAnimationFrame(anim);
	game.ball.speed.x = 0;
	game.ball.speed.y = 0;

	game.ball.x = canvas.width / 2;
	game.ball.y = canvas.height / 2;

	draw();
	document.querySelector('#stop-game');
	socket.emit('leaveRoom', gameId);
	gameId = "-1";

})

function ballMove() {
	// Rebounds on top and bottom
	if (game.ball.y > canvas.height || game.ball.y < 0) {
		game.ball.speed.y *= -1;
	}

	if (game.ball.x > canvas.width - PLAYER_WIDTH) {
		collide(game.computer);
	}
	// else if (game.ball.x < PLAYER_WIDTH) {
	// 	collide(game.player);
	// }

	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
}

function enterMatchMaking()
{
	textDraw("enter Matchmaking", "black");
	console.log("Entered matchmaking");
	matchmaking = 1;
	socket.emit('joinMatchmaking');
}

function play() {
	if (matchmaking == -1)
		console.log("youy didn't accept")
	else if (matchmaking == 0)
		enterMatchMaking();
	else if (matchmaking == 1)
		console.log("searching a game");
	else if (matchmaking == 2)
		console.log("waiting for confirm");
	else if (matchmaking == 3)
		console.log("waiting for opponent");
	else {
		if (gameId != -1)
		{
			draw();
			ballMove();
		}
	}
	anim = requestAnimationFrame(play);
}

function stop() {
	cancelAnimationFrame(anim);

	// Init score
	game.computer.score = 0;
	game.player.score = 0;

	document.querySelector('#computer-score').textContent = game.computer.score;
	document.querySelector('#player-score').textContent = game.player.score;

	draw();
}

socket.on('gameId', function(id) {
	gameId = id;
	game.player.y = canvas.height / 2;
	game.computer.y = canvas.height / 2;
})

socket.on('AskReady', function(conf_id) {
	console.log("match found confirm pls")

	textDraw("Please press ready", 'grey');
	ready_usefull = 1;
	matchmaking = 2;
	confirm_id = conf_id;
	socket.emit('joinRoom', conf_id);
})

function waited_to_long()
{
	if (matchmaking != 4)
	{
		console.log("opponent haven't respond go back to matchmaking");

		textDraw('opponent didn\'t respond in time', 'black');
		socket.emit('MatchTimeOut', confirm_id);
		matchmaking = -1;
	}
}

socket.on('didntRespond', function() {
	console.log("You didn't respond :'(")

	textDraw('Next time accept the match :)', 'red');
	matchmaking = -1;
})

socket.on('playerConfirm', function() {
	nb_confirm += 1;
	console.log("a player confirm total to confirm : ", nb_confirm);
	if (nb_confirm == 2)
	{
		console.log("both player confirmed ready to play");
		matchmaking = 4;
	}
})

function ready() {
	if (ready_usefull == 0)
		return ;
	textDraw('Thanks for confirming waiting opponent', 'grey');
	ready_usefull = 0;
	matchmaking = 3;
	socket.emit('playerReady', confirm_id);
	setTimeout(waited_to_long, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
	canvas = document.getElementById('canvas');
	game = {
		player: {
			score: 0
		},
		computer: {
			score: 0,
			speedRatio: 0.75
		},
		ball: {
			r: 5,
			speed: {}
		}
	};

	game.ball.x = canvas.width / 2;
	game.ball.y = canvas.height / 2;
	
	game.ball.speed.x = 0 ;
	game.ball.speed.y = 0 ;
	
	// Mouse move event
	canvas.addEventListener('mousemove', playerMove);

	// Mouse click event
	document.querySelector('#start-game').addEventListener('click', play);
	document.querySelector('#stop-game').addEventListener('click', stop);
	document.querySelector('#ready').addEventListener('click', ready);
});