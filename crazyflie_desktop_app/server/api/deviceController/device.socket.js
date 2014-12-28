/**
 * Handles api socket
 */

'use strict';

exports.register = function(socket) {
	socket.on('device:update', function(data) {
		console.log('device updated', data);
		socket.broadcast.emit('device:updated', data);
	})
}

function onSave(socket, doc, cb) {
  socket.emit('thing:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('thing:remove', doc);
}