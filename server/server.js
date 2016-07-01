		
		var _ = require('underscore');
		var allData = [];
		
		exports.getData = function(req,res){
		   
		   res.send(allData);
		}
		exports.postData = function(req,res){
		   	 	
		   allData.push(req.body);
		   res.send(allData);
		}
		exports.deleteData = function(req,res){
		   var ticket;	
		   ticket = parseInt(req.params.ticket);
		   var tempArray = [];
		   tempArray = _.where(allData, {ticketNo:ticket});
		   allData = _.difference(allData,tempArray);
		   res.send(allData);
		}
		
		
		