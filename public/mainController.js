
	//Some Essentials Global Variable for Storage Purpose
	var allData = {};
	var ticketsInfo = [];
	//Defining Routes
	var myApp = angular.module('myApp', ['ngRoute']);
	
	myApp.config(function($routeProvider) {

		$routeProvider.when('/', {
			templateUrl: 'static/mainPage.html',
			controller: 'myCtrl'
		}).when('/ticketInfo', {
			templateUrl: 'static/ticketInfo.html',
			controller: 'ticketInfoCtrl'
		})

	});

	//Defining Controller One
	myApp.controller('myCtrl', function($scope,$http,$routeParams,sendingEmail) { 
		$scope.Persons = [];
		
		$scope.Priorities = ["Critical","High Priority","Low Priority"];
		
		$scope.Departments = [];
		//Fetching Data from Db
		
		$http.get('Data Base/EmployeeData.json').success(function(data) {
			allData = data.Department;
			
			angular.forEach(data.Department, function(value, key) {
			  $scope.Departments.push(key);
			});
		});
		//Code To Dynamically change Persons According to department
		$scope.changeDepartment = function(dept){
			
			$scope.Persons = toSetPerson(dept);
			
		}
		
		var toSetPerson = function(dept){
			
			if(dept == "MARKETING"){
				var Employees = [];
				Employees = allData.MARKETING;
				
			}
			if(dept == "TECH"){
				var Employees = [];
				Employees = allData.TECH;
				
			}
			if(dept == "SALES"){
				var Employees = [];
				Employees = allData.SALES;
				
			}
			return Employees;
		}
		//Saving the Issue Object as well as assigning time to send Ping
		$scope.saveInfo = function(name,details,Department,Person,Priority,emailIdUser){
			//--------------------------------------------------//
			var mailObject = {};
			mailObject.subjectOfMessage = "Urgent Issue";
			mailObject.messageToUser = "Hello, I have this urgent issue which I want to get resolved immediately. The folllowing is my issue :: "+details;
			mailObject.fromUser = emailIdUser;
			console.log("USer Mail Id :: "+emailIdUser);
			var employee = Person
			var emailId = employee.substring(employee.lastIndexOf("(")+1,employee.lastIndexOf(")"));
			mailObject.toUser = emailId;
			
			//--------------------------------------------------------------------//
			var tempObject = {};
			tempObject.name = name;
			tempObject.emailIdUser = emailIdUser;
			tempObject.details = details;
			tempObject.Department = Department;
			tempObject.Person = Person;
			tempObject.Priority = Priority;
			tempObject.ticketNo = Math.floor((Math.random() * 100000000) + 1);
			
			
			//-------------------------------------------------------------------//
			if(Priority == "Critical"){
				sendingEmail.sendMail(mailObject,7200000);
				tempObject.message = "Your mail has been sent, thanks for the feedback. We understand it's a Critical issue, give us 2 hrs."
			}
			if(Priority == "High Priority"){
				sendingEmail.sendMail(mailObject,18000000);
				tempObject.message = "Your mail has been sent, thanks for the feedback. We understand it's a High Priority issue, give us 5 hrs."
			}
			if(Priority == "Low Priority"){
				sendingEmail.sendMail(mailObject,86400000);
				tempObject.message = "Your mail has been sent, thanks for the feedback. We understand it's a Low Priority issue, give us 24 hrs."
			}
			
			postData(tempObject);
			
		}
		//Generic Function to Post data
		var postData = function(tempObject){
			
			$http({
					method: 'POST',
					data : tempObject,
					url: 'http://localhost:8083/postData'
					}).then(function successCallback(response) {
						
					}, function errorCallback(error) {
						
					});
		}

	});
	//Defining Controller Two
	myApp.controller('ticketInfoCtrl', function($scope,$http,$window,$routeParams,sendingEmail) { 
		//Generic Function to GET data
		var getData = function(){
			$http({
					method: 'GET',
					url: 'http://localhost:8083/getData'
					}).then(function successCallback(response) {
						
						var ticketInfo = response;
						$scope.ticketsInfo = ticketInfo.data;
						return response;
					}, function errorCallback(error) {
						
					});
		}
		//Generic Function to DELETE data
		var deleteData = function(ticket){
			
			
			$http({
					method: 'PUT',
					url: 'http://localhost:8083/deleteData/'+ticket+'/'
					}).then(function successCallback(response) {
						
						$scope.ticketsInfo = response.data;
					}, function errorCallback(error) {
						
					});
		}
		getData();
		$scope.allStatus = ["Pending","Reject","Resolved"];
		$scope.toSendMail = function(issueInfo){
			var mailObject = {};
			mailObject.subjectOfMessage = "Urgent Issue";
			mailObject.messageToUser = "Hello, I have this urgent issue which I want to get resolved immediately. The folllowing is my issue :: "+issueInfo.details;
			mailObject.fromUser = "abhishek.sharma74542@gmail.com";
			var employee = issueInfo.Person
			var emailId = employee.substring(employee.lastIndexOf("(")+1,employee.lastIndexOf(")"));
			mailObject.toUser = emailId;
			
			sendingEmail.sendMail(mailObject,1000);
			$scope.message = "Your mail has been sent, thanks for the feedback. We will rectify the issue Immediately."
		}
		//What TO do when issue rejected or resolved 
		$scope.isResolved = function(status,ticket){

			if(status != "Pending"){
				$scope.ticketsInfo = deleteData(ticket);
			}
		}

		
		
	});
	//Angular Factory to send mail
	myApp.factory('sendingEmail',['$http',function($http) {
		

		return {
			sendMail: function(mailObject,delay){
					var body = {};	
					body.mailObject = mailObject;
					body.delay = delay
				//Generic Function to send Email.
					$http({
					method: 'POST',
					data : body,
					url: 'http://localhost:8083/sendMail'
					}).then(function successCallback(response) {
						
					}, function errorCallback(error) {
						console.log("Response :: "+error);
					});
			}
		};
	}]);

	


	
