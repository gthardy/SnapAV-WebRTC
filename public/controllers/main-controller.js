app.controller('mainController', function($scope){
    $scope.Title = "Issue: ";
    $scope.CustomerName = '';
    $scope.BriefDesc = '';

    var localstream;

    navigator.getWebcam = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    $scope.init = function(){
        var socket = io.connect();

        socket.on('init', function(msg){
            //console.log(msg.msg);
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
            $('#messages').append($('<li class="list-group-item">').text($scope.CustomerName + ': ' + msg));
        });

        $('#myModal').modal('show');
    };

    $scope.getCustomer = function(){
        $('#myModal').modal('hide');
    };
    $scope.startVideo = function(){
        var options =   { audio: false, video: true };
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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