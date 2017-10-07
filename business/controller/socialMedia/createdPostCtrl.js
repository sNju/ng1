var app=angular.module("createdPost.module",[]);
app.controller("createdPostCtrl",['$scope','$rootScope','getFeedFactory','makeFeedObjectProperFormat','$stateParams','feedCountFactory','feedCardHttpCallFactory',
	function($scope,$rootScope,getFeedFactory,makeFeedObjectProperFormat,$stateParams,feedCountFactory,feedCardHttpCallFactory){
		$scope.init=function(){
			
			$scope.network=$stateParams.network;
			$scope.getFeed($scope.network);
		}
		$scope.feeds=[];
		$scope.countObj={};
		
		
		$scope.getFeed=function(network){
			
			getFeedFactory.getFeed(network).then(function(response){
				console.log("response.data.data.feeds",response);
				if(response.data.hasOwnProperty("data"))
					$scope.feeds=makeFeedObjectProperFormat.make(response.data.data.feeds);
				$scope.$emit("smFeedsEvent",$scope.feeds);
				$scope.$broadcast("smFeedsEvent",$scope.feeds);
				$scope.countObj=feedCountFactory.getCount($scope.feeds);
				
			},function(reason){
				
			});
		}

		$scope.$on("likeList",function(event,data){
			$scope.likeListUsers=data.likes;
			$scope.isProfile=data.isProfile;
		});

		$scope.$on("commentList",function(event,data){
			$scope.comments=data.comments;
			$scope.isProfile=data.isProfile;
			$scope.commentFeed=data.feed;
		});

		$scope.$on("shareList",function(event,data){
			
			$scope.shareUsers=data.shares;
			$scope.isProfile=data.isProfile;
			$scope.shareFeed=data.feed;
		});
		
		
		$scope.commentFeed={};
		$scope.postComment=function(commentText,obj){
			
			$scope.$emit("commentIncrease",true);
			//obj.comment_count=obj.comment_count+1;
			$scope.commentFeed.commentText=commentText;
			feedCardHttpCallFactory.commentFeed($scope.commentFeed).then(function(response){
				$scope.comments.push(response.data.data.comment);
			},function(reason){
				//obj.comment_count=obj.comment_count-1;
				$scope.$broadcast("commentIncrease",false);

			});	
		}
		$scope.init();
	}]);



function VideoGalleryCtrl($scope,$filter,timeMaker,getNextAndPreviousSource){
	$scope.videoArray=[	{
		"id": "279713072184552_384408478381677",
		"created_at": 1412768175000,
		"text": "Memory leaks - You allocate a pointer in a method and then let it go out of scope without properly deallocating it. The pointer to the memory on the heap is now lost, but the memory remains allocated. Freeing this memory is now extremely difficult.",
		"user": "itsRTS",
		"type": "text",
		"user_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/c19.0.50.50/p50x50/10626877_369752309847294_8320056328325742726_n.png?oh=2eb471a7c1875f341c203f0cdc4245d9&oe=5819B732",
		"share_count": "0",
		"comment_count": 0,
		"has_liked": false,
		"like_count": 0,
		"network": "facebook",
		"fileurl":"http://gopartiesstatic.s3.amazonaws.com/images/1468147324_videoplayback.mp4"
	},
	{
		"id": "279713072184552_383891388433386",
		"created_at": 1412665017000,
		"text": "We have started an online phone tracking service in beta stage.\ntrackyourdevice.freeiz.com\nTry it... we look forward for ur reviews",
		"user": "itsRTS",
		"type": "text",
		"user_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/c19.0.50.50/p50x50/10626877_369752309847294_8320056328325742726_n.png?oh=2eb471a7c1875f341c203f0cdc4245d9&oe=5819B732",
		"share_count": "0",
		"comment_count": 0,
		"has_liked": false,
		"like_count": 0,
		"network": "facebook",
		"fileurl":"http://gopartiesstatic.s3.amazonaws.com/images/1468147345_videoplayback.mp4"
	},
	{
		"id": "279713072184552_383881291767729",
		"created_at": 1412661959000,
		"text": "RTS is not a company but an idea. In the technical world every thing is demanded in real time..... either a service or development..... So we strive only for that",
		"user": "itsRTS",
		"type": "text",
		"user_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/c19.0.50.50/p50x50/10626877_369752309847294_8320056328325742726_n.png?oh=2eb471a7c1875f341c203f0cdc4245d9&oe=5819B732",
		"share_count": "0",
		"comment_count": 0,
		"has_liked": false,
		"like_count": 0,
		"network": "facebook",
		"fileurl":"http://gopartiesstatic.s3.amazonaws.com/images/1468147324_videoplayback.mp4"
	},
	{
		"id": "279713072184552_369752309847294",
		"created_at": 1410098643000,
		"user": "itsRTS",
		"type": "image",
		"user_image": "https://scontent.xx.fbcdn.net/v/t1.0-1/c19.0.50.50/p50x50/10626877_369752309847294_8320056328325742726_n.png?oh=2eb471a7c1875f341c203f0cdc4245d9&oe=5819B732",
		"share_count": "0",
		"comment_count": 0,
		"has_liked": false,
		"like_count": 0,
		"network": "facebook",
		"thumburl": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/10626877_369752309847294_8320056328325742726_n.png?oh=2837df1d65db736373382502b7f790bb&oe=5859DCDC",
		"fileurl": "http://gopartiesstatic.s3.amazonaws.com/images/1468147345_videoplayback.mp4"
	}]
	
	$scope.setVideoSource=function(source,index){
		index=index||null;
		debugger;
		if(index==null){
			$scope.videoIndex=getNextAndPreviousSource.findCurrentIndex($scope.videoArray,source);
		}
		else
		{
			$scope.videoIndex=index;
		}
		var obj=$filter('shiftArray')($scope.videoArray,$scope.videoIndex);
		$scope.currentVideo=source;
		$scope.videoPlayer.autoplay=true;
		$scope.isVideoPlay=true;
		$scope.videoPlayer.load();
		$scope.videoPlayer.videoVolumeClass=100;
		$scope.videoPlayer.volume=1;
		document.getElementById("volume-bar").value=1;
	}
	
	$scope.init=function(){
		$scope.videoPlayer=document.getElementById("video");
		$scope.setVideoSource($scope.videoArray[0],0)
	}
	$scope.init();
}
















