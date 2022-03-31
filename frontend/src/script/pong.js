import 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js'

var game = {
	player: {
		score: 0
	},
	computer: {
		score: 0
	},
	ball: {
		r: 5,
		speed: {
			x: 0,
			y: 0
		}
	},
	gameRoom: "-1",
	side: "",
	matchmaking: 0,
			//0 not using
			//1 in search
			//2 wait for confirm
			//3 wait for opponent
			//4 you play
	button: 0,
			//0 not using
			//1 Press to start
			//2 confirm match
			//3 play again
	confirm_id: -1,
	ready_usefull: 0,
	nb_confirm: 0,
	start_buton: {
			x: 0, maxX: 0,
			y: 0, maxY: 0
	}
}

function scoreDraw(){
	var context = game.canvas.getContext('2d');

	context.font = "40px Myanmar Text";
	context.fillStyle = "white" //text color;
	context.textAlign = 'center';
	context.textBaseLine = 'middle';
	context.fillText(game.player.score, game.canvas.width / 2 - 30, 40);
	context.fillText(game.computer.score, game.canvas.width / 2 + 30, 40);


	// Draw middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(game.canvas.width / 2, 0);
	context.lineTo(game.canvas.width / 2, game.canvas.height);
	context.stroke();
}

function buttonDraw(str, offset, ) {
	
	var context = game.canvas.getContext('2d');
	if (offset == 0)
	{
		//Draw field
		game.lineaire = context.createLinearGradient(0, 0 ,game.canvas.width, game.canvas.height)
		game.lineaire.addColorStop(1, "#ddace2")
		game.lineaire.addColorStop(0, "#173dc7")
		context.fillStyle = game.lineaire;
		context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	}
	//Draw game.button zone
	context.font = "30px Myanmar Text";
	var text = { width: context.measureText(str).width + 10, height: 38}
	
	context.fillStyle = 'red';
	context.strokeRect(game.canvas.width / 2 - text.width / 2, game.canvas.height / 2 - text.height /2 + offset,
					text.width, text.height);

	game.start_buton.x = game.canvas.width / 2 - text.width / 2 ;
	game.start_buton.y = game.canvas.height / 2 - text.height / 2 + offset;
	game.start_buton.maxX = game.start_buton.x + text.width;
	game.start_buton.maxY = game.start_buton.y + text.height;

	//Draw game.button text
	context.font = "30px Myanmar Text";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, game.canvas.width /2 , game.canvas.height / 2 + 11 + offset);
}

function textDraw(str, offset = 0) {
	var context = game.canvas.getContext('2d');


	if (str == 'Opponent didn\'t respond, Back in the matchmaking')
	{
		// Draw field
		context.fillStyle = game.lineaire;
		context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	
		//Draw text
		context.font = "30px Myanmar Text";
		context.fillStyle = "#252E83" //text color;
		context.textAlign = 'center';
		context.textBaseline = 'center';
		
		context.fillText('Opponent didn\'t respond', game.canvas.width / 2, game.canvas.height / 2 )
		context.fillText('Back in the matchmaking', game.canvas.width / 2, game.canvas.height / 2 + 30)
		game.matchmaking = 0;
		return ;
	}
	if (offset == 0)
	{
		// Draw field
		context.fillStyle = game.lineaire;
		context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	}
	//Draw text
	context.font = "30px Myanmar Text";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, game.canvas.width / 2, game.canvas.height / 2 + 11 + offset)
	game.matchmaking = 0;
}

function draw() {
	var context = game.canvas.getContext('2d');

	// Draw field
	game.lineaire = context.createLinearGradient(0, 0 ,game.canvas.width, game.canvas.height)
	game.lineaire.addColorStop(1, "#ddace2")
	game.lineaire.addColorStop(0, "#173dc7")
	context.fillStyle = game.lineaire;
	context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	// Draw middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(game.canvas.width / 2, 0);
	context.lineTo(game.canvas.width / 2, game.canvas.height);
	context.stroke();

	// Draw players
	context.fillStyle = 'white';
	context.fillRect(0, game.player.y, game.player_width, game.player_height);
	context.fillRect(game.canvas.width - game.player_width, game.computer.y, game.player_width, game.player_height);

	// Draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();

	// Draw score
	scoreDraw(game);
}

