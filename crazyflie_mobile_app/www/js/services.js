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

.service('Settings', function () {
  this.position = {
    dominantOnly: false,
    sensX: 0.5,
    sensY: 0.5,
    centerX: 0,
    centerY: 0
  };

  this.rotation = {
    reverse: false,
    sensitivity: 0.5,
    returnTime: 2
  }
});
