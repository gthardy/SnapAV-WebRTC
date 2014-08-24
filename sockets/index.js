(function(sockets){
	
	sockets.init = function(server, io){
		io.on('connection', function(socket){
			
			socket.on('init', function(data){
                io.emit('init',  data);
                console.log(data.name + ' ' + data.email + ' ' + data.peerId);
            });

			socket.on('chat message', function(msg){
		    	io.emit('chat message', msg);
		  	});

			setInterval(function(){
				socket.emit('time', { time: new Date().toDateString() + ' ' +  new Date().toLocaleTimeString() });
			}, 1000);
			
		});
	};
	
})(module.exports);