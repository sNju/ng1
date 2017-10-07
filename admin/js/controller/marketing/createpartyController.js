var app=angular.module("main121.module",["ngFileUpload"]);
//'ngMaterial', 'ngMessages'
app.controller('createpartyController', ['$scope','Upload','$filter','genreCoversionFactory','autoCompleteThemeGenreAndProfile','$stateParams','$rootScope','httpService','getuserid','$location'
	,function($scope,Upload,$filter,genreCoversionFactory,autoCompleteThemeGenreAndProfile,$stateParams,$rootScope,httpService,getuserid,$location){
		$scope.partyobj={};
		$scope.partyobj.genre=[];
		$scope.partyobj.user=$rootScope.userinfo._key;
		$scope.partyobj.theme=[];
		$scope.partyobj.performing=[];
		$scope.partyobj.pricing=[];
		$scope.getparty=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/party/?id="+id;
			httpService.get(url).then(function(response){
				if(response.data!=undefined && response.error==undefined){
					$scope.isedit=true;
					var party=response.data.detail.party;
					party.genre=genreCoversionFactory.makergenreArray(party.genre);
					party.theme=genreCoversionFactory.makergenreArray(party.theme);
					party.performing=genreCoversionFactory.makergenreArray(party.performing);
					party.startdate=$filter("timestamptodatetimepickerformat")(party.startdate);
					party.enddate=$filter("timestamptodatetimepickerformat")(party.enddate);
					if(party.deal!=undefined) {
						party.deal.startdate=$filter("timestamptodatetimepickerformat")(party.deal.startdate);
						party.deal.enddate=$filter("timestamptodatetimepickerformat")(party.deal.enddate);
					}
					$scope.partyobj=party;
				}
				else if(response.error!=undefined && response.data==undefined){
					$scope.$emit("status","Something went Wrong","alert-danger",undefined,undefined);
					$location.url('/partieslisting/'+id);
				}
			},function(reason){

			});
		}
		$scope.searchTheme=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
		}


		$scope.searchGenre=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
		}


		$scope.searchProfile=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadProfile");
		}

		$scope.partyobj.geo=[];
		$scope.$on("txtlocation",function($event,data){
			$scope.partyobj.address=data.value;
			$scope.partyobj.latitude=data.latitude;
			$scope.partyobj.longitude=data.longitude;
			$scope.partyobj.geo[0]=$scope.partyobj.latitude;
			$scope.partyobj.geo[1]=$scope.partyobj.longitude;
		});


		$scope.imageupload=function(file){
			$rootScope.internalhttpcall=true;
			var url=$rootScope.devapiBaseUrl;
			url+="/uploadfile";
			(function(file) {
				var data={};
				data.file=file;
				file.status = Upload.upload({
					url: url,
					data:data,
					file: file,
					headers:{
						authorization:"public"
					}
				}).progress(function(evt) {
					file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
				}).success(function(response) {
					$scope.partyobj.banner=response.data.file.fileurl;
					$rootScope.internalhttpcall=false;
				});
			})(file);
		}
		$scope.$on("createparty",function($event,object){
			$scope.partyobj.banner=object.image.src;
			$scope.imageupload(object.images[0]);
			$scope.$digest();
		});

		$scope.updateparty=function(data){
			var url=$rootScope.apiBaseUrl;
			url+="/party/?id="+data._key;
			httpService.put(url,data).then(function(response){
				console.log("updateres",response);
				if(response.data!=undefined){
					var address=$rootScope.userinfo.role!="business"?'/partieslisting?user='+response.data.party.user:'/bparties?user='+$rootScope.userinfo._key;
					console.log("myaddrress",address);
					$scope.$emit("status","Party updated successfully","alert-success",response.data,address);
				}
				else{
					$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
				}

			},function(reason){

			});

		}

		$scope.submitparty=function(data){
			if($scope.user_id!=undefined){
				data.user=$scope.user_id;
				var url=$rootScope.apiBaseUrl;
				url+="/party";
				httpService.post(url,data).then(function(response){
					if(response.data!=undefined){
						var address=$rootScope.userinfo.role!="business"?'/partieslisting/'+response.data.party.user:'/bparties?user='+$rootScope.userinfo._key;

						$scope.$emit("status","successfully update party","alert-success",response.data,address);
					}
					else{
						$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
					}
				},function(reason){
					console.log("response",reason);
				});
			}
			else{
				$scope.$emit("status","Please Retry submitting form","alert-danger",undefined,undefined);
			}

		}

		$scope.deletesegment=function(index){
			$scope.partyobj.pricing.splice(index,1);
		}

		$scope.addsegment=function(){
			var obj=new Object();
			obj.male={};
			obj.male.available=false;
			obj.female={};
			obj.female.available=false;
			obj.couple={};
			obj.couple.available=false;
			$scope.partyobj.pricing.push(obj);
		}

		$scope.toggleDeal=function(){
			if($scope.partyobj.deal!=undefined)
				delete $scope.partyobj.deal;
			else{
				$scope.partyobj.deal={};
				start_date=$scope.partyobj.startdate;
				end_date=$scope.partyobj.enddate;
				if(start_date!=undefined && end_date!=undefined){
					$('#dealstartdate').bootstrapMaterialDatePicker('setMinDate', start_date).bootstrapMaterialDatePicker('setMaxDate', end_date);
					$('#dealenddate').bootstrapMaterialDatePicker('setMinDate', start_date).bootstrapMaterialDatePicker('setMaxDate', end_date);
				}
			}
		}

		$scope.makepartyobject=function(data,isvalid){
			if(data.isonline==true || data.ispoa==true){
				if(isvalid==true){
					var createparty=Object.assign({},data);

					
					if(createparty.startdate!=undefined){
						createparty.startdate=$filter("dateddmmyyyytotimestamp")(createparty.startdate);
					}
					if(createparty.enddate!=undefined){
						createparty.enddate=$filter("dateddmmyyyytotimestamp")(createparty.enddate);
					}
					if(createparty.deal!=undefined){
						if(createparty.deal.startdate!=undefined){
							createparty.deal.startdate=$filter("dateddmmyyyytotimestamp")(createparty.deal.startdate);
						}
						if(createparty.deal.enddate!=undefined){
							createparty.deal.enddate=$filter("dateddmmyyyytotimestamp")(createparty.deal.enddate);
						}
					}
					createparty.genre=genreCoversionFactory.convertGenreToString(createparty.genre);
					createparty.theme=genreCoversionFactory.convertGenreToString(createparty.theme);
					createparty.performing=genreCoversionFactory.convertGenreToString(createparty.performing);
					if(createparty.pricing==undefined || createparty.pricing.length==0){
						createparty.pricing=[ {
							"segment": "",
							"amount": 0,
							"seatlimit": "0",
							"gpcoinslimit": "0",
							"available": false,
							"male": {
								"amount": 0,
								"available": false
							},
							"female": {
								"amount": 0,
								"available": false
							},
							"couple": {
								"amount": 0,
								"available": false
							}
						}
						]
					}

					if($scope.isedit==true){
						$scope.updateparty(createparty);
						
					}
					else{
						$scope.submitparty(createparty);
					}
				}
			}
			else{
				isvalid=false;
				$scope.$emit("status","Please Select Mode of Payment to proceed","alert-danger",undefined,undefined);
			}

		}

		$scope.init=function(){
			$scope.isedit=false;
			if($stateParams.id!=undefined && $stateParams.id!=""){
				$scope.getparty($stateParams.id);
			}
			else{
				var id= getuserid.getId();
				if(id==undefined){
					$location.url('/');
				}
				else{
					$scope.user_id=id;
				}
			}
		}

		$scope.init();

	}]);

app.directive("validateDate",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function () {
				$('#enddate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'dddd DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
				{
					$('#startdate').bootstrapMaterialDatePicker('setMaxDate', date);
				});

				$('#startdate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'dddd DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
				{
					$('#enddate').bootstrapMaterialDatePicker('setMinDate', date);
				});

				$('#dealenddate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'dddd DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
				{
					$('#dealstartdate').bootstrapMaterialDatePicker('setMaxDate', date);
				});

				$('#dealstartdate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'dddd DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
				{
					$('#dealenddate').bootstrapMaterialDatePicker('setMinDate', date);
				});

             });//end ready function
		}
	}
});