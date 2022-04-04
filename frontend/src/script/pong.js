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


function imageDraw() {
	var context = game.canvas.getContext('2d');
	var img = new Image();
	img.src = "http://localhost:4200/src/assets/header-id.png"
	context.drawImage(img, game.canvas.width / 2 - img.width / 2, 30, img.width, img.height);
}

function buttonDraw(str, offset, ) {
	
	var context = game.canvas.getContext('2d');
	if (offset == 0 || str == "Normal     Custom")
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
	imageDraw();
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
	context.fillRect(0, game.player.y, game.player_width, game.player.height);
	context.fillRect(game.canvas.width - game.player_width, game.computer.y, game.player_width, game.computer.height);

	// Draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();

	// Draw score
	scoreDraw(game);
}

function playerMove(event, ) {
	if (game.side == "" || game.side == "observer")
		return ;
	var p_pos;
	// Get the mouse location in the game.canvas
	var rect = game.canvas.getBoundingClientRect(); // abs. size of element
	var scaleY = game.canvas.height / rect.height;  // relationship bitmap vs. element for Y
	var mouseLocation = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element
	if (game.side == "left")
		var p_height = game.player.height
	else
		var p_height = game.computer.height;

	if (mouseLocation < p_height / 2) {
		p_pos = (0);
	} else if (mouseLocation > game.canvas.height - p_height / 2) {
		p_pos = (game.canvas.height - p_height);
	} else {
		p_pos = (mouseLocation - p_height / 2);
	}
	p_pos = p_pos / game.canvas.height * 100;
	if (game.side == "right")
		game.socket.emit('player_pos_right', { gameRoom: game.gameRoom, gameId: game.gameId, pos: p_pos })
	else if (game.side == "left")
		game.socket.emit('player_pos_left',  { gameRoom: game.gameRoom, gameId: game.gameId, pos: p_pos })
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
		// ballMove(game);
	}
	game.anim = requestAnimationFrame(function() {
		play(game);
	});
}

async function waited_to_long(pid)
{
	console.log("TIME OUT IS NOW")
	console.log(game.matchmaking + ' ' + game.nb_confirm)
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
	else if (game.matchmaking == 3 && game.nb_confirm != 2)
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
			game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.y = game.canvas.height / 2 - game.player.height / 2;
			game.player.y = game.canvas.height / 2 - game.computer.height / 2;
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
		autoConnect: false
	})
	
		// Game event;
	game.socket.on('player_pos_left', function(data) {
		game.player.y   = data / 100 * game.canvas.height;
	});
	game.socket.on('player_pos_right', function(data) {
		game.computer.y = data / 100 * game.canvas.height;
	});
	game.socket.on('ball_pos', function(pos_x, pos_y) {
		game.ball.x = pos_x / 100 * game.canvas.width;
		game.ball.y = pos_y / 100 * game.canvas.height;
	});

	game.socket.on('score_update', function(l, r) {
		game.computer.score = r;
		game.player.score = l;
		document.querySelector('#computer-score').textContent = game.computer.score;
		document.querySelector('#player-score').textContent = game.player.score;
	})

	game.socket.on('player_size', function(l, r) {
		console.log('rcv player height l: ' + l + ' r : ' + r);
		game.player.height   = (r / 100) * game.canvas.height;
		game.computer.height = (l / 100) * game.canvas.height;
	})


	//meta event
	game.socket.on('gameId', function(sided, id, gameRoomid) {
		game.gameRoom = gameRoomid;
		game.side = sided;
		game.gameId = id;
		game.socket.emit('joinRoom', game.gameRoom);
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
		game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.y = game.canvas.height / 2 - game.player.height / 2;
		game.player.y = game.canvas.height / 2 - game.computer.height / 2;

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
			game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.y = game.canvas.height / 2 - game.player.height / 2;
			game.player.y = game.canvas.height / 2 - game.computer.height / 2;
			game.ball.speed.x = 0;
			game.ball.speed.y = 0;
			game.ball.x = game.canvas.width / 2;
			game.ball.y = game.canvas.height / 2;
		}
	})
	game.socket.on('start_watching_now', function() {
		play();
	})

	game.socket.on('already_in_matchmaking', function() {
		textDraw('', 0)
		textDraw('You are already in matchmaking.', -17);
		textDraw('You can leave this page.', 17);
	})
}

function canvas_init(mode){
	game.canvas = document.getElementById('canvas'),

	game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
	game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
	game.player_width = (1/128) * game.canvas.width; // base is 1/128

	game.player.y = game.canvas.height / 2 - game.player.height / 2;
	game.computer.y = game.canvas.height / 2 - game.computer.height / 2;

	game.ball.x = game.canvas.width / 2;
	game.ball.y = game.canvas.height / 2;
	
	
	if (mode == 'player')
	{
		// Mouse move event
		game.canvas.addEventListener('mousemove', function(e) {
			playerMove(e, game);
		});
		//click event
		game.canvas.addEventListener('mousedown',function(e) {
			playerclick(e, game);
		})
	}
}

function load(userId)
{
	socket_init();
	canvas_init('player');

	game.socket.auth = {userId};
	game.socket.connect();
	draw();
	buttonDraw("Normal     Custom", 100, game);
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
		game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.y = game.canvas.height / 2 - game.player.height / 2;
		game.player.y = game.canvas.height / 2 - game.computer.height / 2;

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
				r: 10000,
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
	canvas_init('observer');

	
	game.socket.auth = {userId};
	game.socket.connect();
	game.side = "observer";
	game.gameRoom = "gameRoom" + gameId;
	game.matchmaking = -1;
	draw();
	textDraw("Connecting to game", 0);
	emitObserve(+ gameId);
}


export { load, observe, unload }