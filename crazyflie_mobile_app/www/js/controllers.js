angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $ionicPlatform, $cordovaDeviceMotion) {
	$scope.error = '';
	$scope.acceleration = {};
	$scope.capturedAcc = {};
	$scope.options = { frequency: 500 };  // Update every 0.5 seconds
	$scope.timesUpdated = 0;
	$scope.testClick = 0;

	var watch;

	$scope.test = function () {
		$scope.testClick += 1;
	}

	$scope.onCaptureSuccess = function (acceleration) {
		$scope.captureAccel = acceleration;
	}

	$scope.onUpdateSuccess = function(acceleration) {
		$scope.acceleration = acceleration;
		$scope.timesUpdated += 1;
	};

	$scope.onError = function() {
	    $scope.error = 'Problem with accelerator has occured';
	};

	$scope.startWatcher = function () {
		if (!watch) {
			watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
			watch.promise.then(function() {/* unused */}, $scope.onError, $scope.onUpdateSuccess);
		}
	}

	$scope.cleanWatcher = function () {
		$cordovaDeviceMotion.clearWatch(watch.watchId)
		watch = undefined;
	}

	$scope.captureAccel = function () {
		$cordovaDeviceMotion.getCurrentAcceleration().then($scope.onCaptureSuccess, $scope.onError);
	}
})

.controller('JoystickCtrl', function ($scope, $ionicPlatform, $cordovaDeviceMotion, $ionicPopup) {
	$scope.leftOffset = 125;
	$scope.topOffset = 125;
	$scope.options = { frequency: 20 };
	$scope.val = {
		x: 0,
		y: 0
	}

	// $scope.val = 150;
	var watch;
	var xArr = [];
	var yArr = [];
	var currentIdx = 0;
	var easeLength = 5;

	$scope.prepareArray = function (arr, n) {
		for (var i = 0; i< n; i++) {
			arr[i] = 0;
		}
	}

	$scope.getEasedValues = function (newX, newY) {
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

	$scope.onUpdateSuccess = function(acc) {
		var averages = $scope.getEasedValues(acc.x, acc.y);
		$scope.val.x = averages[0];
		$scope.val.y = averages[1];
	};

	$scope.startWatcher = function () {
		if (!watch) {
			watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
			watch.promise.then(function() {/* unused */}, $scope.showError, $scope.onUpdateSuccess);
		}
	}

	$scope.showError = function() {
	    var alertPopup = $ionicPopup.alert({
	        title: 'Error',
	        template: 'Problem with accelerometer!'
	    });
	    alertPopup.then(function () {
	    	
	    })
	};

	$ionicPlatform.ready(function () {
		$scope.prepareArray(xArr, easeLength);
		$scope.prepareArray(yArr, easeLength);
		$scope.startWatcher();
	})
})

.controller('FriendsCtrl', function ($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {
});
