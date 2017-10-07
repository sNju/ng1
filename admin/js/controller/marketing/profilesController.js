var app=angular.module("main.module");
app.controller("profilesController",['$scope','$httpParamSerializer','$rootScope','httpService','$filter','$location'
	,function($scope,$httpParamSerializer,$rootScope,httpService,$filter,$location){


		$scope.getallprofile=function(obj){
			var value=$("#txtlocation").val;
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.address=$scope.txtlocation;

			var path="/profiles";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}

		$scope.showgenurl=function(){
		    $scope.$broadcast("openbusinessmodal","true");
		}

        $scope.submitdetail=function(data){

        		    $rootScope.$emit("internalhttpcall",true);
        			var url=$rootScope.apiBaseUrl;
        			url+="/onboardinglink";
        			httpService.post(url,data).then(function(response){
        				$rootScope.$emit("internalhttpcall",false);
        				if(response.data!=undefined){
        					$scope.$broadcast("opensuccessmodal",window.location.origin+"/welcome/"+response.data.onboardinglink.token);
        				}
        				else{
        				    $scope.$emit("status","Sorry, unable to process request","alert-danger",response.data,undefined);
        				}
        			},function(reason){

        			});

        		}




		$scope.getallprofile1=function(obj){
			var object=Object.assign({},obj);
			var url=$rootScope.apiBaseUrl;
			url+="/profilebyfilter"
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.profiles=response.data.profile;
				}
				if($scope.check==0){
					$scope.check++;
					$scope.$on("$locationChangeStart",function(){
						$scope.init();
					});
				}

			},function(reason){

			});
		}

		$scope.redirect=function(obj){
			if(obj.profile_type=="Partymon"){
				$location.url('/partymoonbookings?id='+obj._key);
			}
			else{
				$location.url('/partieslisting?user='+obj._key);
			}

		}

		$scope.togglestate=function(data,$event){
			$event.stopPropagation();
			data.active=data.active==false?true:false;
			var url=$rootScope.apiBaseUrl;
			url+="/profile/?id="+data._key;
			httpService.put(url,data).then(function(response){
				data.active=response.data.profile.active;
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}


		$scope.$on("txtlocationtext",function($event,data){
			$scope.filterobj.address=data.value;
			$scope.$digest();
		});

		$scope.$on("txtlocation",function($event,obj){
			$scope.txtlocation=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.$digest();

		});


		$scope.getclassname=function(profile_type){
			var classname="";

			switch(profile_type){
				case "Party Spot":
				classname="bg-orange";
				break;
				case "Artist":
				classname="bg-pink";
				break;
				case "Band":
				classname="bg-green";
				break;
				case "Partymon":
				classname="bg-teal";
				break;
				case "DJ":
				classname="bg-red";
				break;
				default:
				classname="bg-teal"
			}
			return classname;
		}


		$scope.check=0;
		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.getallprofile1($scope.filterobj);
			$scope.userobj={};
             $scope.genurl="";
		}

		// if($rootScope.init==1)
		$scope.init();

	}]);

	app.directive('modalOpen',function(){
    	return {
    		scope:false,
    		link: function($scope, iElm, iAttrs, controller) {
    			$scope.$on("opensuccessmodal",function($event,data){
    				$scope.onboardinglink=data;
    				$("#business-modal").modal("hide");
    				$("#urlconfrm").modal("show");
    			});

    		}
    	};
    });


    app.directive('modalBusiness',function($rootScope){
        	return {
        		scope:false,
        		link: function($scope, iElm, iAttrs, controller) {
        			$scope.$on("openbusinessmodal",function($event,data){
        				$("#business-modal").modal("show");

        			});
        		}
        	};
        });