app.factory("makeFeedObjectProperFormat",function(){
	var obj={};
	obj.make=function(array){
		for(var i=0;i<array.length;i++){
			if(array[i].thumburl==undefined||array[i].thumburl.length==0)
				array[i].thumburl="";
		}
		return array;
	}
	return obj;
});







app.controller("smAudioGalleryCtrl",['$scope',
	function($scope){
		$scope.$on("smFeedsEvent",function(event,data){

		});
	}]);
app.controller("smVideoGalleryCtrl",['$scope',
	function($scope){
		$scope.$on("smFeedsEvent",function(event,data){

		});
	}]);









app.factory("feedCountFactory",function(){
	var obj={};
	obj.getCount=function(array){
		var countObj={};
		countObj.allCount=array.length;
		countObj.gopartiesCount=0;
		countObj.facebookCount=0;
		countObj.instagramCount=0;
		countObj.twitterCount=0;
		for(var i=0;i<array.length;i++){
			if(array[i].network.toLowerCase()=="facebook")
				countObj.facebookCount++;
			else if(array[i].network.toLowerCase()=="twitter")
				countObj.twitterCount++;
			else if(array[i].network.toLowerCase()=="instagram")
				countObj.instagramCount++;
			else countObj.gopartiesCount++;

		}
		return countObj;
	}
	return obj;
})

app.filter("feedCategoryFilter",function(){
	return function(array,category){
		if (!array || !array.length) { return; }
		return array.filter(function(obj){
			if(category==undefined||category.toLowerCase()=='all')
				return true;
			return obj.network.toLowerCase()==category.toLowerCase();
		})
	}
});

