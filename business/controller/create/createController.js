var app=angular.module('create.module', ["ngMaterial","ngFileUpload","commonDirective.module","common.module"]);
app.controller('createController', ['$scope','$filter','findCountryAndCityIndex','getCreatedDeal','genreCoversionFactory','getPartyAndDealForUpdate','getDealAndPartyForCorrespondingId','$rootScope','$stateParams','ngToast','$location','$rootScope','publishPatryDealAndStandAlone','Upload','urlFactory','percentCalculationFactory','autoCompleteThemeGenreAndProfile','autoCompleteFactory','countryAndCityObjMaker','countryIntilization','$q','$http','latlongFactory','countryList',
	function($scope,$filter,findCountryAndCityIndex,getCreatedDeal,genreCoversionFactory,getPartyAndDealForUpdate,getDealAndPartyForCorrespondingId,$rootScope,$stateParams,ngToast,$location,$rootScope,publishPatryDealAndStandAlone,Upload,urlFactory,percentCalculationFactory,autoCompleteThemeGenreAndProfile,autoCompleteFactory,countryAndCityObjMaker,countryIntilization,$q,$http,latlongFactory,countryList){
		$scope.image={};
		$scope.minfromdate=new Date().getTime()-24*60*60*1000;
		$scope.id=$stateParams.id;
		$scope.isDealEdit=false;
		$scope.isPartyEdit=false;
		$scope.isAddDeal=false;
		$scope.myDeals=[];
		$scope.$watch('createParty.startdate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var start=$filter("formatchnageandConvertTimeStamp")(newValue)
				var end=start+21600000;
				if(!$scope.createParty.enddate||start>=$filter("formatchnageandConvertTimeStamp")($scope.createParty.enddate)){
					$scope.createParty.enddate=end;
				}
			}
		});

		$scope.$watch('createParty.enddate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var end=$filter("formatchnageandConvertTimeStamp")(newValue);
				var start=end-21600000;
				if($filter("formatchnageandConvertTimeStamp")($scope.createParty.startdate)>=end){
					$scope.createParty.startdate=start;
				}
			}
		});

		$scope.$watch('standAloneDeal.startdate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var start=$filter("formatchnageandConvertTimeStamp")(newValue)
				var end=start+21600000;
				if(!$scope.standAloneDeal.enddate||start>$filter("formatchnageandConvertTimeStamp")($scope.standAloneDeal.enddate)){
					$scope.standAloneDeal.enddate=end;
				}
			}
		});

		$scope.$watch('standAloneDeal.enddate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var end=$filter("formatchnageandConvertTimeStamp")(newValue);
				var start=end-21600000;
				if($filter("formatchnageandConvertTimeStamp")($scope.standAloneDeal.startdate)>=end){
					$scope.standAloneDeal.startdate=start;
				}
			}
		});

		$scope.getMyDeal=function(){
			getCreatedDeal.getMyDeal().then(function(response){
				$scope.myDeals=response.data.data.deal;
			},function(reason){
			});
		}
		$scope.updateCheck=function(){
			if($scope.id!=undefined&&$scope.id!=null&&$scope.id.length>0){
				$rootScope.activetab.toLowerCase().indexOf("deal")>=0?$scope.getDeal($scope.id):$scope.getParty($scope.id);
			}
		}
		$scope.$on("addDeal",function(event,obj){
			$scope.isAddDeal=true;
			$scope.addedDeal=obj;
			$scope.createParty.deal=$scope.addedDeal._key;
		});
		$scope.$on("getDeal",function(event,id){
			$scope.getDeal(id,true);
		});
		$scope.diableDeal=function(id){
			id=id||null;
			$scope.isAddDeal=false;
			$scope.createParty.deal="";
		}
		$scope.getDeal=function(id,isSelect){
			getDealAndPartyForCorrespondingId.getDeal(id).then(function(response){
				var temp=$scope.standAloneDeal;
				$scope.isDealEdit=true;
				if(isSelect!=true){
					$scope.standAloneDeal.title=response.title;
					$scope.standAloneDeal.locaiton=response.locaiton;
				//$scope.standAloneDeal.cities.city=response.city;
				$scope.standAloneDeal.contactemail=response.contactemail;
				//$scope.standAloneDeal.country.country=response.country;
				$scope.standAloneDeal.contactname=response.contactname;
				$scope.standAloneDeal.contactphone=response.contactphone;
				$scope.standAloneDeal.description=response.description;
				$scope.standAloneDeal.terms=response.terms;
				$scope.standAloneDeal.startdate=response.startdate;
				$scope.standAloneDeal.enddate=response.enddate;
				$scope.standAloneDeal.isactive=response.isactive;
				$scope.standAloneDeal.coverShow=response.thumburl;
				$scope.standAloneDeal.genres=genreCoversionFactory.makergenreArray(response.genre);
				$scope.standAloneDeal.themes=genreCoversionFactory.makergenreArray(response.theme);
				$scope.standAloneDeal.instore=response.instore;
				$scope.standAloneDeal.ispoa=response.ispoa;
				$scope.standAloneDeal.isonline=response.isonline;
				$scope.standAloneDeal.expirydate=response.expirydate;
				$scope.standAloneDeal.cover={};
				$scope.standAloneDeal.cover.thumburl=response.thumburl;
				$scope.standAloneDeal.redeemcode=response.redeemcode;
				$scope.standAloneDeal.redeemlink=response.redeemlink;
				$scope.standAloneDeal.claimlimit=response.claimlimit;
				for(var i=0;i<response.pricing.length;++i){
					$scope.standAloneDeal[response.pricing[i].segment]=response.pricing[i];
				}
			}
			else{
				$scope.dealId=response._key;
				$scope.createDeal.title=response.title;
				$scope.createDeal.locaiton=response.locaiton;
				//$scope.createDeal.cities.city=response.city;
				$scope.createDeal.contactemail=response.contactemail;
				//$scope.createDeal.country.country=response.country;
				$scope.createDeal.contactname=response.contactname;
				$scope.createDeal.contactphone=response.contactphone;
				$scope.createDeal.description=response.description;
				$scope.createDeal.terms=response.terms;
				$scope.createDeal.startdate=response.startdate;
				$scope.createDeal.enddate=response.enddate;
				$scope.createDeal.isactive=response.isactive;
				$scope.createDeal.coverShow=response.thumburl;
				$scope.createDeal.cover.thumburl=response.thumburl;
				$scope.createDeal.redeemcode=response.redeemcode;
				$scope.createDeal.redeemlink=response.redeemlink;
				$scope.createDeal.claimlimit=response.claimlimit;
				
			}
		},function(reason){

		});
		}
		$scope.getParty=function(id){
			getDealAndPartyForCorrespondingId.getParty(id).then(function(response){
				$scope.isPartyEdit=true;
				$scope.createParty.title=response.title;
				$scope.createParty.location=response.locaiton;
				$scope.createParty.startdate=response.startdate;
				$scope.createParty.enddate=response.enddate;
				$scope.createParty.description=response.description;
				$scope.createParty.terms=response.terms;
				$scope.createParty.isconcert=response.isconcert;
				$scope.createParty.isbookingAllow=response.isbookingAllow;
				$scope.createParty.contactemail=response.contactemail;
				$scope.createParty.contactname=response.contactname;
				$scope.createParty.contactphone=response.contactphone;
				$scope.createParty.genres=genreCoversionFactory.makergenreArray(response.genre);
				$scope.createParty.themes=genreCoversionFactory.makergenreArray(response.theme);
				$scope.createParty.profiles=genreCoversionFactory.makergenreArray(response.performing);
				$scope.createParty.coverShow=response.thumburl;
				$scope.createParty.instore=response.instore;
				$scope.createParty.ispoa=response.ispoa;
				$scope.createParty.isonline=response.isonline;
				$scope.createParty.cover={};
				$scope.createParty.cover.thumburl=response.thumburl;
				for(var i=0;i<response.pricing.length;++i){
					$scope.createParty[response.pricing[i].segment]=response.pricing[i];
				}
			},function(reason){

			});
		};

		$scope.countriesObj={};
		$scope.country="";
		$scope.createParty={};
		$scope.createParty.countriesObj={};
		$scope.createParty.cityObj={};
		$scope.createParty.country="";
		$scope.createDeal={};
		$scope.createDeal.countriesObj={};
		$scope.createDeal.cityObj={};
		$scope.createDeal.country="";
		$scope.standAloneDeal={};
		$scope.standAloneDeal.countriesObj={};
		$scope.standAloneDeal.cityObj={};
		$scope.standAloneDeal.country="";
		$scope.standAloneDeal.cover={};
		$scope.createDeal.cover={};
		$scope.createParty.cover={};
		$scope.createParty.startdate=new Date();//"00/00/2016 00:00";
		$scope.createParty.enddate="";//new Date();
		$scope.standAloneDeal.startdate=new Date();
		$scope.standAloneDeal.coverShow="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-album.jpg";
		$scope.createDeal.coverShow="images/partybannerdefault.png";
		$scope.createParty.coverShow="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-party-banner.jpg";
		$scope.$on("partyLocation",function(event,value){
			$scope.createParty.locaiton=value;
			$scope.$digest();
		});
		$scope.$on("dealLocation",function(event,value){
			$scope.createDeal.locaiton=value;
			$scope.$digest();
		});
		$scope.$on("standAlonedealLocation",function(event,value){
			$scope.standAloneDeal.locaiton=value;
			$scope.$digest();
		});
		$scope.fileprogress="";
		$scope.isUploading=false;
		$scope.uploadImage=function(cover,formName,image){
			$scope.isUploading=true;
			$scope.fileprogress=cover[0];
			if(cover!=undefined)
			{
				var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
				url+=urlFactory.getUrl("uploadfile").value;
				if(formName=="standAloneDeal")
				{
					$scope.standAloneDeal.cover=cover[0];
					$scope.standAloneDeal.coverShow=image.src;
				}
				else if(formName=="createParty"){
					$scope.createParty.cover=cover[0];
					$scope.createParty.coverShow=image.src;
				}
				else
				{
					$scope.createDeal.cover=cover[0];
					$scope.createDeal.coverShow=image.src;
				}

				console.log("url",url);
				(function(file) {
					file.name=cover[0].name;
					var data={};
					data.file=file;
					//data.details=true;
					file.status = Upload.upload({
						url: url, 
						data:data,
						file: file, 
					}).progress(function(evt) {
						if(formName=="standAloneDeal")
							$scope.calculatePercentage('standAloneDeal','banner',file.name);
						else if(formName=="createParty")
							$scope.calculatePercentage('createParty','cover',file.name);
						file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
					}).success(function(response) {
						$scope.isUploading=false;
						file.fileurl=response.data.file.fileurl;
						file.thumburl=response.data.file.fileurl;
						//console.log("file.fileurl",file.fileurl,file.thumburl,response);
						
					});
				})(cover[0]);

			}
			
		}
		$scope.init=function(){
			if($scope.id!="")
				percentCalculationFactory.init();
			$scope.createParty={};
			$scope.createParty.startdate=new Date().getTime();
			$scope.standAloneDeal={};
			$scope.standAloneDeal.startdate=new Date().getTime();
			$scope.createParty.themes=[];
			$scope.createParty.genres=[];
			$scope.standAloneDeal.themes=[];
			$scope.standAloneDeal.genres=[];
			$scope.createParty.profiles=[];
			$scope.createParty.Vip={};
			$scope.createParty.Vip.segment="Vip";
			$scope.createParty.Platinum={};
			$scope.createParty.Platinum.segment="Platinum";
			$scope.createParty.Gold={};
			$scope.createParty.Gold.segment="Gold";
			$scope.createParty.Silver={};
			$scope.createParty.Silver.segment="Silver";
			$scope.createParty.Bronze={};
			$scope.createParty.Bronze.segment="Bronze";
			$scope.standAloneDeal.Vip={};
			$scope.standAloneDeal.Vip.segment="Vip";
			$scope.standAloneDeal.Platinum={};
			$scope.standAloneDeal.Platinum.segment="Platinum";
			$scope.standAloneDeal.Gold={};
			$scope.standAloneDeal.Gold.segment="Gold";
			$scope.standAloneDeal.Silver={};
			$scope.standAloneDeal.Silver.segment="Silver";
			$scope.standAloneDeal.Bronze={};
			$scope.standAloneDeal.Bronze.segment="Bronze";
			$scope.standAloneDeal.coverShow="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-album.jpg";
			$scope.createDeal.coverShow="images/partybannerdefault.png";
			$scope.createParty.coverShow="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-party-banner.jpg";
			
			// countryIntilization.getCountryandCityArray()
			// .then(function(response){
			// 	var countriesObj=countryAndCityObjMaker.simplifyObj(response.data);
			// 	$scope.standAloneDeal.countriesObj=countriesObj;
			// 	$scope.createParty.countriesObj=countriesObj;
			// 	$scope.createDeal.countriesObj=countriesObj;
			// },function(error){
			// });


			$scope.updateCheck();
		}

		//<---Chips functionality start from here------>
		
		$scope.searchTheme=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
		}
		
		
		$scope.searchGenre=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
		}
		
		
		$scope.searchProfile=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadProfile");
		}

		$scope.$watchCollection("createParty.themes",function(newCol, oldCol, scope){
			$scope.calculatePercentage("createParty","theme",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createParty.profiles",function(newCol, oldCol, scope){
			$scope.calculatePercentage("createParty","genres",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createParty.genres",function(newCol, oldCol, scope){
			$scope.calculatePercentage("createParty","performer",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createParty.enddate",function(newCol, oldCol, scope){
			$scope.calculatePercentage('createParty','enddate',newCol);
		});
		$scope.$watchCollection("standAloneDeal.enddate",function(newCol, oldCol, scope){
			$scope.calculatePercentage('standAloneDeal','enddate',newCol);
		});

		$scope.$watchCollection("standAloneDeal.themes",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createParty","theme",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("standAloneDeal.genres",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("standAloneDeal","genres",newCol.length>0?"yes":"");
		});
		//percent calculation
		$scope.percent=0;
		$scope.calculatePercentage=function(formName,key,value,isCheck){
			//$scope.standAloneDeal.location=$("#txtlocation").val();
			if(isCheck==true){
				$scope.init();
			}
			if((isCheck==true&&$scope.id!="")||(isCheck==undefined)){
				percentCalculationFactory.calculatePercent(formName,key,value).then(function(response){
					$scope.percent+=response;
				},function(reason){

				});
			}

		}
			//<--Chips Functionality End from here---------->
		$scope.init();//initilize controller function called from here

		//publish functionality start from here
		
		$scope.standAloneDealPublish=function(isvalid,isDraft){
			if($scope.isUploading!=true){
				$scope.standAloneDeal.draft=isDraft;
				if($scope.isDealEdit==false){
					publishPatryDealAndStandAlone.publishDeal($scope.standAloneDeal,$scope.social,true).then(function(response){
						console.log("response",response);
						if(response.data.data!=undefined){
							var message=isDraft==false?"Successfully Create Standalone Deal":"Successfully Standalone Deal Save in Draft";
							ngToast.create(message);
							var location=isDraft==false?"createdStandAloneDeals/all":"createdStandAloneDeals/draft"
							$location.path(location);
						}
						else{
							ngToast.create({
								className:"warning",
								content:response.data.error.message
							});
						}
					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something Went Wrong"
						});
					});
				}
				else
				{
					getPartyAndDealForUpdate.updateDeal($scope.standAloneDeal,$scope.social,$scope.id).then(function(response){
						ngToast.create("successFully Deal Update");
						$location.path("createdStandAloneDeals/all");
					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something Went Wrong"
						});
					});
				}
			}
			else{
				ngToast.create({
					className:"warning",
					content:"Please Wait While Cover Uploading"
				});
			}
		}
		
		$scope.isSubmit=false;
		$scope.publishParty=function(isvalid,isDraft){
			if($scope.isUploading!=true){
				$scope.isSubmit=true;
				$scope.createParty.draft=isDraft;
				if(isvalid==true){
					if($scope.isPartyEdit==false){
						publishPatryDealAndStandAlone.publishParty($scope.createParty,$scope.social).then(function(response){
							if(response.data.data!=undefined){
								var message=isDraft==false?"Successfully Create Party":"Successfully Party Save in Draft";
								ngToast.create(message);
								$scope.isSubmit=false;
								var location=isDraft==false?"createdParties/all":"createdParties/draft"
								$location.path(location);
							}
							else{
								ngToast.create({
									className:"warning",
									content:response.data.error.message
								});
							}
						},function(reason){
							ngToast.create({
								className:"warning",
								content:"Something Went Wrong"
							});
						});
					}
					else
					{
						getPartyAndDealForUpdate.updateParty($scope.createParty,$scope.social,$scope.id).then(function(response){
							var message=isDraft==false?"Successfully Party Update":"Successfully Party Save in Draft";
							ngToast.create(message);
							var location=isDraft==false?"createdParties/all":"createdParties/draft"
							$scope.isSubmit=false;
							$location.path(location);
						},function(reason){
							ngToast.create({
								className:"warning",
								content:"Something Went Wrong"
							});
						});
					}
				}
			}

			else
			{
				ngToast.create({
					className:"warning",
					content:"Please Wait While Cover Uploading"
				});
				
			}

		}

		$scope.publishDeal=function(isvalid,isDraft){
			if($scope.isUploading!=true){
				$scope.createDeal.draft=false;
				$scope.addedDeal={};
				if($scope.isDealEdit==false){
					publishPatryDealAndStandAlone.publishDeal($scope.createDeal,$scope.social).then(function(response){
						ngToast.create("Successfully Add Deal");
						$scope.isAddDeal=true;
						$scope.addedDeal=response.data.data.deal;
						$scope.createParty.deal=$scope.addedDeal._key;
					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something Went Wrong"
						});
					});
				}
				else
				{
					getPartyAndDealForUpdate.updateDeal($scope.createDeal,$scope.social,$scope.dealId).then(function(response){
						ngToast.create("successFully Deal Update And Add");
						$scope.isAddDeal=true;
						$scope.addedDeal=response.data.data.deal;
					},function(reason){

					});
				}
			}
			else{
				ngToast.create({
					className:"warning",
					content:"Please Wait While Cover Uploading"
				});
			}
		}
