(function(sockets){
	
	sockets.init = function(server, io){
		io.on('connection', function(socket){
			
			socket.emit('init', { msg: "Welcome to a test socket.io app!" });
			

			socket.on('chat message', function(msg){
		    	io.emit('chat message', msg);
		  	});
			
			setInterval(function(){
				socket.emit('time', { time: new Date().toString() });
			}, 1000);
			
		});
	};
	
})(module.exports);