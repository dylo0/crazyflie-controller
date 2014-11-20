angular.module('starter.directives', [])
.directive('accelJoystick', function () {
	return {
		restrict: 'AE',
		template: '<canvas id="canvas" width="300" height="300"></canvas>',
		scope: {
			coords: '='
		},
		link: function (scope, element, attrs) {
			scope.rotation = attrs.rotation || 0;

			scope.$watch('coords', function (val) {
				scope.updateJoy(-12 * val.x, 12 * val.y);
			}, true);

			scope.drawBackground = function (ctx, centerX, centerY, radius) {
				

	            ctx.fillStyle = 'green';
	            ctx.beginPath();
	            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	            ctx.fill();

	            ctx.lineWidth = 10;
	            ctx.strokeStyle = '#003300';
	            ctx.stroke();   
			}

			scope.drawPointer = function (ctx, x, y) {
				ctx.fillStyle = 'yellow';
	            ctx.beginPath();
	            ctx.arc(x, y, 5, 2 * Math.PI, false);
	            ctx.fill();

	            ctx.lineWidth = 1;
	            ctx.stroke();
			}
			

			scope.updateJoy = function (valX, valY) {
				var canvas = document.getElementById("canvas");
		        
		        if (canvas.getContext) {
		            var ctx = canvas.getContext("2d");
             		var centerX = canvas.width / 2;
		            var centerY = canvas.height / 2;
		            var radius = 140;
		            
		            //clear the canvas
		            ctx.clearRect(0,0, canvas.width, canvas.height);

		            scope.drawBackground(ctx, centerX, centerY, radius);
		            scope.drawPointer(ctx, centerX - valX, centerY - valY);
		            ctx.beginPath();
		        }
			}
		}
	}
})