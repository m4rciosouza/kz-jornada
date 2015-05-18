angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $location, $window, Login, $rootScope) {
  $scope.login = function(login) {
  	if(login.cpf === '123' || login.cpf === 'abc' && login.pass === '123') {
  		Login.setLoggedIn(true);
  		Login.setCurrentUser(login.cpf);
  		login.cpf = '';
  		login.pass = '';
  		$location.path('/tab/home');
  	}
  	$rootScope.show = true;
  };

  $scope.logout = function() {
  	$rootScope.show = false;
  	delete $window.localStorage.isLoggedIn;
  	delete $window.localStorage.user;
  	$location.path('/tab/login');
  };

  $scope.isLoggedIn = function() {
  	return Login.isLoggedIn();
  };

  $scope.checkLoggedIn = function() {
  	if($scope.isLoggedIn()) {
  		$location.path('/tab/home');
  	}
  };

  $scope.doLogout = function() {
  	if($scope.isLoggedIn) {
  		$scope.logout();
  	}
  };

  $scope.doLogout();
})

.controller('HomeCtrl', function($scope, Services, Login, Events, DateUtils) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  $scope.services = Services.all();

  $scope.getCurrentEvent = function() {
  	$scope.hasCurrentEvent = false;
  	var current = Events.getCurrentByUser($scope.loggedUser);
  	if(current) {
  		$scope.currentEventName = Services.getBySlug(current.serviceSlug).name;
  		$scope.currentEvent = current;
  		$scope.hasCurrentEvent = true;
  	}
  };
  
  $scope.add = function() {
  	if($scope.hasCurrentEvent && $scope.service.id === $scope.currentEvent.serviceId) {
  		Events.setEndDateByUser($scope.loggedUser, $scope.date);
  	} else {
  		Events.add($scope.service.id, $scope.service.slug, $scope.gps, $scope.date);
  	}
  	$scope.addConfirm = false;
  	$scope.getCurrentEvent();
  };

  $scope.confirm = function(service) {
  	$scope.service = service;
  	$scope.addConfirm = true;
  	$scope.date = DateUtils.getCurrentFormat();
  	$scope.gps = '123123 132123';
  };

  $scope.cancelAdd = function() {
  	$scope.addConfirm = false;
  };

  $scope.getCurrentEvent();
})

.controller('StoredCtrl', function($scope, Login, Events, Services) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  var user = Login.getCurrentUser();
  $scope.events = Events.getAllByUser(user);

  $scope.getEventNameBySlug = function(slug) {
  	var event = Services.getBySlug(slug);
  	return event.name;
  };
})

.controller('HistoryCtrl', function($scope, Login, Events, Services) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  var user = Login.getCurrentUser();
  $scope.events = Events.getAllByUser(user);

  $scope.getEventNameBySlug = function(slug) {
  	var event = Services.getBySlug(slug);
  	return event.name;
  };
});
