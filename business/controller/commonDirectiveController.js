var app=angular.module("commonDirective.module",[]);

app.controller('commonDirectiveController', ['$scope', function($scope,$rootScope){
	


}]);
app.directive("socialMediaButton",function(ngToast,$window,googleLogin,getProfileStatus,twitterLogin,youtubeLogin,facebookLogin,instagramLogin,soundcloudLogin){
	return {
		replace:true,
		scope:true,
		restrict:'EA',
		templateUrl:'directive/socialMediaButton.html',
		link:function($scope,element,attr,controller,transclude){
			$scope.socialStatus={};
			$scope.socialStatus.facebook={};
			$scope.socialStatus.instagram={};
			$scope.socialStatus.twitter={};

			$scope.socialStatus.facebook.connect=false;
			$scope.socialStatus.facebook.switch=false;
			$scope.socialStatus.instagram.connect=false;
			$scope.socialStatus.instagram.switch=false;
			$scope.socialStatus.twitter.connect=false;
			$scope.socialStatus.twitter.switch=false;
			$scope.social={};
			$scope.social.facebook=false;
			$scope.social.twitter=false;
			$scope.social.instagram=false;
			$scope.changeSwitch=function(){
				$scope.$emit("socialMediaSwitchChange",$scope.social);
			}

			$scope.init=function(){
				facebookLogin.init();
				soundcloudLogin.init();
				youtubeLogin.init();
				googleLogin.init();
				getProfileStatus.getProfile().then(function(response){
					if(response.data!=undefined){
						var data=response.data.data.detail.profile;
						$scope.socialStatus.facebook.connect=!data.facebook;
						$scope.socialStatus.facebook.switch=data.facebook;
						$scope.socialStatus.instagram.connect=!data.instagram;
						$scope.socialStatus.instagram.switch=data.instagram;
						$scope.socialStatus.twitter.connect=!data.twitter;
						$scope.socialStatus.twitter.switch=data.twitter;
					}
				},function(reason){

				});
			}
			$scope.facebookPageClick=function(page){
				var obj={};
				obj.page_id=page.id;
				obj.access_token=$scope.facebookPages.access_token;
				facebookLogin.postInfo(obj).then(function(response){
					ngToast.create("Successfully Post");
					$scope.socialStatus.facebook.connect=false;
					$scope.socialStatus.facebook.switch=true;
				},function(reason){

				});
			}

			$scope.login=function(param){
				switch(param){
					case "facebook":
					facebookLogin.facebook().then(function(response){
						$scope.facebookPages=response;
						$("#socialMediaPagesListModal").modal("show");
					},function(reason){

					});
					break;
					case "google":
					$(".abcRioButtonContentWrapper").click();
					break;
					case "twitter":
					twitterLogin.twitter();
					break;
					case "instagram":
					instagramLogin.instagram();
					break;
					case "soundcloud":
					soundcloudLogin.soundcloud();
					break;
					case "youtube":
					youtubeLogin.youtube();
					break;
				}
			}
			$scope.init();


			$scope.$on('event:google-plus-signin-success', function (event, authResult) {
          // User successfully authorized the G+ App!
          
      });
			$scope.$on('event:google-plus-signin-failure', function (event, authResult) {
          // User has not authorized the G+ App!
         
      });
		}
	}
});



