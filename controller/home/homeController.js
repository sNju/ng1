	
(function(){
	var app=angular.module("home.module",[]);
	app.controller("homeController",["$scope","$window","$httpParamSerializer","$location","distanceCalculate","ngToast","$rootScope","$window","httpService","$anchorScroll",
		function($scope,$window,$httpParamSerializer,$location,distanceCalculate,ngToast,$rootScope,$window,httpService,$anchorScroll){
			$scope.slider=new Array(6);//img.party.banner
			$scope.slider[0]="images/banner/header-01.jpg";
			$scope.slider[1]="images/banner/header-02.jpg";
			$scope.slider[2]="images/banner/header-03.jpg";
			$scope.slider[3]="images/banner/header-04.jpg";
			$scope.slider[4]="images/banner/header-05.jpg";
			$scope.slider[5]="images/banner/header-06.jpg";

			$scope.ismodalopen=function(link){
				if(link==undefined){
					$scope.$emit("opendownloadmodal");
				}
				else{
					$window.open(link, '_blank');
				}
			}

			$scope.initlocation=function(){
				distanceCalculate.initlocation();//this function is use for get current location.
			}

			$scope.distance=function(lat,long){
				var h=distanceCalculate.getDistanceFromLatLonInKm(lat,long);
				return h;
			}

			var set;
			$scope.getValue=function(){
				var url=$rootScope.apiBaseUrl;
				set=true;
				url+="/cawebhome_v2";
				if($scope.locationobj!=undefined){
					set=false;
					url+="?latitude="+$scope.locationobj.latitude;
					url+="&longitude="+$scope.locationobj.longitude;
					url+="&url="+$location.path().split("/")[1];
				}
				else{
					url+="?url="+$location.path().split("/")[1]+"&"+$httpParamSerializer($location.search());	
				}

				httpService.get(url).then(function(response){
					$scope.parse(response);
				},function(resolve){
				});
			}


			$scope.parse=function(response){
				if(response!=undefined){
					$scope.homeobj=response.data.home;
					$scope.assignImage($scope.homeobj.slider);
					$scope.$emit("TitlePage","GoParties - Your Party App");
					$scope.$broadcast("playslider")
					if(set==true){
						//$scope.getmedia($scope.homeobj.mylocation.latitude,$scope.homeobj.mylocation.longitude);
					}
					set=true;
				}
			}

			$scope.getmedia=function(latitude,longitude){
				var url=$rootScope.apiBaseUrl;
				url+="/feed";
				url+="?latitude="+latitude;
				url+="&longitude="+longitude;
				httpService.get(url).then(function(response){
					$scope.works=response.data.feeds;
					$scope.assignVideo(0,false);
				},function(reason){

				});

			}

			$scope.slideparty=[];
			$scope.assignImage=function(obj){
				$scope.slider=[];
				for(index in obj){
					if(obj[index].party!=null&&obj[index]!=undefined){
						$scope.slider.push(obj[index].party);
						$scope.slideparty.push(obj[index].party);
					}
				}
			}

			$scope.getapplink=function(mobile){
				if(mobile!=undefined&&mobile.length>0){
					var url=$rootScope.apiBaseUrl;
					url+="/getapplink";
					var obj={};
					obj.number=mobile;
					httpService.post(url,obj).then(function(response){
						if(response.data!=undefined&&response.data.getapplink==true){
							ngToast.create("Successfully send request");
							$scope.mobile="";
						}
						else{
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							})
						}

					},function(reason){

					})
				}
				else{
					ngToast.create({
						className:"warning",
						content:"Please enter valid mobile number"
					})
				}
			}

			$scope.videoPlayer=document.getElementById("Video1");
			$scope.assignVideo=function(index,isautoplay){
				$scope.index=index;
				if($scope.videoPlayer==null) {
					return;
				}
				$scope.videoPlayer.pause();
				$scope.videoPlayer.removeAttribute('src');
				$scope.videoPlayer.load();
				$scope.videoobj=$scope.works[index];
				if(isautoplay==true){
					$scope.videoPlayer.autoplay=true;
					setTimeout(function () {
						$scope.videoPlayer.play();
					}, 150);
				}
			}


			$scope.$watchCollection("location",function(newValue,oldValue,scope){
				if(newValue!=oldValue){
					$scope.location=newValue;
					$scope.$broadcast("locationvalue",JSON.parse(JSON.stringify(newValue)));
				}
			},true);



			$scope.init=function(){
				$scope.locationobj=$rootScope.locationobj;
				$scope.getValue();
			}

			$scope.init();
		}]);

//--------Home Jquery Directive----//

app.directive("homeJquery",function(){
	return{
		restrict:'EA',
		scope:true,
		replace:true,
		link:function($scope,$attr,$element,controller,transclude){

			$("#download").click(function(){
				$("p:first").addClass("intro");
			});

			$(document).ready( function() {

				var clickEvent = false;

				$('#myCarousel').on('click', '.nav a', function() {
					clickEvent = true;
					$('.nav li').removeClass('active');
					$(this).parent().addClass('active');
				}).on('slid.bs.carousel', function(e) {

					if(!clickEvent) {
						var count = $('.nav').children().length -1;
						var current = $('.nav li.active');
						current.removeClass('active').next().addClass('active');
						var id = parseInt(current.data('slide-to'));
						if(count == id) {
							$('.nav li').first().addClass('active');
						}
					}

					clickEvent = false;
				});
			});

		}
	}
});

