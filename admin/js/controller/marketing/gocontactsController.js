var app=angular.module("main.module");
app.controller("gocontactsController",["$scope",'$rootScope','httpService','$httpParamSerializer'
	,'$filter',function($scope,$rootScope,httpService,$httpParamSerializer,$filter){
		$scope.getcontact=function(data){
			var url=$rootScope.apiBaseUrl;
			url+="/getallcontacts";

			console.log("url=",url);
			httpService.get(url).then(function(response){
				console.log("response come from contact",response);
				if(response.data!=undefined){
					$scope.contacts=response.data.contacts;
				}
				else{
					$scope.contacts=[];
				}
			},function(reason){

			});

		}

		
		$scope.sendmessage=function(data,isvalid){
			debugger;
			if(isvalid==true){
				var by=[];
				data.forEach(function(item){
					if(item.check==true)
						by.push(item.by);
				});
				var object=new Object();
				object.by=by;
				object.message=$scope.message;
				console.log("data in send message",object);
				var url=$rootScope.apiBaseUrl;
				url+="/sendsms";
				console.log("url=",url);
				httpService.post(url,object).then(function(response){
					console.log("response come from post message",response);
					$scope.$emit("status","successfully send message","bg-black",response.data,undefined);
					if(response.data!=undefined){

						by=[];
					}
				},function(reason){

				});
			}
		}

		$scope.$watch("isallcheck",function(newValue,oldValue,scope){
			if(newValue!=oldValue)
			{
				$scope.allchecktoggle(newValue);
			}
		},true);

		
		
		$scope.allchecktoggle=function(value){
			for(var i=0;i<$scope.contacts.length;++i){
				$scope.contacts[i].check=value;
			}
		}

		$scope.init=function(){
			$scope.getcontact($scope.filterobj);

		}

		$scope.init();
	}]);