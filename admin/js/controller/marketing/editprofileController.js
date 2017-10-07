var app=angular.module("main.module");
app.controller('editprofileController', ['$scope','Upload','$filter','genreCoversionFactory','autoCompleteThemeGenreAndProfile','$stateParams','$rootScope','httpService'
	,function($scope,Upload,$filter,genreCoversionFactory,autoCompleteThemeGenreAndProfile,$stateParams,$rootScope,httpService){
		$scope.$on("txtlocation",function($event,data){
			$scope.profileobj.address=data.value;
			$scope.profileobj.latitude=data.latitude;
			$scope.profileobj.longitude=data.longitude;
			$scope.profileobj.geo.push($scope.profileobj.latitude);
			$scope.profileobj.geo.push($scope.profileobj.longitude);
		});

		$scope.profileobj={};
		$scope.profileobj.genre=[];
		$scope.profileobj.theme=[];
		$scope.profileobj.performing=[];

		$scope.getprofile=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/profile/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=null){
					$scope.isedit=true;
					var profile=response.data.detail.profile;
					$scope.parse(profile);
				}

			},function(reason){

			});
		}


		$scope.parse=function(profile){
			profile.genre=genreCoversionFactory.makergenreArray(profile.genre);
			profile.theme=genreCoversionFactory.makergenreArray(profile.theme);
			profile.performing=genreCoversionFactory.makergenreArray(profile.performing);
			if(profile.booking==undefined||profile.booking.header==undefined){
				if(profile.booking==undefined)
					profile.booking={};
				profile.booking.header={}
			}

			if(profile.booking.footer==undefined){
				profile.booking.footer={};
			}

			var header=[];
			var footer=[];
			for (var key in profile.booking.header) {      
				if (profile.booking.header.hasOwnProperty(key))
					header.push({
						"key":key,
						"val":profile.booking.header[key]
					});
			}

			for (var key in profile.booking.footer) {      
				if (profile.booking.footer.hasOwnProperty(key))
					footer.push({
						"key":key,
						"val":profile.booking.footer[key]
					});
			}

			debugger;
			profile.booking.header=header;
			profile.booking.footer=footer;
			profile.booking.starttime=$filter("timestamptotime")(profile.booking.starttime);
			profile.booking.endtime=$filter("timestamptotime")(profile.booking.endtime);
			console.log("profile",profile);
			if(profile.manager==undefined){
				profile.manager=[];
			}
			if(profile.deal!=undefined){
				profile.deal.startdate=$filter("timestamptodatetimepickerformat")(profile.deal.startdate);
				profile.deal.enddate=$filter("timestamptodatetimepickerformat")(profile.deal.enddate);
			}
			$scope.profileobj=profile;

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

		$scope.$on("txtlocation",function($event,data){
			$scope.profileobj.address=data.value;
			$scope.profileobj.latitude=data.latitude;
			$scope.profileobj.longitude=data.longitude;
			$scope.profileobj.geo.push($scope.profileobj.latitude);
			$scope.profileobj.geo.push($scope.profileobj.longitude);
		});


		$scope.imageupload=function(file,target){
			$rootScope.$emit("internalhttpcall",true);
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
					$rootScope.$emit("internalhttpcall",false);
					console.log("response upload",response);
					$scope.profileobj[target]=response.data.file.fileurl;

				});
			})(file);
		}
		$scope.$on("profilecover",function($event,object){
			$scope.profileobj.cover=object.image.src;
			$scope.imageupload(object.images[0],'cover');
			$scope.$digest();
		});

		$scope.$on("profilepic",function($event,object){
			$scope.profileobj.profile_pic=object.image.src;
			$scope.imageupload(object.images[0],'profile_pic');
			$scope.$digest();
		});

		$scope.updateprofile=function(data){
			var url=$rootScope.apiBaseUrl;
			url+="/profile/?id="+data._key;
			httpService.put(url,data).then(function(response){
				if(response.data!=undefined){
					var address=$scope.isba==true?'bprofile':'/profiles';
					$scope.$emit("status","successfully update profile","alert-success",response.data,address);
					if($scope.isba==true){
						$scope.$emit("userinfo",response.data.profile);
					}
				}
				else{
					$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
				}

			},function(reason){

			});
		}

		$scope.submitprofile=function(data){
			var url=$rootScope.apiBaseUrl;
			url+="/profile";
			httpService.post(url,data).then(function(response){
				if(response.data!=undefined){
					var address=$scope.isba==true?'bprofile':'/profiles';
					$scope.$emit("status","successfully update profile","alert-success",response.data,address);
				}
				else{
					$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
				}
			},function(reason){

			});
		}


		$scope.makeprofileobject=function(data,isvalid){
			if(isvalid==true){
				var object=JSON.parse(JSON.stringify(data))
				object.genre=genreCoversionFactory.convertGenreToString(object.genre);
				object.theme=genreCoversionFactory.convertGenreToString(object.theme);
				var header={};
				var footer={};

				for(index in object.booking.header){
					var obj=object.booking.header[index];
					if(angular.equals({}, obj)!=true)
						header[obj.key]=obj.val;
				}


				for(index in object.booking.footer){
					var obj=object.booking.footer[index];
					if(angular.equals({}, obj)!=true)
						footer[obj.key]=obj.val;
				}

				object.booking.header=header;
				object.booking.footer=footer;
				object.booking.starttime=$filter("timetotimestamp")(object.booking.starttime);
				object.booking.endtime=$filter("timetotimestamp")(object.booking.endtime);

				if(object.deal!=undefined){
					if(object.deal.startdate!=undefined){
						object.deal.startdate=$filter("dateddmmyyyytotimestamp")(object.deal.startdate);
					}
					if(object.deal.enddate!=undefined){
						object.deal.enddate=$filter("dateddmmyyyytotimestamp")(object.deal.enddate);
					}
				}
				
				if($scope.isedit==true){
					$scope.updateprofile(Object.assign({},object));
				}
				else{
					$scope.submitprofile(Object.assign({},object));
				}
			}
		}


		$scope.deletesegment=function(array,index){
			array.splice(index,1);
		}

		$scope.addsegment=function(array){
			debugger;
			array.push({});
		}

		$scope.addmanager=function(array){
			if(array==undefined)
				array=[];
			array.push({});			
		}

		$scope.toggleDeal=function(){
			if($scope.profileobj.deal!=undefined)
				delete $scope.profileobj.deal;
			else{
				$scope.profileobj.deal={};
			}
		}

		$scope.init=function(){
			$scope.isedit=false;
			$scope.isba=false;
			if($stateParams.id!=undefined){
				$scope.getprofile($stateParams.id);
			}
			else{
				$scope.isba=true;
				$scope.getprofile($rootScope.userinfo._key);
				//$scope.parse($rootScope.userinfo);
			}
		}

		$scope.init();


	}]);
