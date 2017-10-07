var app=angular.module("createparty.module",[]);
app.controller("createpartyController",["$scope","$rootScope","calculatepercent","validationRuleFactory","$location","genreCoversionFactory","$stateParams","httpService","ngToast","postParty","$window","Upload","autoCompleteThemeGenreAndProfile","$filter",
	function($scope,$rootScope,calculatepercent,validationRuleFactory,$location,genreCoversionFactory,$stateParams,httpService,ngToast,postParty,$window,Upload,autoCompleteThemeGenreAndProfile,$filter){
		$scope.id=$stateParams.id;
		$scope.validate=validationRuleFactory.getRegEx();
		$scope.counter=0;
		$scope.percent=0;
		$scope.calculatePercentage=function(key,value){
			// if($scope.counter==0){
			// 	calculatepercent.init();
			// 	$scope.counter++;
			// }

			// $scope.percent+=calculatepercent.calculate(key,value);
			
		}

		$scope.init=function(){
			//initilization of create party search relevancy calculate.
			
			
			$scope.createparty={};
			$scope.isUploading=false;
			$scope.createparty.geo=[];
			$scope.minfromdate=new Date().getTime()-24*60*60*1000;
			$scope.createparty.startdate=new Date().getTime();
			$scope.createparty.theme=[];
			$scope.createparty.performing=[];
			$scope.createparty.genre=[];
			$scope.createparty.pricing=[];
			$scope.createparty.ispoa=true;
			$scope.createparty.crowd_quotient=2.5;
			$scope.createparty.isactive=true;
			$scope.createparty.pricing.push({segment:"Bronze"});
			$scope.createparty.pricing.push({segment:"Gold"});
			$scope.createparty.pricing.push({segment:"Platinum"});
			$scope.createparty.pricing.push({segment:"Silver"});
			$scope.createparty.pricing.push({segment:"Vip"});
			$scope.isedit=false;
			$scope.createparty.banner="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-party-banner.jpg";
			if($scope.id!=undefined&&$scope.id!=""){
				$scope.isedit=true;
				var url=$rootScope.apiBaseUrl;
				url+="/party?id="+$scope.id;
				httpService.get(url).then(function(response){
					response.data.detail.party.genre=genreCoversionFactory.makergenreArray(response.data.detail.party.genre);
					response.data.detail.party.theme=genreCoversionFactory.makergenreArray(response.data.detail.party.theme);
					response.data.detail.party.performing=genreCoversionFactory.makergenreArray(response.data.detail.party.performing);
					$scope.createparty=response.data.detail.party;
					$scope.createparty.pricing.sort(function(a,b){
						return a.segment>b.segment;
					});
				},function(reason){

				});
			}	

		}
		
		$scope.init();
		$scope.$watch('createparty.startdate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var start=$filter("formatchnageandConvertTimeStamp")(newValue)
				var end=start+21600000;
				if(!$scope.createparty.enddate||start>=$filter("formatchnageandConvertTimeStamp")($scope.createparty.enddate)){
					$scope.createparty.enddate=end;
				}
			}
		});

		$scope.$watch('createparty.enddate', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				var end=$filter("formatchnageandConvertTimeStamp")(newValue);
				var start=end-21600000;
				if($filter("formatchnageandConvertTimeStamp")($scope.createparty.startdate)>=end){
					$scope.createparty.startdate=start;
				}
			}
		});

		
		// $scope.$watch("createparty.banner",function(newValue,oldValue,scope){
		// 	if(newValue!=undefined&&newValue.length>0){
		// 		if(newValue.indexOf("/default/default-party-banner.jpg")<0){
		// 			$scope.calculatePercentage('banner',newValue);	
		// 		}
		// 	}
		// },true);

		$scope.$watch("createparty",function(newValue,oldValue,scope){
			if(newValue!=oldValue){
				$scope.percent=0;
				$scope.percent=calculatepercent.calculate(newValue);
			}
		},true);
		$scope.$on("partyLocation",function(event,value){
			$scope.createparty.location=value;
			$scope.createparty.address=value;
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

		$scope.$watchCollection("createparty.themes",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createparty","theme",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createparty.profiles",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createparty","genres",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createparty.genres",function(newCol, oldCol, scope){
			//$scope.calculatePercentage("createparty","performer",newCol.length>0?"yes":"");
		});
		$scope.$watchCollection("createparty.enddate",function(newCol, oldCol, scope){
			//$scope.calculatePercentage('createparty','enddate',newCol);
		});

		$scope.uploadImage=function(cover,formName,image){
			$scope.isUploading=true;
			$scope.fileprogress=cover[0];
			if(cover!=undefined)
			{
				var url=$rootScope.apiBaseUrl;
				url+="/uploadfile";
				console.log("url",url);
				$scope.createparty.banner=image.src;
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
						$scope.createparty.banner=response.data.file.fileurl;
					});
				})(cover[0]);

			}
			
		}


		// createparty.geo=[];
		// createparty.geo[0]=createparty.latitude;
		// createparty.geo[1]=createparty.longitude;

		$scope.$watch("createparty.location",function(newValue,oldValue,scope){
			if(newValue!=undefined&&newValue.length>0){
				$scope.createparty.latitude=$window.sessionStorage.getItem("partyLocationlatitude")!=null?$window.sessionStorage.getItem("partyLocationlatitude"):"";
				$scope.createparty.longitude=$window.sessionStorage.getItem("partyLocationlongitude")!=null?$window.sessionStorage.getItem("partyLocationlongitude"):"";
				$scope.createparty.geo[0]=$scope.createparty.latitude;
				$scope.createparty.geo[1]=$scope.createparty.longitude;
			}
			else{
				scope.createparty.latitude="";
				$scope.createparty.longitude="";
				$scope.createparty.location=newValue;
				$scope.createparty.address=newValue;
				//$scope.createparty.geo[0]=$scope.createparty.latitude;
				//$scope.createparty.geo[1]=$scope.createparty.longitude;
			}

		},true);

		$scope.issubmit=false;
		$scope.publishParty=function(form){
			console.log("form",form);
			$scope.issubmit=true;
			if(form.$valid==true){
				debugger;
				postParty.publish($scope.createparty,$scope.isedit).then(function(response){
					console.log("response come from party=",response);
					$scope.issubmit=false;
					var  message=$scope.isedit==true?"Successfully Update":"succssfully Publish";
					if(response.data.party){
						debugger;
						ngToast.create(message);
						var location=$scope.createparty.isactive==true?"createdParties/live":"createdParties/all"
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
					$scope.issubmit=false;
					ngToast.create({
						className:'warning',
						content:"Something Went Wrong"	
					});
				})
			}
		}

	}]);


