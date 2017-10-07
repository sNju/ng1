var app=angular.module("chat.module",["common.module","ngMaterial","httpRequest.module","luegg.directives"]);
app.controller("chatCtrl",['$scope','ngToast','$window','bookingRecordHttpMethod','$stateParams','urlFactory','httpRequestFactory',
	function($scope,ngToast,$window,bookingRecordHttpMethod,$stateParams,urlFactory,httpRequestFactory){
		$scope.booked_user_id=$stateParams.id;
		$scope.record_id=$stateParams.record_id;
		$scope.booked_user="";
		$scope.bookingStatus="";
		$scope.init=function(){			
			$scope.bookingStatus($scope.record_id);
		}
		$scope.bookingStatus=function(record_id){
			bookingRecordHttpMethod.getBookingStatus(record_id).then(
				function(response){
					$scope.byme = true;
					if($scope.booked_user_id==response.from._key){
						var from=response.from;
						response.from=response.to;
						response.to=from;
						$scope.byme=false;
					}
					$scope.bookingStatus=response;

					$scope.bookedUser=response.to;
					$scope.$broadcast("toUser",response);
				},function(reason){
				});
		}

		$scope.bookingAction=function(status,record_id){
			bookingRecordHttpMethod.changeBookingStatus(status,record_id).then(function(){
				if(status=="confirmed")
					ngToast.create('Confirmation Request Sent');
				else
					ngToast.create({
						className: 'warning',
						content:'Cancellation Request Sent'});
			},function(reason){

			})
		}

		$scope.init();
	}]);



app.factory("bookingRecordHttpMethod",function($http,$q,urlFactory,$mdDialog,$location){
	var obj={};
	
	
	obj.getBookingStatus=function(record_id){
		var bookingStatus=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/booking?id="+record_id;
		$http.get(url).then(function(response){
			bookingStatus.resolve(response.data.data.booking);
		},function(reason){
			bookingStatus.reject(reason);
		});
		return bookingStatus.promise;
	}

	obj.changeBookingStatus=function(status,record_id,ev){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/booking"
		var obj={};
		var title="Are You Sure Want To Cancel This Booking";
		if(status.toLowerCase()=="confirmed")
			title="Are You Sure Want To Conform This Booking";
		obj.status=status;
		obj.id=record_id;
		var confirm = $mdDialog.confirm()
		.title(title)
		.textContent('')
		.ariaLabel('Lucky day')
		.targetEvent(ev)
		.ok('Yes')
		.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.put(url,obj).then(function(response){
				//console.log("response object in button clicked=",response);
				$location.path('bookingRecords/'+status);
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
		}, function() {
		});

		
		
		return defer.promise;
	}
	obj.getOlderMessages=function(record_id,user,other){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/booking?id="+record_id+"&target=message";
		url+="&user="+user+"&other="+other;
		$http.get(url).then(function(response){
			defer.resolve(response.data.data.message);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})

app.directive("chatWindow",function($window,$rootScope,bookingRecordHttpMethod,$compile,urlFactory,httpRequestFactory,chromeNotificationFactory){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:"directive/bookingRecords/chatWindow.html",
		link:function($scope,element,attr,controller,transclude){
			console.log("hello this is link function");
			$scope.bookingId=attr.rcordId;
			$scope.isviewProfileShow=$scope.bookingId==""?false:true;
			$scope.$on("toUser",function($event,data){
				$scope.bookedUser=data.to;
				$scope.init();
			});

			var userdata=[];
			$scope.init=function(){
				$scope.getMessages();
				setBookingChatHeight();//manoj function
				$(window).on('resize', setBookingChatHeight);//manoj function
				var temp=JSON.parse($window.sessionStorage.getItem("userInfo"));
				$scope.user=temp;
				userdata.push({
					username:temp.username,
					profile_pic:temp.profile_pic,
					cover:temp.cover,
					id:temp._key
				});
			}

			function setBookingChatHeight() {
				var window_height = $(window).height(); /* Browser/Device Screen Height */
				var booking_chat_top_offset = $('.booking-chat').offset().top;
				var new_chat_box_height = $('.booking-chat .new-chat').innerHeight();
				var booking_chat_current_height = (window_height - booking_chat_top_offset);
				var booking_chat_history_window_height = (booking_chat_current_height - new_chat_box_height) - 60; 
				$('.booking-chat').css({ 'height': booking_chat_current_height, 'min-height': booking_chat_current_height });
				$('.chat-history-window').css({ 'height': booking_chat_history_window_height, 'min-height': booking_chat_history_window_height });
				$("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
			};

			
			angular.getTestability(element).whenStable(function() {
				
			});
			$scope.getMessages=function(){

				bookingRecordHttpMethod.getOlderMessages($scope.bookingId,$scope.user._key,$scope.bookedUser._key).then(function(response){
					$scope.messages=response;
				},function(reason){

				});
			}
			

			
			function getCaret(el) { 
				if (el.selectionStart) { 
					return el.selectionStart; 
				} else if (document.selection) { 
					el.focus();
					var r = document.selection.createRange(); 
					if (r == null) { 
						return 0;
					}
					var re = el.createTextRange(), rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);
					return rc.text.length;
				}  
				return 0; 
			}

			$('textarea').keyup(function (event){
				if (event.keyCode == 13) {
					var content = this.value;  
					var caret = getCaret(this);          
					if(event.shiftKey){
						this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
						event.stopPropagation();
					} else {
						this.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
						console.log("yes");
						$("#chatForm").submit();
					}
				}
			});

			$rootScope.$on("chat",function(event,obj){
				console.log("obj incoming message=",obj);
				if(obj.from.userpic!=undefined)
					obj.from.profile_pic=obj.from.userpic;
				var rcvMessageHtml='<receive-chat-message pic="'+obj.from.profile_pic+'" name="'+obj.from.username+'" datetime="'+obj.sentat+'" message="'+obj.message+'" ></receive-chat-message>'
				rcvMessageHtml=$compile(rcvMessageHtml)($scope);
				$("#chatbox").append(rcvMessageHtml);
			})


			$("#chatForm").submit(function(){
				var obj={};
				var sendObj={};
				obj.name=$scope.user.name;
				obj.datetime=new Date().getTime();
				obj.profile_pic=$scope.user.profile_pic;
				obj.message=$("#txtmessage").val().trim();
				if(obj.message.length>0){
					sendObj.message=$("#txtmessage").val();
		sendObj.to=$scope.bookedUser._key;//$scope.booked_user_id;
		sendObj.sid=$scope.bookedUser._key+new Date().getTime()+userdata[0].id;
		sendObj.booking=$scope.bookingId;
		$rootScope.socket.emit("send",sendObj);
		//chromeNotificationFactory.sendNotification(sendObj.message,"http://localhost:8887/index.html?#/bookingchat/id=28799");
		var messageHtml='<send-chat-message  pic="'+obj.profile_pic+'" name="'+obj.name+'" datetime="'+obj.datetime+'" message="'+obj.message+'"></send-chat-message>';
		messageHtml=$compile(messageHtml)($scope);
		$("#chatbox").append(messageHtml);
		$("#txtmessage").val("");
	}
});
		}
	}
});

app.directive("chatMessages",function($window,$filter){
	return {
		restrict:'EA',
		replace:true,
		scope:{
			messageObj:'@'
		},
		link:function($scope,element,attr,controller,transclude){
			$scope.userId=$window.sessionStorage.getItem("userId");
			$scope.myTemplate="";
			$scope.data={};
			$scope.messageObj=JSON.parse($scope.messageObj);
			
			$scope.from=$scope.messageObj.from;
			//console.log("$scope.messageObj in directive=",$scope.messageObj);
			$scope.to=$scope.messageObj.to;
			$scope.message=$scope.messageObj.message;
			$scope.datetime=$filter("timeStamptoProperDate")($scope.messageObj.sentat);
			if($scope.from._key==$scope.userId){
				$scope.myTemplate="directive/bookingRecords/sendChatMessage.html"
				$scope.name=$scope.from.name;
				$scope.profilePic=$scope.from.profile_pic;
			}
			else{
				$scope.myTemplate="directive/bookingRecords/receiveChatMessage.html";
				$scope.name=$scope.to.name;
				$scope.profilePic=$scope.from.profile_pic;

			}
			

		},
		template:'<div class="chat-wrap" ng-include="myTemplate"></div>'
	}
})



app.directive("sendChatMessage",function($filter){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:"directive/bookingRecords/sendChatMessage.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.name=attr.name;
			$scope.datetime=$filter("timeStamptoProperDate")(attr.datetime);
			$scope.message=attr.message;
			$scope.profilePic=attr.pic;
		}
	}
});

