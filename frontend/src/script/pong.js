import 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js'

var game = {
	player: {
		score: 0,
		name: 'right'
	},
	computer: {
		score: 0,
		name: 'left'
	},
	ball: {
		r: 15,
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
	},
	mode: 'normal',
	challenge: 0,
}

var mod_select = {
	a :{x: 0,
		y: 0,
		xMax: 0,
		yMax: 0},
	b :{x: 0,
		y: 0,
		xMax: 0,
		yMax: 0},
}

function clearCanvas() {
	var context = game.canvas.getContext('2d');
	context.clearRect(0, 0, game.canvas.width, game.canvas.height);
}
function clearLower() {
	var context = game.canvas.getContext('2d');

	const img = new Image();
	img.src = "/src/assets/header-id.png";
	context.clearRect(0, 300 + img.height * 1.5, game.canvas.width, game.canvas.height);
}

function scoreDraw() {
	var context = game.canvas.getContext('2d');

	context.font = "160px MyanmarText";
	context.fillStyle = "white" //text color;
	context.textAlign = 'center';
	context.textBaseLine = 'middle';
	context.fillText(game.player.score, game.canvas.width / 2 - 120, 170);
	context.fillText(game.computer.score, game.canvas.width / 2 + 120, 170);

	context.font = "40px MyanmarText"
	context.textAlign = 'right';
	context.fillText(game.player.name , game.canvas.width / 2 - 60, 40);
	context.textAlign = 'left';
	context.fillText(game.computer.name, game.canvas.width / 2 + 60, 40);

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
		context.clearRect(0,0, game.canvas.width, game.canvas.height)
		// game.lineaire = context.createLinearGradient(0, 0 ,game.canvas.width, game.canvas.height)
		// game.lineaire.addColorStop(1, "#ddace2")
		// game.lineaire.addColorStop(0, "#173dc7")
		// context.fillStyle = game.lineaire;
		// context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	}
	//Draw game.button zone
	context.font = "60px MyanmarText";
	var text = { width: context.measureText(str).width + 10, height: 76}
	
	context.strokeRect(game.canvas.width / 2 - text.width / 2, game.canvas.height / 2 - text.height /2 + offset,
					text.width, text.height);

	game.start_buton.x = game.canvas.width / 2 - text.width / 2 ;
	game.start_buton.y = game.canvas.height / 2 - text.height / 2 + offset;
	game.start_buton.maxX = game.start_buton.x + text.width;
	game.start_buton.maxY = game.start_buton.y + text.height;

	//Draw game.button text
	context.font = "60px MyanmarText";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, game.canvas.width /2 , game.canvas.height / 2 + 22 + offset);
}

