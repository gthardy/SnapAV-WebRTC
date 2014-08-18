var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

localVideo.addEventListener("loadedmetadata", function(){
	console.log("Local video currentSrc: " + this.currentSrc +
    		", videoWidth: " + this.videoWidth +
    		"px,  videoHeight: " + this.videoHeight + "px");
});

remoteVideo.addEventListener("loadedmetadata", function(){
	console.log("Remote video currentSrc: " + this.currentSrc +
        	", videoWidth: " + this.videoWidth +
        	"px,  videoHeight: " + this.videoHeight + "px");
});

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

var total = '';

function gotStream(stream){
	console.log("Received local stream");
	
	localVideo.src = URL.createObjectURL(stream);
	localStream = stream;
	
	callButton.disabled = false;
}

function start() {
	console.log("Requesting local stream");
	
	startButton.disabled = true;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({ audio: true, video:true }, gotStream,
	function(error) {
	  console.log("navigator.getUserMedia error: ", error);
	});
}

function call() {
	
	callButton.disabled = true;
	hangupButton.disabled = false;
	console.log("Starting call");

	if (localStream.getVideoTracks().length > 0) {
		console.log('Using video device: ' + localStream.getVideoTracks()[0].label);
	}
	if (localStream.getAudioTracks().length > 0) {
		console.log('Using audio device: ' + localStream.getAudioTracks()[0].label);
	}

	var servers = null;

	localPeerConnection = new webkitRTCPeerConnection(servers);
	console.log("Created local peer connection object localPeerConnection");
	localPeerConnection.onicecandidate = gotLocalIceCandidate;

	remotePeerConnection = new webkitRTCPeerConnection(servers);
	console.log("Created remote peer connection object remotePeerConnection");
	remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
	remotePeerConnection.onaddstream = gotRemoteStream;

	localPeerConnection.addStream(localStream);
	console.log("Added localStream to localPeerConnection");
	localPeerConnection.createOffer(gotLocalDescription);
}

function gotLocalDescription(description){
	localPeerConnection.setLocalDescription(description);
	console.log("Offer from localPeerConnection: \n" + description.sdp);
	remotePeerConnection.setRemoteDescription(description);
	remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(description){
	remotePeerConnection.setLocalDescription(description);
	console.log("Answer from remotePeerConnection: \n" + description.sdp);
	localPeerConnection.setRemoteDescription(description);
}

function hangup() {
	console.log("Ending call");
	
	localPeerConnection.close();
	remotePeerConnection.close();
	
	localPeerConnection = null;
	remotePeerConnection = null;
	
	hangupButton.disabled = true;
	callButton.disabled = false;
}

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
  console.log("Received remote stream");
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}