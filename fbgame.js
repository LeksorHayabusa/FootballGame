
var myPeer = new Peer({key:'lwjd5qra8257b9'});
// a new comment by Dimas
$(document).ready(function(){
$('#getID').on('click', function(){
	alert('sd');

})

$('#connectToID').on('submit', function(event){
	event.preventDefault();
	var otherPIR = $('writeID').val();
})

	myPeer.on('open', function(id) {
  		console.log('My peer ID is: ' + id);
});
//getElementByID('connectToID').
var conn = myPeer.connect('dest-peer-id');

conn.on('open', function() {
  // Receive messages
  conn.on('data', function(data) {
    console.log('Received', data);
  });

  conn.send('hello')
})

myPeer.on('connection', function(conn) { });


}) //ready function
