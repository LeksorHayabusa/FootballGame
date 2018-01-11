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


/*
резерваная копия function keyDownHandler(e){
    //e.preventDefault();
    //if (!User){
      //alert('You need to create or join game first!');
      //return;
    //}

      let replacement = keepY;

    if(e.keyCode === 38){ // up
      //надо заменитть на доступ к значению по оси Х
      //по отношению к вратарю
      if( replacement > upperLimit){
        replacement-=5;
        keeper.attr('y',replacement);
      }
       //$(User).attr('y',replacement);
      //функция передающая перемещиение в чат
      //функция задающая перемещение вратаря
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      if( lowerLimit > replacement){

        replacement+=5;
        keeper.attr('y',replacement);
      }//else do nothing
      //keeper.attr('y',replacement);
      //функция передающая перемещиение в чат
      //функция задающая перемещение вратаря
    }
    
  }*/
  /*function sendMovement(position){
      conn.send({type: 'movement', pos: position});
  };

  function moveOpponent(posY){
      $(Opponent).attr('y',posY);
  };
*/
//я изменил только ниже!!!!!!!!!!!!!!!!!!!!!!!
var keeper = $('#goalkeeperLeft');
var keepY = +(keeper.attr('y'));
var keepX = +(keeper.attr('x'));
var keepHeight = +(keeper.attr('height'));
var keepWidth = +(keeper.attr('width'));
var ball = $('#ball');
var field = $('#field');
var Width = +(field.attr('width'));
var Height = +(field.attr('height'));
var fieldX = +(field.attr('x'));
var fieldY = +(field.attr('y'));
var ballRadius = +(ball.attr('r'));
var x = ball.attr('cx')-10;
var y = ball.attr('cy')-10;
  var dx = 1;
  var dy = -1;

function moveBall() {
    if(x + dx > (Width + fieldX) || x + dx < fieldX) {
        dx = -dx;
    }
    if(y + dy > (Height + fieldY) || y + dy < fieldY) {
        dy = -dy;
    }
    x += dx;
    y += dy;
    ball.attr('cx', x);
    ball.attr('cy', y);
    collapsBallKeeper();
    
}
function collapsBallKeeper(){
  if (x-ballRadius === keepX + keepWidth){
    if ( keepY <= y+ballRadius && y-ballRadius < keepY + keepHeight){
      console.log('keeper catches');
      dx = -dx;} 
  }
}
/*function ballOut(){
  if(x-ballRadius === keepX){
    alert('the ball is out of field');
    setInterval(function(){
      moveKeeper();
      moveBall(); }, 10);
    }
  }
}*/
  var topLimit = 68;
  var bottomLimit = 22 + Height;
  var upPressed = false;
  var downPressed = false;

 $(document).on('keydown', function(e){
    if(e.keyCode === 38){ 
      upPressed =  true;
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      downPressed = true;
    }
  }  ); 
 $(document).on('keyup', function(e){
    if(e.keyCode === 38){ 
      upPressed =  false;
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      downPressed = false;
    }
  }); 

  function moveKeeper(){
        if(upPressed && keepY > topLimit){
          keeper.attr('y', keepY--);
        } else if(downPressed && bottomLimit > keepY){
          keeper.attr('y', keepY++);
        }
  }
  function isBallOutOrGoal(){
    if( ( 160 <= x || x <= 340 ) && (y <= 70)){
          console.log('THE GOAL!');
    }
      else if( fieldX + Width <= x || x <= fieldX){
          console.log('ball is out!');
          dx = 1;
          dy = 1;
          //x = 120;
          //y = 100;
          //ball.attr('cx', 120);
          //ball.attr('cy', 100);
      }
  }
  setInterval(function(){
        moveKeeper();
        isBallOutOrGoal();
        moveBall();}, 10);
}); // ready brackets*/
