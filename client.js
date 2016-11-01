var mypeerid = null;
var peer = null;
var connection = null;
var connections = [];
var xCord = null;
var yCord = null;
var userName = null;

			var init = function() {
				userName = prompt("Please enter a username");

				peer = new Peer(userName,{host: 'liveweb.itp.io', port: 9001, path: '/'});

				document.addEventListener('mousemove', function(evt) {
				for (var c = 0; c < connections.length; c++){
					connections[c].send({x: evt.clientX, y: evt.clientY});
					document.getElementById('yourmouse').style.left = evt.clientX-50 + "px";
					document.getElementById('yourmouse').style.top = evt.clientY-50 + "px";
					//console.log("x value: " + evt.clientX + " " + "y value: " + evt.clientY);
					xCord = evt.clientX;
					yCord = evt.clientY;
				}
			});

			document.addEventListener('mousedown', function(evt){
          for (var c = 0; c < connections.length; c++){
					connections[c].send({x: evt.clientX, y: evt.clientY, b: "press"});
				}
      });

			peer.on('error', function(err){
				console.log(err);
			});

				peer.on('open', function(id) {
				  console.log('My peer ID is: ' + id);
				  mypeerid = id;
				});

				peer.on('connection', function(conn) {
					connection = conn;
					connection.on('open', function() {
						document.getElementById('chatlog').innerHTML += "Connection Established";
					});
					connection.on('data', function(data) {
						//document.getElementById('chatlog').innerHTML += data;
						document.getElementById('othermouse').style.left = data.x + "px";
						document.getElementById('othermouse').style.top = data.y + "px";

						//broadcastMessage(data);
					});
					connections.push(connection);
				});
			};

			var broadcastMessage = function(msg) {
				for (var c = 0; c < connections.length; c++){
					connections[c].send(msg);
				}
			}

			var sendMessage = function() {
				for (var c = 0; c < connections.length; c++){
					connections[c].send(document.getElementById('chat').value);
				}
				// connection.send(document.getElementById('chat').value);
				// document.getElementById('chat').value = "";
			};

			var makeConnection = function() {
				connection = peer.connect(document.getElementById('other_peer_id').value);
				connection.on('open', function(data) {
					document.getElementById('chatlog').innerHTML += "Connection Established";
				});

				connection.on('data', function(data) {
					document.getElementById('othermouse').style.left = data.x-50 + "px";
					document.getElementById('othermouse').style.top = data.y-50 + "px";

					console.log("data.x: " + data.x + " data.y: " + data.y + " evtX: " + xCord + " evtY: " + yCord);

					if (data.x + 50 >= xCord && data.x - 50 <= xCord && data.y + 50 >= yCord && data.y - 50 <= yCord && data.b == "press") {
						document.getElementById('chatlog').innerHTML += "LOSER";
						console.log('loser');
					}
					//document.getElementById('chatlog').innerHTML += data;
				});
			};

window.addEventListener('load', init);
