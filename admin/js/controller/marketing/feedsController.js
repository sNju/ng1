var app=angular.module("main.module");
app.controller("feedsController",['$scope','$httpParamSerializer','$rootScope','httpService','$filter','$location'
	,function($scope,$httpParamSerializer,$rootScope,httpService,$filter,$location){


		$scope.getallfeeds=function(obj){
			var value=$("#txtlocation").val;
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.location=$scope.txtlocation;

			var path="/feeds";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);

		}

		$scope.getallfeeds1=function(obj){
			var object=Object.assign({},obj);
			var url=$rootScope.apiBaseUrl;
			url+="/getfeeds"
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
			    console.log("myresponse",response);
				if(response.data!=undefined){
					$scope.feeds=response.data.feeds;
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


      $scope.iterate=function(counter){
            $scope.arrayindex=$scope.arrayindex+counter;
            $scope.arrayindex=$scope.arrayindex<0?$scope.feeds.length-1:$scope.arrayindex;
            $scope.arrayindex=$scope.arrayindex>=$scope.feeds.length?0:$scope.arrayindex;
            $scope.play($scope.arrayindex,false);
        }


        $scope.videoPlayer=document.getElementById("Video1");
        $scope.play=function(index,isautoplay){

        		$scope.arrayindex=index;
        		$scope.videoPlayer.pause();
        		$scope.videoPlayer.removeAttribute('src');
        		$scope.videoPlayer.load();
        		$scope.videoobj=$scope.feeds[index];
        		if(isautoplay==true){
        				$scope.videoPlayer.autoplay=true;
        		}
        		 $scope.$broadcast("openvideoplayer",$scope.videoobj);
        }

		$scope.togglestate=function(data,$event){
			$event.stopPropagation();
			data.active=data.active==false?true:false;
			data.id = data._key;
			var url=$rootScope.apiBaseUrl;
			url+="/post";
			httpService.put(url,data).then(function(response){
				data.active=response.data.post.active;
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}


		$scope.$on("txtlocationtext",function($event,data){
			$scope.filterobj.location=data.value;
			$scope.$digest();
		});

		$scope.$on("txtlocation",function($event,obj){
			$scope.txtlocation=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.$digest();

		});

		$scope.check=0;
		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.getallfeeds1($scope.filterobj);
		}

		// if($rootScope.init==1)
		$scope.init();

	}]);

//Modal window to play the video
app.directive('modalPlay',function(){
    	return {
    		scope:false,
    		link: function($scope, iElm, iAttrs, controller) {
    			$scope.$on("openvideoplayer",function($event,data){
    				$("#urlconfrm").modal("show");
    			});

    			$("#urlconfrm").on('hidden.bs.modal',function(){
    			    console.log("closing video");
    			    $(this).find('video')[0].pause();
    			});

    		}
    	};
    });
