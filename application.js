	var express = require('express');
	var app     = express();
	var path    = require("path");
	var bodyParser = require('body-parser');
	console.log("This file is " + __filename);
	console.log("It's located in " + __dirname);
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	var sendMail = require(__dirname+'/server/sendMail.js');
	var server = require(__dirname+'/server/server.js');
	var port = process.env.PORT || 8083;

		//All end points -->	
		app.use(express.static(__dirname + '/public'));
		app.post('/sendMail', sendMail.sendMail);
		app.get('/getData', server.getData);
		app.post('/postData', server.postData);
		app.put('/deleteData/:ticket', server.deleteData);
		
		
	app.listen(port);

	console.log("server running on port: "+ port);