app.filter("restrictLengthFilter",function(){
	return function(text,url){
		if(text==undefined)
			return"";
		if(url==undefined||url.length==0)
			return	text.length>1000?text.substring(0,1000)+"....":text;
		return	text.length>30?text.substring(0,30)+"....":text;
	}
})
app.factory("getFeedFactory",function($http,$q,urlFactory,$window){
	var obj={};
	var feeds={};
	obj.getFeedData=function(){
		return feeds;
	}
	obj.getFeed=function(network){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId")+"&target=feed";
		url+="&network="+network;
		$http.get(url).then(function(response){
			feeds=response;
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})









app.directive("socialMediaManagement",function($mdMedia,$mdDialog){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		link:function($scope,element,attr,controller,transclude){





	// Tooltip Initialization //
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body',
		placement: 'auto bottom',
		trigger: 'hover'	
	});
			//  GP Feed Like/Unlike Button  //
			// $('body').on('click', '.like-post-btn',  function() {
			// 	$(this).toggleClass('liked');
			// 	if( $(this).hasClass('liked') ) {
			// 		$(this).children('.fa-heart-o').remove();
			// 		$(this).append('<i class="fa fa-heart"></i>');
			// 	}
			// 	else {
			// 		$(this).children('.fa-heart').remove();
			// 		$(this).append('<i class="fa fa-heart-o"></i>');
			// 	}
			// });

			$('body').on('click', '[data-toggle="feed-content"]', function() {
				var feed_content_object = $(this).data('target'); 	
				$(this).closest('.gp-feed-content').hide();
				$(this).closest('.gp-feed-content-wrapper').children(feed_content_object).show();
			});

			$("body").on('click',".dialog-control",function(){
				$("#likedUsersContent,#feedCommentsContent,#feedSharesContent").hide();
				$("#textFeedContent").show();
			});

			$('body').on('click', '.gp-section-header .close', function(){
				$(this).closest('.gp-feed-section').hide();
				$('.gp-feed-content').show();
			});
		}
	}
});





app.directive("socialFeeds",function(ngToast,$mdMedia,$mdDialog,feedCardHttpCallFactory){
	return {
		restrict:'EA',
		replace:true,
		scope:{
			feedObj:'='
		},
		link:function($scope,element,attr,controller,transclude){

			$scope.$on("commentIncrease",function($event,data){
				alert("yes");

			})
			if($scope.feedObj.type="image"){
				$scope.myTemplate="directive/socialMediaManagement/photoFeed.html";
			}
			else if($scope.feedObj.type="video")	
			{
				$scope.myTemplate="directive/socialMediaManagement/videoFeed.html";
			}
			else if($scope.feedObj.type="audio"){
				$scope.myTemplate="directive/socialMediaManagement/audioFeed.html";
			}
			else{
				$scope.myTemplate="directive/socialMediaManagement/textFeed.html";	
			}


			$scope.likeClick=function(obj){
				feedCardHttpCallFactory.likeFeed(obj).then(function(response){
					if(response.hasOwnProperty('data')){
						//$scope.feedObj.like_count=obj.has_liked==true?$scope.feedObj.like_count-1:$scope.feedObj.like_count+1;
						//$scope.feedObj.has_liked=!$scope.feedObj.has_liked;
						obj.like_count=obj.has_liked==true?obj.like_count-1:obj.like_count+1;
						obj.has_liked=!obj.has_liked;
						ngToast.create("Successfully Update");
					}
					else{
						ngToast.create({
							className:'warning',
							content:'Something Went Wrong'
						});
					}
					
				},function(reason){

				});
			}	
			$scope.getLikeList=function(obj){
				var temp={};
				temp.isProfile=obj.netwrok=="goparties"?true:false;
				temp.likes=[];
				$scope.likeList=[];
				$scope.$emit("likeList",temp);
				feedCardHttpCallFactory.getLikeList(obj).then(function(response){
					$scope.likeList=response.data.data.likes;
					response.data.data.isProfile=obj.netwrok=="goparties"?true:false;
					$scope.isProfile=obj.netwrok=="goparties"?true:false;
					$scope.$emit("likeList",response.data.data);
				},function(reason){

				});
			}

			$scope.getCommentList=function(obj){
				var temp={};
				temp.comments=[];
				temp.isProfile=obj.netwrok=="goparties"?true:false;
				temp.feed=obj;
				$scope.commentList=[];
				$scope.$emit("commentList",temp);
				feedCardHttpCallFactory.getCommentList(obj).then(function(response){
					response.data.data.isProfile=obj.netwrok=="goparties"?true:false;
					response.data.data.feed=obj;
					$scope.isProfile=obj.netwrok=="goparties"?true:false;
					$scope.commentList=response.data.data.comments;
					$scope.$emit("commentList",response.data.data);
				},function(reason){

				});		
			}

			$scope.postCommentfromPopup=function(commentText,feed){
				$scope.commentFeed=feed;
				$scope.commentFeed.commentText=commentText;
				feedCardHttpCallFactory.commentFeed($scope.commentFeed).then(function(response){
					$scope.commentList.push(response.data.data.comment);
					
					
				},function(reason){
				});	
			}

			$scope.getShareList=function(obj){
				feedCardHttpCallFactory.getShareList(obj).then(function(response){
					response.data.data.isProfile=obj.netwrok=="goparties"?true:false;
					response.data.data.feed=obj;
					$scope.isProfile=obj.netwrok=="goparties"?true:false;
					$scope.shareList=response.data.data.shares;
					$scope.$emit("shareList",response.data.data);
				},function(reason){

				});		
			}

			$scope.selectedFeedObj={};
			$scope.status = '';
			$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			$scope.fullFeedModal=function(ev,obj){
				var template="";
				switch(obj.type){
					case 'image':
					template="gpFeedFullViewModal";
					break;
					case 'video':
					template="gpVideoFeedFullViewModal";
					break;
					case "audio":
					template="gpAudioFeedFullViewModal";
					break;
					default:
					template="gpFeedFullViewModal";
				}

				//template="gpVideoFeedFullViewModal";
				$scope.selectedFeedObj=obj;
				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
				$mdDialog.show({
					scope:$scope.$new(),
					controller:smImageGalleryCtrl,
					templateUrl: 'directive/socialMediaManagement/'+template+'.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					//onShow: onShow,
					clickOutsideToClose:true,
					fullscreen: useFullScreen
				})
				.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
				});

				$scope.$watch(function() {	
					return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === false);
				});
			};
		},
		template:'<li ng-include="myTemplate"></li>'


		

	}

	/** Show method for dialogs 
		function onShow(scope, element, options, controller) {
			console.log('opened');
		}
		*/


});


 

