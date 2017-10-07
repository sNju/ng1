var app=angular.module("manageProfile.module",[]);
app.controller("manageProfileCtrl",['$scope','ngToast','validationRuleFactory','getAndUpdateProfile','autoCompleteThemeGenreAndProfile','Upload','urlFactory',
	function($scope,ngToast,validationRuleFactory,getAndUpdateProfile,autoCompleteThemeGenreAndProfile,Upload,urlFactory){
		$scope.coverShow="images/gp-user-profile-cover.jpg";
		$scope.profile_pic="images/soi7-profile-pic.jpg";
		$scope.isEdit=false;
		$scope.userData={}
		$scope.buttonContent="Edit";
		$scope.validate=validationRuleFactory.getRegEx();
		$scope.isSubmit=false;
		$scope.editAndUpdate=function(isValid){
			debugger;
			$scope.isSubmit=true;
			
			if($scope.buttonContent=="Edit"){
				$scope.isEdit=true;
				$scope.buttonContent="Update";
			}
			else {
				if(isValid==true){
					getAndUpdateProfile.updateProfile($scope.userData).then(function(response){
						debugger;
						$scope.isSubmit=false;
						if(response.data.error!=undefined){
							ngToast.create({
								className:"warning",
								content:response.data.error.message
							});

						}
						else{

							ngToast.create("Successfully Profile Update");
							$scope.isEdit=false;
							$scope.buttonContent="Edit";
						}

					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something Went Wrong"
						});
					})
				}
			}
		}


		$scope.uploadImage=function(cover,formName,image){
			if(formName=="profileCover"){
				$scope.userData.cover=image.src;
			}
			else if(formName=="profilePic"){
				$scope.userData.profile_pic=image.src;
			}
			$scope.$digest();
			(function(file) {
				var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
				url+=urlFactory.getUrl("uploadfile").value;
				file.name=cover[0].name;
				var data={};
				data.file=file;
					//data.details=true;
					file.status = Upload.upload({
						url: url, 
						data:data,
						file: file, 
					}).progress(function(evt) {
						file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
					}).success(function(response) {
						file.fileurl=response.data.file.fileurl;
						file.thumburl=response.data.file.fileurl;
						if(formName=="profileCover"){
							$scope.userData.cover=response.data.file.fileurl
						}
						else if(formName=="profilePic"){
							$scope.userData.profile_pic=response.data.file.fileurl
						}

					});
				})(cover[0]);
			}

			$scope.init=function(){
				$scope.show=true;
				getAndUpdateProfile.getProfile().then(function(response){
					$scope.userData=response.data.data.detail.profile;
					$scope.shadowing=response.data.data.detail.shadowdetails.ref;
					console.log("$scope.userData",response.data.data,$scope.shadow);
					$scope.show=false;
				},function(reason){

				});
			}
			$scope.init();

			$scope.userData.genre=[];
			$scope.userData.theme=[];
			$scope.searchGenreandTheme=function(query,method){
				return autoCompleteThemeGenreAndProfile.querySearch(query,method);//.then(function(response{
				// 	return response;
				// },function(reason){

				// });
			}


		}]);

app.factory("getAndUpdateProfile",function($http,$q,urlFactory,$window,genreCoversionFactory){
	var obj={};
	obj.getProfile=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId");
		$http.get(url).then(function(response){
			console.log("response",response);
			response.data.data.detail.profile.genre=genreCoversionFactory.makergenreArray(response.data.data.detail.profile.genre);
			response.data.data.detail.profile.theme=genreCoversionFactory.makergenreArray(response.data.data.detail.profile.theme);
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.updateProfile=function(data){
		var obj=JSON.parse(JSON.stringify(data));
		obj.genre=genreCoversionFactory.convertGenreToString(obj.genre);
		obj.theme=genreCoversionFactory.convertGenreToString(obj.theme);
		obj.id=obj._key;
		delete obj._key;
		delete obj._id;
		delete obj._rev;
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		$http.put(url,obj).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;

	}
	return obj;
})