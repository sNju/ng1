var app=angular.module("directive.module",[]);

app.directive("commonJsDirective",function(){
	return {
		link:function($scope,element,$attr){
			angular.element('<script src="plugins/jquery/jquery.min.js"></script>').appendTo(element);
			angular.element('<script src="plugins/bootstrap/js/bootstrap.js"></script>').appendTo(element);
			// angular.element('<script src="plugins/jquery-slimscroll/jquery.slimscroll.js"></script>').appendTo(element);
			angular.element('<script src="plugins/node-waves/waves.js"></script>').appendTo(element);
			angular.element('<script src="plugins/morrisjs/morris.js"></script>').appendTo(element);
		}
	}
});

app.directive("uiSref",function($location){
	return{
		restrict:'EA',
		link:function($scope,$element,$attr){
			$element.css('cursor','pointer');
			
		}
	}
});

app.directive("ngClick",function($location){
	return{
		restrict:'EA',
		link:function($scope,$element,$attr){
			$element.css('cursor','pointer');
			
		}
	}
})


app.directive("indexPageDirective",function(){//
	return{
		link:function($scope,element,$attr){

			$(document).ready(function(){//
				angular.element('<script src="js/pages/cards/colored.js"></script>').appendTo(element);
				angular.element('<script src="plugins/waitme/waitMe.js"></script>').appendTo(element);
				angular.element('<script src="js/demo.js"></script>').appendTo(element);
				angular.element('<script src="plugins/momentjs/moment.js"></script>').appendTo(element);
				angular.element('<script src="plugins/bootstrap-select/js/bootstrap-select.js"></script>').appendTo(element);
				angular.element('<script src="plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js"></script>').appendTo(element);
				angular.element('<script src="plugins/autosize/autosize.js"></script>').appendTo(element);
				angular.element('<script src="js/pages/forms/basic-form-elements.js"></script>').appendTo(element);


			});
		}
	}
});



app.directive("addUserDirective",function($rootScope){
	return{
		link:function($scope,element,$attr){

			$(document).ready(function(){
				angular.element('<script src="plugins/bootstrap-select/js/bootstrap-select.js"></script>').appendTo(element);
					// angular.element('<script src="plugins/jquery-slimscroll/jquery.slimscroll.js"></script>').appendTo(element);
					angular.element('<script src="plugins/momentjs/moment.js"></script>').appendTo(element);
					angular.element('<script src="plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js"></script>').appendTo(element);
					// angular.element('<script src="plugins/autosize/autosize.js"></script>').appendTo(element);
					angular.element('<script src="js/pages/forms/basic-form-elements.js"></script>').appendTo(element);
					angular.element('<script src="js/demo.js"></script>').appendTo(element);

					if($rootScope.isfirsttime==0){
						$rootScope.isfirsttime=$rootScope.isfirsttime+1;
						angular.element('<script src="js/leftsidebar.js"></script>').appendTo(element);
					}


				//input focus animation code start
				$('.form-control').focus(function () {
					$(this).parent().addClass('focused');
				});

				//On focusout event
				$('.form-control').focusout(function () {
					var $this = $(this);
					if ($this.parents('.form-group').hasClass('form-float')) {
						if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
					}
					else {
						$this.parents('.form-line').removeClass('focused');
					}
				});

				//On label click
				$('body').on('click', '.form-float .form-line .form-label', function () {
					$(this).parent().find('input').focus();
				});
				//input focus animation code end
				
				if ($.fn.selectpicker) {
					$('select:not(.ms)').selectpicker();
				}
			});
		}
	}
});


app.directive("leftSideBarDirectve",function(){
	return {
		link:function($scope,element,$attr){
			$("document").ready(function(){
				angular.element('<script src="js/leftsidebar.js"></script>').appendTo(element);
			});
		}
	}
});


app.directive("validationDirective",function(){
	return{
		link:function($scope,element,$attr){
			$(document).ready(function(){
				angular.element('<script src="plugins/jquery-validation/jquery.validate.js"></script>').appendTo(element);
				angular.element('<script src="js/pages/forms/form-validation.js"></script>').appendTo(element);

			});
		}
	}
});


// app.directive("dragDropDirective",function(){
// 	return{
// 		link:function($scope,element,$attr){
// 			$(document).ready(function(){
// 				angular.element('<script src="libjs/sortable.js"></script>').appendTo(element);
// 			});
// 		}
// 	}
// });

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