function playerMove(event, ) {
	if (game.side == "")
		return ;
	var p_pos;
	// Get the mouse location in the game.canvas
	var rect = game.canvas.getBoundingClientRect(); // abs. size of element
	var scaleY = game.canvas.height / rect.height;  // relationship bitmap vs. element for Y
	var mouseLocation = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element

	if (mouseLocation < game.player_height / 2) {
		p_pos = (0);
	} else if (mouseLocation > game.canvas.height - game.player_height / 2) {
		p_pos = (game.canvas.height - game.player_height);
	} else {
		p_pos = (mouseLocation - game.player_height / 2);
	}
	if (game.side == "right")
		game.socket.emit('player_pos_right', { gameRoom: game.gameRoom, gameId: game.gameId, player_pos_right: p_pos })
	else if (game.side == "left")
		game.socket.emit('player_pos_left',  { gameRoom: game.gameRoom, gameId: game.gameId, player_pos_left: p_pos })
}

function engage(pid) {
	if (game.socket && game.socket.connected == true)
		game.socket.emit('engage', {gameRoom: game.gameRoom, speed:game.ball.speed.x});
}

//game action
function collide(player, ) {
	// The player does not hit the ball
	if (game.ball.y < player.y || game.ball.y > player.y + game.player_height) {

		if (game.side == 'observer')
			;
		// Update score
		else if (player == game.player)
			game.socket.emit('left_miss', {
				gameRoom: game.gameRoom, gameId: game.gameId,
				score_l: game.player.score, score_r: game.computer.score})
		else if (player == game.computer)
			game.socket.emit('right_miss', {
				gameRoom: game.gameRoom, gameId: game.gameId,
				score_l: game.player.score, score_r: game.computer.score})
		
		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
		
		game.ball.speed.x = 0 ;
		game.ball.speed.y = 0 ;
	} else {
		// Change direction
		game.ball.speed.x *= -1;
		changeDirection(player.y, game);

		// Increase speed if it has not reached max speed
		if (Math.abs(game.ball.speed.x) < 12) {
			game.ball.speed.x *= 1.1;
		}
	}
}

function changeDirection(playerPosition, ) {
	var impact = game.ball.y - playerPosition - game.player_height / 2;
	var ratio = 100 / (game.player_height / 2);

	// Get a value between 0 and 10
	game.ball.speed.y = Math.round(impact * ratio / 10);
	if (game.ball.speed.y == 0)
		game.ball.speed.y = 0.01;
}

function ballMove() {
	// Rebounds on top and bottom
	if (game.ball.y > game.canvas.height || game.ball.y < 0) {
		game.ball.speed.y *= -1;
	}

	if (game.ball.x > game.canvas.width - game.player_width) {
		collide(game.computer, game);
	}
	else if (game.ball.x < game.player_width) {
		collide(game.player, game);
	}
	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
}

function entermatchmaking(draw)
{
	if (draw == 1)
		textDraw("Searching an opponent", 0);
	else
		textDraw('Opponent didn\'t respond, Back in the matchmaking', 0);
	game.matchmaking = 1;
	game.socket.emit('joinMatchmaking');
}

function play() {
	if (game.matchmaking == -1)
	{
		game.matchmaking = 0;
		cancelAnimationFrame(game.anim);
		return ;
	}
	else if (game.gameRoom != "-1")
	{
		draw(game);
		ballMove(game);
	}
	game.anim = requestAnimationFrame(function() {
		play(game);
	});
}

async function waited_to_long(pid)
{
	console.log("TIME OUT IS NOW")
	game.ready_usefull = 0;
	if (game.matchmaking == 2)
	{
		textDraw('You didn\'t respond in time', 0);
		game.socket.emit('MatchTimeOut', game.confirm_id);
		game.matchmaking = -1;
		game.nb_confirm = 0;
		game.button = 3;
		buttonDraw('Enter the matchmaking again', 50, game);
	}
	else if (game.matchmaking == 5)
	;
	else if (game.matchmaking == 5)
	{
		game.socket.emit('MatchTimeOut', game.confirm_id);
		game.nb_confirm = 0;
		entermatchmaking(0, game);
	}
}

function ready() {
	if (game.ready_usefull == 0)
		return ;
	textDraw('Thanks for confirming waiting opponent', 0);
	game.ready_usefull = 0;
	game.matchmaking = 3;
	game.socket.emit('playerReady', game.confirm_id);
}

