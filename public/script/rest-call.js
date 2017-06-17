app.service('serverRequests', function($http) {
    this.startGame = function() {
    	return $http.get('/startGame');
    };

    this.sendNumber = function(id, number) {
    	return $http.put('/sendNumber/' + id +'/' + number);
    };

    this.isMyTurn = function(id) {
    	return $http.get('/isMyTurn/' + id);
    };

    this.endGame = function() {
    	return $http.get('/endGame');
    };
});