//standAloneDeal Country Autocomplete Object 
// $scope.$watch("standAloneDeal.cities",function(newvalue,oldvalue){
// 	if(newvalue!=undefined&&newvalue!=null){
// 		$scope.calculatePercentage('standAloneDeal','cityname',newvalue.city);
// 	}
// });
// $scope.$watchCollection("standAloneDeal.enddate",function(newCol, oldCol, scope){
// 	$scope.calculatePercentage('standAloneDeal','enddate',newCol);
// });
// $scope.standAloneDeal.countrySearch=function(searchText){
// 	return autoCompleteFactory.filterData(searchText,$scope.standAloneDeal.countriesObj.countries).sort(function(x,y){
// 		return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 	});
// }
// $scope.standAloneDeal.changeSelectedCountry=function(country){
// 	$scope.standAloneDeal.resetCity();
// 	if(country!=""&&country!=null)
// 	{
// 		var cityObj=$scope.standAloneDeal.countriesObj.obj.find(function(obj){
// 			return country.id===obj.id;
// 		});
// 		cityObj.cities.forEach(function(city){
// 			city.value=city.city;
// 			city.display=city.city.toUpperCase();
// 		});
// 		$scope.standAloneDeal.cityObj=cityObj;
// 	}
// }

// $scope.standAloneDeal.resetCity=function(){
// 	$scope.standAloneDeal.searchCity="";
// }
// $scope.standAloneDeal.citySearch=function(searchText){
// 	if($scope.standAloneDeal.searchCountry==""||$scope.standAloneDeal.searchCountry==null)
// 		return "";
// 	else
// 	{
// 		if($scope.standAloneDeal.country!=""&&$scope.standAloneDeal.country!=null)
// 		{
// 			return autoCompleteFactory.filterData(searchText,$scope.standAloneDeal.cityObj.cities).sort(function(x,y){
// 				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 			});
// 		}
// 		return "";
// 	}
// }
// //End Here
// //Start createParty Country and city Autocomplete Logic
// $scope.$watch("createParty.cities",function(newvalue,oldvalue){
// 	if(newvalue!=undefined&&newvalue!=null){
// 		$scope.calculatePercentage('createParty','city',newvalue.city);
// 	}
// });
// $scope.createParty.countrySearch=function(searchText){
// 	return autoCompleteFactory.filterData(searchText,$scope.createParty.countriesObj.countries).sort(function(x,y){
// 		return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 	});
// }
// $scope.createParty.changeSelectedCountry=function(country){
// 	if(country!=""&&country!=null)
// 	{
// 		var cityObj=$scope.createParty.countriesObj.obj.find(function(obj){
// 			return country.id===obj.id;
// 		});
// 		cityObj.cities.forEach(function(city){
// 			city.value=city.city;
// 			city.display=city.city.toUpperCase();
// 		});
// 		$scope.createParty.cityObj=cityObj;
// 	}
// }
// $scope.createParty.resetCity=function(){
// 	$scope.createParty.searchCity="";
// }
// $scope.createParty.citySearch=function(searchText){
// 	if($scope.createParty.searchCountry==""||$scope.createParty.searchCountry==null)
// 		return "";
// 	else
// 	{
// 		if($scope.createParty.country!=""&&$scope.createParty.country!=null)
// 		{
// 			return autoCompleteFactory.filterData(searchText,$scope.createParty.cityObj.cities).sort(function(x,y){
// 				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 			});
// 		}
// 		return "";
// 	}
// }
// //End createParty Country and city Autocomplete Logic
// //Start createDeal Country and city Autocomplete Logic
// $scope.createDeal.countrySearch=function(searchText){
// 	return autoCompleteFactory.filterData(searchText,$scope.createDeal.countriesObj.countries).sort(function(x,y){
// 		return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 	});
// }
// $scope.createDeal.changeSelectedCountry=function(country){
// 	$scope.createDeal.resetCity();
// 	if(country!=""&&country!=null)
// 	{
// 		var cityObj=$scope.createParty.countriesObj.obj.find(function(obj){
// 			return country.id===obj.id;
// 		});
// 		cityObj.cities.forEach(function(city){
// 			city.value=city.city;
// 			city.display=city.city.toUpperCase();
// 		});
// 		$scope.createDeal.cityObj=cityObj;
// 	}
// }
// $scope.createDeal.resetCity=function(){
// 	$scope.createDeal.searchCity="";
// }
// $scope.createDeal.citySearch=function(searchText){
// 	if($scope.createDeal.searchCountry==""||$scope.createDeal.searchCountry==null)
// 		return "";
// 	else
// 	{
// 		if($scope.createDeal.country!=""&&$scope.createDeal.country!=null)
// 		{
// 			return autoCompleteFactory.filterData(searchText,$scope.createDeal.cityObj.cities).sort(function(x,y){
// 				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
// 			});
// 		}
// 		return "";
// 	}
// }

