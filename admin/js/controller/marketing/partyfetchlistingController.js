var app=angular.module("main.module");
app.controller('partyfetchlistingController',['$scope','partyfetchService','$rootScope','$q','$stateParams','httpService','$filter','$window'
	,function($scope,partyfetchService,$rootScope,$q,$stateParams,httpService,$filter,$window){
		var id=$stateParams.id;
		$scope.filterobj={};


		$scope.init=function(id){
			$scope.filterobj.id;
			$rootScope.accessToken=$window.sessionStorage.getItem("FbaccessToken");
			$rootScope.expirytime=$window.sessionStorage.getItem("ExpiryTime");
			var url=$rootScope.apiBaseUrl;
			url+="/profile/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.profile=response.data.detail.profile
				}
			}
			,function(reason){

			});
		}

		$scope.getAccessToken=function(){
			if($rootScope.accessToken!=undefined  && $rootScope.expirytime!=undefined){
				var now=new Date().getTime()/1000;
				if(now<$rootScope.expirytime){
					//console.log("mydata",$rootScope.accessToken);
					return $rootScope.accessToken;
				}
				else{
					$window.sessionStorage.clear();
				}
				

			}

		}

		$scope.checkAccessToken=function(){
			if($rootScope.accessToken!=undefined  && $rootScope.expirytime!=undefined){
				var now=new Date().getTime()/1000;
				if(now<$rootScope.expirytime){
					//console.log("mydata",$rootScope.accessToken);
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}

		}

		$scope.getallparty=function(obj,isvalid){
			debugger;
			$rootScope.partyExist=0;
			if(isvalid==true){
				$rootScope.internalhttpcall=true;
				var object=Object.assign({},obj);

				if(object.since!=undefined){
					object.since=Math.floor(($filter("dateddmmyyyytotimestamp")(object.since))/1000);
				}

				partyfetchService.fetchparty($scope.profile,object).then(function(response){
					if(response.length>0){
						var obj=partyfetchService.makepartyobject($scope.profile,response);
						$scope.parties=obj.partyobjArray;
						console.log("obj in controller",$scope.parties);
					}
					else{
						if(partyfetchService.ispartyExist()==-1){
							$scope.$emit("status","Parties Not Exist","bg-black",response.data,undefined);
						}
						else{
							$scope.$emit("status","Update token","alert-danger",response.data,undefined);	
						}
						
					}
					$rootScope.internalhttpcall=false;
				},function(reason){
					$rootScope.internalhttpcall=false;
				});
			}
		}

		$scope.saveparty=function(party){
			saveparty(party).then(function(response){
				$scope.$emit("status",response,"bg-green",response,undefined);
			},function(reason){

			});
		}

		$scope.saveallparty=function(index){
			if(index<$scope.parties.length){
				let j=index;
				saveparty($scope.parties[index]).then(function(response){
					//console.log("j=",j,$scope.parties.length);
					$scope.saveallparty(index+1);
					if(j+1==$scope.parties.length){
						$scope.$emit("status","all data save successfully","bg-black",response.data,undefined);
					}
				},
				function(reason){
					//$scope.$emit("status","Party already Exist"+$scope.parties[i].title.substring(0,15),"alert-danger",response.data,undefined);
				});

			}
		}


		function saveparty(data){
			data.active=true;
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/party";
			httpService.post(url,data).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					//data.active=response.data.party.active;
					defer.resolve("successfully save");
					
				}
				else{
					defer.resolve("Party already exist");
				}
			},function(reason){
				data.active=false;
				defer.reject(reason);
				$scope.$emit("status","something went wrong in"+data.title.substring(0,15),"alert-danger",response.data,undefined);
			});
			return defer.promise;
		}



		$scope.init($stateParams.id);

	}]);


