var app=angular.module("createPost.module",[]);
app.controller("createPostCtrl",['$scope','ngToast','socialMediaDataPost','urlFactory','Upload',
	function($scope,ngToast,socialMediaDataPost,urlFactory,Upload){
	// Tooltip Initialization 
 $scope.isUpload=false;
 $('[data-toggle="tooltip"]').tooltip({
  container: 'body',
  placement: 'auto bottom',
  trigger: 'hover'	
});
 
 $scope.postData={};
 $scope.postData.facebook=false;
 $scope.postData.twitter=false;
 $scope.postData.instagram=false;
 $scope.postData.type=""
 $scope.$on("socialMediaSwitchChange",function(event,data){
  $scope.postData.facebook=data.facebook;
  $scope.postData.twitter=data.twitter;
  $scope.postData.instagram=data.instagram;
})
 $scope.submitPost=function(){
  socialMediaDataPost.postData($scope.postData).then(function(response){
    ngToast.create("Successfully Post Request");
  },function(reason){

  })
}

$scope.uploadFile=function(file){
  $scope.isUpload=true;
  var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
  url+=urlFactory.getUrl("uploadfile").value;
  if (file) {


   (function(file) {
    if(file.type.indexOf("audio")>=0)
    {
     $scope.postData.type="audio";
     $scope.file.thumburl="images/audio-default-img.jpg";
   }
   else if(file.type.indexOf("video")>=0)
   {
    $scope.postData.type="video";
    $scope.file.thumburl="images/video-default-img.jpg";
  }
  else
  {
    $scope.postData.type="image";
    $scope.file.thumburl="images/photo-thumb-1.jpg";
  }
  var data={};
  data.file=file;

  file.status = Upload.upload({
    url: url, 
    data:data,
    file: file, 
  }).progress(function(evt) {
    $scope.file.progress = Math.round(evt.loaded * 100 / evt.total);
    $scope.file.isUploading=true;
  }).success(function(response) {
    $scope.file.thumburl=response.data.file.thumburl;
    $scope.postData.fileurl=$scope.file.fileurl=response.data.file.fileurl;
    $scope.file.duration=response.data.file.duration;
  });
})(file);


}
}

$scope.file={};
$scope.file.isUploading=false;
$scope.file.progress=0;
$scope.file.thumburl="";
$scope.file.fileurl="";
$scope.file.duration=0;
$scope.file.worktype="";
$scope.assign=function(files){
  $scope.uploadFile(files[0]);
}

$scope.uploadStatus={};
$scope.uploadStatus.progress="";
}]);


app.factory("socialMediaDataPost",function($http,$q,$window,urlFactory){
  var obj={};
  obj.postData=function(data){
    var defer=$q.defer();
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
    url+=urlFactory.getUrl("post").value;
    data.user=$window.sessionStorage.getItem("userId");
    $http.post(url,data).then(function(response){
      defer.resolve(response);
    },function(reason){
      defer.reject(reason);
    });
    return defer.promise;
  }
  return obj;
})