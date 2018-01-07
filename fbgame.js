
'use strict'
var myPeer;
var connectedPeers = {};
myPeer = new Peer({key:'lwjd5qra8257b9'
  , debug : 3
  , logFunction : function(){
    var copy = Array.prototype.slice.call(arguments).join(' ');
    $('.log').append(copy + '<br>');
  }
});

// a new comment by Dimas

function connect(c){
  if (c.label === 'chat'){
    var charbox, header, messages;
    
    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
  }
}

$(document).ready(function(){
    myPeer.on('open', function(id){
      $('#myID').text('my id is: ' + id);
    })
//notation: method connect use homePeerID. and (hostPeerID)
//homePeerID.connect(hostPeerID, handler???)
  $('#connectToDestID').on('click', function(event){
    var destID = $('#destID').val();
    if(!connectedPeers[destID]){
      var c = myPeer.connect(destID, {
        label : 'gameData', 
        serialization : 'binary-utf8',
        metaData : {message : 'the game starts now!'}
      })
      c.on('open', function(){
        connect(c);
      })
      c.on('error', function(err){
        alert(err);
      })
    }
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
