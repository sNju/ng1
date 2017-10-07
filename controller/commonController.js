var app=angular.module("common.module",[]);
app.factory('shadowService',function(httpService,$q,$rootScope,$location,authenticationService){
	var object=new Object();
	object.shadow=function(obj){
		
		obj.shadow=obj.shadow==true?false:true;
		var data={};
		data.to=obj._key;
		data.user=$rootScope.userinfo._key;
		var defer=$q.defer();
		var url=$rootScope.apiBaseUrl;
		url+="/shadow";
		httpService.post(url,data).then(function(response){
			
			if(response.data!=undefined){
				defer.resolve(response.data.shadow);
			}
			else{
				defer.resolve(false);
			}
		},function(reason){
			defer.resolve(false);
		});
		return defer.promise;
	}
	return object;
});
//Start Header Animate
/*app.directive("headerAnimate",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		link:function($scope,$attr,$element){			
			
			$(document).ready(function(){
				$(window).scroll(function(){
					if ($(window).scrollTop() >= 50) {
						$('#secondary').addClass('scroll-up');
						$('#primarynav').addClass('scroll-up');
					}
					else {
						$('#secondary').removeClass('scroll-up');
						$('#primarynav').removeClass('scroll-up');
					}
				});
			})
			//
		}
	}
});*/
//End Header Animate


app.directive("googleLocationAutocomplete",function($window){
	return{
		scope:true,
		replace:true,
		restrict:'EA',
		link:function($scope,element,attr,controller,transclude){
			var id=element[0].id;
			$scope.initialize=function(id) {
				var address=(document.getElementById(id));
				address.onkeyup=function(event){
					$scope.$emit(id+'text',document.getElementById(id).value);
				}

				var autocomplete=new google.maps.places.Autocomplete(address);
				autocomplete.setTypes(['geocode']);
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return;
					}
					var address = '';
					if (place.address_components) {
						address = [
						(place.address_components[0] && place.address_components[0].short_name || ''),
						(place.address_components[1] && place.address_components[1].short_name || ''),
						(place.address_components[2] && place.address_components[2].short_name || '')
						].join(' ');
						$scope.codeAddress(id);

					}
				});
			}
			$scope.codeAddress=function(id) {
				geocoder = new google.maps.Geocoder();
				var address = document.getElementById(id).value;
				geocoder.geocode( {'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var latitude=results[0].geometry.location.lat();
						var longitude=results[0].geometry.location.lng();
						$window.sessionStorage.setItem(id+"latitude",latitude);
						$window.sessionStorage.setItem(id+"longitude",longitude);
						var obj={};
						obj.value=document.getElementById(id).value;
						obj.latitude=latitude;
						obj.longitude=longitude;
						$scope.$emit(id,obj);
					}else{
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}
			$scope.initialize(id);
		}
	}
});


app.directive("googleCityAutocomplete",function(){
	return{
		scope:true,
		replace:true,
		restrict:'EA',
		link:function($scope,element,attr){
			google.load("maps", "3.x", {callback: initialize, other_params:'sensor=false&libraries=places'});

			function initialize() {
				var id=element[0].id;
				//            var id=document.getElementById('txtlocation');
				var input = document.getElementById(id);
				var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'], region:'EU' });
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return;
					}
					var obj={};
					obj.latitude=place.geometry.location.lat();
					obj.longitude=place.geometry.location.lng();
					//obj.value=place.name;
					obj.value=document.getElementById(id).value;
					$scope.$emit(id,obj);

				});
			}

		}
	}
});




app.directive("caHeader",function($rootScope,httpService){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:"directive/homeheader.html",
		link:function($scope,$attr,$element){

		}
	}
});