app.directive("receiveChatMessage",function($filter){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:"directive/bookingRecords/receiveChatMessage.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.name=attr.name;
			$scope.datetime=$filter("timeStamptoProperDate")(attr.datetime);//$filter("timeStampToDate")(attr.datetime,"dd-mm-yyyy","-",1);
			$scope.message=attr.message;
			$scope.profilePic=attr.pic;
		}
	}
});

app.directive("statusWidget",function($window){
	return{
		replace:true,
		restrict:'EA',
		link:function($scope,element,attr,controller,transclude){
			$scope.myTemplate="";
			attr.$observe("status",function(param){
				$scope.record_id=attr.id;
				$scope.bookedUser=attr.bookedUser;
				var userInfo=JSON.parse($window.sessionStorage.getItem("userInfo"))._key;
				if($scope.byme==false){
					if(param.toLowerCase()=="confirmed")
					{
						$scope.myTemplate="directive/bookingRecords/withdrawButton.html";
					}
					else if(param.toLowerCase()=="cancelled")
					{
						$scope.myTemplate="directive/empty.html"
						
					}
					else if(param.toLowerCase()=="pending")
					{
						$scope.myTemplate="directive/bookingRecords/confirmButton.html";
						//$scope.myTemplate="directive/bookingRecords/confirmAndWithdrawButton.html";
					}
				}
				else if($scope.byme==true){
					if(param.toLowerCase()=="confirmed"||param.toLowerCase()=="pending")
					{
						$scope.myTemplate="directive/bookingRecords/withdrawButton.html";
					}
					else if(param.toLowerCase()=="cancelled")
					{
						$scope.myTemplate="directive/empty.html"
						
					}
				}
				
			});
		},
		template:'<div ng-include="myTemplate"></div>'
	}
});