app.factory('partyfetchService',function($http,$q){
	var object=new Object();
	var apiBaseUrl="https://graph.facebook.com/v2.7";
	var terms="1. The organiser reserves the right to entry to the venue as per the policy of the venue. \n2. The organiser shall not be responsible for the refund of the amount paid by Partymon; if the right to enter is denied by the venue as per the policy. \n3. The e-ticket generated after booking / claiming (as the case may be) is merely a proof of booking but not the final ticket. The final ticket would be available physically from the entry-point of the venue after producing the e-ticket. \n4. The organiser can be contacted directly through “Direct Chat With Organiser” to seek any specific clarification or understand specific policy of venue, such as, dress code (if any), stag-entry / couple entry (as the case may be), timings, date and time confirmations etc.  \n5. Without prejudice to the foregoing, if satisfactory response is not received from organisers, then the Partymon can call our party-experts at the Party Hotline @ +91-97-11-971244.\n\nHope this is of assistance. Party hard with GoParties.";
	var parties=[];
	var partyExist;


	function defaultValueAssignifNotExist(value,defaultValue){
		return value==undefined?defaultValue:value;
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	function fetch(url){
		var defer=$q.defer();
		$http.get(url).then(function(response){

			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	function calculatePartyRank(partyObj,profileObj){
		var rank=0;
		rank+=partyObj.attending_count!=undefined?partyObj.attending_count*10:0;
		rank+=partyObj.declined_count!=undefined?partyObj.declined_count*10:0;
		rank+=partyObj.interested_count!=undefined?partyObj.interested_count*5:0;
		rank+=partyObj.is_canceled==true?5:0;
		rank+=partyObj.maybe_count!=undefined?partyObj.maybe_count*10:0;
		rank+=profileObj.rank!=undefined?profileObj.rank:0;
		return rank;
	}

	object.ispartyExist=function(){
		return partyExist;
	}

	object.fetchparty=function(profileObj,obj){
		parties=[];
		partyExist=0;
		var defer=$q.defer();
		var url=apiBaseUrl;
		url+="/"+profileObj.fbid;
		url+="/events?date_format=U&fields=attending_count%2Ccan_guests_invite%2Ccategory%2Cdeclined_count%2Ccover%2Cdescription%2Cend_time%2Cid%2Cinterested_count%2Cis_canceled%2Cmaybe_count%2Cname%2Cnoreply_count%2Cowner%2Cplace%2Cstart_time%2Cticket_uri%2Ctimezone%2Cupdated_time%2Cpicture&type=created&";
		url+="access_token="+obj.access_token;
		url+="&since="+obj.since;
		function callfunction(url){
			fetch(url).then(function(response){
				debugger;
				console.log(response);
				if(partyExist==0&&response!=undefined&&response.data!=undefined&&response.data.data.length==0){
					partyExist=-1

					
				}

				
				if(response!=undefined&&response.data!=undefined){
					for(var i=0;i<response.data.data.length;++i){
						parties.push(response.data.data[i]);
					};	
				}
				if(response!=undefined&&response.data.paging!=undefined&&response.data.paging.next!=undefined){
					partyExist++;
					callfunction(response.data.paging.next);
				}

				else{

					defer.resolve(parties);
				}

			},function(reason){
				defer.reject(reason);
			});
		};


		
		callfunction(url);
		return defer.promise;
	}

	object.makepartyobject=function(profileObj,partyArray){
		var _key=profileObj._key;
		var fetchobj={};
		var terms="1. The organiser reserves the right to entry to the venue as per the policy of the venue. \n2. The organiser shall not be responsible for the refund of the amount paid by Partymon; if the right to enter is denied by the venue as per the policy. \n3. The e-ticket generated after booking / claiming (as the case may be) is merely a proof of booking but not the final ticket. The final ticket would be available physically from the entry-point of the venue after producing the e-ticket. \n4. The organiser can be contacted directly through “Direct Chat With Organiser” to seek any specific clarification or understand specific policy of venue, such as, dress code (if any), stag-entry / couple entry (as the case may be), timings, date and time confirmations etc.  \n5. Without prejudice to the foregoing, if satisfactory response is not received from organisers, then the Partymon can call our party-experts at the Party Hotline @ +91-97-11-971244.\n\nHope this is of assistance. Party hard with GoParties.";
		var partyobjArray=[];
		var feedObjArray=[];
		for(var i=0;i<partyArray.length;++i){
			try{
				var partyObj=partyArray[i];
				var obj=new Object();
				obj._key=partyObj.id;
				obj.fbid=partyObj.id;
				obj.user=_key
				obj.geo=[];
				obj.title=defaultValueAssignifNotExist(partyObj.name,"");
				obj.isbookingallowed=defaultValueAssignifNotExist(partyObj.can_guests_invite,"");
				obj.description=defaultValueAssignifNotExist(partyObj.description,"");
				obj.thumburl=defaultValueAssignifNotExist(partyObj.cover.source,"");
				obj.contactphone=defaultValueAssignifNotExist(profileObj.phone,"");
				obj.contactname=defaultValueAssignifNotExist(profileObj.name,"");
				obj.contactemail=defaultValueAssignifNotExist(profileObj.email,"");
				obj.genre=defaultValueAssignifNotExist(profileObj.genre,"");
				if(partyObj.place!=undefined&&partyObj.place.location!=undefined){
					obj.latitude=partyObj.place.location.latitude;
					obj.longitude=partyObj.place.location.longitude;
					obj.location=partyObj.place.location.street==undefined?"":partyObj.place.location.street+"  "+partyObj.place.location.city==undefined?"":partyObj.place.location.city+"  "+partyObj.place.location.country==undefined?"":partyObj.place.location.country;
					obj.address=partyObj.place.name;
					obj.country=defaultValueAssignifNotExist(partyObj.place.location.country,"");
					obj.city=defaultValueAssignifNotExist(partyObj.place.location.city,"");

				}
				else{
					obj.latitude=defaultValueAssignifNotExist(profileObj.latitude,"");
					obj.longitude=defaultValueAssignifNotExist(profileObj.longitude,"");
					obj.location=profileObj.location;
					obj.address=defaultValueAssignifNotExist(profileObj.address,"");
				}

				obj.geo.push(obj.latitude);
				obj.geo.push(obj.longitude);
				obj.performing=defaultValueAssignifNotExist(partyObj.owner.name,"");
				obj.startdate=new Date(partyObj.start_time).getTime();
				obj.enddate=defaultValueAssignifNotExist(new Date(partyObj.end_time).getTime(),obj.startdate+6*60*60*1000);
				if(obj.enddate==null||obj.enddate==undefined||partyObj.end_time==undefined){
					obj.enddate=obj.startdate+6*60*60*1000;
				}
					//||isNAN(obj.enddate)
					//console.log("obj.enddate=",obj.enddate);

					obj.updatedat=partyObj.updated_time*1000;
					obj.rank=calculatePartyRank(partyObj,profileObj);
					obj.banner=obj.thumburl;
					
					//slug functionality start from here
					var str=obj.title;
					if(str!=undefined){
						console.log("str",str);
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
						str=str+"-"+getRandomInt(10000000, 99999999);
						obj.slug=str.toLowerCase();
					}
					var location="";

					if(obj.location!=undefined){
						location="/"+obj.location;
					}

					location+="/party";
					location+="/"+obj.slug;
					obj.gpurl=location.replace(/ /g, "-");
					obj.gpurl=obj.gpurl.toLowerCase();

					obj.pricing=[
					{
						"segment": "Basic",
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
					obj.ispoa=true;
					obj.crowd_quotient=profileObj.crowd_quotient;
					if(obj.entry_terms==undefined||obj.entry_terms==null||obj.entry_terms==""){
						obj.entry_terms=terms;
					}
					obj.location=obj.location||"";
					obj.address=obj.address||"";
					obj.location=obj.location.replace('undefined', '');
					obj.address=obj.address.replace('undefined', '');
					
					var feedObj=new Object();
					feedObj._key=partyObj.id;
					feedObj.fbid=partyObj.id;
					feedObj.network="goparties";
					feedObj.ref=partyObj.id;
					feedObj.text="This party is creating waves. Check Now !!!";
					feedObj.type="party";
					feedObj.updatedat=obj.updatedat;
					feedObj.latitude=obj.latitude;
					feedObj.longitude=obj.longitude;
					feedObj.geo=[];
					feedObj.geo.push(obj.latitude);
					feedObj.geo.push(obj.longitude);

					partyobjArray.push(obj);
					feedObjArray.push(feedObj);
				}
				catch(e){
					console.log(e);
				}


			};

			fetchobj.partyobjArray=partyobjArray;
			fetchobj.feedObjArray=feedObjArray;
			return fetchobj;
		}

		return object;
	})