app.controller('mainController', function($scope){

    $scope.Title = "Chat About: ";
    $scope.PeerId = '';
    $scope.Name = '';
    $scope.Email = '';
    $scope.BriefDesc = '';
    $scope.UserCount = 0;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var peer = new Peer({
        // http://peerjs.com/peerserver
        key:  'im9l7izmb9lcv7vi',
        debug:3,
        config: {
            'iceServers': [
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun1.l.goggle.com:19302'},
                {url: 'turn:numb.numb.viagenie.ca', username: 'graham.hardy@snapav.com', credential: 'snapav' }
            ]
        }
    });

    var options = { audio: false, video: true };
    var socket = io.connect();

    $scope.init = function(){

        peer.on('open', function(){
            $scope.PeerId = peer.id;
        });

        socket.on('init', function(data){

            $('#availableUsers').append(
                $('<li role="presentation">').append(
                    $('<a>', { href: "" }).text(data.name)
                )
            );

            $('#availableUsers li a').click(function(peerId){
               $scope.makeCall(peerId);
            });
        });


        socket.on('time', function(data) {
            $('#time').html(data.time);
        });

        $('form').submit(function(){

            var data= {};
            data.msg = $('#m').val();
            data.name = $scope.Name;
            data.time = new Date();

            socket.emit('chat message', data);

            $('#m').val('');
            return false;
        });

        socket.on('chat message', function(data){
            var time = new Date(data.time);
            $('#messages').append(
                $('<li class="left clearfix">').append(
                    $('<div class="chat-body clearfix">').append(
                        $('<div class="header">').append(
                            $('<strong class="primary-font">').text(data.name).append(
                                $('<small class="pull-right text-muted">').append(
                                    $('<span class="glyphicon glyphicon-time">').text(' ' + time.toLocaleTimeString()).append(

                                    )
                                )
                            )
                        ).append(
                            $('<p>').text(data.msg)
                        )

                  )
              )
            );
        });

        $('#navVideo').click(function(){
            $scope.startVideo();
        });

        $('#navScreenSharing').click(function(){

        });

        $('#myModal').modal('show');
    };

    $scope.getCustomer = function(){
        socket.emit('init', { peerId: $scope.PeerId, name: $scope.Name, email: $scope.Email });
        $('#myModal').modal('hide');
    };

    $scope.makeCall = function(peerId){
        //navigator.getUserMedia(options, function(stream){
           //var call = peer.call($scope.PeerIdRemote, stream);
        //});
    };

    $scope.startVideo = function(){
        navigator.getUserMedia(options, $scope.onSuccessVideo, $scope.onError);
    };

    $scope.onSuccessVideo = function(stream){
        var video = $('#localVideo')[0];
        window.stream = stream;

        if (window.URL) {
            video.src = window.URL.createObjectURL(stream);
        } else {
            video.src = stream;
        }
    };

    $scope.onError = function(e){
        console.log(e);
    };

    $scope.init();
});
