var app=angular.module("main.module");
app.controller("userController",["$scope","httpService","$rootScope",
	function($scope,httpService,$rootScope){

		$scope.init=function(){
			$scope.getallusers();
		}

		$scope.getallusers=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/getalladminusers";
			httpService.get(url).then(function(response){
				console.log("response",response);
				$scope.users=response.data.adminuser;
			},function(reason){
				
			});
		}

		$scope.getuser=function(id,index){
			var url=$rootScope.apiBaseUrl;
			url+="/adminuser/?id="+id;
			httpService.get(url).then(function(response){
				console.log("mydata",response);
				$scope.user=response.data.adminuser;
			},function(reason){
				
			});
		}
		$scope.togglestate=function(data){
			data.active=data.active==true?false:true;
			var url=$rootScope.apiBaseUrl;
			url+="/adminuser/?id="+data._key;
			httpService.put(url,data).then(function(response){
				data.active=response.data.adminuser.active;
				console.log("response",response);
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}


		$scope.getclassname=function(role){
			var classname="";

			switch(role){
				case "admin": 
				classname="bg-blue";
				break; 
				case "marketing": 
				classname="bg-green";
				break; 
				case "finance": 
				classname="bg-red";
				break; 
				case "sales": 
				classname="bg-pink";
				break; 
				default:
				classname="bg-green"
			}
			return classname;
		}
		$scope.init();

	}]);