function playerclick(event, ) {

	var rect = game.canvas.getBoundingClientRect(); // abs. size of element
	var scaleX = game.canvas.width / rect.width;    // relationship bitmap vs. element for X
	var scaleY = game.canvas.height / rect.height;  // relationship bitmap vs. element for Y

	var x = (event.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
	var y = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element
	if (game.button == 0)
		return ;
	if (game.button == 1) // press to start
	{
		if (x >= game.start_buton.x && x <= game.start_buton.maxX &&
			y >= game.start_buton.y && y <= game.start_buton.maxY)
		{
			game.button = 0;
			entermatchmaking(1, game);
		}
		
	}
	if (game.button == 2) // press to confirm
	{
		if (x >= game.start_buton.x && x <= game.start_buton.maxX &&
			y >= game.start_buton.y && y <= game.start_buton.maxY)
		{
			game.button = 0;
			ready(game);
		}
	}
	if (game.button == 3) //play again
	{
		if (x >= game.start_buton.x && x <= game.start_buton.maxX &&
			y >= game.start_buton.y && y <= game.start_buton.maxY)
		{
			game.computer.y = game.canvas.height / 2 - game.player_height / 2;
			game.player.y = game.canvas.height / 2 - game.player_height / 2;
			game.button = 0;
			game.matchmaking = 1
			entermatchmaking(1, game);
		}
	}
}

function socket_init()
{
	game.socket = io("http://localhost:42069",{
		withCredentials: true,
		extraHeaders: {
		"my-custom-header": "pong"
		},
		autoConnect: false})
	
		// Game event;
	game.socket.on('player_pos_left', function(data) {
		game.player.y = data;
	});
	game.socket.on('player_pos_right', function(data) {
		game.computer.y = data;
	});

	game.socket.on('score_update', function(l, r) {
		game.computer.score = r;
		game.player.score = l;
		document.querySelector('#computer-score').textContent = game.computer.score;
		document.querySelector('#player-score').textContent = game.player.score;
	})

	game.socket.on('reset', function(speed_x, speed_y) {
		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
		
		game.ball.speed.x = speed_x ;
		game.ball.speed.y = speed_y ;
	})

	game.socket.on('speed_update', function(speed_x, speed_y) {
		game.ball.speed.x = speed_x;
		game.ball.speed.y = speed_y;
	})

	//meta event
	game.socket.on('gameId', function(sided, id, gameRoomid) {
		game.gameRoom = gameRoomid;
		game.side = sided;
		game.gameId = id;
		game.socket.emit('joinRoom', game.gameRoom);
		setTimeout(function() {
			engage(game.id)
		}, 2000);
	})

	game.socket.on('AskReady', function(conf_id) {
		textDraw("Please press ready", 0);
		game.ready_usefull = 1;
		game.button = 2;
		buttonDraw("Press here to confirm", 0, game);
		game.matchmaking = 2;
		game.confirm_id = conf_id;
		game.socket.emit('joinRoom', conf_id);
		setTimeout(function() {
			waited_to_long(game.id)
		}, 5000);
	})

	game.socket.on('didntRespond', function() {
		if (game.matchmaking == 2)
			game.matchmaking = -1;
	})

	game.socket.on('playerConfirm', function() {
		game.nb_confirm += 1;
		if (game.nb_confirm == 2)
		{
			game.matchmaking = 5;
			game.socket.emit('startGame', game.confirm_id);
			play();
		}
	})
	game.socket.on('playerUnconfirm', function() {
		game.nb_confirm -= 1;
	})

	game.socket.on('gameEnd', function() {
		cancelAnimationFrame(game.anim);
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
		game.computer.y = game.canvas.height / 2 - game.player_height / 2;
		game.player.y = game.canvas.height / 2 - game.player_height / 2;

		draw(game);
		if (game.side == 'observer')
		{
			if (game.player.score > game.computer.score)
				textDraw("Game end, left player win !", 0)
			else 
				textDraw("Game end, right player win !", 0)
				cancelAnimationFrame(game.anim);
			return;
		}
		else if ((game.player.score == 11 && game.side == 'left') || 
			game.computer.score == 11 && game.side == 'right')
			textDraw("You win !", 0)
		else
			textDraw("You loose !", 0)

			console.log ('pos p = ', game.player.y)
			console.log('should be ', game.canvas.width / 2 - game.player_height / 2);

		game.matchmaking = 0;
		game.button = 3;
		buttonDraw('Play again', 50, game);
		game.player.score = 0;
		game.computer.score = 0;
		game.nb_confirm = 0;
		game.side = ' ';
		game.gameRoom = "-1";
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;
		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
	})
	game.socket.on('playerLeave', function() {
		if (game.side == 'observer')
		{
			cancelAnimationFrame(game.anim);
			textDraw("A player leave the game", 0);
		}
		else
		{
			if (game.side == 'left' && game.player.score <= game.computer.score)
					game.player.score = game.computer.score + 1;
			else if (game.side == 'right' && game.computer <= game.player.score)
					game.computer.score = game.player + 1;
			game.socket.emit('playerLeave',
					{side: game.side, gameId: game.gameId, score_r: game.player.score, score_l: game.computer.score});

			textDraw("Your opponent has left the game, you win");
			game.matchmaking = 0;
			game.button = 3;
			buttonDraw('Play again', 50, game);
			cancelAnimationFrame(game.anim);
			game.player.score = 0;
			game.computer.score = 0;
			game.nb_confirm = 0;
			game.side = ' ';
			game.gameRoom = "-1";
			game.computer.y = game.canvas.height / 2 - game.player_height / 2;
			game.player.y = game.canvas.height / 2 - game.player_height / 2;
			game.ball.speed.x = 0;
			game.ball.speed.y = 0;
			game.ball.x = game.canvas.width / 2;
			game.ball.y = game.canvas.height / 2;
		}
	})
	game.socket.on('ask_pos', function() {
		if (game.side == 'right')
			game.socket.emit('for_observer', {gameId: game.id, gameRoom: game.gameRoom, 
												pos_x: game.ball.x, pos_y: game.ball.y,
												speed_x: game.ball.speed.x, speed_y: game.ball.speed.y,
												left_pos: game.player.y, right_pos: game.computer.y})
	})
	game.socket.on('observer_data', function(ball_x, ball_y, speed_x, speed_y, left_pos, right_pos) {
		//add player pos
		if (game.side == 'observer')
		{
			game.ball.x = ball_x;
			game.ball.y = ball_y;
			game.ball.speed.x = speed_x;
			game.ball.speed.y = speed_y;
			game.matchmaking = 4;
			game.player.y = left_pos;
			game.computer.y = right_pos;
			play();
		}
	})
	game.socket.on('already_in_matchmaking', function() {
		textDraw('', 0)
		textDraw('You are already in matchmaking.', -17);
		textDraw('You can leave this page.', 17);
	})
}

function load(userId)
{
	socket_init();
	game.canvas = document.getElementById('canvas'),

	game.player_height = (6/6) * game.canvas.height; // base is 1/6 min for alt is 18
	game.player_width = (1/128) * game.canvas.width; // base is 1/128

	game.player.y = game.canvas.height / 2 - game.player_height / 2;
	game.computer.y = game.canvas.height / 2 - game.player_height / 2;

	game.ball.x = game.canvas.width / 2;
	game.ball.y = game.canvas.height / 2;

	console.log ('start pos p = ', game.player.y)
	
	// Mouse move event
	game.canvas.addEventListener('mousemove', function(e) {
		playerMove(e, game);
	});
	//click event
	game.canvas.addEventListener('mousedown',function(e) {
		playerclick(e, game);
	})
	game.socket.auth = {userId};
	game.socket.connect();
	draw();
	buttonDraw("Press here to start", 0, game);
	game.button = 1;
}

function unload(userId)
{
	if (game.socket)
	{
		if (game.socket.connected == true)
			game.socket.disconnect();
		cancelAnimationFrame(game.anim);
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
		game.computer.y = game.canvas.height / 2 - game.player_height / 2;
		game.player.y = game.canvas.height / 2 - game.player_height / 2;

		draw(game);
		if ((game.player.score == 11 && game.side == 'left') || 
			game.computer.score == 11 && game.side == 'right')
			textDraw("You win !", 0)
		else
			textDraw("You loose !", 0)
		game.matchmaking = 0;
		game.button = 3;
		buttonDraw('Play again', 50, game);
		cancelAnimationFrame(game.anim);
		game = {
			player: {
				score: 0
			},
			computer: {
				score: 0
			},
			ball: {
				r: 5,
				speed: {
					x: 0,
					y: 0
				}
			},
			gameRoom: "-1",
			side: "",
			matchmaking: 0,
					//0 not using
					//1 in search
					//2 wait for confirm
					//3 wait for opponent
					//4 you play
			button: 0,
					//0 not using
					//1 Press to start
					//2 confirm match
					//3 play again
			confirm_id: -1,
			ready_usefull: 0,
			nb_confirm: 0,
			start_buton: {
					x: 0, maxX: 0,
					y: 0, maxY: 0
			}
		}
	}
}

function emitObserve(id)
{
	game.socket.emit('observe', {gameId: id, gameRoom:'gameRoom' + id})
}

function observe(userId, gameId) 
{
	socket_init();
	game.canvas = document.getElementById('canvas'),

	game.player_height = (1/6) * game.canvas.height; // base is 1/6
	game.player_width = (1/128) * game.canvas.width; // base is 1/128

	game.ball.x = game.canvas.width / 2;
	game.ball.y = game.canvas.height / 2;

	
	game.socket.auth = {userId};
	game.socket.connect();
	game.side = "observer";
	game.gameRoom = "gameRoom" + gameId;
	game.matchmaking = -1;
	draw();
	textDraw("Connecting to game", 0);
	emitObserve(gameId);
}


export { load, observe, unload }