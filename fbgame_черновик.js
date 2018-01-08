'use strict';
$(function(){

      var myPeer; // peer object
      var conn; // connection stored
      var User;
      var Opponent;
      // click event listener - click will create new peer (host)!
      $('#getID').on('click', function(){

        // new host-peer
        myPeer = new Peer({key:'9l97dfmlbygy14i', debug: 3});
        // Here we are create new ID of the connection (our host)
        myPeer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
        });
        //  IMPORTANT: Here we are deal with incoming connection
        //             from remote peer (guest)!!!

        myPeer.on('connection', function(connection) {
          // IMPORTANT to handle recieved connection
          // after this assignment we can use .send() method for our HOST!
          // conn.send(our message);
          conn = connection; //can use .send() method for our HOST!

          // Here set listener for incoming messages
          conn.on('data', function(data){
            if (data.type){
              moveOpponent(data.pos);
            }else{
              console.log('Recieved - ' + data);
            }
          });


        });//P2P FUNCTION
        User = '#goalkeeperLeft';
        Opponent = '#goalkeeperRight';
    });

    // click event listener - click will connect
    //  with new peer (guest) to existed peer (host)!
    $('#connectToID').on('click', function(){
      // new guest-peer
      myPeer = new Peer({key:'9l97dfmlbygy14i', debug: 3});
      // take host-peer ID from input to create connection
      let otherPIR = $('#writeID').val();
      // establish connection with host-peer

      // IMPORTANT to handle recieved connection
      // after this assignment we can use .send() method for our GUEST!
      // conn.send(our message);
      conn = myPeer.connect(otherPIR); //can use .send() method for our GUEST!


      // if connection established - send greeting
      conn.on('open', function(id) {
            conn.send('Greeting message!');
            //console.log('My peer ID is: ' + myPeer.id + '. Connected successful!');
            //console.log('Status: ' + myPeer.open);
      });

      // Here we listening for incoming messages
      conn.on('data', function(data){
        if (data.type){
            moveOpponent(data.pos);
        }else{
            console.log('Recieved - ' + data);
        }
      });
      User = '#goalkeeperRight';
      Opponent = '#goalkeeperLeft';
    });

    // Send message function
    $('#sendMessage').on('click', function(){
        // here conn - our HOST or GUEST connection
        conn.send(prompt('Enter your message: '));
    });

// ************** GAME ***********************

  var upperLimit = 110;
  var lowerLimit = 340;
  $(document).on('keydown', function(e){
    e.preventDefault();
    if (!User){
      alert('You need to create or join game first!');
      return;
    }

      let replacement = $(User).attr('y');

    if(e.keyCode === 38){ // up
      //надо заменитть на доступ к значению по оси Х
      //по отношению к вратарю
      if( replacement > upperLimit){
        replacement--;
        sendMovement(replacement);
      }
       $(User).attr('y',replacement);
      //функция передающая перемещиение в чат
      //функция задающая перемещение вратаря
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      if( lowerLimit > replacement){

        replacement++;
        sendMovement(replacement);
      }//else do nothing
      $(User).attr('y',replacement);
      //функция передающая перемещиение в чат
      //функция задающая перемещение вратаря
    }

  })

  function sendMovement(position){
      conn.send({type: 'movement', pos: position});
  };

  function moveOpponent(posY){
      $(Opponent).attr('y',posY);
  };

var ball = $('#ball');
var canvas = $('#field');
var W = 740;
var H = 450;
var ballRadius = ball.attr('r');
var x = ball.attr('cx')-10;
var y = ball.attr('cy')-10;
var dx = 2;
var dy = -2;

function moveBall() {

    if(x + dx > W-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > H-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    x += dx;
    y += dy;
    ball.attr('cx',x);
    ball.attr('cy',y);
}
setInterval(moveBall, 10);

}); // ready brackets*/