var app=angular.module("blog.module",[]);

app.controller('blogdetailController', ['$scope','cachedataservice','httpService', '$rootScope','$stateParams',
	function($scope,cachedataservice,httpService,$rootScope,$stateParams){
		$('[data-toggle="tooltip"]').tooltip();

		$scope.init=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/blogdetail/?id="+id;
			cachedataservice.getlocal(url).then(function(response){
				$scope.parse(response);	
			});
			httpService.get(url).then(function(response){
				$scope.parse(response);
			},function(reason){

			});
		}
		
		$scope.parse=function(response){
			if(response!=undefined&&response.data!=undefined){

				$scope.blog=response.data.detail.blog;
				$scope.recent=response.data.detail.recent;
				$scope.suggested=response.data.detail.suggested;
				$scope.$broadcast("lightGalleryBindBlogDetail",$scope.blog.gallery);
				$title="Blog - "+$scope.blog.title+"GoParties Your Party App";
				$scope.$emit("TitlePage",$title);
			}
		}
		$scope.init($stateParams.id);

	}]);

app.directive("blogDetailDirective",function(){
	return{
		link:function($scope,element,$attr){
			// angular.element('<script src="js/slider/blog.js"></script>').appendTo(element);
		}
	}
})


app.directive("lightGalleryBindBlogDetail",function(){
	return{
		restrict:'EA',
		link:function($scope,element,attr){
			$scope.$on("lightGalleryBindBlogDetail",function(event,array){
				var html="";
				for(index in array){
					html+='<li class="col-xs-6 col-sm-4 col-md-3" data-src="'+array[index].thumburl+'">'+
					'<a href="">'+
					'<div class="img-gallery" style="background-image: url('+array[index].thumburl+');">'+
					'</div>'+
					'<span class="thumb-overlay"></span>'+
					'</a>'+
					'</li>';
				}
				$("#lightgallery").html("");
				$("#lightgallery").html(html);
			});
		}
	}
})
