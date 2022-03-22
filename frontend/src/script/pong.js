import 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js'

const socket = io("http://localhost:42069",{
	withCredentials: true,
	extraHeaders: {
	  "my-custom-header": "pong"
	}
});

var canvas;
var game;
var anim;
var gameRoom = "-1";
var gameId;
var side = "";
var matchmaking = 0;
	//0 not using
	//1 in search
	//2 wait for confirm
	//3 wait for opponent
	//4 you play
var	button = 0;
	//0 not using
	//1 Press to start
	//2 confirm match
	//3 play again
var confirm_id = -1;
var ready_usefull = 0;
var nb_confirm = 0;

var lineaire

const MAX_SPEED = 12;

var start_buton = {x: 0,  maxX: 0, y: 0, maxY: 0};

function scoreDraw(){
	var context = canvas.getContext('2d');

	context.font = "40px Myanmar Text";
	context.fillStyle = "white" //text color;
	context.textAlign = 'center';
	context.textBaseLine = 'middle';
	context.fillText(game.player.score, canvas.width / 2 - 30, 40);
	context.fillText(game.computer.score, canvas.width / 2 + 30, 40);


	// Draw middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();
}

function buttonDraw(str, offset = 0) {
	
	var context = canvas.getContext('2d');
	if (offset == 0)
	{
		//Draw field
		lineaire = context.createLinearGradient(0, 0 ,canvas.width, canvas.height)
		lineaire.addColorStop(1, "#ddace2")
		lineaire.addColorStop(0, "#173dc7")
		context.fillStyle = lineaire;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	//Draw button zone
	context.font = "30px Myanmar Text";
	var text = { width: context.measureText(str).width + 10, height: 38}
	
	context.fillStyle = 'red';
	context.strokeRect(canvas.width / 2 - text.width / 2, canvas.height / 2 - text.height /2 + offset,
					 text.width, text.height);

	start_buton.x = canvas.width / 2 - text.width / 2 ;
	start_buton.y = canvas.height / 2 - text.height / 2 + offset;
	start_buton.maxX = start_buton.x + text.width;
	start_buton.maxY = start_buton.y + text.height;

	//Draw button text
	context.font = "30px Myanmar Text";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, canvas.width /2 , canvas.height / 2 + 11 + offset);
}

function textDraw(str) {
	var context = canvas.getContext('2d');


	if (str == 'Opponent didn\'t respond, Back in matchmaking')
	{
		// Draw field
		context.fillStyle = lineaire;
		context.fillRect(0, 0, canvas.width, canvas.height);
	
		//Draw text
		context.font = "30px Myanmar Text";
		context.fillStyle = "#252E83" //text color;
		context.textAlign = 'center';
		context.textBaseline = 'center';
		
		context.fillText('Opponent didn\'t respond', canvas.width / 2, canvas.height / 2 )
		context.fillText('Back in matchmaking', canvas.width / 2, canvas.height / 2 + 30)
		matchmaking = 0;
		return ;
	}
	// Draw field
	context.fillStyle = lineaire;
	context.fillRect(0, 0, canvas.width, canvas.height);

	//Draw text
	context.font = "30px Myanmar Text";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, canvas.width / 2, canvas.height / 2 + 11)
	matchmaking = 0;
}


function draw() {
	var context = canvas.getContext('2d');

	// Draw field
	let lineaire = context.createLinearGradient(0, 0 ,canvas.width, canvas.height)
	lineaire.addColorStop(1, "#ddace2")
	lineaire.addColorStop(0, "#173dc7")
	context.fillStyle = lineaire;
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

	// Draw score
	scoreDraw();
}

//done
function playerMove(event) {
	var p_pos;
	// Get the mouse location in the canvas
	var rect = canvas.getBoundingClientRect(); // abs. size of element
	var scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
	var mouseLocation = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element

	if (mouseLocation < PLAYER_HEIGHT / 2) {
		p_pos = (0);
	} else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
		p_pos = (canvas.height - PLAYER_HEIGHT);
	} else {
		p_pos = (mouseLocation - PLAYER_HEIGHT / 2);
	}
	if (side == "right")
		socket.emit('player_pos_right', { gameRoom: gameRoom, gameId: gameId, player_pos_right: p_pos })
	else if (side == "left")
		socket.emit('player_pos_left',  { gameRoom: gameRoom, gameId: gameId, player_pos_left: p_pos })
}

// Game event;
socket.on('player_pos_left', function(data) {
	game.player.y = data;
});
socket.on('player_pos_right', function(data) {
	game.computer.y = data;
});

socket.on('score_update', function(l, r) {
	game.computer.score = r;
	game.player.score = l;
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
	game.ball.speed.x = speed_x;
	game.ball.speed.y = speed_y;
})

socket.on('observe', function(gameid) {
	textDraw('Connecting to game id : ' + gameid);
	side = 'observer'
})

function emitObserve(id)
{
	socket.emit('observe', {gameid: id, gameRoom:'gameRoom' + id})
}

function engage() {
	socket.emit('engage', {gameRoom: gameRoom, speed:game.ball.speed.x});
}

//meta event
socket.on('gameID', function(sided, id, gameRoomid) {
	gameRoom = gameRoomid;
	side = sided;
	gameId = id;
	socket.emit('joinRoom', gameRoom);
	console.log('game id is ', id)
	setTimeout(engage, 2000);
})

socket.on('AskReady', function(conf_id) {
	textDraw("Please press ready");
	ready_usefull = 1;
	button = 2;
	buttonDraw("Press here to confirm");
	matchmaking = 2;
	confirm_id = conf_id;
	socket.emit('joinRoom', conf_id);
	setTimeout(waited_to_long, 5000);
})

socket.on('didntRespond', function() {
	if (matchmaking == 2)
		matchmaking = -1;
})

