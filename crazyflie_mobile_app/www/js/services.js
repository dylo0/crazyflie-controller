angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Sockets', function (socketFactory, Settings) {
    console.log('initializing sockets');
    var serverAdress = Settings.server.ip || 'http://192.168.1.108:3000';

    var ioSocket = io(serverAdress);

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    console.log('connecting to', serverAdress);
    return {
      socket: socket
    }
})

.service('MotionReader', function ($ionicPlatform, $cordovaDeviceMotion, $ionicPopup, Settings, Sockets) {
  console.log('calling motionreaeder');
  var watch;
  var xArr = [];
  var yArr = [];
  var currentIdx = 0;
  var easeLength = 5;
  var options = { frequency: 20 };
  var currentValue = {};

  var prepareArray = function (arr, n) {
    for (var i = 0; i< n; i++) {
      arr[i] = 0;
    }
  }

  var getEasedValues = function (newX, newY) {
    var xAverage = 0.0;
    var yAverage = 0.0;

    xArr[currentIdx] = newX;
    yArr[currentIdx] = newY;
    
    if (currentIdx < easeLength -1 ) {
      currentIdx++;
    } else {
      currentIdx = 0; 
    }

    for (var i=0; i < easeLength; i++) {
      xAverage += xArr[i];
      yAverage += yArr[i];
    }

    xAverage = xAverage / easeLength;
    yAverage = yAverage / easeLength;

    return [xAverage, yAverage];
  }

  var onUpdateSuccess = function(acc) {
    var averages = getEasedValues(acc.x, acc.y);
    if (Settings.position.dominantOnly) {
      if (Math.abs(averages[0]) > Math.abs(averages[1]) ) {
        averages[1] = 0;
      } else {
        averages[0] = 0;
      }
    }

    Sockets.socket.emit('device:update', averages);

    currentValue.x = averages[0];
    currentValue.y = averages[1];
  };

  var startWatcher = function () {
      prepareArray(xArr, easeLength);
      prepareArray(yArr, easeLength);
      
    $ionicPlatform.ready(function () {
      if (!watch) {
        watch = $cordovaDeviceMotion.watchAcceleration(options);
        watch.promise.then(function() {/* unused */}, showError, onUpdateSuccess);
      }
    });
  }

  var stopWatcher = function () {
    if (watch) {
      $cordovaDeviceMotion.clearWatch(watch.watchId) 
      watch = undefined;
    }
  }

  var showError = function() {
      var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Problem with accelerometer!'
      });
      alertPopup.then(function () {
        
      })
  };

  this.startWatcher = startWatcher;
  this.stopWatcher = stopWatcher;
  this.value = currentValue;
})


.service('Settings', function () {
  this.position = {
    dominantOnly: false,
    sensX: 0.5,
    sensY: 0.5,
    // for simple calibration
    centerX: 0,
    centerY: 0
  };

  this.rotation = {
    reverse: false,
    sensitivity: 0.5,
    returnTime: 2
  }

  this.server = {
    ip: 'http://192.168.1.108:3000'
  }
});