app.directive("gpcaHeader",function($rootScope,ngToast,$location,httpService,$window){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		templateUrl:"directive/gpcaheader.html",
		link:function($scope,$element,$attr){
			$scope.headerdate=true;
			$scope.searchstrip=true;
			$scope.callback=$attr.callBack;
			$scope.loginstatus=$attr.loginStatus;


			$attr.$observe("dateValue",function(value){
				$scope.headerdate=JSON.parse(value);
			});

			$attr.$observe("searchStrip",function(value){
				$scope.searchstrip=JSON.parse(value);
			});

			$attr.$observe("callBack",function(value){
				$scope.callback=JSON.parse(value);
			});

			$attr.$observe("loginStatus",function(value){
				$scope.loginstatus=JSON.parse(value);
			});
			



			function modifyurl(value){
				var url=JSON.parse(JSON.stringify(value));
				url=url.replace(/ /g, "-");
				$location.url("/"+url);
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}


			$scope.redirect=function(){
				var url="/";
				if($rootScope.cityname==undefined){
					$rootScope.cityname=$window.sessionStorage.getItem("cityname");
				}

				var locationobj={
					'delhi-ncr':['28.6139','77.2090'],
					'mumbai':['19.0760','72.8777'],
					'hyderabad':['17.3850','78.4867'],
					'pune':['18.5204','73.8567'],
					'bangalore':['12.9716','77.5946'],
					'chennai':['13.0827','80.2707']
				};

				url+=$rootScope.cityname;
				var city=$rootScope.cityname.toLowerCase();
				url+="?latitude="+locationobj[city][0]+"&longitude="+locationobj[city][1];
				url=url.replace(/ /g,'-');
				$location.url(url);
			}
 
			$scope.init=function(){
				$rootScope.cityname=$window.sessionStorage.getItem("cityname");
			}

			$scope.init();

			$scope.signin=function(){
				$scope.$emit("stage","login");
				$scope.$emit("promoCodeStatus",false);
			}


			
			function converttwodigit(num){
				return num<10?'0'+num:num;
			}

			$scope.setDate=function(day){
				var date=new Date();
				var timestamp;
				date.setDate(date.getDate()+day);
				date=converttwodigit(date.getMonth()+1)+"/"+converttwodigit(date.getDate())+"/"+date.getFullYear();
				timestamp=new Date(date).getTime();
				$location.url("/search?date="+timestamp);
			}


			$scope.submitquery=function(name,phone,isvalid){
				debugger;
				var obj={};
				obj.user="callback";
				obj.query=name+"  "+phone;
				var url=$rootScope.apiBaseUrl;
				url+="/query";
				if(isvalid==true){
					httpService.post(url,obj).then(function(response){
						$('#clicktocall').modal('hide');
						if(response.data!=undefined){
							ngToast.create("Successfully send");
						}
						else{
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							})
						}
					},function(reason){

					});
				}
			}
		}
	}
});


app.directive("baHeader",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:"directive/baheader.html",
		link:function($scope,$attr,$element){
		}
	}
});




app.directive("footerDirective",function(){
	return{
		restrict:'EA',
		scope:false,
		replace:true,
		link:function($scope,$attr,$element,controller,transclude){
		}
	}
});

app.directive("gpCard",function(distanceCalculate,$window){
	return {
		replace:true,
		scope:{
			cardObj:'@',
			disableObj:'@'
		},
		link:function($scope,$attr,$element){
			$scope.isdistance=false;
			$scope.cardObj=JSON.parse($scope.cardObj);
			if($scope.cardObj.party!=undefined){
				$scope.party=$scope.cardObj.party;
				$scope.myTemplate="directive/gppartycard.html";
			}
			else if($scope.cardObj.profile!=undefined||$scope.cardObj.band!=undefined
				||$scope.cardObj.dj!=undefined||$scope.cardObj.artist!=undefined){
				$scope.profile=$scope.cardObj.profile;
			$scope.myTemplate="directive/gpprofilecard.html";
			$scope.isdistance=$scope.profile.profile_type=="Party Spot"?true:false;
		}
		else{
			$scope.deal=$scope.cardObj.deal;
			$scope.myTemplate="directive/gpdealcard.html";
		}

		$scope.distance=function(lat,long){
			return distanceCalculate.getDistanceFromLatLonInKm(lat,long);
		}

		$scope.ismodalopen=function(link){
			if(link==undefined){
				$scope.$emit("opendownloadmodal");
			}
			else{
				$window.open(link, '_blank');
			}
		}
		
	},
	template:'<li ng-include="myTemplate"></li>'
}
});