socket.on('playerConfirm', function() {
	nb_confirm += 1;
	if (nb_confirm == 2)
	{
		matchmaking = 4;
		socket.emit('startGame', confirm_id);
	}
})

socket.on('gameEnd', function() {
	cancelAnimationFrame(anim);
	game.ball.speed.x = 0;
	game.ball.speed.y = 0;

	game.ball.x = canvas.width / 2;
	game.ball.y = canvas.height / 2;

	draw();
	if ((game.player.score == 11 && side == 'left') || 
		game.computer.score == 11 && side == 'right')
		textDraw("You win !")
	else
		textDraw("You loose !")

	matchmaking = 0;
	button = 3;
	buttonDraw('Play again', 50);
	cancelAnimationFrame(anim);
	game.player.score = 0;
	game.computer.score = 0;
	nb_confirm = 0;
	side = ' ';
	gameRoom = "-1";
	game.computer.y = canvas.width / 2 - PLAYER_HEIGHT / 2;
	game.player.y = canvas.width / 2 - PLAYER_HEIGHT / 2;

})

//game action
function collide(player) {
	// The player does not hit the ball
	if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {

		if (side == 'observer')
			;
		// Update score
		else if (player == game.player)
			socket.emit('left_miss', {
				gameRoom: gameRoom, gameId: gameId,
				score_l: game.player.score, score_r: game.computer.score, side})
		else if (player == game.computer)
			socket.emit('right_miss', {
				gameRoom: gameRoom, gameId: gameId,
				score_l: game.player.score, score_r: game.computer.score, side})
		
		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2;
		
		game.ball.speed.x = 0 ;
		game.ball.speed.y = 0 ;
	} else {
		// Change direction
		game.ball.speed.x *= -1;
		changeDirection(player.y);
 
		// Increase speed if it has not reached max speed
		if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
			game.ball.speed.x *= 1.1;
		}
	}
}


function changeDirection(playerPosition) {
	var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
	var ratio = 100 / (PLAYER_HEIGHT / 2);

	// Get a value between 0 and 10
	game.ball.speed.y = Math.round(impact * ratio / 10);
	if (game.ball.speed.y == 0)
		game.ball.speed.y = 0.01;
}


function ballMove() {
	// Rebounds on top and bottom
	if (game.ball.y > canvas.height || game.ball.y < 0) {
		game.ball.speed.y *= -1;
	}

	if (game.ball.x > canvas.width - PLAYER_WIDTH) {
		collide(game.computer);
	}
	else if (game.ball.x < PLAYER_WIDTH) {
		collide(game.player);
	}

	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
}

function enterMatchMaking(draw)
{
	if (draw == 1)
		textDraw("Searching an opponent");
	else
		textDraw('Opponent didn\'t respond, Back in matchmaking');
	matchmaking = 1;
	socket.emit('joinMatchmaking');
}

function play() {
	if (matchmaking == -1)
	{
		matchmaking = 0;
		cancelAnimationFrame(anim);
		return ;
	}
	else if (matchmaking == 0)
		enterMatchMaking(1);
	else if (matchmaking == 1)
		; // console.log("searching a game");
	else if (matchmaking == 2)
		; // console.log("waiting for confirm");
	else if (matchmaking == 3)
		; // console.log("waiting for opponent");
	else {
		if (gameRoom != "-1")
		{
			draw();
			ballMove();
		}
	}
	anim = requestAnimationFrame(play);
}


function waited_to_long()
{
	ready_usefull = 0;
	if (matchmaking == 2)
	{
		textDraw('You didn\'t respond in time');
		socket.emit('MatchTimeOut', confirm_id);
		matchmaking = -1;
		nb_confirm = 0;
		button = 3;
		buttonDraw('Enter matchmaking again', 50);
	}
	else if (matchmaking != 4)
	{
		socket.emit('MatchTimeOut', confirm_id);
		enterMatchMaking(0);
		nb_confirm = 0;
	}
}

function ready() {
	if (ready_usefull == 0)
		return ;
	textDraw('Thanks for confirming waiting opponent');
	ready_usefull = 0;
	matchmaking = 3;
	socket.emit('playerReady', confirm_id);
}

function playerclick(canvs, event) {

	var rect = canvas.getBoundingClientRect(); // abs. size of element
	var scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
	var scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	var x = (event.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
	var y = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element
	if (button == 0)
		return ;
	if (button == 1) // press to start
	{
		if (x >= start_buton.x && x <= start_buton.maxX &&
			y >= start_buton.y && y <= start_buton.maxY)
		{
			button = 0;
			play();
		}
		
	}
	if (button == 2) // press to confirm
	{
		if (x >= start_buton.x && x <= start_buton.maxX &&
			y >= start_buton.y && y <= start_buton.maxY)
		{
			button = 0;
			ready();
		}
	}
	if (button == 3) //play again
	{
		if (x >= start_buton.x && x <= start_buton.maxX &&
			y >= start_buton.y && y <= start_buton.maxY)
		{
			button = 0;
			play();
		}
	}
}

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

const PLAYER_HEIGHT = (1/6) * canvas.height;
const PLAYER_WIDTH = (1/128) * canvas.width;

	game.ball.x = canvas.width / 2;
	game.ball.y = canvas.height / 2;
	
	game.ball.speed.x = 0 ;
	game.ball.speed.y = 0 ;

	game.computer.score = 0;
	game.player.score = 0;

	game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
	game.player.y   = canvas.height / 2 - PLAYER_HEIGHT / 2;
	
	// Mouse move event
	canvas.addEventListener('mousemove', playerMove);
	canvas.addEventListener('mousedown',function(e) {
		playerclick(canvas, e);
	})
	buttonDraw("Press here to start");
	button = 1;