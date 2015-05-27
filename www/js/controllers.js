angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $location, $window, Login, $rootScope, $cordovaDevice, 
  Events, EventsHist, $http, md5Service, API_URL) {
  
  document.addEventListener('deviceready', function () {
  	$rootScope.imei = $cordovaDevice.getUUID();
  }, false);

  $scope.login = function(login) {
  	$scope.invalidUser = false;

    // local authentication
    var token = $window.localStorage.token || false;
    var userToken = md5Service.md5(login.cpf + login.pass);
    if(token !== false && userToken === token) {
      $scope.processLogin(login);
      return;
    }
    
    // remote authentication
    $scope.loggingIn = true;
    $http.post(API_URL + 'usuarios/autenticar', { usuario:login.cpf, senha:login.pass }).
      success(function(data) {
        $window.localStorage.token = data.token;
        $scope.loggingIn = false;
        $scope.processLogin(login);
      }).
      error(function() {
        $scope.loggingIn = false;
        $scope.invalidUser = true;
      });
  };

  $scope.processLogin = function(login) {
    Login.setLoggedIn(true);
    Login.setCurrentUser(login.cpf);
    login.cpf = '';
    login.pass = '';
    $rootScope.show = true;
    $rootScope.hideTabs = false;
    $location.path('/tab/home');
  }

  $scope.logout = function() {
  	$rootScope.show = false;
  	$rootScope.hideTabs = true;
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
  		var loggedUser = Login.getCurrentUser();
  		var current = Events.getCurrentByUser(loggedUser);
  		if(current) {
  			Events.setEndDateByUser(loggedUser, 'sem status');
        EventsHist.setEndDateByUser(loggedUser, 'sem status');
  		}
  		$scope.logout();
  	}
  };

  $scope.doLogout();
})

.controller('HomeCtrl', function($scope, Services, Login, Events, EventsHist, DateUtils, 
		ServicesMsg, $ionicPlatform, $cordovaGeolocation) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  $scope.services = Services.all();
  $scope.servicesMsg = ServicesMsg.all();

  $scope.getCurrentEvent = function() {
  	$scope.hasCurrentEvent = false;
  	var current = Events.getCurrentByUser($scope.loggedUser);
  	if(current) {
  		$scope.currentEventName = Services.getBySlug(current.serviceSlug).name;
  		$scope.currentEvent = current;
  		$scope.hasCurrentEvent = true;
  	}
  };
  
  $scope.add = function(eventMsgId) {
  	if($scope.hasCurrentEvent && $scope.service.id === $scope.currentEvent.serviceId) {
  		Events.setEndDateByUser($scope.loggedUser, $scope.date, eventMsgId, $scope.gps);
      EventsHist.setEndDateByUser($scope.loggedUser, $scope.date, eventMsgId);
  	} else {
  		Events.add($scope.service.id, $scope.service.slug, $scope.gps, $scope.date);
      EventsHist.add();
  	}
  	$scope.addConfirm = false;
  	$scope.getCurrentEvent();
  	$scope.checkHasToJustify();
  };

  $scope.confirm = function(service) {
  	$scope.service = service;
  	$scope.addConfirm = true;
  	$scope.date = DateUtils.getCurrentFormat();
  	$scope.gps = '';
  	
    $ionicPlatform.ready(function() {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
            $scope.gps = position.coords.latitude + ',' + position.coords.longitude;
        });
    }); 	
  };

  $scope.checkHasToJustify = function() {
  	if(!$scope.hasCurrentEvent) {
  		$scope.hasToJustify = false;
  		return;
  	}

  	// descanso < 30 min
  	if($scope.currentEvent.serviceId === '3') {
  		var initialDate = DateUtils.getDateFromText($scope.currentEvent.initialDate);
  		var checkDate = DateUtils.addMinutes(initialDate, 30);
  		var currentDate = new Date();
  		if(currentDate.getTime() < checkDate.getTime()) {
  			$scope.hasToJustify = true;
  		}
  		return;
  	}

  	// refeição < 1 hora
  	if($scope.currentEvent.serviceId === '4') {
  		var initialDate = DateUtils.getDateFromText($scope.currentEvent.initialDate);
  		var checkDate = DateUtils.addMinutes(initialDate, 60);
  		var currentDate = new Date();
  		if(currentDate.getTime() < checkDate.getTime()) {
  			$scope.hasToJustify = true;
  		}
  		return;
  	}

  	// volante > 5h30
  	if($scope.currentEvent.serviceId === '2') {
  		var initialDate = DateUtils.getDateFromText($scope.currentEvent.initialDate);
  		var checkDate = DateUtils.addMinutes(initialDate, 330);
  		var currentDate = new Date();
  		if(currentDate.getTime() > checkDate.getTime()) {
  			$scope.hasToJustify = true;
  		}
  		return;
  	}

  	$scope.hasToJustify = false;
  };

  $scope.getCurrentEvent();
  $scope.checkHasToJustify();
})

.controller('StoredCtrl', function($scope, Login, Events, Services) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  var user = Login.getCurrentUser();
  $scope.events = Events.getAllByUser(user);
})

.controller('SyncCtrl', function($scope, $rootScope, Login, Sync) {

  $scope.sendToServer = function() {
    $rootScope.success = false;
    $rootScope.error = false;
    Login.validate();
    Sync.sendToServer();
  };

  $scope.sendToServer();
})

.controller('HistoryCtrl', function($scope, Login, EventsHist, Services) {
  Login.validate();
  $scope.loggedUser = Login.getCurrentUser();
  $scope.events = EventsHist.getAllByUser($scope.loggedUser);

  $scope.getEventNameBySlug = function(slug) {
  	var event = Services.getBySlug(slug);
  	return event.name;
  };
});