app.directive("rdgpCard",function(shadowService,distanceCalculate,$window,authenticationService){
	return {
		replace:true,
		scope:{
			cardObj:'@',
			disableObj:'@'
		},
		link:function($scope,$element,$attr){
			$scope.isdistance=false;
			$scope.cardObj=JSON.parse($scope.cardObj);
			if($scope.cardObj.party!=undefined){
				$scope.party=$scope.cardObj.party;
				$scope.myTemplate="directive/rdpartycard.html";
			}

			else if($scope.cardObj.profile!=undefined||$scope.cardObj.band!=undefined
				||$scope.cardObj.dj!=undefined||$scope.cardObj.artist!=undefined){
				
				$scope.profile=$scope.cardObj.profile;
			$scope.profile.shadow=JSON.parse($scope.cardObj.shadow);

			if($scope.profile.profile_type=="Party Spot"){
				$scope.myTemplate="directive/rdpartyspotcard.html";
			}
			else{

				$scope.myTemplate="directive/rdprofilecard.html";
			}
			$scope.isdistance=$scope.profile.profile_type=="Party Spot"?true:false;
		}

		else{
			$scope.deal=$scope.cardObj.deal;
			$scope.myTemplate="directive/rddealcard.html";
		}
		$scope.distance=function(lat,long){
			return distanceCalculate.getDistanceFromLatLonInKm(lat,long);
		}


		$scope.ismodalopen=function(link){
			if(link==undefined){
				$scope.$emit("opendownloadmodal");
			}
			else{
				$window.open(link, '_blank');
			}
		}

		$scope.shadowclick=function(obj){
			if(authenticationService.login()==true){
				shadowService.shadow(obj).then(function(response){
					if(response==false){
						obj.shadow=response;
					}
				},function(reason){

				});
			}
		}

		$scope.checkDate=function(obj)
		{
			var now_date=new Date().getTime();
			return obj.enddate<now_date;
		}

		$attr.$observe("className",function(value){
			$scope.classname=value;
		})
		
	},
	template:'<div ng-class="classname" ng-include="myTemplate" ></div>'
}
});


app.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);



app.directive("videoGallery",function(httpService,$rootScope,distanceCalculate){
	return{
		replace:true,
		scope:false,
		templateUrl:'directive/videogallery.html',
		restrict:'EA',
		link:function($scope,element,attr){
			$scope.videoobj={};
			$scope.hidegallery=false;
			$scope.array=[];
			attr.$observe('objArray', function(value){
				if(value!=undefined&&value!=""){
					$scope.videos=[];
					$scope.array=Object.assign([],JSON.parse(value));
					if($scope.array.length<4){
						var url=$rootScope.apiBaseUrl;
						url+="/feed";
						httpService.get(url).then(function(response){
							if(response.data!=undefined){
								$scope.array=response.data.feeds;
								$scope.initvideogallery($scope.array);	
							}
							else{
								$scope.hidegallery=true;
							}

						},function(reason){
							$scope.hidegallery=true;
						});
						
					}

					else{
						$scope.initvideogallery($scope.array);
					}
				}
			});

			$scope.initvideogallery=function(array){
				$scope.videos=[];
				for( var i in array){
					if(true){
						$scope.videos.push(array[i]);
					}
				}	

				$scope.videoPlayer=document.getElementById("Video1");
				$scope.assignVideo=function(index,isautoplay){
					$scope.index=index;
					$scope.videoPlayer.pause();
					$scope.videoPlayer.removeAttribute('src');
					$scope.videoPlayer.load();
					$scope.videoobj=$scope.videos[index];
					if(isautoplay==true){
						$scope.videoPlayer.autoplay=true;
						setTimeout(function () {      
							$scope.videoPlayer.play();
						}, 150);
					}
				}

				$('.video-panel').click(function() {
					
					var Video1=document.getElementById("Video1");
					if (Video1.paused == false) {
						setTimeout(function () {      
							Video1.pause();
						}, 150);
						
					} else {

						setTimeout(function () {      
							Video1.play();
						}, 150);
					}
				});
				$scope.assignVideo(0,false);
			}
		}
	}
});



