(function(sockets){
    var clients = [];
	sockets.init = function(server, io){
		io.on('connection', function(socket){

            socket.on('init', function(data){
                clients.push(data);
                io.emit('init',  clients);

                console.log(clients);
            });

            socket.on('disconnect', function() {
                clients.splice(clients.indexOf(socket), 1);
                io.emit('init', clients);
            });

			socket.on('chat message', function(data){
                io.emit('chat message', data);
		  	});

			//setInterval(function(){
				//socket.emit('time', { time: new Date().toDateString() + ' ' +  new Date().toLocaleTimeString() });
			//}, 1000);
			
		});
	};
	
})(module.exports);