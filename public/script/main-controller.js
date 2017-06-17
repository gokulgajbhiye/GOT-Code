app.controller('mainController', function(serverRequests, $interval, gameService, playerService) {
	this.wrongNumberChosen = false;
	var checkTurnInterval;
	this.game = gameService;
	this.player = playerService;
	var _this = this;

	var myEl = angular.element(document.querySelector('.number') );

	function stopInterval() {
      $interval.cancel(checkTurnInterval);
	};

	function startInterval() {
		//Just in case, if there is already an active $interval
		stopInterval();
		checkTurnInterval = $interval(isMyTurn, 1000);
		console.log('playing');		
	};

	this.startGame = function() {
		serverRequests.startGame().then(function(playerInfo){
			// If 2 players already playing
			if(!playerInfo.data.id) {
				console.log("You can't join the game");
				return;
			}

			playerService.id = playerInfo.data.id;
			gameService.started = true;

			if(playerInfo.data.number) {
				myEl.addClass('nubActive');				
				var number = parseInt(playerInfo.data.number);
				_this.sendNumber(number, true);

				// jQuery('.number').addClass('nubActive');
			}
			else {
				startInterval();
				console.log('nothing');				
			}
    	},
    	function(error) {
    		console.log(error);
    	});
	};

	this.sendNumber = function(number, firstTurn) {
		number = parseInt(number);
		if(number % 3 !== 0 && !firstTurn) {
			this.wrongNumberChosen = true;
			return;
		}

		// Game ended
		if(number === 3) {
			gameService.ended = true;
			serverRequests.endGame();
			return;
		}

		this.wrongNumberChosen = false;
		gameService.number = number;

		serverRequests.sendNumber(playerService.id, gameService.number).then(function() {
			playerService.myTurn = false;
			startInterval();
		},
		function(error) {
			console.log(error);
		});
	};

	function isMyTurn() {
		serverRequests.isMyTurn(playerService.id).then(function(playerInfo){
			if(playerInfo.data.gameEnded) {
				gameService.ended = true;
				stopInterval();
				return;
			}

			if(playerInfo.data.number) {
				myEl.addClass('nubActive');	
				var number = parseInt(playerInfo.data.number);
				playerService.myTurn = true;
				gameService.number = number;
				stopInterval();
			}
    	},
    	function(error) {
    		stopInterval();
    		console.log(error);
    	});
	};

    this.$onDestroy = function() {
      // Make sure checkTurnInterval is destroyed when the scope is destroyed to prevent memory leak
    	stopInterval();
    };

});