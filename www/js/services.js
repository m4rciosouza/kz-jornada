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
      var minutes = date.getMinutes();
      if(minutes.toString().length === 1) {
        minutes = '0' + minutes;
      }
      var seconds = date.getSeconds();
      if(seconds.toString().length === 1) {
        seconds = '0' + seconds;
      }
      return hours + ':' + minutes + ':' + seconds;
    },

    addMinutes: function(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
    },

    getDateFromText: function(textDate) {
      var dateTime = textDate.split(' ');
      var date = dateTime[0].split('/');
      var time = dateTime[1].split(':');
      return new Date(date[2], date[1]-1, date[0], time[0], time[1], time[2]);
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
        'endDate': '',
        'eventMsgId': ''
      };
      var events = this.getAll();
      events.push(event);
      $window.localStorage.events = angular.toJson(events);
    },

    setEndDateByUser: function(user, date, eventMsgId) {
      var events = this.getAll();
      for(var i=(events.length-1); i>=0; i--) {
        if(events[i].user === user) {
          events[i].endDate = date;
          events[i].eventMsgId = eventMsgId;
          $window.localStorage.events = angular.toJson(events);
          break;
        }
      }
    },

    remove: function(eventId) {
      var events = this.getAll();
      var newEvents = [];
      for(var i=0; i<events.length; i++) {
        if(events[i].id !== eventId) {
          newEvents.push(events[i]);
        }
      }
      $window.localStorage.events = angular.toJson(newEvents);
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

.factory('EventsHist', function($window, Login, Events) {
  return {
    add: function() {
      var event = Events.getLastByUser(Login.getCurrentUser());
      var events = this.getAll();
      events.push(event);
      $window.localStorage.eventsHist = angular.toJson(events);
    },

    setEndDateByUser: function(user, date, eventMsgId) {
      var events = this.getAll();
      for(var i=(events.length-1); i>=0; i--) {
        if(events[i].user === user) {
          events[i].endDate = date;
          events[i].eventMsgId = eventMsgId;
          $window.localStorage.eventsHist = angular.toJson(events);
          break;
        }
      }
    },

    getAll: function() {
      if($window.localStorage.eventsHist) {
        return angular.fromJson($window.localStorage.eventsHist);
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
})

.factory('ServicesMsg', function() {

  var servicesMsg = [
    { id: '1', name: 'Alta periculosidade' },
    { id: '2', name: 'Particularidade da carga' },
    { id: '3', name: 'Descanso fracionado' }, // (somente para descanso)
    { id: '4', name: 'Outros' },
  ];

  return {
    all: function() {
      return servicesMsg;
    },

    remove: function(service) {
      servicesMsg.splice(servicesMsg.indexOf(servicesMsg), 1);
    },

    get: function(id) {
      for (var i = 0; i < servicesMsg.length; i++) {
        if (servicesMsg[i].id === id) {
          return servicesMsg[i];
        }
      }
      return null;
    },

    getName: function(id) {
      var msg = this.get(id);
      if(msg) {
        return msg.name;
      }
      return null;
    }
  };
})

.factory('Sync', function($rootScope, $cordovaDialogs, Events, Login, DateUtils, $http, 
    API_URL, VERSAO, ServicesMsg) {

  return {

    sendToServer: function() {
      var events = Events.getAllByUser(Login.getCurrentUser());
      $rootScope.completed = 0;
      $rootScope.total = events.length;

      for(var i=0; i<events.length; i++) {
        if(events[i].endDate === '') {
          continue;
        }
        $http.post(API_URL + 'jornadas/cadastrar', 
            { 
              eventId: events[i].id,
              usuario: events[i].user, 
              gps: events[i].gps, 
              tipo: events[i].serviceId, 
              dataInicial: events[i].initialDate, 
              dataFinal: events[i].endDate, 
              imei: $rootScope.imei || '123456',
              versao: VERSAO,
              justificativa: ServicesMsg.getName(events[i].eventMsgId)
            }).
          success(function(data) {
            Events.remove(data.eventId);
            $rootScope.completed++;
            if($rootScope.completed === $rootScope.total) {
              $rootScope.success = true;
            }
          }).
          error(function() {
            console.log('SUCCESS: ' + data);
            $rootScope.error = true;
          });
      }
    },

    timeAlert: function() {
      var current = Events.getCurrentByUser(Login.getCurrentUser());

      // descanso >= 30 min
      if(current.serviceId === '3') {
        var initialDate = DateUtils.getDateFromText(current.initialDate);
        var checkDate = DateUtils.addMinutes(initialDate, 30);
        var currentDate = new Date();
        if(currentDate.getTime() >= checkDate.getTime()) {
          $cordovaDialogs.alert('O descanso de 30 minutos ultrapassou o limite de tempo.', 'Atenção!', 'OK');
        }
      }

      // refeição >= 1 hora
      if(current.serviceId === '4') {
        var initialDate = DateUtils.getDateFromText(current.initialDate);
        var checkDate = DateUtils.addMinutes(initialDate, 60);
        var currentDate = new Date();
        if(currentDate.getTime() >= checkDate.getTime()) {
          $cordovaDialogs.alert('O limite de tempo da refeição ultrapassou 1 hora.', 'Atenção!', 'OK');
        }
      }

      // volante > 5h30
      if(current.serviceId === '2') {
        var initialDate = DateUtils.getDateFromText(current.initialDate);
        var checkDate = DateUtils.addMinutes(initialDate, 330);
        var currentDate = new Date();
        if(currentDate.getTime() >= checkDate.getTime()) {
          $cordovaDialogs.alert('O limite de tempo de volante ultrapassou 5h30.', 'Atenção!', 'OK');
        }
      }

      $cordovaDialogs.beep(1);
    }
  };
});