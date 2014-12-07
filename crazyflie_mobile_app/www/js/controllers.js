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

.controller('JoystickCtrl', function ($scope, MotionReader) {
	$scope.leftOffset = 125;
	$scope.topOffset = 125;
	$scope.options = { frequency: 20 };
	$scope.val = {
		x: 0,
		y: 0,
		alpha: 0
	}
	// $scope.rotation = 0
	MotionReader.startatcher();
	$scope.val = angular.extend(MotionReader.value, $scope.val);
})

.controller('FriendsCtrl', function ($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('SettingsCtrl', function ($scope, Settings) {
	$scope.position = Settings.position;
	$scope.rotation = Settings.rotation;

	$scope.test = function () {
		console.log(Settings);
	}

	$scope.updateParam = function(param, val) {
		Settings[param] = val;
	}
});