//End createDeal Country and city Autocomplete Logic
}]);
app.controller('partyDealCtrl', ['$scope','getDealFactory',function($scope,getDealFactory){
	$scope.deals=[];
	$scope.getDeals=function(){
		getDealFactory.getDeals(1).then(function(response){
			$scope.deals=response;
		},function(reason){

		});
	}
}]);

app.factory("findCountryAndCityIndex",function($q){
	var obj={};
	//($scope.standAloneDeal.cityObj,response.country)
	obj.findCountry=function(array,country){
		var defer=$q.defer();
		for(var i=0;i<array.length;i++){

		}
	}
	obj.findCity=function(array,obj){
		var defer=$q.defer();
	}
	return obj;
})



app.factory("getDealFactory",function($q,$http){
	var obj={};

	obj.getDeals=function(id){
		var defer=$q.defer();
		defer.resolve([1,2,3,4,5,6]);
		return defer.promise;
	}
	return obj;
});

app.factory("getDealAndPartyForCorrespondingId",function(ngToast,$http,$q,getPartyAndDealForUpdate){
	var obj={};
	obj.getDeal=function(id){
		var defer=$q.defer();
		getPartyAndDealForUpdate.getDeal(id).then(function(response){
			defer.resolve(response.data.data.detail.deal);
		},function(reason){
			ngToast.create({
				className:"warning",
				content:"Something Went Wrong"
			});
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.getParty=function(id){
		var defer=$q.defer();
		getPartyAndDealForUpdate.getParty(id).then(function(response){
			defer.resolve(response.data.data.detail.party);
			
		},function(reason){
			ngToast.create({
				className:"warning",
				content:"Something Went Wrong"
			});
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})





app.factory("getPartyAndDealForUpdate",function($http,$q,urlFactory,publishPatryDealAndStandAlone){
	var obj={};
	obj.getDeal=function(id){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("deal").value;
		url+="?id="+id;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.updateDeal=function(dataObj,social,id){
		var defer=$q.defer();
		dataObj=publishPatryDealAndStandAlone.makeDealObject(dataObj);
		dataObj.id=id;
		delete dataObj.cityObj;
		delete dataObj.countriesObj;
		delete dataObj.country;
		delete dataObj.coverShow;
		delete dataObj.draft;
		delete dataObj.cover;
		delete dataObj.Vip;
		delete dataObj.Platinum;
		delete dataObj.Gold;
		delete dataObj.Silver;
		delete dataObj.Bronze;
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("deal").value;
		$http.put(url,dataObj).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.getParty=function(id){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("party").value;
		url+="?id="+id;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.updateParty=function(objData,social,id){
		var defer=$q.defer();
		debugger;
		objData=publishPatryDealAndStandAlone.makePartyObject(objData);
		//objData._key=id;
		objData.id=id;
		delete objData.cityObj;
		delete objData.countriesObj;
		delete objData.country;
		delete objData.coverShow;
		delete objData.draft;
		delete objData.cover;
		delete objData.themes;
		delete objData.profiles;
		delete objData.genres;
		delete objData.Vip;
		delete objData.Platinum;
		delete objData.Gold;
		delete objData.Silver;
		delete objData.Bronze;
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("party").value;
		$http.put(url,objData).then(function(response){
			console.log("response=",response);
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	return obj;
});





app.factory("publishPatryDealAndStandAlone",function($http,$location,ngToast,genreCoversionFactory,$q,$window,urlFactory,dateFactory){
	var obj={};
	makeSpaceSepaatedArray=function(array){
		var string="";
		for(var i=0;i<array.length;i++){
			string+=array[i]+" ";
		}
		return string;
	}


	obj.makeDealObject=function(data,socialMediaObj,isStandAlone){
		socialMediaObj=socialMediaObj||null;
		data.user=$window.sessionStorage.getItem("userId");
		data.enddate=dateFactory.converttoTimeStamp(data.enddate,"dd-mm-yyyy");
		data.startdate=dateFactory.converttoTimeStamp(data.startdate,"dd-mm-yyyy");
		data.isactive=data.draft==true?null:true;
		data.thumburl=data.cover!=undefined?data.cover.thumburl:"";
		if(isStandAlone==true){
			data.latitude=$window.sessionStorage.getItem("standAlonedealLocationlatitude");
			data.longitude=$window.sessionStorage.getItem("standAlonedealLocationlongitude");
		}
		else{
			data.latitude=$window.sessionStorage.getItem("dealLocationlatitude");
			data.longitude=$window.sessionStorage.getItem("dealLocationlongitude");
		}

		if(data.hasOwnProperty("genres"))
			data.genre=genreCoversionFactory.convertGenreToString(data.genres);
		if(data.hasOwnProperty("themes"))
			data.theme=genreCoversionFactory.convertGenreToString(data.themes);

		data.address=data.locaiton;
		data.crowd_quotient=2.5;
		data.geo=[];
		data.geo[0]=parseFloat(data.latitude);
		data.geo[1]=parseFloat(data.longitude);
		debugger;
		debugger;
		data.pricing=[];
		data.pricing.push(data.Vip);
		data.pricing.push(data.Platinum);
		data.pricing.push(data.Gold);
		data.pricing.push(data.Silver);
		data.pricing.push(data.Bronze);
		if($window.sessionStorage.getItem("userInfo")!=null){
			var user=JSON.parse($window.sessionStorage.getItem("userInfo"));
			data.rank=user.rank;
		}
		else{
			data.rank=0;
		}
		data.redemptionlink=data.redeemlink;
		return Object.assign({}, data);
	}

	obj.makePartyObject=function(data,socialMediaObj){
		data.user=$window.sessionStorage.getItem("userId");
		data.enddate=dateFactory.converttoTimeStamp(data.enddate,"dd-mm-yyyy");
		data.startdate=dateFactory.converttoTimeStamp(data.startdate,"dd-mm-yyyy");
		data.isactive=data.draft==true?null:true;
		data.thumburl=data.cover!=undefined?data.cover.thumburl:"";
		data.latitude=$window.sessionStorage.getItem("partyLocationlatitude");
		data.longitude=$window.sessionStorage.getItem("partyLocationlongitude");
		
		if(data.hasOwnProperty("genres"))
			data.genre=genreCoversionFactory.convertGenreToString(data.genres);
		if(data.hasOwnProperty("themes"))
			data.theme=genreCoversionFactory.convertGenreToString(data.themes);

		if(data.hasOwnProperty("profiles"))
			data.performing=genreCoversionFactory.convertGenreToString(data.profiles);

		data.banner=data.thumburl;
		data.address=data.location;
		data.crowd_quotient=2.5;
		data.entry_terms=data.terms;
		data.geo=[];
		data.geo[0]=parseFloat(data.latitude);
		data.geo[1]=parseFloat(data.longitude);
		data.isbookingallowed=data.isbookingAllow;
		debugger;
		debugger;
		data.pricing=[];
		data.pricing.push(data.Vip);
		data.pricing.push(data.Platinum);
		data.pricing.push(data.Gold);
		data.pricing.push(data.Silver);
		data.pricing.push(data.Bronze);
		// data.ispoa=data.ispoa;
		// data.instore=data.instore
		if($window.sessionStorage.getItem("userInfo")!=null){
			var user=JSON.parse($window.sessionStorage.getItem("userInfo"));
			data.rank=user.rank;
		}
		else{
			data.rank=0;
		}
		
		return Object.assign({},data);
		
	}
	obj.publishParty=function(data,socialMediaObj){
		var objData={};
		var defer=$q.defer();
		objData=obj.makePartyObject(data,socialMediaObj);
		console.log("objData",objData);
		delete objData.cityObj;
		delete objData.countriesObj;
		delete objData.country;
		delete objData.coverShow;
		delete objData.draft;
		delete objData.cover;
		delete objData.themes;
		delete objData.profiles;
		delete objData.genres;
		delete objData.Vip;
		delete objData.Platinum;
		delete objData.Gold;
		delete objData.Silver;
		delete objData.Bronze;
		debugger;
		console.log("objData posting in party",objData);
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("party").value;
		$http.post(url,objData).then(function(response){
			defer.resolve(response);
		},function(reason){
			ngToast.create({
				className:'warning',
				content:"Something Went Wrong"	
			});
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.publishDeal=function(data,socialMediaObj,isStand){
		socialMediaObj=socialMediaObj||null;
		var dataObj={};
		var defer=$q.defer();
		dataObj=obj.makeDealObject(data,socialMediaObj,isStand);
		delete dataObj.cityObj;
		delete dataObj.countriesObj;
		delete dataObj.country;
		delete dataObj.coverShow;
		delete dataObj.draft;
		delete dataObj.cover;
		delete dataObj.Vip;
		delete dataObj.Platinum;
		delete dataObj.Gold;
		delete dataObj.Silver;
		delete dataObj.Bronze;
		console.log("dataObj",dataObj);
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("deal").value;
		$http.post(url,dataObj).then(function(response){
			console.log("response come from publish deal=",response);
			defer.resolve(response);
		},function(reason){
			ngToast.create({
				className:'warning',
				content:"Something Went Wrong"	
			});
			defer.reject(reason);
		});
		return defer.promise;
	}
	
	return obj;
});

app.factory("coverUploadFactory",function(Upload,$http,$q,urlFactory){
	var obj={};

	return obj;
});

app.directive("selectDealCard",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:{
			dealObj:'=',
			getDeal:'&'
		},
		templateUrl:'directive/create/selectDealCard.html',
		link:function($scope,element,attr,controller,transclude){
			$scope.getDeal=function(id){
				$scope.$emit("getDeal",id);
			}
			$scope.selectDeal=function(obj){
				$scope.$emit("addDeal",obj);
			}
			
		}
	}
})

app.factory("percentCalculationFactory",function($q){
	var obj={};
	var data={};
	data.createParty=[
	{
		key:"theme",
		value:20,
		flag:true
	},
	{
		key:"genres",
		value:20,
		flag:true
	},
	{
		key:"performer",
		value:20,
		flag:true
	},
	{
		key:"title",
		value:5,
		flag:true
	},
	{
		key:"description",
		value:10,
		flag:true
	},
	{
		key:"cover",
		value:5,
		flag:true
	},
	{
		key:"city",
		value:5,
		flag:true
	},
	{
		key:"address",
		value:5,
		flag:true
	},
	{
		key:"enddate",
		value:5,
		flag:true
	},
	{
		key:"terms",
		value:5,
		flag:true
	},
	{
		key:"contactname",
		value:1,
		flag:true
	},
	{
		key:"contactemail",
		value:2,
		flag:true
	},
	{
		key:"contactphone",
		value:2,
		flag:true
	}];
	data.standAloneDeal=[
	{
		key:"title",
		value:12.5,
		flag:true
	},
	{
		key:"description",
		value:12.5,
		flag:true
	},
	{
		key:"banner",
		value:12.5,
		flag:true
	},
	{
		key:"terms",
		value:12.5,
		flag:true
	},
	{
		key:"address",
		value:12.5,
		flag:true
	},
	{
		key:"enddate",
		value:12.5,
		flag:true
	},
	{
		key:"cityname",
		value:12.5,
		flag:true
	},
	{
		key:"contactname",
		value:5,
		flag:true
	},
	{
		key:"contactphone",
		value:10,
		flag:true
	},
	{
		key:"contactemail",
		value:10,
		flag:true
	}
	];
	obj.init=function(){
		for(var i=0;i<data.createParty.length;i++)
			data.createParty[i].flag=true;
		for(var i=0;i<data.standAloneDeal.length;i++)
			data.standAloneDeal[i].flag=true;


	}
	obj.calculatePercent=function(formName,key,value){
		var defer=$q.defer();
		var array=data[formName].filter(function(obj){
			return obj.key==key;
		});
		if(value!=undefined&&value!=null&&value.length>0)
		{
			if(array[0].flag==false)
			{
				defer.resolve(0);
			}
			obj.setArrayflag(formName,key,value,false);
			defer.resolve(array[0].value);
		}
		else
		{
			if(array[0].flag==false)
			{
				obj.setArrayflag(formName,key,value,true);
				defer.resolve(-(array[0].value));
			}
			else
			{
				defer.resolve(0);
			}
		}
		return defer.promise;
	}

	obj.setArrayflag=function(formName,key,value,flag){
		for(var i in data[formName])
		{
			if(data[formName][i].key==key)
			{
				data[formName][i].flag=flag;
			}
		}
	}
	return obj;

})


app.service("countryIntilization",function(countryList,$q){
	var countryArray={};
	var resolveArray={};
	var defer=$q.defer();
	this.getCountryandCityArray=function(){
		if(Object.getOwnPropertyNames(countryArray).length=="")
		{
			countryList.getCountry()
			.then(function(response){
				countryArray=response.data.data;
				defer.resolve(response.data);
			},function(error){
				defer.reject(error);
			});
		}
		return defer.promise;
	}
});
app.service("countryAndCityObjMaker",function($q){
	this.simplifyObj=function(countryArray)
	{
		var finalArray={};
		countryArray=countryArray.countries;
		var countries=[];
		var cities=[];
		for(var i=0;i<countryArray.length;i++)
		{
			countries.push({
				country:countryArray[i].country,
				id:countryArray[i].id,
				value:countryArray[i].country,
				display:countryArray[i].country.toUpperCase()
			});
		}
		finalArray.obj=countryArray;
		finalArray.countries=countries;
		return finalArray;
	}
});

app.factory("autoCompleteFactory",function(){
	var obj={};
	obj.filterData=function(query,data){
		if(query==null||query=="")
		{
			return data
		}
		var results = query ? data.filter(function(state){
			var lowercaseQuery = angular.lowercase(query);
			return (state.value.toLowerCase().indexOf(lowercaseQuery) === 0);
		}) :  data;
		return results;
	};
	return obj;
})

app.directive("coverPicUpload",function($parse){
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
				var formName=attrs.formtype;
				var reader = new FileReader;
				reader.readAsDataURL(element[0].files[0]);
				$scope.$apply(function(){
					for(var i=0;i<element[0].files.length;i++)
					{
						fileArray.push(element[0].files[i]);
					}
					reader.onload=function() {
						var image=new Image();
						image.src=reader.result;
						$scope.uploadImage(fileArray,formName,image);
					};
				});
			});
		}
	}
});
app.directive("checkIfConcert", function(){
	return {
		restrict:'EA',
		link:function($scope, element, attr, controller, transclude) {

			$('#party-title').on('keypress', function(){

				if( $(this).val().length > 0 ) {
					$(this).parent().next('.gp-form-group').slideDown(200);
				}
				else {
					$(this).parent().next('.gp-form-group').slideUp(200);
				}

			}).on('keyup', function(){

				if( $(this).val().length > 0 ) {
					$(this).parent().next('.gp-form-group').slideDown(200);	
				}
				else {
					$(this).parent().next('.gp-form-group').slideUp(200);
				}

			});	
		}
	}
});
app.directive("createFormSidebar",function(){
	return{
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			$("body").on("click",".edit-deal-action",function(){
				$("#addDealAnchor")[0].click()
			});
			var window_width = $(window).width();

			var site_header_height = $('#site-header').innerHeight();

			if( window_width > 767 ) {
				var create_frm_sidebar_offset_top = $('.create-frm-sidebar').offset().top;
				var sticky_create_frm_sidebar = function(){
					var scroll_top = $(window).scrollTop() + site_header_height + 40 /*+ page_header_height + 50 Page Header Margin Bottom */;
					//var fixed_sidebar_right_offset = $('.create-frm-sidebar').closest('.container-fluid').width() * .03;
					var fixed_sidebar_right_offset = $('.create-frm-sidebar').closest('.container-fluid').css('margin-right');// * .03;

					//console.log(fixed_sidebar_right_offset);
					//console.log(create_frm_sidebar_offset_top);
					if (scroll_top >  create_frm_sidebar_offset_top) {
						$('.create-frm-sidebar').addClass('fixed-beside-create-frm');
						$('.fixed-beside-create-frm').css({ 'top': (site_header_height + 40), 'right': fixed_sidebar_right_offset });
					}
					else {
						$('.create-frm-sidebar').removeClass('fixed-beside-create-frm');	
						$('.create-frm-sidebar').css({ 'top': '0', 'right':'0' });  
					}

				};
				
				sticky_create_frm_sidebar();

				$('.create-frm-sidebar').removeClass('fixed-beside-create-frm');
				
				$(window).scroll(function() {
					sticky_create_frm_sidebar();
				});
			}

			
			// Tooltip Initialization 
			$('[data-toggle="tooltip"]').tooltip({
				container: 'body',
				placement: 'auto bottom',
				trigger: 'hover'	
			});


		}}
	});

app.directive("hasScrollingTabs",function(){
	return{
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			function animateScoll() {
				$('.create-frm-toggle').bind('click', function() {
			        //event.preventDefault();
			        var $anchor = $(this);
			        $('html, body').stop().animate({
			        	scrollTop: ($($anchor.attr('data-target-container')).offset().top - 90)
			        }, 1500, 'easeInOutExpo');

			        //var dataOffset = $($anchor.attr('data-target')).offset().top;
			        //console.log(dataOffset);
			        
			    });
			};

			angular.getTestability(element).whenStable(function() {
				animateScoll();				
			});
		}
	};
});


//Raw Code Start From Here
app.controller('partyCityController', ['$scope','autoCompleteFactory','countryAndCityObjMaker','countryIntilization',
	function($scope,autoCompleteFactory,countryAndCityObjMaker,countryIntilization){
		$scope.createParty.countriesObj={};
		$scope.createParty.cityObj={};
		$scope.createParty.country="";

		$scope.init=function(){

			countryIntilization.getCountryandCityArray()
			.then(function(response){
				$scope.createParty.countriesObj=countryAndCityObjMaker.simplifyObj(response.data);
			},function(error){
			});
		}
		$scope.init();
		$scope.createParty.countrySearch=function(searchText){
			return autoCompleteFactory.filterData(searchText,$scope.createParty.countriesObj.countries).sort(function(x,y){
				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
			});
		}
		$scope.createParty.changeSelectedCountry=function(country){
			if(country!=""&&country!=null)
			{
				var cityObj=$scope.createParty.countriesObj.obj.find(function(obj){
					return country.id===obj.id;
				});
				cityObj.cities.forEach(function(city){
					city.value=city.city;
					city.display=city.city.toUpperCase();
				});
				$scope.createParty.cityObj=cityObj;
			}
		}
		$scope.createParty.resetCity=function(){
			$scope.createParty.searchCity="";
		}
		$scope.createParty.citySearch=function(searchText){
			if($scope.createParty.searchCountry==""||$scope.createParty.searchCountry==null)
				return "";
			else
			{
				if($scope.createParty.country!=""&&$scope.createParty.country!=null)
				{
					return autoCompleteFactory.filterData(searchText,$scope.createParty.cityObj.cities).sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});
				}
				return "";
			}
		}
	}]);
app.controller('dealCityController', ['$scope','autoCompleteFactory','countryAndCityObjMaker','countryIntilization',
	function($scope,autoCompleteFactory,countryAndCityObjMaker,countryIntilization){
		$scope.createDeal.countriesObj={};
		$scope.createDeal.cityObj={};
		$scope.createDeal.country="";
		$scope.init=function(){
			countryIntilization.getCountryandCityArray()
			.then(function(response){
				$scope.createDeal.countriesObj=countryAndCityObjMaker.simplifyObj(response.data);
			},function(error){
			});
		}
		$scope.init();
		$scope.createDeal.countrySearch=function(searchText){
			return autoCompleteFactory.filterData(searchText,$scope.createDeal.countriesObj.countries).sort(function(x,y){
				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
			});
		}
		$scope.createDeal.changeSelectedCountry=function(country){
			$scope.createDeal.resetCity();
			if(country!=""&&country!=null)
			{
				var cityObj=$scope.createParty.countriesObj.obj.find(function(obj){
					return country.id===obj.id;
				});
				cityObj.cities.forEach(function(city){
					city.value=city.city;
					city.display=city.city.toUpperCase();
				});
				$scope.createDeal.cityObj=cityObj;
			}
		}
		$scope.createDeal.resetCity=function(){
			$scope.createDeal.searchCity="";
		}
		$scope.createDeal.citySearch=function(searchText){
			if($scope.createDeal.searchCountry==""||$scope.createDeal.searchCountry==null)
				return "";
			else
			{
				if($scope.createDeal.country!=""&&$scope.createDeal.country!=null)
				{
					return autoCompleteFactory.filterData(searchText,$scope.createDeal.cityObj.cities).sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});
				}
				return "";
			}
		}
	}]);
app.controller('standAloneDealCityController', ['$scope','autoCompleteFactory','countryAndCityObjMaker','countryIntilization',
	function($scope,autoCompleteFactory,countryAndCityObjMaker,countryIntilization){
		$scope.standAloneDeal.countriesObj={};
		$scope.standAloneDeal.cityObj={};
		$scope.standAloneDeal.country="";
		$scope.init=function(){
			countryIntilization.getCountryandCityArray()
			.then(function(response){
				$scope.standAloneDeal.countriesObj=countryAndCityObjMaker.simplifyObj(response.data);
			},function(error){
			});
		}
		$scope.init();
		$scope.standAloneDeal.countrySearch=function(searchText){
			return autoCompleteFactory.filterData(searchText,$scope.standAloneDeal.countriesObj.countries).sort(function(x,y){
				return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
			});
		}
		$scope.standAloneDeal.changeSelectedCountry=function(country){
			$scope.standAloneDeal.resetCity();
			if(country!=""&&country!=null)
			{
				var cityObj=$scope.standAloneDeal.countriesObj.obj.find(function(obj){
					return country.id===obj.id;
				});
				cityObj.cities.forEach(function(city){
					city.value=city.city;
					city.display=city.city.toUpperCase();
				});
				$scope.standAloneDeal.cityObj=cityObj;
			}
		}
		$scope.standAloneDeal.resetCity=function(){
			$scope.standAloneDeal.searchCity="";
		}
		$scope.standAloneDeal.citySearch=function(searchText){
			if($scope.standAloneDeal.searchCountry==""||$scope.standAloneDeal.searchCountry==null)
				return "";
			else
			{
				if($scope.standAloneDeal.country!=""&&$scope.standAloneDeal.country!=null)
				{
					return autoCompleteFactory.filterData(searchText,$scope.standAloneDeal.cityObj.cities).sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});
				}
				return "";
			}
		}
	}]);

app.directive("scrollDisable",function(){
	return{
		link:function($scope,element,attr){
			
			function preventDefault(e) {
				e.preventDefault();
			}

			element.on('wheel', preventDefault);
			element.on('touchmove', preventDefault);


			return function() {
				element.off('wheel', preventDefault);
				element.off('touchmove', preventDefault);
			}
		}
	}

});


app.directive("scroll", function ($window) {
	return function(scope, element, attrs) {
		angular.element($window).bind("scroll", function() {
			scope.visible = true;
            //$window.scrollTo(0, 0);
            scope.$apply();
        });
	};
});