function smImageGalleryCtrl($scope,$mdDialog,$mdMedia,getFeedFactory,$filter,feedFilterFactory){
	$scope.currentObj=$scope.selectedFeedObj;
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel=function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	$scope.text="this text from controller";
	$scope.init=function(){
		$scope.currentObj=$scope.selectedFeedObj;
		var data=feedFilterFactory.filterFeed(getFeedFactory.getFeedData().data.data.feeds,$scope.selectedFeedObj);
		$scope.galleryData=data.array;
		$scope.currentIndex=data.index;
	}

	$scope.nextObj=function(){
		$scope.currentIndex=feedFilterFactory.getNextIndex($scope.galleryData,$scope.currentIndex);
		$scope.currentObj=$scope.galleryData[$scope.currentIndex];
		
	}
	$scope.prevObj=function(){
		$scope.currentIndex=feedFilterFactory.getPreviousIndex($scope.galleryData,$scope.currentIndex);
		$scope.currentObj=$scope.galleryData[$scope.currentIndex];
		
	}

	$scope.init();
}


function smVideoGalleryController($scope){
	$scope.init();
	$scope.init=function(){
		alert("video controller is inilize");
	}
}









app.filter("feedGalleryFilter",function(){
	return function(array,data){
		return array.filter(function(obj,index){
			return obj.type.toLowerCase()==data.type.toLowerCase();
		});
	}
});

app.factory("feedFilterFactory",function(){
	var obj={};
	obj.filterFeed=function(array,data){
		var dataIndex="";
		array.filter(function(obj,index){
			if(obj.id==data.id)
				dataIndex=index;
			if(obj.type!=undefined)
				return obj.type.toLowerCase()==data.type.toLowerCase();
		});
		var data={};
		data.array=array;
		data.index=dataIndex;
		return data;
	}
	obj.getNextIndex=function(array,index){
		if(index==array.length-1)
			return 0;
		else return index+1;
	}
	obj.getPreviousIndex=function(array,index){
		if(index==0)
			return array.length-1;
		else return index-1;
	}
	return obj;
})




app.factory("feedCardHttpCallFactory",function($http,$q,urlFactory,$window){
	var obj={};
	obj.likeFeed=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/like";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.to=obj.id;
		data.network=obj.network;
		if(obj.has_liked==true)
			data.intention="unlike";
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.getLikeList=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/like";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.id=obj.id;
		data.network=obj.network;
		$http({
			url:url,
			method:'GET',
			params:data
		}).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.commentFeed=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/comment";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.to=obj.id;
		data.network=obj.network;
		data.comment=obj.commentText;
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.getCommentList=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/comment";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.id=obj.id;
		data.network=obj.network;
		$http({
			url:url,
			method:'GET',
			params:data
		}).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;	
	}
	obj.getShareList=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/share";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.id=obj.id;
		data.network=obj.network;
		$http({
			url:url,
			method:'GET',
			params:data
		}).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;	
	}
	return obj;
})