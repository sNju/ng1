var app=angular.module('supportService.module', ['common.module','discoverAndBook.module']);
app.controller('supportServiceCtrl', ['$scope','$timeout','latlongFactory','getServiceProviderFactory','autoComplete', 
	function($scope,$timeout,latlongFactory,getServiceProviderFactory,autoComplete){
		$scope.services=[];
		$scope.init=function(){
			$scope.getServiceProvider();
			
		}
		$scope.getServiceProvider=function(){
			getServiceProviderFactory.getServiceProvider().then(function(response){
				$scope.services=response.data.data.servicecategory;
				console.log("$scope.services",$scope.services);
				
			},function(reason){

			});
		}
		$scope.autoCompleteNameData;
		$scope.querySearch=function(query){
			if(query==null||query=="")
			{
				return $scope.autoCompleteNameData=autoComplete.querySearch(query).then(function(response){
					return response.sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});;
				},function(reason){
				});
			}
			else
			{
				//console.log("controller send data=",$scope.autoCompleteNameData);	
				return autoComplete.filetrData(query,$scope.autoCompleteNameData).then(function(response){
					return response.sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});;
				},function(reason){
				});
			}
			
		}
		$scope.categories=null;
		$scope.getPriceRange=function(){
			$timeout(function() {
				$scope.categories=$scope.priceRange||[
				{ id: 1, value: 'Catering' },
				{ id: 2, value: 'Lighting' },
				{ id: 3, value: 'Mascots' }
				];
			}, 650);
		}
		$scope.searchValue="";
		$scope.init();
	}]);

app.controller('supportServiceCtrl.serviceListCtrl', ['$scope','$stateParams','getServiceProviderCategory',
	function($scope,$stateParams,getServiceProviderCategory){
		$scope.type=$stateParams.type;
		$scope.categoryList=[];
		$scope.init=function(){
			$scope.getList();
		}

		$scope.getList=function(){
			getServiceProviderCategory.getCategory($scope.type).then(function(response){
				$scope.categoryList=response.data.data.profile;
				console.log("$scope.categoryList",$scope.categoryList);
			},function(resolve){

			});
		}

		$scope.init();
	}]);

app.controller('supportServiceCtrl.serviceDetailCtrl', ['$scope','$stateParams','serviceDetailGet',
	function($scope,$stateParams,serviceDetailGet){
		$scope.id=$stateParams.id;
		$scope.profile=[];
		$scope.counter=Array;
		$scope.init=function(){
			$scope.getProfileDetail();
		}
		$scope.getProfileDetail=function(){
			serviceDetailGet.getProfileDetails($scope.id).then(function(response){
				$scope.profile=response.data.data.profile;
				console.log("$scope.profile",$scope.profile);
			},function(reason){

			})
		}

		$scope.init();
	}]);



app.filter("searchCategoryList",function(){
	return function(array,parms){
		return array.filter(function(obj){
			if(parms.length==0)
				return true;
			if(obj.type.toLowerCase().indexOf(parms.toLowerCase())>=0||obj.description.toLowerCase().indexOf(parms.toLowerCase())>=0)
			{
				return true;
			}
		})
	}
});

app.filter("limitString",function(){
	return function(param,length){
		length=length||100;
		if(param!=undefined&&param!=null&&param.length>length)
			return param.substr(0,length)+"...";
		return param;
	}
});
app.factory("getServiceProviderFactory",function($http,$q,urlFactory){
	var obj={};

	obj.getServiceProvider=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("servicecategory").value;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})

app.directive("supportServiceCategory",function(){
	return{
		replace:true,
		restrict:'EA',
		templateUrl:"directive/supportServices/supportServiceCategory.html",
		link:function($scope,element,attr,controller,transclude){
			var obj=attr.data;
			obj=JSON.parse(obj);
			$scope.id=obj._key;
			$scope.title=obj.title;
			$scope.count=obj.count;
			$scope.description=obj.description;
			$scope.thumburl=obj.thumburl;
		}
	}
});


app.factory("getServiceProviderCategory",function($http,$q,urlFactory){
	var obj={};
	obj.getCategory=function(param){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/servicelist"
		url+="?category="+param;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});

app.directive("serviceList",function(){
	return{
		replace:true,
		restrict:'EA',
		templateUrl:"directive/supportServices/serviceList.html",
		link:function($scope,element,attr,controller,transclude){
			var obj=attr.data;
			obj=JSON.parse(obj);
			$scope.id=obj.id;
			$scope.address=obj.address;
			$scope.about=obj.about;
			$scope.description=obj.description;
			$scope.coverUrl=obj.cover;
		}
	}
});
app.directive("headerFilter",function(latlongFactory){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/supportServices/headerFilter.html",
		link:function($scope,element,attr,controller,transclude){
			latlongFactory.initialize();
		}
	}
});



app.factory("serviceDetailGet",function($http,$q,urlFactory){
	var obj={};
	obj.getProfileDetails=function(id){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/profile/"+id+"?access_token="+urlFactory.getUrl("access_token").value;

		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	}
	return obj;
});



app.directive("hasWriteReviewDialog",function($mdMedia,$mdDialog){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			$scope.status = '';
			$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');    
			$scope.writeReviewDialog=function(ev){
				                

				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
				$mdDialog.show({
					scope:$scope.$new(),
					    controller:addNewPaymentCardCtrl,
					    templateUrl: 'directive/supportServices/writeReview.html',
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
		}
	}
});