app.directive("notificationDirective",function(){
	return {
		scope:true,
		link:function($scope,$element,$attr){
			function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) {
				if (colorName === null || colorName === '') { colorName = 'bg-black'; }
				if (text === null || text === '') { text = 'Turning standard Bootstrap alerts'; }
				if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
				if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
				var allowDismiss = true;

				$.notify({
					message: text
				},
				{
					type: colorName,
					allow_dismiss: allowDismiss,
					newest_on_top: true,
					timer: 1000,
					placement: {
						from: placementFrom,
						align: placementAlign
					},
					animate: {
						enter: animateEnter,
						exit: animateExit
					},
					template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
					'<span data-notify="icon"></span> ' +
					'<span data-notify="title">{1}</span> ' +
					'<span data-notify="message">{2}</span>' +
					'<div class="progress" data-notify="progressbar">' +
					'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
					'</div>' +
					'<a href="{3}" target="{4}" data-notify="url"></a>' +
					'</div>'
				});
			}

			$scope.$on("message",function($event,obj){
				console.log("obj",obj);
				var classname="bg-black";//obj.className;
				//alert-success
				//alert-danger
				var text=obj.message;
				var placementFrom="top";
				var placementAlign="right";
				var animateEnter=null;
				var animateExit=null;
				showNotification(obj.classname,text,placementFrom,placementAlign,animateEnter,animateExit);
				
			})
		}
	}
});

