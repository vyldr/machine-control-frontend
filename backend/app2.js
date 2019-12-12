var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var WebSocket = require('ws').Server;
var path = require('path');
var { Client } = require('pg');
var PORT = process.env.PORT || 5000;
var activeConnections = 0;
var connections = [];

var app = express();
app.use(express.static(path.join(__dirname, '../dist/machine-control')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT);

console.log(`Listening on ${PORT}`);



// Database connection

const database = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

database.connect();

// database.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
// 	if (err) throw err;
// 	for (let row of res.rows) {
// 		console.log(JSON.stringify(row));
// 	}
// 	database.end();
// });


// HTTP

// Create a new user
app.post('/signup', (req, res) => {
	console.log('/signup', req.body);

	var query = 'INSERT INTO bros (identifier, secret_code) VALUES ($1, $2);';
	var values = [req.body.user, req.body.pass];

	database.query(query, values, (err, dbres) => {
		if (err) { // Username taken
			console.log(err.stack);
			return res.send({ status: 'no' });
		} else {
			return res.send({ status: 'it worked' });
		}
	});
});

// Sign in
app.post('/signin', (req, res) => {
	console.log('/signin', req.body);

	var query = 'SELECT secret_code FROM bros WHERE identifier = $1;';
	var values = [req.body.user];

	database.query(query, values, (err, dbres) => {
		if (err) {
			console.log(err.stack);
			return res.send({ status: 'no' });
		} else {
			if (dbres.rowCount != 1) { // Invalid username
				return res.send({ status: 'no' });
			}
			if (dbres.rows[0].secret_code == req.body.pass) { // That's correct!
				return res.send({ status: 'it worked' });
			}
			else { // That password is wrong
				return res.send({ status: 'no' });
			}
		}
	});

});

// Get list of bots
app.post('/getlist', (req, res) => {
	console.log(req.body);

	// Make sure user is real
	var query = 'SELECT id_int FROM bros WHERE identifier = $1 AND secret_code = $2;';
	var values = [req.body.user, req.body.pass];

	database.query(query, values, (err, dbres) => {
		if (err) {
			console.log(err.stack);
			return res.send({ status: 'no' });
		} else {
			if (dbres.rowCount != 1) { // Invalid username / password
				return res.send({ status: 'no' });
			}
			else { // That's correct!

				// Add the new bot
				var query = 'SELECT * FROM bots WHERE master = $1;';
				var values = [dbres.rows[0].id_int];

				database.query(query, values, (err2, dbres2) => {
					if (err2) { 
						console.log(err2.stack);
						return res.send({ status: 'no' });
					} else {
						console.log(dbres2.rows);
						return res.send({ 
							status: 'it worked',
							bots: dbres2.rows,
						});
					}
				});
				// return res.send({ status: 'it worked' });
			
			
			}
		}
	});

	// return res.send({ status: 'Received a POST HTTP method' });
});

// Add new bot
app.post('/addbot', (req, res) => {
	console.log(req.body);

	// Make sure user is real
	var query = 'SELECT id_int FROM bros WHERE identifier = $1 AND secret_code = $2;';
	var values = [req.body.user, req.body.pass];

	database.query(query, values, (err, dbres) => {
		if (err) {
			console.log(err.stack);
			return res.send({ status: 'no' });
		} else {
			if (dbres.rowCount != 1) { // Invalid username / password
				return res.send({ status: 'no' });
			}
			else { // That's correct!

				// Add the new bot
				var query = 'INSERT INTO bots (identifier, crazy_code, master) VALUES ($1, $2, $3);';
				var values = [
					req.body.name, 
					Math.floor(Math.random() * Math.floor(2**30)), 
					dbres.rows[0].id_int
				];

				database.query(query, values, (err2, dbres2) => {
					if (err2) { 
						console.log(err2.stack);
						return res.send({ status: 'no' });
					} else {
						return res.send({ status: 'it worked' });
					}
				});
				// return res.send({ status: 'it worked' });
			
			
			}
		}
	});

	// return res.send({ status: 'Received a POST HTTP method' });
});



// WebSockets!
const wss = new WebSocket({ port: 5001 });
wss.on('connection', (ws) => {
	userConnect(ws);
	ws.on('message', (message) => sendMessage(ws, message));
	ws.on('close', () => userDisconnect(ws));

});

function sendMessage(ws, message) {
	// Assign a group
	if (message[0] != '{') {
		ws.group = message;

		// Broadcast to the group
	} else {
		connections.forEach(connection => {
			if (connection != 0) { // Don't ask an empty slot who it belongs to
				if (connection.group == ws.group &&
					connection.readyState === connection.OPEN &&
					ws.group != "") {
					connection.send(message);
				}
			}
		});
		// for (var i in connections)
		// 	if (connections[i] != 0) // Don't ask an empty slot who it belongs to
		// 		if (connections[i].group == ws.group &&
		// 			connections[i].readyState === connections[i].OPEN &&
		// 			ws.group != "")
		// 			connections[i].send(message);
	}
}

// Add a new connection
function userConnect(ws) {
	activeConnections++;

	// Add a new connection slot if necessary
	if (activeConnections > connections.length)
		connections.push(0);

	// Give the user the lowest available ID
	for (var i = 0; i < connections.length; i++)
		if (connections[i] == 0) {
			ws.id = i; // This ID is unique for each connection
			connections[i] = ws;
			break;
		}
	console.log('User connected ' + ws.id);
}

function userDisconnect(ws) {
	console.log('User disconnected ' + ws.id)
	activeConnections--; // Update the number of connections
	connections[ws.id] = 0; // Clear the slot

	// The server is empty now
	if (activeConnections == 0)
		cleanup();
}

// Reset the server
function cleanup() {
	connections = [];
}
