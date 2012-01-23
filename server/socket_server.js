/**
 * websocket-server
 */
// Settings
var    io = require('socket.io').listen(process.env.VMC_APP_PORT || 3000),
	fs = require('fs'),
	path = require('path');

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

// Users info
var users = {};

io.sockets.on('connection', function (socket) {
	// error
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
	io.sockets.emit('user_list', users);
	socket.emit('init', user_data);
	// User set
	socket.on('add_user', function (data) {
		if (data && data.name) {
			user_data.name = data.name;
			users[user_data.id] = user_data;
			io.sockets.emit('user_list', users);
		} else error('add_userに失敗しました');
	});
	// User activity
	socket.on('user_activity', function (data) {
		if (data && data.type) {
			user_data.type = data.type;
			for (var param in data) {
				if (data.hasOwnProperty(param)) {
					user_data[param] = data[param];
				}
			}
			users[user_data.id] = user_data;
			io.sockets.emit('user_list', users);
		} else error('user_activityに失敗しました');
	});
	// Image share
	socket.on('send_image', function (data) {
		if (data && data.img) {
			data.id = user_data.id;
			socket.broadcast.emit('receive_image', data);
			socket.emit('sent_check', {status: '共有されました'});
		} else error('send_imageに失敗しました');
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
		delete users[user_data.id];
		io.sockets.emit('user_list', users);
	});
});