function textDraw(str, offset = 0) {
	var context = game.canvas.getContext('2d');


	if (str == 'Opponent didn\'t respond, Back in the matchmaking')
	{
		clearLower();
		//Draw text
		context.font = "60px MyanmarText";
		context.fillStyle = "#252E83" //text color;
		context.textAlign = 'center';
		context.textBaseline = 'center';
		
		context.fillText('Opponent didn\'t respond', game.canvas.width / 2, game.canvas.height / 2   + 44 + offset)
		context.fillText('Searching a new opponent', game.canvas.width / 2, game.canvas.height / 2 + 125 + offset)
		game.matchmaking = 0;
		return ;
	}
	if (offset == 0)
	{
		context.clearRect(0,0, game.canvas.width, game.canvas.height)
		// Draw field
		// context.fillStyle = game.lineaire;
		// context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	}
	//Draw text
	context.font = "60px MyanmarText";
	context.fillStyle = "#252E83" //text color;
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.fillText(str, game.canvas.width / 2, game.canvas.height / 2 + 44 + offset)
	game.matchmaking = 0;
}

function draw() {
	var context = game.canvas.getContext('2d');

	// Draw field
	// game.lineaire = context.createLinearGradient(0, 0 ,game.canvas.width, game.canvas.height)
	// game.lineaire.addColorStop(1, "#ddace2")
	// game.lineaire.addColorStop(0, "#173dc7")
	// context.fillStyle = game.lineaire;
	// context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	context.clearRect(0, 0, game.canvas.width, game.canvas.height);

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
	context.arc(game.ball.x, game.ball.y, game.ball.r, Math.PI * 2, false);
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
	clearLower()
	if (game.challenge == 0)
	{
		if (draw == 1)
			textDraw("Searching an opponent", 150);
		else
			textDraw('Opponent didn\'t respond, Back in the matchmaking', 150);
	}
	else
	{
		if (draw == 1)
			textDraw("Waiting an opponent", 150);
		else
			textDraw('Opponent didn\'t respond, Waiting again', 150);

	}
	game.matchmaking = 1;
	if (game.challenge == 0)
	{
		if (game.mode == 'normal')
			game.socket.emit('joinMatchmaking');
		else
			game.socket.emit('joinHardMatchmaking');
	}
	else
	{
		game.socket.emit('joinDirectGame', {mode: game.mode, searchid: game.challenge});
	}
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

async function waited_too_long(pid)
{
	game.ready_usefull = 0;
	if (game.matchmaking == 2)
	{
		if(game.challenge != 0)
		{
			game.socket.emit('MatchTimeOut', game.confirm_id);
			clearCanvas();
			drawHead();
			textDraw("You didn\'t respond in time", 150);
			textDraw("The duel got aborted", 231);
			return ;
		}
		clearLower()
		game.socket.emit('MatchTimeOut', game.confirm_id);
		game.matchmaking = -1;
		game.nb_confirm = 0;
		game.button = 3;
		chooseMod('You didn\'t');
		textDraw('respond in time', 231);
	}
	else if (game.matchmaking == 3 && game.nb_confirm != 2)
	{
		// opponent didn't respond
		game.socket.emit('MatchTimeOut', game.confirm_id);
		if (game.challenge != 0)
		{
			clearCanvas();
			drawHead();
			textDraw("Your opponent didn\'t respond in time", 150);
			textDraw("The duel got aborted", 231);
			return ;
		}
		clearCanvas();
		drawHead();
		game.socket.emit('MatchTimeOut', game.confirm_id);
		game.matchmaking = -1;
		game.nb_confirm = 0;
		game.button = 3;
		chooseMod();
		textDraw('Your opponent didn\'t respond in time', 231);
	}
}

function ready() {
	if (game.ready_usefull == 0)
		return ;
	clearLower();
	textDraw('Thanks for confirming waiting opponent', 150);
	game.ready_usefull = 0;
	game.matchmaking = 3;
	game.socket.emit('playerReady', game.confirm_id);
}
async function speed_Game_check(){
	game.wait = 0;
}

function playerclick(event, ) {

	if (game.side == "observer")
		return ;
	var rect = game.canvas.getBoundingClientRect(); // abs. size of element
	var scaleX = game.canvas.width / rect.width;    // relationship bitmap vs. element for X
	var scaleY = game.canvas.height / rect.height;  // relationship bitmap vs. element for Y

	var x = (event.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
	var y = (event.clientY - rect.top) * scaleY  ;   // been adjusted to be relative to element
	if (game.button == 0)
		return ;
	else if (game.button == 1) // press to start
	{
		if (x >= mod_select.a.x && x <= mod_select.a.xMax &&
			y >= mod_select.a.y && y <= mod_select.a.yMax)
		{
			game.button = 0;
			game.mode = 'normal';
			entermatchmaking(1);
		}	
		else if (x >= mod_select.b.x && x <= mod_select.b.xMax &&
				 y >= mod_select.b.y && y <= mod_select.b.yMax)
		{
			game.button = 0;
			game.mode = 'hard';
			entermatchmaking(1);
		}
		
	}
	else if (game.button == 2) // press to confirm
	{
		if (x >= game.start_buton.x && x <= game.start_buton.maxX &&
			y >= game.start_buton.y && y <= game.start_buton.maxY)
		{
			game.button = 0;
			game.wait = 1;
			setTimeout(speed_Game_check, 10000);
			ready(game);
		}
	}
	else if (game.button == 3) //play again
	{
		if (x >= mod_select.a.x && x <= mod_select.a.xMax &&
			y >= mod_select.a.y && y <= mod_select.a.yMax)
		{
			game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.y = game.canvas.height / 2 - game.player.height / 2;
			game.player.y = game.canvas.height / 2 - game.computer.height / 2;
			game.button = 0;
			game.matchmaking = 1
			game.mode = 'normal';
			entermatchmaking(1);
		}	
		else if (x >= mod_select.b.x && x <= mod_select.b.xMax &&
					y >= mod_select.b.y && y <= mod_select.b.yMax)
		{
			game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
			game.computer.y = game.canvas.height / 2 - game.player.height / 2;
			game.player.y = game.canvas.height / 2 - game.computer.height / 2;
			game.button = 0;
			game.matchmaking = 1
			game.mode = 'hard';
			entermatchmaking(1);
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
	})

	game.socket.on('player_size', function(l, r) {
		game.player.height   = (l / 100) * game.canvas.height;
		game.computer.height = (r / 100) * game.canvas.height;
	})

	game.socket.on('gameId', function(sided, id, gameRoomid, l_name, r_name) {
		game.gameRoom = gameRoomid;
		game.side = sided;
		game.player.name = l_name;
		game.computer.name = r_name;
		game.gameId = id;
		game.socket.emit('joinRoom', game.gameRoom);
		if (game.challenge != 0)
			game.socket.emit('DirectGameId', {searchid: game.challenge, gameId: game.gameId});
	})

	game.socket.on('AskReady', function(conf_id) {
		clearLower();
		textDraw("Opponent found !", 150);
		game.ready_usefull = 1;
		game.button = 2;
		buttonDraw("Press here to confirm", 275);
		game.matchmaking = 2;
		game.confirm_id = conf_id;
		game.socket.emit('joinRoom', conf_id);
		setTimeout(function() {
			waited_too_long(game.id)
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
			game.socket.emit('startGame', {room: game.confirm_id, mode: game.mode});
			play();
		}
	})
	game.socket.on('playerUnconfirm', function() {
		game.nb_confirm -= 1;
	})

	game.socket.on('gameEnd', async function() {
		cancelAnimationFrame(game.anim);
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		game.ball.x = game.canvas.width / 2;
		game.ball.y = game.canvas.height / 2;
		game.player.height   = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.height = (1/6) * game.canvas.height; // base is 1/6 min for alt is 18
		game.computer.y = game.canvas.height / 2 - game.player.height / 2;
		game.player.y = game.canvas.height / 2 - game.computer.height / 2;

		textDraw("", 0)
		if (game.side == 'observer')
		{
			cancelAnimationFrame(game.anim);
			clearCanvas();
			drawHead()
			if (game.player.score > game.computer.score)
				textDraw("Game end, " + game.player.name + " win !", 150)
			else 
				textDraw("Game end, " + game.computer.name + " win !", 150)
			return;
		}
		if (game.challenge != 0)
			game.socket.emit('DirectGameEnd', {searchid: game.challenge, gameId: game.gameId});
		if ((game.player.score == 11 && game.side == 'left') || 
			game.computer.score == 11 && game.side == 'right')
			chooseMod("You win !");
		else
			chooseMod("You loose !");
		game.matchmaking = 0;
		game.button = 3;
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
	game.socket.on('leaveResult', function(score_l, score_r) {
		if (game.side == 'observer')
		{
			game.player.score = score_l;
			game.computer.score = score_r;
			cancelAnimationFrame(game.anim);
			clearCanvas();
			drawHead()
			if (game.player.score > game.computer.score)
			{
				textDraw(game.computer.name + " leaved the game", 150);
				textDraw(game.player.name + " win !", 231)
			}
			else 
			{
				textDraw(game.player.name + " leaved the game", 150);
				textDraw(game.computer.name + " win !", 231)
			}
		}
	})

	game.socket.on('playerLeave', function() {
		if (game.side == 'observer')
		{
			cancelAnimationFrame(game.anim);
			drawHead()
			textDraw("All player leaved the game", 0);
		}
		else
		{
			if (game.challenge != 0)
				game.socket.emit('DirectGameEnd', {searchid: game.challenge, gameId: game.gameId});
			game.socket.emit('playerLeave',
					{side: game.side, gameId: game.gameId, gameRoom: game.gameRoom});
			clearCanvas();
			drawHead()
			textDraw("Your opponent left the game", 231);
			chooseMod("You win !");
			game.matchmaking = 0;
			game.button = 1;
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
	game.socket.on('start_watching_now', function(r_name, l_name) {
		game.player.name = l_name;
		game.computer.name = r_name;
		play();
	})

	game.socket.on('already_in_matchmaking', function() {
		textDraw('', 0)
		textDraw('You are already in matchmaking.', -30);
		textDraw('You can leave this page.', 30);
	})

	game.socket.on('tooLateForChall', function() {
		clearCanvas()
		drawHead();
		textDraw('This challenge is already finish !', 150);
	})

	game.socket.on('playingForChall', function(gameId) {
		observe(game.userId, gameId);
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

function drawHead()
{
	if (game.canvas)
	{
	var context = game.canvas.getContext('2d');
	//Draw PongHeader
	const img = new Image();
	img.src = "/src/assets/header-id.png";
	img.onload = function() {
		context.drawImage(img, game.canvas.width / 2 - (img.width * 1.5) / 2, 300, img.width * 1.5, img.height * 1.5);
		}
	}
}

function chooseMod(txt = "")
{
	var context = game.canvas.getContext('2d');

	//Draw field
	// game.lineaire = context.createLinearGradient(0, 0 ,game.canvas.width, game.canvas.height)
	// game.lineaire.addColorStop(1, "#ddace2")
	// game.lineaire.addColorStop(0, "#173dc7")
	// context.fillStyle = game.lineaire;
	// context.fillStyle = '#070707';
	// context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	drawHead();
	const img = new Image();
	img.src = "/src/assets/header-id.png";
	
	//Normal game
		var str = "Normal Mode"
		context.font = "60px MyanmarText";
		var text1 = { width: context.measureText(str).width + 10, height: 60}
		context.fillStyle = 'white'
		context.fillRect(	game.canvas.width / 2 - (img.width * 1.5) / 2 - text1.width / 2,
							300 + img.height * 1.5 + 20,
							text1.width,
							text1.height);
		mod_select.a.x = game.canvas.width / 2 - (img.width * 1.5) / 2 - text1.width / 2;
		mod_select.a.y = 300 + img.height * 1.5 + 20;
		mod_select.a.xMax = mod_select.a.x + text1.width;
		mod_select.a.yMax = mod_select.a.y + text1.height;
		//contour
		// context.lineWidth = 0;
		// context.strokeStyle = "#252E83"; //text color;
		// context.strokeRect( game.canvas.width / 2 - (img.width * 1.5) / 2 - text.width / 2,
		// 					330 + img.height * 1.5,
		// 					text.width,
		// 					text.height);	

		//Draw text
		context.font = "60px MyanmarText";
		context.fillStyle = "#252E83"; //text color;
		context.textAlign = 'center';
		context.textBaseline = 'center';
		context.fillText(	str,
							game.canvas.width / 2 - (img.width * 1.5) / 2,
							300 + img.height * 1.5 + 50 + 20);


	//hard game
		var str = "Hard Mode"
		context.font = "60px MyanmarText";
		var text2 = { width: context.measureText(str).width + 10, height: 60}
		context.fillStyle = 'white';
		context.fillRect(	game.canvas.width / 2 + (img.width * 1.5) / 2 - text2.width / 2,
							300 + img.height * 1.5 + 20,
							text2.width,
							text2.height);	
		mod_select.b.x = game.canvas.width / 2 + (img.width * 1.5) / 2 - text2.width / 2;
		mod_select.b.y = 300 + img.height * 1.5 + 20;
		mod_select.b.xMax = mod_select.b.x + text2.width;
		mod_select.b.yMax = mod_select.b.y + text2.height;
		//contour
		// context.lineWidth = 0;
		// context.strokeStyle = "#252E83"; //text color;
		// context.strokeRect( game.canvas.width / 2 + (img.width * 1.5) / 2 - text.width / 2,
		// 					330 + img.height * 1.5,
		// 					text.width,
		// 					text.height);	
		//Draw text
		context.font = "60px MyanmarText";
		context.fillStyle = "#252E83" //text color;
		context.textAlign = 'center';
		context.textBaseline = 'center';
		context.fillText(	str,
							game.canvas.width / 2 + (img.width * 1.5) / 2,
							300 + img.height * 1.5 + 50 + 20);
		if (txt != '')
		{
			context.fillText(	txt,
								game.canvas.width / 2,
								2 * game.canvas.height / 3);
		}
		
	game.start_buton.x = game.canvas.width / 2 - (img.width * 1.5) / 2 - text1.width / 2,
	game.start_buton.y = 330 + img.height * 1.5,
	game.start_buton.maxX = game.canvas.width / 2 + (img.width * 1.5) / 2 + text2.width / 2,
	game.start_buton.maxY = game.start_buton.y + text2.height;
}

function load(userId, challenge = 0, mode = '')
{
	if (userId == 0)
		return ;
	socket_init();
	canvas_init('player');
	game.socket.auth = {userId};
	game.socket.connect();
	game.wait = 0;
	if (challenge == 0)
	{
		chooseMod();
		game.button = 1;
		game.challenge = challenge;
	}
	else
	{
		drawHead();
		game.mode = mode;
		game.challenge = challenge; 
		game.button = 0;
		entermatchmaking(1);
	}
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
				r: 15,
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
	canvas_init('observer');
	if (!game.socket)
	{
		socket_init();
		game.socket.auth = {userId};
		game.socket.connect();
	}

	game.side = "observer";
	game.gameRoom = "gameRoom" + gameId;
	game.matchmaking = -1;
	draw();
	textDraw("Connecting to game", 0);
	emitObserve(+ gameId);
}

export { load, observe, unload }
