var app=angular.module("main.module");
app.controller('addgpbController', ['$scope','$location','$rootScope','httpsService','httpService','$window'
	,function($scope,$location,$rootScope,httpsService,httpService,$window){
		$scope.profileobj={};
		$scope.token="";
		
		var facebookobj;
		$scope.$emit("AdminPageTitle","GPCA Admin Panel");
		$rootScope.accessToken=$window.sessionStorage.getItem("FbaccessToken");
		$rootScope.expirytime=$window.sessionStorage.getItem("ExpiryTime");
		
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function defaultValueAssignifNotExist(value,defaultValue){
			return value==undefined?defaultValue:value;
		}

		$scope.$watch("profileobj",function(newval,oldval,$scope){
			if(newval!=oldval){
				var obj=newval;
				if(newval.profile_type!=oldval.profile_type){
					var data=facebookobj;
					if(obj.profile_type!=undefined&&obj.profile_type.indexOf("pot")){
						obj.address=data.single_line_address;
					}

					else{
						obj.address=data.current_location;
					}


					if(obj.address==null){
						obj.address=data.hometown;
					}

					if(obj.address==null){
						obj.address=obj.location;
					}


					var str=obj.name;
					str=str.replace(/&/g, "and");
					str=str.replace(/\//g, "");
					str=str.replace(/\#/g, "");
					str=str.replace(/\[/g, "");
					str=str.replace(/\]/g, "");
					str=str.replace(/\:/g, "");
					str=str.replace(/\+/g, "-");
					str=str.replace(/\=/g, "-");
					str=str.replace(/\*/g, "-");
					str=str.replace(/ /g, "-");
					str=str.replace(/(---)/g, "-");
					str=str.replace(/(--)/g, "-");
					str=str+"-"+getRandomInt(10000000,99999999);
					obj.slug=str.toLowerCase();
					var profiletype=obj.profile_type;
					var regex = /([A-Za-z]*)/g;
					profiletype=profiletype.replace(regex, function(x) { return x.toLowerCase() });
					obj.gpurl=profiletype.replace(/ /g, "")+"/"+obj.slug;
					obj.gpurl=obj.gpurl.toLowerCase();
				}
			}
		},true)



		$scope.adduser=function(data,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				data.active=true;
				data.pricing=[
				{
					"segment": "Free Entry",
					"amount": 0,
					"seatlimit": "1000",
					"gpcoinslimit": "1000",
					"available": true,
					"male": {
						"amount": 0,
						"available": true
					},
					"female": {
						"amount": 0,
						"available": true
					},
					"couple": {
						"amount": 0,
						"available": true
					}
				}
				];

				url+="/profile";
				httpService.post(url,data).then(function(response){
					if(response.data!=undefined){
						$scope.$emit("status","successfully user added","alert-success",response.data,undefined);	
						$location.path("editprofile/"+response.data.profile._key);

					}
					else{
						$scope.$emit("status","user already exist","alert-danger",response.data,undefined);	
					}

				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,"");
				});
			}
		}


		$scope.getuserinfo=function(url,token){
			httpsService.getuserinfo(url,token).then(function(response){
				facebookobj=httpsService.getfbuserobject();
				$scope.profileobj=response;
			},function(reason){
				$scope.$emit("status",reason,"alert-danger",undefined,undefined);
			});
		};

		$scope.getAccessToken=function(){
			if($rootScope.accessToken!=undefined  && $rootScope.expirytime!=undefined){
				var now=new Date().getTime()/1000;
				if(now<$rootScope.expirytime){
					$scope.token=$rootScope.accessToken;
					return $rootScope.accessToken;
				}
				else{
					$window.sessionStorage.clear();
				}
				

			}

		};

		$scope.checkAccessToken=function(){
			if($rootScope.accessToken!=undefined  && $rootScope.expirytime!=undefined){
				var now=new Date().getTime()/1000;
				if(now<$rootScope.expirytime){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}

		};

		$scope.$on("txtlocation",function($event,data){
			$scope.profileobj.address=data.value;
			$scope.profileobj.latitude=data.latitude;
			$scope.profileobj.longitude=data.longitude;
			$scope.profileobj.geo.push($scope.profileobj.latitude);
			$scope.profileobj.geo.push($scope.profileobj.longitude);
		});

	}]);


app.factory('httpsService',function($q,$http){
	var object=new Object();
	var fbuserobj={};
	var apiBaseUrl="https://graph.facebook.com/v2.7";
	function defaultValueAssignifNotExist(value,defaultValue){
		return value==undefined?defaultValue:value;
	}
	
	//var access_token="EAACEdEose0cBAAloKwIBWwGujDT5pLOttAF8QQMmUCPhBvwZAzqfBx7ZC9C7qrIrRZBF7UdYV4Y25264yFLIZBrupfxMV17RUigNWHYeFckCse9UMosgART3etHwCCG0AB6LqZBBq6B7ICdZCN2CV8iiz6KnMqQTmRYGJ10I8cLQZDZD";
	function updatefbid(id,token){

		var defer=$q.defer();
		var url=apiBaseUrl;
		url+="/search/?q="+id+"&type=page";
		url+="&access_token="+token;
		$http.get(url).then(function(result){
			defer.resolve(result);
		},function(reason){
			console.log("error occured during fetch api",error);
			defer.reject(reason);
		});
		return defer.promise;
	}

	function calculateProfileRank(profile){
		var rank=0;
		rank=profile.parking!=undefined?(profile.parking.valet*500)+(profile.parking.lot*200)+(profile.parking.street*100):0;
		rank+=profile.engagement!=undefined?(profile.engagement.count)*3:0;
		rank+=profile.fan_count!=undefined?(profile.fan_count)*3:0;
		rank+=profile.engagement.count!=undefined?(profile.engagement.count)*3:0;
		rank+=profile.is_always_open==true?100:0;
		rank+=profile.is_verified==true?100:0;
		rank+=profile.talking_about_count!=undefined?profile.talking_about_count:0;
		rank+=profile.were_here_count!=undefined?profile.were_here_count:0;
		rank+=profile.is_permanently_closed==true?10:0;
		rank+=profile.were_here_count!=undefined?10*profile.were_here_count:0;
		rank+=profile.engagement!=undefined?(profile.engagement.count)*3:0;
		return rank;
	}

	function calculateGenre(categoryArray){
		categoryArray=categoryArray.map(function(obj){
			return obj.name;
		});
		return categoryArray.join(",");
	}
	function getuserid(url,token){
		var defer=$q.defer();
		var exist=url.endsWith("/");
		if(exist==true){
			url=url.substring(0,url.length-1);
		}
		var array=url.split('/');
		var id=array[array.length-1];
		if(/^\d+$/.test(id)==false){
			console.log("id=",id);
			updatefbid(id,token).then(function(response){
				try{
					var id=response.data.data[0].id;
					defer.resolve(id);
				}
				catch(e){
					defer.reject("Page does not exist");
				}

			},function(reason){
				defer.reject(reason);
			});
		}
		return defer.promise;
	}

	object.getfbuserobject=function(){
		return fbuserobj;
	}


	object.getuserinfo=function(url,token){
		var defer=$q.defer();
		getuserid(url,token).then(function(response){

			var url=apiBaseUrl;
			url+="/"+response;
			url+="?fields=about%2Cid%2Caffiliation%2Cattire%2Cband_interests%2Cband_members%2Cawards%2Cartists_we_like%2Cbooking_agent%2Cbuilt%2Ccategory%2Ccategory_list%2Ccheckins%2Ccompany_overview%2Ccontact_address%2Ccountry_page_likes%2Ccover%2Cculinary_team%2Ccurrent_location%2Cdescription%2Cdescription_html%2Cbirthday%2Cbio%2Cemails%2Cengagement%2Cfan_count%2Ccan_post%2Cfeatures%2Cbest_page%2Cfounded%2Cgeneral_info%2Cgeneral_manager%2Cgenre%2Cglobal_brand_page_name%2Cfood_styles%2Chometown%2Chours%2Cinfluences%2Cis_always_open%2Cis_community_page%2Cis_permanently_closed%2Cis_published%2Cis_unclaimed%2Cis_verified%2Clink%2Clocation%2Cmembers%2Cmission%2Cname%2Cname_with_location_descriptor%2Cnetwork%2Cnew_like_count%2Coffer_eligible%2Cowner_business%2Cparent_page%2Cparking%2Cpayment_options%2Cpersonal_info%2Cpersonal_interests%2Cphone%2Cplace_type%2Cpress_contact%2Cprice_range%2Cproduced_by%2Cproducts%2Cpublic_transit%2Cschedule%2Csingle_line_address%2Cstart_info%2Cstore_location_descriptor%2Cstudio%2Ctalking_about_count%2Cusername%2Cvoip_info%2Cwebsite%2Cwere_here_count%2Cfeatured_video%2Cdisplay_subtext%2Cimpressum%2Clast_used_time%2Cmpg%2Crestaurant_services%2Crestaurant_specialties%2Cverification_status%2Cpicture";
			url+="&access_token="+token;

			$http.get(url).then(function(response){
				try{
					var obj=new Object();
					var data=response.data;
					fbuserobj=data;
					obj.facebookurl=url;
					obj._key=data.id;
					obj.fbid=data.id;
					obj.about=defaultValueAssignifNotExist(data.about,"");
					obj.website=defaultValueAssignifNotExist(data.website,"");
					obj.type=defaultValueAssignifNotExist(data.category,"");
					obj.description=defaultValueAssignifNotExist(data.about,"");

					if(data.overall_star_rating!=undefined){
						obj.crowd_quotient=data.overall_star_rating;
					}
					else{
						obj.crowd_quotient=2.5;	
					}



					if(data.engagement!=undefined)
						obj.likes=defaultValueAssignifNotExist(data.engagement.count,0);



					obj.birthday=defaultValueAssignifNotExist(data.birthday,"");
					obj.username=defaultValueAssignifNotExist(data.username,"");
					obj.name=defaultValueAssignifNotExist(data.name,"");

					obj.profile_pic="https://graph.facebook.com/"+data.id+"/picture?type=large";

					if(data.cover!=undefined)
						obj.cover=defaultValueAssignifNotExist(data.cover.source,"");
					if(data.emails!=undefined)
						obj.email=defaultValueAssignifNotExist(data.emails[0],"");
					obj.genre=defaultValueAssignifNotExist(data.genre,"");
					if(data.category_list!=undefined){
						obj.category_list=data.category_list;
						if(obj.genre!=""){
							obj.genre=obj.genre+","+calculateGenre(data.category_list);	
						}
						else{
							obj.genre=calculateGenre(data.category_list);
						}

					}

					if(data.attire!=undefined){
						obj.theme=data.attire;
						obj.attire=data.attire;
					}

					if(data.location!=undefined){
						obj.latitude=defaultValueAssignifNotExist(data.location.latitude,"");
						obj.longitude=defaultValueAssignifNotExist(data.location.longitude,"");
					}
					if((obj.latitude==undefined||obj.latitude=="")&&(defaultLatLong[obj.location]!=undefined)){
						obj.latitude=defaultLatLong[obj.location].latitude;
						obj.longitude=defaultLatLong[obj.location].longitude;
					}
					obj.geo=[];
					obj.geo.push(obj.latitude);
					obj.geo.push(obj.longitude);
					obj.phone=defaultValueAssignifNotExist(data.phone,null);
					obj.rank=calculateProfileRank(data);
					obj.rsm = {};
					obj.rsm.name="Tarun";
					obj.rsm.email="suport@goparties.com";
					obj.rsm.phone="+91 97 1197 1244";

					defer.resolve(obj);

				}
				catch(e){
					defer.reject(e);
				}

			},function(reason){
				console.log('reason',reason);
				defer.reject(reason);
			});

		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}



	return object;
});