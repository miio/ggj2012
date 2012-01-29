/**
 * websocket-server
 */
// Settings
var room_max = 4,
    objects_file = 'sushi.json';

// Require
var io = require('socket.io').listen(64550),
    fs = require('fs'),
    path = require('path');

// Global var
var users = {},
	rooms = {},
	objects = {};

// Global method
var object_parse = function (obj, keyname) {
	var a = [],
		o = {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			a[a.length] = key;
			o[key] = {
				name	: obj[key][keyname]
			};
		}
	}
	return {id_array: a, object: o};
};

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

// Load objects
objects = JSON.parse(fs.readFileSync(path.resolve(objects_file), 'utf8'));
objects.parse = object_parse(objects, 'name');

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
		room_id = String(new Date().getTime()) + ('00' + parseInt(Math.random() * 100, 10)).slice(-3),
		stream = new function () {
			var	that = this,
				turn = 0,
				get_lock = true,
				obj_id;
			this.send = function (room) {
                var f = arguments.callee;
				turn++;
                
				get_lock = false;
				var	id_array = objects.parse.id_array,
					object_id = id_array[Math.floor(Math.random() * id_array.length)];
				obj_id = object_id;
                setTimeout( function () {
                    obj_id = null;
                    if (! get_lock) f(room);
                }, 2950);
				room.emit('object_stream', {
					turn		: that.turn,
					object_id	: object_id
				});
			};
			this.get = function (room, user_id, object_id) {
				if (get_lock) return true;
				get_lock = true;
				if (obj_id !== object_id) return false;
				room_users[user_id].score += objects[object_id].price;
				room_users[user_id].count++;
				
				// Pass count
				for (var key in room_users) {
					if (room_users.hasOwnProperty(key) && ! room_users[key].clicked) {
						room_users[key].pass_count++;
					}
				}
				
				room.emit('user_list', room_users);
				return true;
			};
		}();
	
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
				if (user_data === null || typeof(user_data.id) === 'undefined') error('disconnect');
				
				// Initialize
				room_users[user_data.id] = user_data;
				room_users[user_data.id].score = 0;
				room_users[user_data.id].count = 0;
				room_users[user_data.id].pass_count = 0;
				room_users[user_data.id].clicked = false;
				room.emit('user_list', room_users);
				
				// Game start
				socket.on('game_start', function () {
					if (! that.is_closed) {
						var player_count = 0;
						for (var key in room_users) {
							if (room_users.hasOwnProperty(key)) {
								room_users[key].player = ++player_count;
							}
						}
						room.emit('user_list', room_users);
						
						that.is_closed = true;
						// Send object
						room.emit('get_object', objects);
						
						stream.send(room);
					}
				});
				
				// Get sushi
				socket.on('get_sushi', function (data) {
					if (data && data.sushi_order_id) {
						room_users[user_data.id].clicked = true;
						if (! stream.get(room, user_data.id, data.sushi_order_id)) error('get_sushi fatal error!');
						stream.send(room);
					} else error('get_sushiに失敗しました。');
				});
				
				// Dobon user
				socket.on('get_dobon_user_id', function () {
					var	a = [],
						max_dobon;
					for (var key in room_users) {
						if (room_users.hasOwnProperty(key)) {
							a[a.length] = {
								id	  : key,
								count   : room_users[key].pass_count
							};
						}
					}
					a.sort(function (x, y) {
						return x.count - y.count;
					});
					max_dobon = a[a.length-1].count;
					
					var ret = [];
                    for (key in room_users) {
                        if (room_users.hasOwnProperty(key) && (max_dobon - room_users[key].pass_count) >= 5) {
                            ret.push({id: room_users[key].id});
                        }
                    }
					socket.emit('dobon_user_ids', ret);
				});
				
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