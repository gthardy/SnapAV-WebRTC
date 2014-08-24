app.controller('mainController', function($scope){

    $scope.Title = "Chat About: ";
    $scope.PeerId = '';
    $scope.Name = '';
    $scope.Email = '';
    $scope.BriefDesc = '';

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var peer = peer = new Peer({
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
            $('#availableUsers').append($('<li class="list-group-item">').text(data.name));
        });

        socket.on('time', function(data) {
            //console.log(data);
            $('#time').html(data.time);
        });

        $('form').submit(function(){
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chat message', function(msg){
            $('#messages').append($('<li class="list-group-item">').text($scope.Name + ': ' + msg));
        });

        $('#myModal').modal('show');
    };

    $scope.getCustomer = function(){
        socket.emit('init', { peerId: $scope.PeerId, name: $scope.Name, email: $scope.Email });
        $('#myModal').modal('hide');
    };

    $scope.makeCall = function(){
        var conn = peer.connect($scope.PeerIdRemote);
        conn.on('open', function(){
            conn.send('hi');
        });
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