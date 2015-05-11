angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {
  $scope.submit = function() {
  	console.log('logando...');
  };
})

.controller('HomeCtrl', function($scope, Services) {
  $scope.services = Services.all();
  $scope.lastAction = Services.get('2');
})

.controller('HistoryCtrl', function($scope) {
  $scope.services = {};
});
