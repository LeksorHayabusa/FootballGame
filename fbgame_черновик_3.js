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
var leftKeeper = $('#goalkeeperLeft'); 
var leftKeepY = +(leftKeeper.attr('y'));
var leftKeepX = +(leftKeeper.attr('x'));
var testRightKeeper = $('#goalkeeperRight'); 
var testRightKeepY = +(testRightKeeper.attr('y'));
var testRightKeepX = +(testRightKeeper.attr('x'));
var testRightKeepHeight = +(testRightKeeper.attr('height'));
var testRightKeepWidth = +(testRightKeeper.attr('width'));
var keepHeight = +(leftKeeper.attr('height'));
var keepWidth = +(leftKeeper.attr('width'));
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
    
}
function collapsBallKeeper(){
  if (x-ballRadius === leftKeepX + keepWidth){
    if ( leftKeepY <= y+ballRadius && y-ballRadius < leftKeepY + keepHeight){
      console.log('leftKeeper catches');
      dx = -dx;} 
  }
}
function collapsTESTBallKeeper(){
  if (x+ballRadius === testRightKeepX){
    if ( testRightKeepY <= y+ballRadius && y-ballRadius < testRightKeepY + keepHeight){
      console.log('rightKeeper catches');
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
  var topLimit = 68;  //goalkeeper move limits
  var bottomLimit = 22 + Height; //goalkeeper move limits
  var upPressed = false;
  var rightPressed = false; //-test button
  var downPressed = false;
  var leftPressed = false;//-test button
  var leftCounter = goalCounter(); // who missed the goal
  var rightCounter = goalCounter();// who missed the goal

//event below listens to pushing a button
 $(document).on('keydown', function(e){
  e.preventDefault();
    if(e.keyCode === 38){ 
      upPressed =  true;
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      downPressed = true;
    } 
    // beneath - just for test
    else if(e.keyCode === 39){ // down
      //let replacement = 0;
      rightPressed = true;
    }
    else if(e.keyCode === 37){ // down
      //let replacement = 0;
      leftPressed = true;
    }
  }); 

 //event below listens to releasing a button
 $(document).on('keyup', function(e){
  e.preventDefault();
    if(e.keyCode === 38){ 
      upPressed =  false;
    }else if(e.keyCode === 40){ // down
      //let replacement = 0;
      downPressed = false;
    }
    // beneath - just for test
    else if(e.keyCode === 39){ // down
      //let replacement = 0;
      rightPressed = false;
    }
    else if(e.keyCode === 37){ // down
      //let replacement = 0;
      leftPressed = false;
    }
  }); 

  function moveKeeper(){
        if(upPressed && leftKeepY > topLimit){
          leftKeeper.attr('y', leftKeepY-=2);
        } else if(downPressed && bottomLimit > leftKeepY){
          leftKeeper.attr('y', leftKeepY+=2);
        }
  }
  function moveTESTKeeper(){
        if(leftPressed && testRightKeepY > topLimit){
          testRightKeeper.attr('y', testRightKeepY-=2);
        } else if(rightPressed && bottomLimit > testRightKeepY){
          testRightKeeper.attr('y', testRightKeepY+=2);
        }
  }
  //defines whether out or goal happened
  function isBallOutOrGoal(){
    if( (180 <= y && y <= 330) && ( x ===65 || x === fieldX+ Width)){
         console.log('GOAL!');
          if (x===65){
            countL = leftCounter()
            $('#leftGoalPlate').text(countL);
          } else if (x===fieldX 
            + Width){
            countR = rightCounter()
            $('#rightGoalPlate').text(countR);}
          ball.attr('cx', x = 395);
          ball.attr('cy', y = 255);
          dx = -dx;

    }
      else if( fieldX + Width <= x || x <= fieldX){
          console.log('ball is out!');
          ball.attr('cx', x = 395);
          ball.attr('cy', y = 390);
          dx = -dx;
      }
  }
  function goalCounter(){
    let currentCounter = 1;
    return function(){
      return currentCounter++;
    }
  };

//this part sets the game up 
var countL = 0; //-goal counter for left player
var countR = 0; //-goal counter for right player
var isGameStarted = false;
$('#startGame').on('click',function startGame(){
  isGameStarted = true;
  if (isGameStarted){       //turns the startGame button off
    $(this).off('click');
  }
  countL = 1; //-goal counter for left player
  countR = 1;
  leftCounter.currentCounter = 1;
  rightCounter.currentCounter = 1;
  countL = leftCounter.currentCounter;
  countR = rightCounter.currentCounter;
  var gameInterval = setInterval(function(){
    moveKeeper();
    moveTESTKeeper();
    isBallOutOrGoal();
    moveBall();
    collapsBallKeeper();
    collapsTESTBallKeeper()
    if (countL >=3 || countR >= 3){
      clearInterval(gameInterval);
      alert('game over');
      isGameStarted = false;
      if (!isGameStarted){     //turns the startGame button on
        $('#startGame').on('click', startGame());
      }
    }
   }, 10);
})

}); // ready brackets