app.service("postParty",function($http,$rootScope,$q,httpService,$window,httpService,genreCoversionFactory,dateFactory){
	var obj={};
	obj.publish=function(data,isedit){
		var defer=$q.defer();
		debugger;
		var createparty=Object.assign({},data);
		createparty.genre=genreCoversionFactory.convertGenreToString(createparty.genre);
		createparty.theme=genreCoversionFactory.convertGenreToString(createparty.theme);
		createparty.performing=genreCoversionFactory.convertGenreToString(createparty.performing);
		createparty.enddate=dateFactory.converttoTimeStamp(createparty.enddate,"dd-mm-yyyy");
		createparty.startdate=dateFactory.converttoTimeStamp(createparty.startdate,"dd-mm-yyyy");
		createparty.user=$window.sessionStorage.getItem("userId");
		console.log("createparty",createparty);
		var url=$rootScope.apiBaseUrl;
		url+="/party";
		if(isedit==true){
			createparty.id=createparty._key;
			httpService.put(url,createparty).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		else{
			httpService.post(url,createparty).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		
		
		return defer.promise;

	}

	return obj;
});

app.directive("coverPicUpload",function($parse){
	return{
		replace:true,
		restrict:'EA',
		scope:false,
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



app.factory("calculatepercent",function(){
	var obj=new Object();
	var data={
		title:{percent:5,isset:false},
		location:{percent:5,isset:false},
		banner:{percent:5,isset:false},
		enddate:{percent:5,isset:false},
		description:{percent:10,isset:false},
		entry_terms:{percent:10,isset:false},
		contactname:{percent:10,isset:false},
		contactphone:{percent:10,isset:false},
		contactemail:{percent:10,isset:false},
		theme:{percent:10,isset:false},
		genre:{percent:10,isset:false},
		performing:{percent:10,isset:false}
	}

	obj.init=function(){
		for(key in data){
			if(data.hasOwnProperty(key)){
				data[key].isset=false;
			}
		}
	}

	obj.calculate=function(dataobj){
		var percent=0;
		for(key in data){
			if(data.hasOwnProperty(key)&&dataobj.hasOwnProperty(key)){
				if(dataobj[key]!=undefined&&dataobj[key].length>0){
					//console.log("dataobj[key]",key,dataobj[key]);
					percent+=data[key].percent;
				}
			}
		}
		console.log("");
		console.log("");
		return percent;
	}
	return obj;
})