// app.directive('bgImage', function () {
// 	return {
// 		link: function(scope, element, attr) {
// 			attr.$observe('bgImage', function() {           
// 				if (!attr.bgImage) {
// 					element.css("background-image","url("+attr.default+")");
// 				} else {
// 					var image = new Image();  
// 					image.src = attr.bgImage;
// 					image.onload = function() { 
// 						element.css("background-image","url("+attr.bgImage+")");
// 					};
// 					image.onerror = function() {
// 						element.css("background-image","url("+attr.default+")");
// 					};
// 				}
// 			});
// 		}
// 	};
// });

app.directive("stuckDirective",function($window,$document){
	return {
		restrict:'EA',
		link:function($scope,$element,$attr){
			$(document).ready(function(){
				var elementid=$attr.id;
				var topelementid=$attr.stuckDirective;
				var stuckclass=$attr.stuckClass;
				var stuckheight;
				
				angular.getTestability($element).whenStable(function() {
					stuckheight=$('body').find("#"+elementid).offset().top;
					scroll_fixed();
				});

				function scroll_fixed(){
					var btn_offset=$('body').find("#"+elementid).offset().top;
					var btn_scroll_top=$(window).scrollTop();
					var header_outer_height = $('body').find("#"+topelementid).outerHeight();
					var top_offset_after_header = btn_offset - header_outer_height;
					if(btn_scroll_top+header_outer_height>=btn_offset&&btn_offset>=stuckheight){
						if(!$('body').find("#"+elementid).hasClass(stuckclass)){
							$('body').find("#"+elementid).addClass(stuckclass).css({'top':header_outer_height});
						}
					}
					else{
						if($('body').find("#"+elementid).hasClass(stuckclass)){
							$('body').find("#"+elementid).removeClass(stuckclass);
						}
					}
				}

				$(window).on('scroll', scroll_fixed);

			})
		}
	}
});


app.directive('a', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
				elem.on('click', function(e){
					e.preventDefault();
				});
			}
		}
	};
});


app.directive("imageGallery",function(){
	return{
		link:function($scope,element,attr){
			angular.getTestability(element).whenStable(function() {
				angular.element(' <script src="js/slider/lightgallery/lightgallery.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-fullscreen.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-thumbnail.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-video.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-autoplay.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-zoom.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/lg-pager.min.js"></script>').appendTo(element);
				angular.element(' <script src="js/slider/lightgallery/jquery.mousewheel.min.js"></script>').appendTo(element);
				$("#lightgallery").lightGallery();
				$("#videoGallery").lightGallery(); 
			});
		}
	}
});


app.directive("lightGalleryBind",function(){
	return{
		restrict:'EA',
		link:function($scope,element,attr){
			$scope.galleryshow=true;
			$scope.$on("loadimageGalleryhtml",function(event,array){
				var html="";
				var videohtml=""
				$scope.galleryshow=array.length>0;
				for(index in array){
					if(array[index].worktype=="image"){					
						html+='<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 padding-control" data-src="'+array[index].fileurl+'">'+
						'<div class="image-thumb-container">'+
						'<a href="">'+
						'<div class="thumbnail-img" style="background-image: url('+array[index].thumburl+');"></div>'+
						'</a>'+
						'</div>'+
						'</div>';
					}
					else{
						html+='<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 padding-control" data-poster="'+array[index].thumburl+'" data-html="#video'+index+'">'+
						'<div class="image-thumb-container video-thumb">'+
						'<a href="">'+
						'<div class="thumbnail-img" style="background-image: url('+array[index].thumburl+');"></div>'+
						'</a>'+
						'</div>'+
						'</div>';						

						videohtml+='<div style="display:none;" id="video'+index+'">'+
						'<video class="lg-video-object lg-html5" controls preload="none">'+
						'<source src="'+array[index].fileurl+'" type="video/mp4">'+								         
						'</video>'+
						'</div>';
					}
				}
				$("#lightgallery").html("");
				$("#mainGalleryContainer").prepend(videohtml);
				$("#lightgallery").html(html);
			});
		}
	}
});

