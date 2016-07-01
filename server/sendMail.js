		var api_key = 'key-eadb2a4d6398f2a8d21d01ee4854010d';
		var domain = 'triconinfotech.com';
		var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
		var allData = [];
		
		exports.sendMail = function(req,res){
		var delay = req.body.delay;
		console.log("Delay is :: "+delay/1000+" seconds");
		setTimeout(function() {
		    
			var mailObject = req.body.mailObject;
			
			
			 
			var data = {
			  from: mailObject.fromUser,
			  to: mailObject.toUser,
			  subject: mailObject.subjectOfMessage,
			  text: mailObject.messageToUser
			};
			 
			mailgun.messages().send(data, function (error, body) {
			  console.log(body);
			  
			});
		}, delay);	
		    res.send("Success we mailed your Issue");
		}
		
		exports.saveTicketInfo = function(req,res){
			allData.push(req.body);
			
			res.send("Pushed the data");
		}
		