app.factory("getProfileStatus",function($http,urlFactory,$window,$q){
	var obj={};
	obj.getProfile=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId");
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})
app.factory("facebookLogin",function(ngToast,$q,urlFactory,$http,$window){
	var obj={};
	obj.init=function(){
		window.fbAsyncInit = function() {
			FB.init({
				appId      : '1246775765337052',
				xfbml      : true,
				version    : 'v2.5'
			});
		};

		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	obj.facebook=function(){
		if( navigator.userAgent.match('CriOS') )
		{
			window.open('https://www.facebook.com/dialog/oauth?client_id='+appID+'&redirect_uri='+ document.location.href +'&scope=email,public_profile,manage_pages,publish_actions,publish_pages,user_posts,user_about_me', '', null);
		}
		else
		{
			var defer=$q.defer();
			FB.login(function(response){
				if(response.status=='connected')
				{
					//console.log("Access Token=",response.authResponse.accessToken);
					var access_token=response.authResponse.accessToken;
					obj.getCurrentUserInfo(response).then(function(response){
						response.access_token=access_token;
						defer.resolve(response);
					},function(reason){
						defer.reject(reason);
					});
				}
				else if(response.status=='not_authorized')
				{
					ngToast.create("You Are Not Authorized");
				}
				else {

				}
			},{scope: 'email,public_profile,manage_pages,publish_actions,publish_pages,user_posts,user_about_me'});
			return defer.promise;
		}
	}
	obj.getCurrentUserInfo=function(response) {
		var defer=$q.defer();
		FB.api('/me', function(userInfo) {
			
			var userdata={};
			FB.api(
				'/me/accounts',
				'GET',
				{"fields":"picture,name,id"},
				function(response) {
					
					defer.resolve(response);
				});
			
		});
		return defer.promise;
	}
	obj.postInfo=function(data){
		var defer=$q.defer();
		data.network="facebook";
		data.user=$window.sessionStorage.getItem("userId");
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("network").value;
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})

app.factory("googleLogin",function(){
	var obj={};
	function onSuccess(googleUser){
		var profile = googleUser.getBasicProfile();
		
	}
	function onFailure(error){
		console.log("error occured during google sign in="+error);
	}

	obj.init=function(){
		gapi.signin2.render('my-signin2', {
			'scope': 'profile email',
			'width': 100,
			'height': 30,
			'longtitle': true,
			'theme': 'dark',
			'onsuccess': function(googleUser){
				onSuccess(googleUser);
			},
			'onfailure':function(){
				onFailure();
			}
		});
	}
	return obj;
});

app.factory("twitterLogin",function($window,$q,urlFactory){
	var obj={};
	obj.init=function(){
	}
	obj.twitter=function(){
		var openurl=urlFactory.getUrl("apiBaseUrlUpdated").value;
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		//win=window.open("https://accounts.google.com/o/oauth2/auth?client_id=72677469672-o5j9kmf1ub1eu8utsathsu2bsohua4bk.apps.googleusercontent.com&redirect_uri=http://localhost:8887&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner-channel-audit&response_type=token", 'youtube.com', opts);
		var win=window.open(openurl+"/twitterlogin?user="+$window.sessionStorage.getItem('userId'), 'twitter.com', opts);
		var interval = window.setInterval(function() {
			
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;
	}
	return obj;
});

app.factory("instagramLogin",function($window,$q,urlFactory){
	var obj={};
	obj.init=function(){

	}
	obj.instagram=function(){
		var openurl=urlFactory.getUrl("apiBaseUrlUpdated").value;
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		var win=window.open(openurl+"/instagramlogin?user="+$window.sessionStorage.getItem('userId'), 'instagram.com', opts);
		var interval = window.setInterval(function() {
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;
	}
	return obj;
});

app.factory("soundcloudLogin",function($q,urlFactory,$window){
	var obj={};
	obj.init=function(){
		SC.initialize({
			client_id: '08ffe545ab9e0496a116d314ff0d9094',
			redirect_uri: 'http://localhost:8887/callback.html',
			grant_type:('authorization_code', 'refresh_token', 'password', 'client_credentials', 'oauth1_token')
		});
	}
	obj.soundcloud=function(){

		SC.connect(function() {
			return SC.accessToken();
		}).then(function(token){
			console.log("token of sound cloud=",token);
		});
	}
	obj.soundCloudLogin=function(){
		var openurl=urlFactory.getUrl("apiBaseUrlUpdated").value;
		debugger;
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		var win=window.open(openurl+"/soundcloudlogin?user="+$window.sessionStorage.getItem('userId'), 'goparties.com', opts);
		var interval = window.setInterval(function() {
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;

	}
	return obj;
});
//https://api.goparties.com/soundcloudlogin?user=37988
app.factory("youtubeLogin",function($http,$window,urlFactory,$q){
	var obj={};
	obj.init=function(){
	}
	obj.youtube=function(){
		var openurl=urlFactory.getUrl("apiBaseUrlUpdated").value;
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		var win=window.open(openurl+"/youtubelogin?user="+$window.sessionStorage.getItem('userId'), 'goparties.com', opts);
		var interval = window.setInterval(function() {
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;
	}
	return obj;
});


app.directive("imageUpload",function(){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			var reader=new FileReader();
			$scope.imageName="";
			reader.onload=function(e){
				$scope.img=e.target.result;
				$scope.$digest();
				$scope.uploadImage($scope.img,$scope.imageName);
			}
			element.on("change",function(){
				reader.readAsDataURL(element[0].files[0]);
				$scope.imageName=element[0].files[0].name;
				$scope.uploadImage($scope.img,$scope.imageName);
			});
		}		
	}
});
app.directive("scrollEvent",function($window){
	return {
		restrict:'EA',
		scope:true,
		link:function($scope,element,attr,controller,transclude){

		}
	}
});

app. directive('googlePlusSignin', ['$window', function ($window) {
	var ending = /\.apps\.googleusercontent\.com$/;

	return {
		restrict: 'EA',
		transclude: true,
		template: '<span></span>',
		replace: true,
		link: function (scope, element, attrs, ctrl, linker) {
			attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');

			attrs.$set('data-clientid', attrs.clientid);
			attrs.$set('theme', attrs.theme);

        // Some default values, based on prior versions of this directive
        var defaults = {
        	callback: 'signinCallback',
        	cookiepolicy: 'single_host_origin',
        	requestvisibleactions: 'http://schemas.google.com/AddActivity',
        	scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
        	height: 'standard',
        	width: 'wide',
        	state: ''
        };

        defaults.clientid = attrs.clientid;
        defaults.theme = attrs.theme;

        // Overwrite default values if explicitly set
        angular.forEach(Object.getOwnPropertyNames(defaults), function(propName) {
        	if (attrs.hasOwnProperty(propName)) {
        		defaults[propName] = attrs[propName];
        	}
        });

        // Default language
        // Supported languages: https://developers.google.com/+/web/api/supported-languages
        attrs.$observe('language', function(value){
        	$window.___gcfg = {
        		lang: value ? value : 'en'
        	};
        });
        
        // Asynchronously load the G+ SDK.
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

        linker(function(el, tScope){
        	po.onload = function() {
        		if (el.length) {
        			element.append(el);
        		}
        		gapi.signin.render(element[0], defaults);
        	};
        });
    }
}
}]).
run(['$window','$rootScope',function($window, $rootScope) {
	$window.signinCallback = function (authResult) {
		if (authResult && authResult.access_token){
			$rootScope.$broadcast('event:google-plus-signin-success', authResult);
		} else {
			$rootScope.$broadcast('event:google-plus-signin-failure', authResult);
		}
	}; 
}]);

app.directive("percentageWidget",function(){
	return{
		replace:true,
		scope:false,
		restrict:'EA',
		templateUrl:"directive/PercentageWidget.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.progress=0;
			attr.$observe("percent", function (newValue) {
				$scope.progress=attr.percent;
				//var progressStyle=document.querySelector(".current-status-bar");
				//progressStyle.style.width=$scope.progress+'%';
			});
			
			

		}
	}
});



app.directive("loginInfoDirective",function($window,$rootScope){
	return{
		replace:true,
		restrict:'EA',
		templateUrl:"directive/loginInfo.html",
		link:function($scope,element,attr,controller,transclude){
			var user=$window.localStorage.getItem("userInfo");
			if(user!=null)
			{
				user=JSON.parse(user);
				$scope.name=user.name;
				$rootScope.name=$scope.name;
				$rootScope.profile_pic=user.profile_pic!=undefined?user.profile_pic:"https://s3-ap-southeast-1.amazonaws.com/gopartiesnew/images/gpba-images/user-default-pic.jpg";
				$scope.profile=user.profile_type;
			}
			$scope.logout=function(){
				$window.sessionStorage.clear();
				$window.localStorage.clear();
				$window.location.href="./index.html";
			}
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

app.directive('autocomplete', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			el.bind('change', function(e) {
				e.preventDefault();
			});
		}
	};
});

app.directive("ratingDirective",function(){
	return {
		relace:true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/rating.html",
		link:function($scope,element,attrs,controller,transclude){
			
			$scope.rating=attrs.rating;
			attrs.$observe("rating", function (newValue) {
				$scope.rating=attrs.rating;
			});
		}
	}
});

app.directive("googleLocationAutocomplete",function($window){
	return{
		scope:true,
		replace:true,
		restrict:'EA',
		link:function($scope,element,attr,controller,transclude){
			var id=element[0].id;
			$scope.initialize=function(id) {
				var address=(document.getElementById(id));
				var autocomplete = new google.maps.places.Autocomplete(address);
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
						$scope.$emit(id,document.getElementById(id).value);
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
					}else{
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}
			$scope.initialize(id);
		}
	}
});

app.directive('imageFadeIn', function($timeout){
	return {
		restrict: 'EA',
		link: function($scope, $element, attrs){
			$element.addClass("ng-hide-remove");
			$element.on('load', function() {
				$element.addClass("ng-hide-add");
			});
		}
	};
});

app.directive("preloaderDirective",function(){
	return{
		scope:true,
		restrict:'EA',
		templateUrl:'directive/preloader.html',
		link:function($scope,$element,$attr,controller,transclude){

		}
	}
});


app.directive("shareModal",function($mdMedia,$mdDialog,$rootScope){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		link:function($scope,attr,element,controller,transclude){

			$scope.shareModal=function(ev,id) {
				debugger;
				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
				$rootScope.shareUrl=id;
				$scope.param=id;
				$mdDialog.show({
					scope:$scope.$new(),
					templateUrl: 'directive/launchMyWork/shareModal.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
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

			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}
	}
});


app.directive("fileUploadCreatePost",function($parse){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,attrs,controller,transclude){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			var fileArray=[];
			element.bind('change', function(){
				debugger;
				fileArray=[];
				$scope.$apply(function(){
					for(var i=0;i<element[0].files.length;i++)
					{
						fileArray.push(element[0].files[i]);
					}
          //document.getElementById("thumburl").innerHTML= document.getElementById("thumburl").innerHTML;
          //document.getElementById("audioUpload").innerHTML= document.getElementById("audioUpload").innerHTML;
          $scope.assign(fileArray);
      });
			});
		}
	}
});


app.directive("closeModalDirective",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		link:function($scope,$element,$attr,controller,transclude){
			$scope.$on("closeModal",function(event,id){
				$("#"+id).modal('hide');
			});
		}
	}
});

app.factory("validationRuleFactory",function(){
	var obj=new Object();
	obj.getRegEx=function(){
		var regex={};
		regex.onlyLetttrs=/^[a-zA-Z]+/;
		regex.onlyDigit=/^[0-9]+$/;
		regex.date=/\d\d\/\d\d\/\d\d\d\d$/;
		regex.datetime=/\d\d\/\d\d\/\d\d\d\d \d\d:\d\d$/;
		regex.letterAndDigit=/^[a-zA-Z0-9]+/;
		regex.email= /\S+@\S+\.\S+/;
		regex.phone=/^\d{10}$/;
		return regex;
	}
	return obj;
})