app.factory("autoCompleteThemeGenreAndProfile",function($q,$window,$rootScope,httpService){
	var obj={};
	var genre=[];
	var theme=[];
	var isthemecalled=false;
	var isgenrecalled=false;
	function getsearchData(data){
		return data.map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}

	obj.loadTheme=function(){
		if(isthemecalled==false){
			var defer=$q.defer();

			var url=$rootScope.apiBaseUrl;
			url+="/"+"theme";

			httpService.get(url).then(function(response){
				theme=response.data.theme;
				isthemecalled=true;
			},function(reason){

			});
		}
		return getsearchData(theme);
	};

	obj.querySearch=function(query,method){
		if(query==null||query=="")
		{
			return obj.loadStates();
		}
		var results = query ? obj[method]().filter(function(state){
			var lowercaseQuery = angular.lowercase(query);
			return (state.value.indexOf(lowercaseQuery) === 0);
		}):obj[method]();
		if(results.length==0)
		{
			results.push({
				value: query.toLowerCase(),
				display: query,
				image:"",
				name:query.toUpperCase(),
				email:""
			})
		}
		return results;
	};

	obj.loadGenre=function()
	{
		if(isgenrecalled==false){
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/"+"genre";

			httpService.get(url).then(function(response){
				genre=response.data.genre;
				isgenrecalled=true;
			},function(reason){

			});

		}
		return getsearchData(genre);
	}

	obj.loadProfile=function(){
		var allStates = 'Alabamaaaaaaaaaaa, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
		Florida, Georgia, aawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
		Maine, Maryland, aassachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
		Nebraska, Nevada, aew Hampshire, New Jersey, New Mexico, New York, North Carolina,\
		North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
		South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
		Wisconsin, Wyoming';
		return allStates.split(/, +/g).map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}
	obj.loadGenre();
	obj.loadTheme();
	return obj;
});

app.factory("genreCoversionFactory",function(){
	var obj={};
	obj.makergenreArray=function(string){
		if(string==null||string=="")
			return new Array();
		if(string.constructor === Array)
			return string;
		var array=string.split(',');
		var newarray=[];
		for(var i=0;i<array.length;i++){
			if(array[i]!=','){
				newarray.push({
					value: array[i].toLowerCase(),
					display: array[i],
					name:array[i].toUpperCase()
				});
			}
		}
		return newarray;
	}

	obj.convertGenreToString=function(genres){
		var genre="";
		if(genres==undefined||genres=="")
			return genres;
		for(var i=0;i<genres.length-1;i++){
			genre+=genres[i].display+",";
		}
		if(genres.length>0)
			genre+=genres[genres.length-1].display;
		return genre;
	}
	return obj;
})

app.directive('toggleClass', function() {
	return {
		restrict: 'EA',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				element.toggleClass(attrs.toggleClass);
			});
		}
	};
});


app.directive("datePicker",function(){
	return {
		restrict:'EA',
		link:function($scope,element,$attr){
			angular.element('<link rel="stylesheet" href="bootstrap-material-datetimepicker-gh-pages/css/bootstrap-material-datetimepicker.css" />').appendTo(element);
			angular.element('<link href="http://fonts.googleapis.com/css?family=Roboto:400,500">').appendTo(element);
			angular.element('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">').appendTo(element);
			angular.element('<script type="text/javascript" src="https://rawgit.com/FezVrasta/bootstrap-material-design/master/dist/js/material.min.js"></script>').appendTo(element);
			angular.element('<script type="text/javascript" src="bootstrap-material-datetimepicker-gh-pages/js/bootstrap-material-datetimepicker.js"></script>').appendTo(element);
			angular.getTestability(element).whenStable(function() {
				$scope.$applyAsync(function(){
					$('.datepicker').bootstrapMaterialDatePicker(
						{ weekStart : 0,
							time: false ,
							format : 'DD/MM/YYYY',
							minDate: new Date(),
							clearButton:true }
							);
					
					$('.timepicker').bootstrapMaterialDatePicker
					({
						date: false,
						shortTime: false,
						format: 'HH:mm',
						clearButton:true
					});
					
					$('.datetimepicker').bootstrapMaterialDatePicker
					({
						weekStart:0,
						shortTime:false,
						time:true,
						minDate: new Date(),
						date:true,
						format: 'DD MMMM YYYY  HH:mm',
						clearButton:true
					});




				});
				
			});
		}
	}
});

