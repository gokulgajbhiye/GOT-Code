var express = require("express");
var app = express();
var game = {
	playersIds: [],
	playerTurn: null,
	number: null,
	gameEnded: null,
	firstTurn: true
}

app.get("/", function(req, res) {
	res.sendfile("public/index.html")
});

app.get("/endGame", function(req, res) { 
	game.gameEnded = true;
	res.send(JSON.stringify({status: 'OK'}));
});

app.get("/startGame", function(req, res) { 
	var data = {status: 'OK'};

	//Maximum players already play
	if(game.playersIds.length === 0) {
		game.playersIds.push("A");
		data = {id: "A"};
	}
	else if(game.playersIds.length === 1){
		// Generate random number between 3 and 99
		game.number = Math.floor(Math.random() * 97) + 3; 
		game.playersIds.push("B");
		data = {id: "B", number: game.number};
	}
	res.send(JSON.stringify(data));
});

app.put("/sendNumber/:id/:number", function(req, res) {
	var number = parseInt(req.params.number); 
	if(game.firstTurn) {
		game.firstTurn = false;
		game.number = number;
	}
	else {
		game.number = number / 3;
	}

	// Switch turns
	if(req.params.id === game.playersIds[0]) {
		game.playerTurn = game.playersIds[1];
	}
	else {
		game.playerTurn = game.playersIds[0];
	}

	res.send(JSON.stringify({status: 'OK'}));
});

app.get("/isMyTurn/:id", function(req, res) { 
	var data = {status: 'OK'};

	if(game.gameEnded) {
		data = {gameEnded: true};
	}
	else if(req.params.id === game.playerTurn) {
		data = {number: game.number};
	}
	res.send(JSON.stringify(data));
});

app.use(express.static('public'));

// Serve localhost 
var port = 8080;

app.listen(port, function() {
	console.log("Listening on " + port);
});