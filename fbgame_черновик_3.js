'use strict';
$(function(){
  var doubleCheckPrevent = 0;
  var dialogStart = $( "#dialog-start" ).dialog({
      autoOpen: false,
      closeOnEscape: false,
      draggable: false,
      height: 360,
      width: 450,
      modal: true,
      buttons: {
        Cancel: function() {
          dialogStart.dialog( "close" );
        }
      },
      close: false,
      });

  var connectEstablish = $('#load-connection').html();
  var dialogConnect = $( "#dialog-connect" ).dialog({
      autoOpen: false,
      closeOnEscape: false,
      draggable: false,
      height: 360,
      width: 450,
      modal: true,
      buttons: {
        "Connect to game": function(){
          dialogConnect.dialog( "option", 'buttons.Cancel', {hide:false, disabled:true});
          //dialogConnect.dialog( "option", 'buttons.Ready to game', {hide:false, disabled:true});
          $('#load-connection').removeAttr('hidden');
          $('#load-connection').html(connectEstablish);
          connectToPeer();
        }
        ,
        Cancel: function() {
          dialogConnect.dialog( "close" );
        }
      },
      close: false,
      });

      // copy to clipboard
      $("#code").on('click', function(){
        let text = $('#clipboard');
        let code = $(this).text();
        $(this).text('Copied to clipboard!').css('color', '#00BDFFFF');
        text.val(code);
        text.focus();
        text.select();
        document.execCommand("copy");
        window.setTimeout(redraw,800);
        function redraw(){
           $("#code").text(code).css('color', 'white').fadeIn('slow');
        }
        window.clearTimeout();
      });
      // Player CHECK STATUS FUNC
      var sheckStatus = 0;
      function appendStatus(dialog, flag1, flag2){
        if (dialog){
          $(dialog).append("<div style='display:flex; justify-content:space-between; margin-top:10px;'>"+
            "<div class='p1'>Player 1 ready:<span><i class='fa fa-spinner fa-pulse fa-lg fa-fw'></i></span></div>"+
            "<div class='p2'>Player 2 ready:<span><i class='fa fa-spinner fa-pulse fa-lg fa-fw'></i></span></div></div>");
        }else if (flag1){
          $('.p1 > span').html('<i class="fa fa-check" aria-hidden="true"></i>');
          sheckStatus += 1;
        }else{
          $('.p2 > span').html('<i class="fa fa-check" aria-hidden="true"></i>');
          sheckStatus += 1;
        }
        if (sheckStatus === 2){
            // TIMEOUT BEFORE RUN GAME
            window.setTimeout(startGameAfterCheck,2000);
        }
      }

      // This code run the game
      function startGameAfterCheck(){
          dialogStart.dialog( "close" );
          dialogConnect.dialog( "close" );
          $('#startGame').trigger('click');
      }

      var myPeer; // peer object
      var conn; // connection stored
      var User;
      var Opponent;

      var UserKeepY; //changed
      var UserKeepX;
      var OpponentKeepY; //changed
      var OpponentKeepX;
      var keepHeight;
      var keepWidth;
      // click event listener - click will create new peer (host)!
      $('#getID').on('click', function(){
        $('#load-icon').removeAttr('hidden');
        // new host-peer
        myPeer = new Peer({key:'9l97dfmlbygy14i', debug: 3});
        // Here we are create new ID of the connection (our host)
        myPeer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
            $('#code').text(id);
            dialogStart.dialog( "open" );
            $('#load-icon').attr('hidden','hidden');
        });
        //  IMPORTANT: Here we are deal with incoming connection
        //             from remote peer (guest)!!!
        myPeer.on('connection', function(connection) {
          $('#dialog-start').find('.load-icon-big').last()
          .html('<span>Connection established.<br/>To start game click button below</span>');
          if (doubleCheckPrevent === 0){
            $('.ui-dialog-buttonset').remove();
            $('#dialog-start').append('<div class="ui-dialog-buttonset">'+
            '<button type="button" class="ui-button ui-corner-all '+
            'ui-widget readyPlay">Start game</button></div>');
            appendStatus('#dialog-start');
            $('.readyPlay').on('click', function(){
              $(this).fadeOut('fast');
              conn.send({type:'Ready'});
              appendStatus(0, 1);
            });
            doubleCheckPrevent = 1;
          }
          // IMPORTANT to handle recieved connection
          // after this assignment we can use .send() method for our HOST!
          // conn.send(our message);
          conn = connection; //can use .send() method for our HOST!
          // Here set listener for incoming messages
          conn.on('data', function(data){
            if (data.type==='moveBall'){
              OpponentKeepY = data.posOpponentY;
              OpponentKeepX = data.posOpponentX;
            }else if(data.type==='Ready'){
              appendStatus(0, 0);
            }else{
              console.log('Recieved - ' + data);
            }
          });
        });//P2P FUNCTION
        User = $('#goalkeeperLeft');
        Opponent = $('#goalkeeperRight');
        initPlayer();
    });
    $('#connectToID').on('click', function(){
        dialogConnect.dialog( "open" );
    });
    // click event listener - click will connect
    //  with new peer (guest) to existed peer (host)!
    function connectToPeer(){

      User = $('#goalkeeperRight');
      Opponent = $('#goalkeeperLeft');
      initPlayer();
      // new guest-peer
      myPeer = new Peer({key:'9l97dfmlbygy14i', debug: 3});
      // take host-peer ID from input to create connection
      let otherPIR = $('#insert-code').val();
      // establish connection with host-peer

      // IMPORTANT to handle recieved connection
      // after this assignment we can use .send() method for our GUEST!
      // conn.send(our message);
      conn = myPeer.connect(otherPIR); //can use .send() method for our GUEST!
      $('#startGame').trigger('click');
      // if connection established - send greeting
      conn.on('open', function(id) {
            $('#dialog-connect').find('.load-icon-big').last()
            .html('<span>Connection established.<br/>To start game click button below</span>');
            if (doubleCheckPrevent === 0){
              $('.ui-dialog-buttonset').remove();
              $('#dialog-connect').append('<div class="ui-dialog-buttonset">'+
              '<button type="button" class="ui-button ui-corner-all '+
              'ui-widget readyPlay">Start game</button></div>');
              appendStatus('#dialog-connect');
              $('.readyPlay').on('click', function(){
                $(this).fadeOut('fast');
                appendStatus(0, 0);
                conn.send({type:'Ready'});
              });
              doubleCheckPrevent = 1;
            }

      });
      myPeer.on('error', function(err) {
            let error = err.type;
            if (error === 'peer-unavailable'){
              error = 'Connection error. Wrong code';
            } else if (error === 'network'){
              error = 'Lost connection to server';
            }

            $('#dialog-connect').find('.load-icon-big').last().text(error);
            //dialogConnect.dialog( "option", "buttons.Ready to game" );
            console.log('---- ' + error);
      });
      // Here we listening for incoming messages
      conn.on('data', function(data){
        // MOVE BALL SENDING COORDINATES
        if (data.type==='moveBall'){
          moveBallData(data.posX, data.posY);
          Opponent.attr('x', data.posOpponentX);
          Opponent.attr('y', data.posOpponentY);

        }else if(data.type==='goal'){
            let score = $(data.gate).text();
            if (parseInt(score)){
                $(data.gate).text(parseInt(score) + 1);
            } else {
                $(data.gate).text('1');
            }
        }else if(data.type==='Ready'){
            appendStatus(0, 1);
        } else{
            console.log('Recieved - ' + data);
        }
      });
    } // END CONNECT FUNC

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
<<<<<<< HEAD
//я изменил только ниже!!!!!!!!!!!!!!!!!!!!!!!