app.directive("stuckDirective",function($window,$document){
	return {
		restrict:'EA',
		link:function($scope,$element,$attr){
			$(document).ready(function(){
				console.log("$attr",$attr);
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


app.directive("titlelocationbookbusiDirective",function(){
	return {
		restrict:'EA',
		replace:true,
		scope:{
			infoObj:'@',
			index:'@'
		},
		link:function($scope,element,$attrs){
			$scope.infoObj=JSON.parse($scope.infoObj);
			console.log("$scope",$scope.infoObj,$scope.index);
			$scope.templatelink="";

			if($scope.infoObj.party!=undefined){
				$scope.party=$scope.infoObj.party;
				$scope.id=$scope.party._key;
				$scope.type='party';
				$scope.templatelink="directive/rowmodule/partytitlelocationbookbusi.html";
			}
			else{
				$scope.profile=$scope.infoObj.profile;
				$scope.id=$scope.profile._key;
				$scope.type='profile';
				$scope.templatelink="directive/rowmodule/profiletitlelocationbookbusi.html";
			}
		},
		template:'<tr class="" ng-include="templatelink" ui-sref="/detail({type:type,id:id})"></tr>'
	}
})


app.directive("imageUpload",function($parse){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,attrs,controller,transclude){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			var fileArray=[];
			

			element.bind('change', function(){
				fileArray=[];
				var reader = new FileReader;
				reader.readAsDataURL(element[0].files[0]);
				$scope.$apply(function(){
					for(var i=0;i<element[0].files.length;i++)
					{
						fileArray.push(element[0].files[i]);
					}
					reader.onload=function() {
						var eventname=attrs.imageUpload;
						var image=new Image();
						image.src=reader.result;

						var obj={};
						obj.images=fileArray;
						obj.image=image;
						$scope.$emit(eventname,obj);
					};
				});
			});
		}
	}
});

app.directive("bookingCard",function($window,$location){
	return {
		replace:true,
		scope:{
			obj:'@'
		},
		templateUrl:'directive/bookingcard.html',
		link:function($scope,element,$attr,controller,transclude){
			
			$attr.$observe("obj",function(value){
				$scope.obj=$window.JSON.parse($scope.obj);
			});
			
			$scope.makeurl=function($event,obj){
				$event.stopPropagation();
				if(obj.party!=undefined){
					$location.url("createparty/"+obj.party._key)
				}
				else{
					$location.url("editprofile/"+obj.profile._key)
				}
			}


			$scope.getclassnametype=function(status){
				var classname="";
				switch(status){
					case "party": 
					classname="partyrow";
					break; 
					case "profile": 
					classname="";
					break; 
					default:
					classname=""
				}
				return classname;
			}
		}
	}
})

app.directive("revenueCard",function($window){
	return {
		replace:true,
		scope:{
			'revenue':'@'
		},
		templateUrl:'directive/revenuecard.html',
		link:function($scope,element,$attr,controller,transclude){
			
			$attr.$observe("revenue",function(value){
				$scope.revenue=$window.JSON.parse($scope.revenue);
			});
		}
	}
});
app.directive("newbookingCard",function($window,$location){
	return {
		replace:true,
		scope:{
			'obj':'@'
		},
		templateUrl:'directive/newbookingcard.html',
		link:function($scope,element,$attr,controller,transclude){
			
			$attr.$observe("obj",function(value){
				$scope.obj=$window.JSON.parse($scope.obj);
			});
			$scope.newBooking = function($event, obj) {
				var url = "/newbooking/";
				url+= obj.party!=undefined?"party":"profile";
				url+= "?id=";
				url+= obj.party!=undefined?obj.party._key:obj.profile._key;
				$location.url(url);
			}
		}
	}
});




/*Start Business Modal Directive*/

//app.directive("welcomeBusinessModal",function($rootScope,httpService){
	//	return{
		//		restrict:'EA',
		//		templateUrl:'directive/businessWelcomeModal.html',
		//		controller:function($scope){
			//		     $scope.init=function(){
				//                        	$scope.userobj={};
				//                        	$scope.genurl="";
				//                }
				//                        $scope.init();
				//                        $scope.submitdetail=function(data){
					//                                debugger;
					//                               var url=$rootScope.apiBaseUrl;
					//                               url+="/onboardinglink";
					//                                httpService.post(url,data).then(function(response){
						//                                        console.log("myresponse",response);
						//                                        $rootScope.genurl="www.gp.com/clientdetails/"+response.data.onboardinglink.token;
						//                                        console.log("token",$rootScope.genurl);
						//
						//                                },function(reason){
							//
							//                                 });
							//
							//             }
							//
							//             $scope.giveurl=function(){
								//                return $scope.genurl;
								//             }
								//
								//		},
								//		link:function($scope,$element,$attr){
									//
									//		}
									//	}
									//});
									//
									//app.directive("okBusinessModal",function(){
										//	return{
											//		restrict:'EA',
											//		templateUrl:'directive/okModalWindow.html',
											//        link:function($scope,$element,$attr){
												//
												//           }
												//
												//	}
												//});

												/*End Business Modal Directive*/

												app.directive("stopFlickering",function(){
													return{
														restrict:'EA',
														link:function($scope,$attr,$element){
															$(document).ready(function() {
																$("button[data-toggle='modal'], a[data-toggle='modal']").click(function(){
																	$('body').removeClass('modal-open').addClass('modal-openNew');
																	$('.clicktocall').appendTo('body');
																});
															})
														}
													}
												});

												app.directive("showOkpage",function(){
													return{
														restrict:'EA',
														link:function($scope,$attr,$element){
															$(document).ready(function() {
																$("#generateUrl").click(function(){
																	$('#business-modal').modal('hide');
																	$('#urlconfrm').modal('show');
																	$('body').removeClass('modal-open').addClass('modal-openNew');
																	$('.clicktocall').appendTo('body');

																});
															})
														}
													}
												});



												app.directive("copyUrlLink",function(){
													return{
														restrict:'EA',
														link:function($scope,$attr,$element){
															$(document).ready(function() {

																function copyToClipboard(text) {
																	if (window.clipboardData && window.clipboardData.setData) {
																		// IE specific code path to prevent textarea being shown while dialog is visible.
																		return clipboardData.setData("Text", text); 

																	} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
																		var textarea = document.createElement("textarea");
																		textarea.textContent = text;
																		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
																		document.body.appendChild(textarea);
																		textarea.select();
																		try {
																			return document.execCommand("copy");  // Security exception may be thrown by some browsers.
																		} catch (ex) {
																			console.warn("Copy to clipboard failed.", ex);
																			return false;
																		} finally {
																			document.body.removeChild(textarea);
																		}
																	}
																}

																document.querySelector("#copyUrl").onclick = function() {
																	var copyUrl=document.getElementById('copyUrlText').innerHTML;
																	var result = copyToClipboard(copyUrl);
																	console.log('URL has been copied' + result);
																	$('#urlconfrm').removeClass('in');
																	$('.modal-backdrop').removeClass('in');
																	$scope.$emit("status","Link Copied","alert-success",undefined,undefined);

																};

															});
														}


													}
												});


												app.directive("setDymanicWidth",function(){
													return{
														restrict:'EA',
														link:function($scope,$attr,$element){
															$(document).ready(function() {
																var getWidth=$('.card').width();
																$('.full-width-wrap').css('width',getWidth)
															});
														}
													}
												});
