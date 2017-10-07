var app=angular.module("main.module");
app.controller("sendmessagesController",["$scope","$rootScope","httpService",
	function($scope,$rootScope,httpService){

		$scope.sendmessage=function(obj,message,isvalid){
			var numbers=[];
			for(var i=0;i<obj.length;i++){
				if(obj[i].check==true){
					numbers.push(obj[i]._id);
				}
			}

			if(numbers.length==0){
				$scope.$emit("status","Please select at least one message group","alert-danger",undefined,'');
				return;
			}
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				var data={};
				data.numbers=numbers;
				data.message=message;
				url+='/sendbulksmsusinggroup';
				httpService.post(url,data).then(function(response){
					console.log("response come from",response);
					if(response.data!=undefined){
						$scope.$emit("status","Message sent","alert-success",response.data,undefined);
					}
					else
					{
						$scope.$emit("status","Something Went Wrong","alert-danger",undefined,'');
					}
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
			else
			{
				$scope.$emit("status","Message field can't be empty","alert-danger",undefined,'');
			}
		}


		$scope.getsmsgroup=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/getsmsgroup?since=0&limit=10";
			httpService.get(url).then(function(response){
				console.log("response",response);
				$scope.groups=response.data.groups;
			},function(reason){
				
			});

		}


		$scope.$watch("isallcheck",function(newValue,oldValue,scope){
			if(newValue!=oldValue)
			{
				$scope.allchecktoggle(newValue);
			}
		},true);

		$scope.DeleteGroup=function(data,index){
			var url=$rootScope.apiBaseUrl;
			url+="/smsgroup?id="+data._key;
			data.id=data._key;
			httpService.delete(url).then(function(response){
				
				if(response.data!=undefined){
					$scope.groups.splice(index,1);
					$scope.$emit("status","delete smsgroup","alert-success",response.data,"sendmessages");
				}
				
			},function(reason){
				$scope.$emit("status","","alert-danger",undefined,'');
			});
			
		}

		
		$scope.allchecktoggle=function(value){
			for(var i=0;i<$scope.groups.length;++i){
				$scope.groups[i].check=value;
			}
		}


		$scope.init=function(){
			$scope.getsmsgroup();
		}

		$scope.init();
	}]);