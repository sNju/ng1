var app=angular.module("main.module",["ngFileUpload","ui.tinymce"]);
app.controller("addblogController",["$scope","Upload","$rootScope","httpService","$stateParams",
	function($scope,Upload,$rootScope,httpService,$stateParams){
		$scope.blogobj={};
		$scope.blogobj.gallery=[];


		$scope.imageupload=function(file,index){
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
					//file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
				}).success(function(response) {
					
					if(index>=0){
						$scope.blogobj.gallery[index].fileurl=response.data.file.fileurl;
						$scope.blogobj.gallery[index].thumburl=response.data.file.fileurl;
					}
					else{
						$scope.blogobj.cover=response.data.file.fileurl;
					}
					$rootScope.$emit("internalhttpcall",false);
					//$scope.partyobj.banner=response.data.file.fileurl;
					//$rootScope.internalhttpcall=false;
				});
			})(file);
		}

		$scope.$on("uploadblogFiles",function($event,object){
			$scope.blogobj.gallery.push({
				type:"image",
				thumburl:object.image.src,
				fileurl:object.image.src
			});

			$scope.imageupload(object.images[0],$scope.blogobj.gallery.length-1);			
			$scope.$digest();
		});


		$scope.remove=function(index){
			$scope.blogobj.gallery.splice(index,1);
		}

		function submit(data,isvalid){
			if(isvalid==true){
				data.active=true;
				var url=$rootScope.apiBaseUrl;
				url+="/blog";
				httpService.post(url,data).then(function(response){
					console.log("response",response);
					if(response.data!=undefined){
						$scope.$emit("status","successfully blog post","alert-success",response.data,undefined);    
					}
					else{
						$scope.$emit("status","something went wrong","alert-danger",undefined,"");
					}
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,"");
				});
			}
		}


		function updateblog(data,isvalid){
			data.id=data._key;
			var url=$rootScope.apiBaseUrl;
			url+="/blog";
			httpService.put(url,data).then(function(response){
				if(response.data!=undefined){
					data=response.data.blog;
					$scope.$emit("status","Successfully Update","alert-success",response.data,"/blogs");
				}
			},function(reason){
				$scope.$emit("status","","alert-danger",undefined,'');
			});
		}




		$scope.submitblog=function(data,isvalid){
			if($scope.isedit==true){
				updateblog(data,isvalid);
			}
			else{
				submit(data,isvalid);
			}
		}

		$scope.$on("uploadCover",function($event,object){
			$scope.blogobj.cover=object.image.src;
			$scope.imageupload(object.images[0],-1);			
			$scope.$digest();
		});


		var getblog=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/blog?id="+id;
			httpService.get(url).then(function(response){
				console.log("response come from api",response);
				$scope.blogobj=response.data.blog;
			},function(reason){
				$scope.$emit("status","","alert-danger",undefined,'');
			});
		}



		$scope.init=function(){
			if($stateParams.id!=undefined&&$stateParams.id!=""){
				debugger
				$scope.isedit=true;
				getblog($stateParams.id);
			}
		}

		$scope.init();



//tinymce functionality start from here don't try to touch 
$scope.tinymceModel = 'Initial content';
$scope.getContent = function() {
	console.log('Editor content:', $scope.tinymceModel);
};
$scope.setContent = function() {
	$scope.tinymceModel = 'Time: ' + (new Date());
};

$scope.tinymceOptions = {
	plugins: 'link image code',
	toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
};
}]);