//--------Mutli Function Directive ie toggle active class add, video play button, same page link----//

app.directive("newHomeDirective",function($location){
	return {
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			$scope.$on("locationvalue",function(event,value){
				$("#txtlocation").val(value);
			});

			$(document).ready(function() {
				
				$('.media-list-toggle, .gp-list > a').on('click', function(e){
					e.preventDefault();
					$('.feed-aside-col').toggleClass('active');
				});

				//--------Video Panel Play and Stop Button function----//
				$('.video-panel').click(function() {
					var Video1=document.getElementById("Video1");
					if (Video1.paused == false) {
						Video1.pause();
					} else {
						Video1.play();
					}
				});
				//--------Same page Id Link scroll Function----//
				$("body").on("click",".feed",function(){
					$('html, body').animate({
						scrollTop: ($("#city-feed").offset().top)-58
					},500);
				});

				$("body").on("click",".blog",function(){
					$('html, body').animate({
						scrollTop:($("#blog").offset().top)-58
					},500);

				});

			}) //End Ready Function

		}
	}
})

app.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);


//---------------------------header search input stop when cross top header------------------//

app.directive("searchInput",function(){
	return {
		restrict:'EA',
		link:function($scope,$element,attr){
			$(document).ready(function(){
				$(window).scroll(function(){
					if($('.dot')!=undefined&$('.dot').position()!=undefined){
						if ( ($(window).width() >= 769)  && ($(window).scrollTop() >= ($('.banner-container').position().top + 85)) ){
							$('.banner-content').addClass('searchfixed');
							$('.top-nav,.call-back-panel').hide();
						}

						else if ( ($(window).width() === 768)  && ($(window).scrollTop() >= ($('.banner-container').position().top + 85)) ) 
						{
							$('.banner-content').addClass('searchfixed searchfixedResponsive');
						}

						else {
							$('.banner-content').removeClass('searchfixed searchfixedResponsive');
							$('.top-nav,.call-back-panel').show();
						}
					}
				});
			}) //end ready funtion
		}
	}
});

//---------------------------Body Scroll Stop on Open Toggle------------------//

app.directive("stopScroll",function(){
	return {
		restrict:'EA',
		link:function($scope,$element,attr){
			$(document).ready(function(){
				var isset=true;
				function scrolllock(){
					if (isset) {
						isset=false;
						$('body').css({
							position:'fixed',
							overflowY:'scroll',
							width:'100%',
							height:'100%'
						});

						$('.btn-app, .navbar-toggle, .stopFlickering , .top-nav li:not(.location),.top-link').addClass('pointerEvents');
					}

					else {
						isset=true;
						$('body').css({
							position:'static',
						});

						$('.btn-app, .navbar-toggle, .stopFlickering , .top-nav li:not(.location),.top-link').removeClass('pointerEvents');
					}
				}

				$('#stopScroller').on('click',function(){
					scrolllock();
				})

				$('#findlocation').on('click',function(){
					$('#stopScroller').click();
				})
			})//end ready funtion
		}
	}
});

//---------------------------location Value move in label------------------//

app.directive("pannelHideClick",function(){
	return {
		restrict:'EA',
		scope:false,
		link:function($scope,$element,attr){
			$scope.assignLocation=function(value,latitude,longitude){
				var obj={};
				obj.value=value;
				obj.latitude=latitude;
				obj.longitude=longitude;
				$scope.$emit("txtlocation",obj);

			}
		}
	}
});

//---------------------------Download Popup Page------------------//

app.directive("downloadPopupPage",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:"directive/downloadPopupPage.html",
		link:function($scope,$attr,$element){
		}
	}
});

//---------------------------Click to call Function for body A------------------//

app.directive("stopFlickering",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function() {
				$("button[data-toggle='modal'], a[data-toggle='modal'], input[data-toggle='modal']").click(function(){
					$('body').removeClass('modal-open').addClass('modal-openNew');
					$('#clicktocall').appendTo('body');
				});
		})//end ready funtion
		}
	}
});

//---------------------------bottom to top scroll function------------------//

app.directive("goBackToTop",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function(){
				$(window).scroll(function(){

					if ($(this).scrollTop() > 100) {
						$('#scrollToTop').fadeIn(1000); 
					}

					else {
						$('#scrollToTop').fadeOut(1000); 
					} 

				});

				$('#scrollToTop').click(function(){
					$("html, body").animate({ scrollTop: 0 }, 600);
					return false;
				});

		});//end ready funtion
		}
	}
});


//---------------------------Input Cursor Remove from Mozila Browser Issue------------------//
app.directive("readonlyInput",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function(){
				$('input[readonly]').focus(function(){
					this.blur();
				});

			})
		}
	}
});

//---------------------------Add and Remove bscrollbar------------------//
app.directive("removeScrollBar",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function() {

				$('#searchbox').on('shown.bs.modal', function () {
					$('body').addClass('fixed');
				})

				$('#searchbox').on('hidden.bs.modal', function () {
					$('body').removeClass('fixed').addClass('static');
				})

				$('.removeClass,.search-ul li a').on('click', function () {
					$('body').removeClass('fixed').addClass('static');

				})


			});

		}
	}});


})();