//
function initPlayer(){
  UserKeepY = +(User.attr('y')); //changed
  UserKeepX = +(User.attr('x'));
  keepHeight = +(User.attr('height'));
  keepWidth = +(User.attr('width'));
}

=======
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
>>>>>>> f82d145215ce3105f838e892e75490c40e7483d2
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

//This function is for second player just to move ball after
//  receiving of coordinates
function moveBallData(posX, posY){
    x = posX;
    y = posY;
    ball.attr('cx', posX);
    ball.attr('cy', posY);
}
// Standart move ball func
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

    // This part is imortant!!!!!!!!!!!!!!!!!!!
    // determines
    //if user is right then opponent has left goalkeeper
    // if user is left then opponent has right goalkeeper
    if (User[0].id === 'goalkeeperLeft'){
        collapsBallKeeper(x-ballRadius, x+ballRadius, true);//right is opponent
    }else{
        collapsBallKeeper(x+ballRadius, x-ballRadius, false);//left is opponent
    }

    Opponent.attr('x', OpponentKeepX);
    Opponent.attr('y', OpponentKeepY);
}
<<<<<<< HEAD

// Function for goalkeeper touches the ball
function collapsBallKeeper(leftSide, rightSide, flag){
  if (leftSide === UserKeepX + (flag===true?keepWidth:0)){
      if ( UserKeepY <= y+ballRadius && y-ballRadius < UserKeepY + keepHeight){
        console.log('User catches');
        dx = -dx;
      }
  } else if (rightSide === OpponentKeepX + (flag===false?keepWidth:0)){
      if ( OpponentKeepY <= y+ballRadius && y-ballRadius < OpponentKeepY + keepHeight){
        console.log('Opponent catches');
        dx = -dx;
      }
=======
function collapsBallKeeper(){
  if (x-ballRadius <= leftKeepX + keepWidth){
    if ( leftKeepY <= y+ballRadius && y-ballRadius < leftKeepY + keepHeight){
      console.log('leftKeeper catches');
      dx = -dx;}
  }
}
function collapsTESTBallKeeper(){
  if (x+ballRadius >= testRightKeepX){
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
>>>>>>> f82d145215ce3105f838e892e75490c40e7483d2
    }
}

// Standart PRESS BUTTONS FUNCTION
  var topLimit = 68;  //goalkeeper move limits
  var bottomLimit = 22 + Height; //goalkeeper move limits
  var upPressed = false;
  var rightPressed = false; //-test button
  var downPressed = false;
  var leftPressed = false;//-test button
  var currentLeftCounter = 0;
  var currentRightCounter = 0;

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

// ONE FUNCTION FOR MOVE GOALKEEPER
  function moveKeeper(){
<<<<<<< HEAD
        if(upPressed && UserKeepY > topLimit){
          User.attr('y', UserKeepY-=2);
        } else if(downPressed && bottomLimit > UserKeepY){
          User.attr('y', UserKeepY+=2);
=======
        if(upPressed && leftKeepY > topLimit){
          leftKeeper.attr('y', leftKeepY-=2);
        } else if(downPressed && bottomLimit > leftKeepY){
          leftKeeper.attr('y', leftKeepY+=2);
        }
  }
  function moveTESTKeeper(){ //test function to interchange second player
        if(leftPressed && testRightKeepY > topLimit){
          testRightKeeper.attr('y', testRightKeepY-=2);
        } else if(rightPressed && bottomLimit > testRightKeepY){
          testRightKeeper.attr('y', testRightKeepY+=2);
>>>>>>> f82d145215ce3105f838e892e75490c40e7483d2
        }
      //conn.send({type:'moveBall', posOpponentX: UserKeepX, posOpponentY: UserKeepY});
  }
  // function moveTESTKeeper(){
  //       if(leftPressed && OpponentKeepY > topLimit){
  //         Opponent.attr('y', OpponentKeepY-=2);
  //       } else if(rightPressed && bottomLimit > OpponentKeepY){
  //         Opponent.attr('y', OpponentKeepY+=2);
  //       }
  // }
  //defines whether out or goal happened
  function isBallOutOrGoal(){
    if( (180 <= y && y <= 330) && ( x <=65 || x >= fieldX+ Width)){
         console.log('GOAL!');
<<<<<<< HEAD
          if (x===65){
            countR = rightCounter();
            $('#rightGoalPlate').text(countR);
            conn.send({type:"goal", gate: '#rightGoalPlate'});
          } else if (x===fieldX
            + Width){
            countL = leftCounter();
            $('#leftGoalPlate').text(countL);
            conn.send({type:"goal", gate: '#leftGoalPlate'});
          }
=======
          if (x<=65){
            ++currentLeftCounter;
            $('#leftGoalPlate').text(currentLeftCounter);
          } else if (x>=fieldX
            + Width){
            ++currentRightCounter;
            $('#rightGoalPlate').text(currentRightCounter);}
>>>>>>> f82d145215ce3105f838e892e75490c40e7483d2
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

function timeoutSetting(i,msDelay){ //count down timer for dialog window
  var num = setTimeout(function (){
  countDownCircle.text(i);
  }, msDelay);
}
function countDown(){ //execution of dialog window and game run
  countDownCircle[0].showModal();
    let msDelay = 0;
    for (var i =3;  i>1; i--){
      msDelay += 1000;
      timeoutSetting(i,msDelay);
    }
    if (i === 1 ){
      i = 'GO!'
      msDelay = 3000;
      timeoutSetting(i,msDelay);
      msDelay = 4000;
      setTimeout(function(){
      countDownCircle[0].close();
      gameRun();
      },msDelay)
    }
}
  function gameRun(){ //execution game methods
      var gameInterval= setInterval(function(){
        moveKeeper();
        moveTESTKeeper();
        isBallOutOrGoal();
        moveBall();
        collapsBallKeeper();
        collapsTESTBallKeeper()
    
        //clear goal count
        if (currentLeftCounter >=3 || currentRightCounter >= 3){
          clearInterval(gameInterval);
          gameOverWindow[0].showModal();
          isGameStarted = false;
          if (!isGameStarted){     //turns the startGame button on
            $('#startGame').on('click', startGame);
            gameOverWindow[0].close();
          }
        }
       }, 10);
      return gameInterval; 
  }

function startGame(){
        //this part sets the game up
  isGameStarted = true;
  if (isGameStarted){       //turns the startGame button off
    $(this).off('click');
  }
<<<<<<< HEAD
  countL = goalCounter(); //-goal counter for left player
  countR = goalCounter();
  leftCounter = goalCounter();
  rightCounter = goalCounter();
  //countL = leftCounter.currentCounter;
  //countR = rightCounter.currentCounter;
  var gameInterval = setInterval(function(){
    moveKeeper();
    //moveTESTKeeper();

    if (User[0].id === 'goalkeeperLeft'){
        isBallOutOrGoal();
        moveBall();
        conn.send({type:'moveBall', posX: x, posY: y,
                  posOpponentX: UserKeepX, posOpponentY: UserKeepY});
    } else {
        conn.send({type:'moveBall', posOpponentX: UserKeepX, posOpponentY: UserKeepY});
    }
    if (countL >=3 || countR >= 3){
      clearInterval(gameInterval);
      alert('game over');
      isGameStarted = false;
      if (!isGameStarted){     //turns the startGame button on
        $('#startGame').on('click', startGame);
      }
    }
   }, 10);
})
=======
  $('#leftGoalPlate').text(0); //-goal counter for left player
  $('#rightGoalPlate').text(0);
  currentLeftCounter = 0;
  currentRightCounter = 0;
  countDown();//count down and game run
}

var isGameStarted = false;
var countDownCircle = $("#countDownCircle");
const gameOverWindow = $('#gameOverWindow');
//the main execution listener!
$('#startGame').on('click', startGame);
>>>>>>> f82d145215ce3105f838e892e75490c40e7483d2

}); // ready brackets
