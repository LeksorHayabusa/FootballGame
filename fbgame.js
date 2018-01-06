$(function(){

      var myPeer; // peer object
      var conn; // connection stored

      // click event listener - click will create new peer (host)!
      $('#getID').on('click', function(){

        // new host-peer
        myPeer = new Peer({key:'jg7jctlc81c0izfr', debug: 3});
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
            console.log('Recieved - ' + data);
          });
        });

    });

    // click event listener - click will connect
    //  with new peer (guest) to existed peer (host)!
    $('#connectToID').on('click', function(){
      // new guest-peer
      myPeer = new Peer({key:'jg7jctlc81c0izfr', debug: 3});
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
        console.log('Recieved - ' + data);
      });

    });

    // Send message function
    $('#sendMessage').on('click', function(){
        // here conn - our HOST or GUEST connection
        conn.send(prompt('Enter your message: '));
    });


});