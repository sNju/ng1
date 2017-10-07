var app=angular.module("createdeal.module",[]);
app.controller("createstandaloneController",["$scope","$rootScope","$location","genreCoversionFactory","$stateParams","httpService","ngToast","postdeal","$window","Upload","autoCompleteThemeGenreAndProfile","$filter",
	function($scope,$rootScope,$location,genreCoversionFactory,$stateParams,httpService,ngToast,postdeal,$window,Upload,autoCompleteThemeGenreAndProfile,$filter){
		$scope.id=$stateParams.id;
		$scope.init=function(){
			$scope.createdeal={};
			$scope.createdeal.geo=[];
			$scope.minfromdate=new Date().getTime()-24*60*60*1000;
			$scope.createdeal.startdate=new Date().getTime();
			$scope.createdeal.theme=[];
			$scope.createdeal.performing=[];
			$scope.createdeal.genre=[];
			$scope.createdeal.pricing=[];
			$scope.createdeal.ispoa=true;
			$scope.createdeal.crowd_quotient=2.5;
			$scope.createdeal.isactive=true;
			$scope.createdeal.pricing.push({segment:"Bronze"});
			$scope.createdeal.pricing.push({segment:"Gold"});
			$scope.createdeal.pricing.push({segment:"Platinum"});
			$scope.createdeal.pricing.push({segment:"Silver"});
			$scope.createdeal.pricing.push({segment:"Vip"});
			$scope.isedit=false;
			$scope.createdeal.banner="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-deal-banner.jpg";
			if($scope.id!=undefined){
				$scope.isedit=true;
				var url=$rootScope.apiBaseUrl;
				url+="/deal?id="+$scope.id;
				console.log("url",url);
				httpService.get(url).then(function(response){
					console.log("httpService",response.data.detail.deal);
					response.data.detail.deal.genre=genreCoversionFactory.makergenreArray(response.data.detail.deal.genre);
					response.data.detail.deal.theme=genreCoversionFactory.makergenreArray(response.data.detail.deal.theme);
					response.data.detail.deal.performing=genreCoversionFactory.makergenreArray(response.data.detail.deal.performing);
					$scope.createdeal=response.data.detail.deal;
					console.log("$scope.createdeal1233",$scope.createdeal);
					$scope.createdeal.pricing.sort(function(a,b){
						return a.segment>b.segment;
					});
					console.log("$scope.createdeal",$scope.createdeal);
				},function(reason){

				});
			}	

		}
		
		$scope.init();
		$scope.$watch('createdeal.startdate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var start=$filter("formatchnageandConvertTimeStamp")(newValue)
				var end=start+21600000;
				if(!$scope.createdeal.enddate||start>=$filter("formatchnageandConvertTimeStamp")($scope.createdeal.enddate)){
					$scope.createdeal.enddate=end;
				}
			}
		});

		$scope.$watch('createdeal.enddate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var end=$filter("formatchnageandConvertTimeStamp")(newValue);
				var start=end-21600000;
				if($filter("formatchnageandConvertTimeStamp")($scope.createdeal.startdate)>=end){
					$scope.createdeal.startdate=start;
				}
			}
		});

		$scope.$on("dealLocation",function(event,value){
			$scope.createdeal.location=value;
			$scope.createdeal.address=value;
			$scope.$digest();
		});

		$scope.searchTheme=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
		}


		$scope.searchGenre=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
		}


		$scope.searchProfile=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadProfile");
		}

		$scope.$watchCollection("createdeal.themes",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createdeal","theme",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createdeal.profiles",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createdeal","genres",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createdeal.genres",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createdeal","performer",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createdeal.enddate",function(newCol, oldCol, scope){
			//$scope.calculatePercentage('createdeal','enddate',newCol);
		});

		$scope.uploadImage=function(cover,formName,image){
			$scope.isUploading=true;
			$scope.fileprogress=cover[0];
			if(cover!=undefined)
			{
				var url=$rootScope.apiBaseUrl;
				url+="/uploadfile";
				$scope.createdeal.banner=image.src;
				(function(file){
					file.name=cover[0].name;
					var data={};
					data.file=file;
					file.status = Upload.upload({
						url: url, 
						data:data,
						file: file, 
					}).progress(function(evt) {
						file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
					}).success(function(response) {
						$scope.isUploading=false;
						$scope.createdeal.banner=response.data.file.fileurl;
					});
				})(cover[0]);

			}
			
		}


		// createdeal.geo=[];
		// createdeal.geo[0]=createdeal.latitude;
		// createdeal.geo[1]=createdeal.longitude;

		$scope.$watch("createdeal.location",function(newValue,oldValue,scope){
			if(newValue!=undefined&&newValue.length>0){
				$scope.createdeal.latitude=$window.sessionStorage.getItem("dealLocationlatitude")!=null?$window.sessionStorage.getItem("dealLocationlatitude"):"";
				$scope.createdeal.longitude=$window.sessionStorage.getItem("dealLocationlongitude")!=null?$window.sessionStorage.getItem("dealLocationlongitude"):"";
				$scope.createdeal.geo[0]=$scope.createdeal.latitude;
				$scope.createdeal.geo[1]=$scope.createdeal.longitude;
			}
			else{
				scope.createdeal.latitude="";
				$scope.createdeal.longitude="";
				$scope.createdeal.location=newValue;
				$scope.createdeal.address=newValue;
				//$scope.createdeal.geo[0]=$scope.createdeal.latitude;
				//$scope.createdeal.geo[1]=$scope.createdeal.longitude;
			}

		},true);

		$scope.publishdeal=function(){
			postdeal.publish($scope.createdeal,$scope.isedit).then(function(response){
				console.log("response come from deal=",response);
				var  message=$scope.isedit==true?"Successfully Update":"succssfully Publish";
				if(response.data.deal){
					ngToast.create(message);
					var location=$scope.createdeal.isactive==true?"createdParties/all":"createdParties/draft"
					$scope.isSubmit=false;
					$location.path(location);



				}
				else{
					ngToast.create({
						className:'warning',
						content:response.data.error.message	
					});
				}
				
			},function(reason){
				ngToast.create({
					className:'warning',
					content:"Something Went Wrong"	
				});
			})
		}

	}]);


app.service("postdeal",function($http,$rootScope,$q,httpService,$window,httpService,genreCoversionFactory,dateFactory){
	var obj={};
	obj.publish=function(data,isedit){
		var defer=$q.defer();
		var createdeal=Object.assign({},data);
		createdeal.genre=genreCoversionFactory.convertGenreToString(createdeal.genre);
		createdeal.theme=genreCoversionFactory.convertGenreToString(createdeal.theme);
		createdeal.performing=genreCoversionFactory.convertGenreToString(createdeal.performing);
		createdeal.enddate=dateFactory.converttoTimeStamp(createdeal.enddate,"dd-mm-yyyy");
		createdeal.startdate=dateFactory.converttoTimeStamp(createdeal.startdate,"dd-mm-yyyy");
		createdeal.user=$window.sessionStorage.getItem("userId");
		console.log("createdeal",createdeal);
		var url=$rootScope.apiBaseUrl;
		url+="/deal";
		if(isedit==true){
			createdeal.id=createdeal._key;
			httpService.put(url,createdeal).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		else{
			httpService.post(url,createdeal).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		return defer.promise;
	}

	return obj;
});
