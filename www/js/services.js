angular.module('starter.services', [])

.factory('DateUtils', function() {

  return {
    getCurrentFormat: function() {
      return this.getDateFormat() + ' ' + this.getTimeFormat();
    },

    getDateFormat: function() {
      var date = new Date();
      var day = date.getDate();
      if(day.toString().length === 1) {
        day = '0' + day;
      }
      var month = date.getMonth() + 1;
      if(month.toString().length === 1) {
        month = '0' + month;
      }
      var year = date.getFullYear();
      return day + '/' + month + '/' + year;
    },

    getTimeFormat: function() {
      var date = new Date();
      var hours = date.getHours();
      if(hours.toString().length === 1) {
        hours = '0' + hours;
      }
      var minutes = date.getMinutes() + 1;
      if(minutes.toString().length === 1) {
        minutes = '0' + minutes;
      }
      var seconds = date.getSeconds();
      if(seconds.toString().length === 1) {
        seconds = '0' + seconds;
      }
      return hours + ':' + minutes + ':' + seconds;
    }
  };
})

.factory('Login', function($window, $location, $rootScope) {
  return {
    validate: function() {
      if(!$window.localStorage.isLoggedIn) {
        $location.path('/tab/login');
      }
    },

    isLoggedIn: function() {
      return $window.localStorage.isLoggedIn;
    },

    setLoggedIn: function(logged) {
      $rootScope.isLoggedIn = logged;
      $window.localStorage.isLoggedIn = logged;
    },

    getCurrentUser: function() {
      return $window.localStorage.user;
    },

    setCurrentUser: function(user) {
      $window.localStorage.user = user;
    }
  };
})

.factory('Events', function($window, Login) {
  return {
    add: function(serviceId, serviceSlug, gps, date) {
      var event = {
        'id': this.guid(),
        'user': Login.getCurrentUser(),
        'serviceId': serviceId, 
        'serviceSlug': serviceSlug, 
        'gps': gps,
        'initialDate': date,
        'endDate': ''
      };
      var events = this.getAll();
      events.push(event);
      $window.localStorage.events = angular.toJson(events);
    },

    setEndDateByUser: function(user, date) {
      var events = this.getAll();
      for(var i=(events.length-1); i>=0; i--) {
        if(events[i].user === user) {
          events[i].endDate = date;
          $window.localStorage.events = angular.toJson(events);
          break;
        }
      }
    },

    getAll: function() {
      if($window.localStorage.events) {
        return angular.fromJson($window.localStorage.events);
      }
      return [];
    },

    getAllByUser: function(user) {
      var events = this.getAll();
      var userEvents = [];
      for(var i=(events.length-1); i>=0; i--) {
        if(events[i].user === user) {
          userEvents.push(events[i]);
        }
      }
      return userEvents;
    },

    getLastByUser: function(user) {
      var events = this.getAll();
      for(var i=(events.length-1); i>=0; i--) {
        if(events[i].user === user) {
          return events[i];
        }
      }
      return false;
    },

    getCurrentByUser: function(user) {
      var current = this.getLastByUser(user);
      if(current && current.endDate === '') {
        return current;
      }
      return false;
    },

    guid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  };
})

.factory('Services', function() {

  var services = [
    { id: '1', slug: 'aguardando-liberacao', name: 'Aguardando liberação', icon: 'ion-lock-combination' },
    { id: '2', slug: 'volante', name: 'Volante', icon: 'ion-speedometer' },
    { id: '3', slug: 'descanso-30-min', name: 'Descanso 30 min', icon: 'ion-coffee' },
    { id: '4', slug: 'refeicao', name: 'Refeição', icon: 'ion-fork' },
    { id: '5', slug: 'espera', name: 'Espera', icon: 'ion-clock' },
    { id: '6', slug: 'repouso', name: 'Repouso', icon: 'ion-ios-moon' },
    { id: '7', slug: 'folga', name: 'Folga', icon: 'ion-ios-home-outline' }
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
    },

    getBySlug: function(slug) {
      for (var i = 0; i < services.length; i++) {
        if (services[i].slug === slug) {
          return services[i];
        }
      }
      return null;
    }
  };
});