app.directive("facebookPageFind",function(){
	return{
		restrict:'EA',
		link:function($scope,element,attr){
			$(document).ready(function(){
				
				
				(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			})
		}
	}
})


app.directive("shadowClick",function($rootScope,shadowService){
	return{
		replace:true,
		restrict:'EA',
		link:function($scope,$element,attr){
			$scope.shadowclick=function(obj,$event){
				debugger;
				$event.preventDefault();
				if($rootScope.userinfo!=undefined && $rootScope.userinfo._key!=undefined){
					shadowService.shadow(obj).then(function(response){
						if(response==false){
							obj.shadow=response;
						}
					},function(reason){

					});
				}
				else{
					debugger;
					$scope.$broadcast("loginstage","login");
				}
			}
		}
	}
});

/*--------------------------Home Search Popup------------------------------*/
app.directive("homeSearchPopup",function(){
	return{
		restrict:'EA',	
		templateUrl:"directive/home-search-popup.html"
	}
});
/*--------------------------Login Popup------------------------------*/
app.directive("loginPopup",function(){
	return{
		restrict:'EA',
		templateUrl:"directive/auth/login-popup-modal.html",
		link:function($scope,$element,$attr){
			$scope.load=function(){
				alert("yes");
			}
		}

	}
});

app.directive("loginPageBody",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		controller:"loginController",
		link:function($scope,$element,$attr){
			$attr.$observe("stage", function (newValue){
				$scope.status=$attr.status;
				switch($scope.stage){
					case "otpverify":
					$scope.template="directive/auth/sendotp.html";
					break;
					default:
					$scope.template="directive/auth/login.html";
				}
				
			});
		},
		template:'<div class="modal-content" ng-include="template"></div>'
	}
});
/*--------------------------Gp Modal Popup------------------------------*/
app.directive("gpModalPopupWindow",function(){
	return{
		restrict:'EA',	
		templateUrl:"directive/gp-modal-popup.html"
	}
});
/*--------------------------Business Login------------------------------*/
app.directive("businessLoginPopup",function(){
	return{
		restrict:'EA',	
		templateUrl:"directive/business-login-modal.html"
	}
});

/*--------------------------Location Popup------------------------------*/
app.directive("locationPopup",function($window,$location){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:"directive/location-popup.html",
		link:function($scope,$element,$attr){
			$scope.changelocation=function(value,latitude,longitude){
				$("#location-box").modal("hide");
				$(".modal-backdrop").remove();
				$window.sessionStorage.setItem("cityname",value);
				$location.url("/"+value+"?latitude="+latitude+"&longitude="+longitude);
			}

			
		}
	}
});
/*--------------------------Click 2 Call Popup------------------------------*/
app.directive("clickCall",function(){
	return{
		restrict:'EA',	
		templateUrl:"directive/click-to-call.html"
	}
});


//---------------------------Search box directive------------------//
app.directive("searchBox",function($location,$httpParamSerializer){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:"directive/searchBox.html",
		link:function($scope,$attr,$element){
			var obj={};
			$scope.redirect=function(property,value){
				obj[property]=value;
				$location.url("/search?"+$httpParamSerializer(obj));
			}

			$(document).on("keyup", function (event) {
				if (event.which == 13) {
					if($("#searchtxt").is(':focus')==true){
						$("#searchbtn").click();
					}
				}
			}); 
		}
	}
});

app.directive("appDownloadSection",function($rootScope,httpService,ngToast){
	return{
		restrict:'EA',	
		templateUrl:"directive/appdownloadsection.html",
		link:function($scope,$attr,$element){
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
		}
	}
});

//---------------------------Blog Hover function------------------//
app.directive("showShareContentOne",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function() {
				$(".blogOne").hover(function(){
					$('.blog-Type').show();
					$('.blogInnerTextOne').show();},function(){
						$('.blog-Type').hide();
						$('.blogInnerTextOne').hide()
						$('.blog-share-icon').removeClass('in');
					});
			});
		}
	}
});

//---------------------------fixed footer at bottom------------------//
app.directive("fixedBottomFooter",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function() {

				$('.search-result').css('min-height', ($(window).height() -
					$('footer').height() - $('.search-result').offset().top));

			});
		}
	}
});

