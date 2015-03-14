app.controller('mainController', function($scope){

    $scope.Title = "Chat About: ";
    $scope.PeerId = '';
    $scope.RemotePeerId = '';
    $scope.Name = '';
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

    var options = { audio: true, video: true };
    var socket = io.connect();
    var clients = [];
    $scope.init = function(){

        peer.on('open', function(){
            $scope.PeerId = peer.id;
        });

        peer.on('call', function(call){
            call.answer(window.localStream);
            $scope.onAnswer(call);
        });

        socket.on('init', function(data){

            $('#availableUsers li').remove();

            for (var i = 0; i < data.length; i++) {

                if($scope.PeerId !== data[i].peerId) {

                    $('#availableUsers').append(
                        $('<li role="presentation">').append(
                            $('<a>', { href: "", id: data[i].peerId }).text(data[i].name)
                        )
                    );

                    $('#' + data[i].peerId).click(function () {
                        var id = $(this).prop('id');
                        $scope.makeCall(id);
                    });
                }
            }
        });

        socket.on('time', function(data) {
            //$('#time').html(data.time);
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
                            $('<b class="primary-font">').text(data.name).append(
                                $('<small class="pull-right">').append(
                                    $('<span class="">').text(' ' + time.toLocaleTimeString()).append()
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
            $scope.startScreenSharing();
        });

        $('#myModal').modal('show');
    };

    $scope.getCustomer = function(){
        socket.emit('init', { peerId: $scope.PeerId, name: $scope.Name });
        $('#myModal').modal('hide');

    };

    $scope.makeCall = function(peerId){
        console.log("Users Peer Id: " + peerId);
        $scope.RemotePeerId = peerId;
        var call = peer.call(peerId, window.localStream);
    };

    $scope.onAnswer = function(call){
       if(window.existingCall){
           window.existingCall.close();
       }
        call.on('stream', function(stream){
           $('#remoteVideo').prop('src', URL.createObjectURL(stream));
        });
    }

    $scope.startVideo = function(){
        navigator.getUserMedia(options, $scope.onSuccessVideo, $scope.onError);
    };

    $scope.startScreenSharing = function(){

    };

    $scope.onSuccessVideo = function(stream){
        $('#localVideo').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
    };

    $scope.onError = function(e){
        console.log(e);
    };
    $scope.init();
});
