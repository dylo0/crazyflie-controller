angular.module('starter.directives', [])
.directive('accelJoystick', function (Settings) {
	return {
		restrict: 'AE',
		template: '<canvas style="width:300px;height:300px" id="canvas" width="1200" height="1200"></canvas>',
		scope: {
			coords: '='
		},
		link: function (scope, element, attrs) {
			var canvas;
			var rotationStartX;
			var rotator = attrs.rotator || true;

			scope.$watch('coords', function (val) {
				// todo - remove hardcoded values ( 48, -48, 0.01)
				scope.updateJoy(48 * val.x, -48 * val.y, 0.002 * val.alpha);
			}, true);


			var initializeCanvas = function () {
				canvas = document.getElementById("canvas");
				canvas.addEventListener('touchstart', scope.onTouchStart, false);
				canvas.addEventListener('touchmove', scope.onTouchMove, false);
			}

			// joy drawing functions
			scope.drawBackground = function (ctx, centerX, centerY, radius) {
	            ctx.fillStyle = '#F0F0F2';
	            ctx.beginPath();
	            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	            ctx.fill();

	            ctx.lineWidth = 80;
	            ctx.strokeStyle = '#BFBFBF';
	            ctx.stroke();   
			}

			scope.drawPointer = function (ctx, x, y) {
				// ctx.fillStyle = 'BFBFBF';
	            ctx.beginPath();
	            ctx.arc(x, y, 16, 0, 2 * Math.PI, false);
	            ctx.fill();

	            ctx.lineWidth = 4;
	            ctx.stroke();
			}
			
			scope.drawRotator = function (ctx, centerX, centerY, radius, rotation) {
	            // Ring parameters are for now hardcoded
	            for (var i=1; i<26; i+=2) {
		            ctx.beginPath();
		            ctx.lineWidth = 80;
		            ctx.strokeStyle = "#D9D9D9";
		            var alpha = Math.PI *rotation;
		            ctx.arc(centerX, centerY, radius, i * Math.PI / 13 + alpha, (i * Math.PI / 13) + Math.PI/15 + alpha, false);
		            ctx.stroke();
	            }

			}

			// joy manipulation functions
			scope.onTouchStart = function (event) {
				event.preventDefault();
				rotationStartX = event.targetTouches[0].pageX;
			}

			scope.onTouchMove = function (event) {
				scope.coords.alpha = event.targetTouches[0].pageX - rotationStartX;
			}

			scope.updateJoy = function (valX, valY, rotation) {
		        
		        if (canvas.getContext) {
		            var ctx = canvas.getContext("2d");
             		var centerX = canvas.width / 2;
		            var centerY = canvas.height / 2;
		            var radius = 480;
		            
		            //clear the canvas
		            ctx.clearRect(0,0, canvas.width, canvas.height);

		            scope.drawBackground(ctx, centerX, centerY, radius);
		            if (rotator) {
		            	scope.drawRotator(ctx, centerX, centerY, radius, rotation);
		            }
		            scope.drawPointer(ctx, centerX - valX, centerY - valY);
		        }
			}

			initializeCanvas();
		}
	}
})

.directive('integer', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue, 10);
            });
        }
    };
})

.directive('float', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                return parseFloat(viewValue);
            });
        }
    };
})