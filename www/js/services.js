angular.module('starter.services', [])

.factory('Services', function() {

  // Some fake testing data
  var services = [
    { id: '1', name: 'Aguardando liberação', icon: 'ion-lock-combination' },
    { id: '2', name: 'Volante', icon: 'ion-speedometer' },
    { id: '3', name: 'Descanso 30 min', icon: 'ion-coffee' },
    { id: '4', name: 'Refeição', icon: 'ion-fork' },
    { id: '5', name: 'Espera', icon: 'ion-clock' },
    { id: '6', name: 'Repouso', icon: 'ion-ios-moon' }
  ];

  return {
    all: function() {
      return services;
    },
    remove: function(service) {
      services.splice(services.indexOf(service), 1);
    },
    get: function(id) {
      for (var i = 0; i < services.length; i++) {
        if (services[i].id === id) {
          return services[i];
        }
      }
      return null;
    }
  };
});
