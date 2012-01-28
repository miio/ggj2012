/**
 * websocket-server
 */
// Settings
var room_max = 4;

// Require
var io = require('socket.io').listen(64550),
    fs = require('fs'),
    path = require('path');

// Global var
var users = {},
    rooms = {};

/* 一時的に停止
// Error log
process.on('uncaughtException', function(err) {
	var	file = path.join(__dirname, 'error.log'),
		str = JSON.stringify({
			date	: new Date().toString(),
			error	: err
		}),
		fd = fs.openSync(file, 'a'),
		position = fs.statSync(file).size;
	if (position !== 0) str = '\n,' + str;
	fs.writeSync(fd, str, position, 'utf8');
	fs.closeSync(fd);
});
*/

// Room
var new_room = function () {
	var room;
	for (var key in rooms) {
		if (rooms.hasOwnProperty(key)) {
			room = rooms[key];
			if (room.counter < room_max && ! room.is_closed) {
				console.log(room);
				return key;
			}
		}
	}
	// Room var
	var	room_users = {},
		room_id = String(new Date().getTime()) + ('00' + parseInt(Math.random() * 100, 10)).slice(-3);
	
	rooms[room_id] = new function () {
		var that = this;
		that.is_closed = false;
		that.counter = 0;
		var room = io.of('/' + room_id).on('connection', function (socket) {
			that.counter++;
			
			// Error
			var error = function (message) {
				socket.emit('error', {msg: message});
			};
			
			socket.get('user', function (err, user_data) {
				if (err !== null) error(err);
				if (user_data === null) error('disconnect');
				
				// Initialize
				room_users[user_data.id] = user_data;
				room.emit('user_list', room_users);
				
				// Chat
				socket.on('send_message', function (data) {
					if (data && data.msg) {
						data.id = user_data.id;
						socket.broadcast.emit('receive_message', data);
					} else error('send_messageに失敗しました');
				});
				
				// Disconnect
				socket.on('disconnect', function () {
					that.counter--;
					delete room_users[user_data.id];
					room.emit('user_list', room_users);
				});
			});
		});
	}();
	return room_id;
};

// Lobby
var lobby= io.sockets.on('connection', function (socket) {
    // Error
	var error = function (message) {
		socket.emit('error', {msg: message});
	};
    
	// Initialize
	var user_data = {
		id			: String(new Date().getTime()) + ('00' + parseInt(Math.random() * 100, 10)).slice(-3),
		name		: null,
		timestamp	: new Date().getTime()
	};
	users[user_data.id] = user_data;
	socket.emit('init', user_data);
	lobby.emit('user_list', users);
	
	// Add user
	socket.on('add_user', function (data) {
		if (data && data.name) {
			user_data.name = data.name;
			//var id = "room";
			var id = new_room();
			socket.set('user', user_data, function () {
				socket.emit('room', {id: id});
			});
		} else error('add_userに失敗しました');
	});
	
	// Disconnect
	socket.on('disconnect', function () {
		delete users[user_data.id];
		lobby.emit('user_list', users);
	});
});