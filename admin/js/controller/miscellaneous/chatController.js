var app=angular.module("main.module",["luegg.directives"]);
app.controller("chatController",["$scope","$rootScope","httpService","$location","$stateParams",
	function($scope,$rootScope,httpService,$location,$stateParams){
		console.log("$location",$stateParams.id);

		$scope.init=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/profile?id="+id;
			httpService.get(url).then(function(response){
			//console.log("bookuser",response);
				if(response.data!=undefined){
					$scope.$broadcast("bookedUser",response.data.detail.profile);
					$scope.bookeduser=response.data.detail.profile;
				}		
			},function(reason){

			});
		}

		$scope.init($stateParams.id);
	}]);


app.directive("chatDirective",function($rootScope,$compile,httpService){
	return{
		restrict:'EA',
		link:function($scope,$element,$attrs){

			$scope.user=$rootScope.userinfo;
			$scope.$on("bookedUser",function($event,user){
				$scope.bookedUser=user;
				$scope.getolderMessage();
			});

			$scope.getolderMessage=function(){
				var url=$rootScope.apiBaseUrl;
				url+="/booking?target=message&user="+$scope.user._key+"&other="+$scope.bookedUser._key
				console.log("url",url);
				httpService.get(url).then(function(response){
				console.log("chat1",response);
					if(response.data!=undefined){
						$scope.messages=response.data.message;
					}
				},function(reason){

				});
			}


			

			$scope.$on("chat",function($event,obj){
				if(obj.from.userpic!=undefined)
					obj.from.profile_pic=obj.from.userpic;
				var rcvMessageHtml='<receive-chat-message pic="'+obj.from.profile_pic+'" name="'+obj.from.username+'" datetime="'+obj.sentat+'" message="'+obj.message+'" ></receive-chat-message>'
				rcvMessageHtml=$compile(rcvMessageHtml)($scope);
				$("#chatbox").append(rcvMessageHtml);
			});


			$scope.sendchat=function(message){
				var obj={};
				var sendObj={};
				obj.name=$scope.user.name;
				obj.datetime=new Date().getTime();
				obj.profile_pic=$scope.user.profile_pic;
				obj.message=message;
				if(obj.message.length>0){
					sendObj.message=message;
		sendObj.to=$scope.bookedUser._key;//$scope.booked_user_id;
		sendObj.sid=$scope.bookedUser._key+new Date().getTime()+$scope.user._key;
		sendObj.booking=$scope.bookingId;
		// $rootScope.socket.emit("send",sendObj);
		$scope.$emit("chatmessage",sendObj);

		//chromeNotificationFactory.sendNotification(sendObj.message,"http://localhost:8887/index.html?#/bookingchat/id=28799");
		var messageHtml='<send-chat-message  pic="'+obj.profile_pic+'" name="'+obj.name+'" datetime="'+obj.datetime+'" message="'+obj.message+'"></send-chat-message>';
		messageHtml=$compile(messageHtml)($scope);
		$("#chatbox").append(messageHtml);
		$("#txtmessage").val("");
	}
};


$('textarea').bind('keypress', function(e) {
	if ((e.keyCode || e.which) == 13) {
		$scope.sendchat($scope.message);
		return false;
	}
});





	//normal dom manipulation javascript
	//
	$(document).ready(function(){
		function resize(){
			var heights = window.innerHeight;
			document.getElementById("chatbox").style.height = heights -300 + "px";
		}
		resize();
		window.onresize = function() {
			resize();
		};	
	})
	


	
}
}
})






app.directive("receiveChatMessage",function($filter){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:"directive/receiveChatMessage.html",
		link:function($scope,element,attr,controller,transclude){
			debugger;
			$scope.name=attr.name;
			$scope.datetime=$filter("timeStamptoProperDate")(attr.datetime);//$filter("timeStampToDate")(attr.datetime,"dd-mm-yyyy","-",1);
			$scope.message=attr.message;
			$scope.profilePic=attr.pic;
		}
	}
});


app.directive("sendChatMessage",function($filter){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:"directive/sendChatMessage.html",
		link:function($scope,element,attr,controller,transclude){
			debugger;
			$scope.name=attr.name;
			$scope.datetime=$filter("timeStamptoProperDate")(attr.datetime);
			$scope.message=attr.message;
			$scope.profilePic=attr.pic;
		}
	}
});


app.directive("chatMessages",function($window,$rootScope,$filter){
	return {
		restrict:'EA',
		replace:true,
		scope:{
			messageObj:'@'
		},
		link:function($scope,element,attr,controller,transclude){
			$scope.userId=$rootScope.userinfo._key;
			$scope.myTemplate="";
			$scope.data={};
			$scope.messageObj=JSON.parse($scope.messageObj);
			$scope.from=$scope.messageObj.from;
			$scope.to=$scope.messageObj.to;
			$scope.message=$scope.messageObj.message;
			$scope.date=$filter("timeStamptoProperDate")($scope.messageObj.sentat);
			$scope.time=$filter("timeStampToDate")($scope.messageObj.sentat);
			$scope.finaltime=$filter("timeFormat")($scope.time);
			$scope.datetime=$scope.date+"  "+$scope.finaltime;

			if($scope.from._key==$scope.userId){
				$scope.myTemplate="directive/sendChatMessage.html"
				$scope.name=$scope.from.name;
				$scope.profilePic=$scope.from.profile_pic;
			}
			else{
				$scope.myTemplate="directive/receiveChatMessage.html";
				$scope.name=$scope.to.name;
				$scope.profilePic=$scope.from.profile_pic;

			}
			

		},
		template:'<div class="chat-wrap" ng-include="myTemplate"></div>'
	}
})

