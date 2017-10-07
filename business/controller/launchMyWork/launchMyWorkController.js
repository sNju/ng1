//inject angular file upload directives and services.
var app = angular.module('launchMyWork.module', ['ngFileUpload','common.module','commonDirective.module','ngMaterial']);
app.controller("launchMyWorkCtrl",['$scope','ngToast',function($scope,ngToast){

}]);

app.controller('launchMyWorkCtrl.fileUploadCtrl', ['$scope','genreCoversionFactory','getEditableObject','$stateParams','$location','ngToast','$window','postTrackInfo','urlFactory','Upload','autoCompleteThemeGenreAndProfile','$timeout',
 function ($scope,genreCoversionFactory,getEditableObject,$stateParams,$location,ngToast,$window,postTrackInfo,urlFactory, Upload,autoCompleteThemeGenreAndProfile, $timeout) {
  $scope.myFile="";
  $scope.uploadContainer={};
  $scope.isSelect=false;
  $scope.uploadStatus="";
  $scope.filesProgress=[];
  $scope.uploadContainer.genre=[];
  $scope.uploadContainer.theme=[];
  $scope.isUpload=false;
  $scope.isUploading=false;
  $scope.id=$stateParams.id;
  $scope.isEdit=false;
  if($scope.id!=undefined&&$scope.id!=null&&$scope.id!="no"&&$scope.id!=""){
    $scope.isEdit=true;
    $scope.isUpload=true;
    $scope.isSelect=true;
    getEditableObject.getInfo($scope.id).then(function(response){
      $scope.uploadContainer.title=response.title;
      $scope.uploadContainer.description=response.description;
      $scope.uploadContainer.worktype=response.worktype;
      $scope.uploadContainer.thumburl=response.thumburl;
      $scope.uploadContainer.fileurl=response.fileurl;
      $scope.uploadContainer.genre=genreCoversionFactory.makergenreArray(response.genre);
      $scope.uploadContainer.theme=genreCoversionFactory.makergenreArray(response.theme);
    },function(reason){

    });
  }


  $scope.uploadFile =function(files){
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
    url+=urlFactory.getUrl("uploadfile").value;
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
       (function(file) {
        $scope.isUploading=true;
        $scope.uploadContainer.thumburl="";
        if(file.type.indexOf("audio")>=0)
        {
          $scope.uploadContainer.thumburl="images/audio-default-img.jpg";
        }
        else if(file.type.indexOf("video")>=0)
        {
          $scope.uploadContainer.thumburl="images/video-default-img.jpg";
        }
        else
        {
         $scope.uploadContainer.thumburl="images/photo-thumb-1.jpg";
       }
       var data={};
       data.file=file;
       file.status = Upload.upload({
        url: url, 
        data:data,
        file: file, 
      }).progress(function(evt) {
        file.progress = Math.round(evt.loaded * 100 / evt.total);
      }).success(function(response){
        $scope.isUploading=false;
        console.log("response from uploading=",response);
        var isUpload=true;
        $scope.$watch(isUpload,function(newval,oldval){
          $scope.isUpload=newval;
        });
        if($scope.myFile[0].type.substr(0,$scope.myFile[0].type.lastIndexOf("/"))=="image"){
          $scope.uploadContainer.fileurl=response.data.file.fileurl;
          if($scope.uploadContainer.indexOf("default")>=0)
            $scope.uploadContainer.thumburl=response.data.file.fileurl;
        }
        else{
         $scope.uploadContainer.fileurl=response.data.file.fileurl;
         if($scope.uploadContainer.thumburl.indexOf("default")>=0)
           $scope.uploadContainer.thumburl=response.data.file.thumburl;
         $scope.uploadContainer.duration=Math.floor(response.data.file.duration*1000);
       }     

          //$scope.$apply();
        });
    })(files[i]);
  }
  $scope.uploadStatus=$scope.myFile[0];

}
}




$scope.$on("assign",function(event,files){
  $scope.assign(files);
})

$scope.assign=function(files){
  console.log("$scope.uploadStatus");
  if($scope.myFile!="")
  {
    $scope.myFile[0].status.abort();
    $scope.myFile="";

  }
  $scope.myFile=files;
  $scope.isSelect=true;
  reader=$scope.myFile;
  $scope.uploadContainer.title=$scope.myFile[0].name.substr(0,$scope.myFile[0].name.lastIndexOf("."));
  $scope.uploadContainer.worktype=$scope.myFile[0].type.substr(0,$scope.myFile[0].type.lastIndexOf("/"));
  $scope.uploadContainer.user=$window.sessionStorage.getItem("userId");
  $scope.uploadContainer.thumburl=$scope.myFile[0].thumburl;
  $scope.uploadFile($scope.myFile);
} 

$scope.$on("chnageThumbUrl",function($event,url){
  $scope.uploadContainer.thumburl=url;
});

$scope.searchTheme=function(query){
  return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
}


$scope.searchGenre=function(query){
  return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
}

$scope.isSubmit=false;
$scope.publishTrack=function(valid){
  $scope.isSubmit=true;
  debugger;
  if($scope.isUploading==false){
   if(valid==true)
   {
    if($scope.isEdit==false){
      postTrackInfo.postInfo($scope.uploadContainer).then(function(response){
        $scope.myFile="";
        $scope.uploadContainer={};
        $scope.isSelect=false;
        ngToast.create('Successfully Post');
      },function(reason){

      });
    }
    else
    {
      getEditableObject.update($scope.uploadContainer);
    }
  }
}
else{
  ngToast.create({
    className:"warning",
    content:"Please Wait While Media Uploading"
  })
}

}

}]);

app.factory("getEditableObject",function(genreCoversionFactory,urlFactory,postTrackInfo,$http,$q,ngToast,$location){
  var obj={};
  var url=""
  obj.getInfo=function(id){
    var defer=$q.defer();
    url=urlFactory.getUrl("apiBaseUrlUpdated").value;
    url+=urlFactory.getUrl("work").value;
    url+="/"+id;
    $http.get(url).then(function(response){
      defer.resolve(response.data.data.work);
    },function(reason){
      defer.reject(reason);
    });
    return defer.promise;
  }
  obj.update=function(obj){
    obj.genre=genreCoversionFactory.convertGenreToString(obj.genre);
    var defer=$q.defer();
    $http.put(url,obj).then(function(response){
      defer.resolve(response);
      ngToast.create('Successfully '+obj.worktype+' Update');
      $location.path("myLaunchedWork/"+obj.worktype);
    },function(reason){
      defer.reject(reason);
    });
    return defer.promise;
  }
  return obj;
});

app.factory("postTrackInfo",function($http,$q,urlFactory,$location){
  var obj={};
  obj.makergenreArray=function(string){
    if(string.constructor === Array)
      return string;
    var array=string.split(',');
    var newarray=[];
    for(var i=0;i<array.length;i++){
      if(array[i]!=','){
        newarray.push({
         value: array[i].toLowerCase(),
         display: array[i],
         name:array[i].toUpperCase()
       });
      }
    }
    return newarray;
  }

  obj.convertGenreToString=function(genres){
    var genre="";
    debugger;
    for(var i=0;i<genres.length-1;i++){
      genre+=genres[i].display+",";
    }
    if(genres.length>0)
      genre+=genres[genres.length-1].display;
    return genre;
  }
  obj.postInfo=function(data){
    data.genre=obj.convertGenreToString(data.genre);
    var defer=$q.defer();
    if(data.worktype=="audio"||data.worktype=="video")
    {

    }
    else
    {
      data.thumburl=data.fileurl;

    }
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value+"/work";
    $http.post(url,data).then(function(response){
     defer.resolve(response);
     if(data.worktype=="image")
      $location.path("/myLaunchedWork/image");
    else if(data.worktype=="video")
     $location.path("/myLaunchedWork/video");
   else
     $location.path("/myLaunchedWork/audio");
 },function(reason){
  defer.reject(reason);
});
    return defer.promise;
  }
  return obj;
})






app.directive("fileUpload",function($parse,$mdMedia, $mdDialog){
  return{
    replace:true,
    restrict:'EA',
    scope:false,
    link:function($scope,element,attrs,controller,transclude){
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      var fileArray=[];
      element.bind('change', function(){
        debugger;
        fileArray=[];
        $scope.$apply(function(){
          for(var i=0;i<element[0].files.length;i++)
          {
            fileArray.push(element[0].files[i]);
          }
          //document.getElementById("thumburl").innerHTML= document.getElementById("thumburl").innerHTML;
          //document.getElementById("audioUpload").innerHTML= document.getElementById("audioUpload").innerHTML;
          debugger;
          $scope.$emit("assign",fileArray);
          $mdDialog.hide();
        });
      });
    }
  }
});

app.directive("fileUploadInServerAndLinkEmit",function(Upload,urlFactory){
  return{
    replace:true,
    restrict:'EA',
    scope:false,
    link:function($scope,element,attrs,controller,transclude){
      element.bind('change', function(){
        $scope.$apply(function(){
          console.log("element chnage");
          $scope.uploadFileforUrl(element[0].files[0]);
        });
      });
      $scope.uploadFileforUrl=function(file){
        var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
        url+=urlFactory.getUrl("uploadfile").value;
        if (file) {
         (function(file) {
           var data={};
           data.file=file;
           file.status = Upload.upload({
            url: url, 
            data:data,
            file: file, 
          }).progress(function(evt) {
            file.progress = Math.round(evt.loaded*100/evt.total);
          }).success(function(response){
            $scope.$emit("chnageThumbUrl",response.data.file.thumburl);
            //console.log("thumburl response=",response.data.file.thumburl);
          });
        })(file);
      }
    }
  }
}
});


/* Add Multimedia Modal - Angular mdDialog ( only for audio & video for now ) */
app.directive("hasAddMultimediaDialog",function($mdMedia,$location,ngToast,$mdDialog,youtubeLogin,soundcloudLogin){
  return{
    replace:true,
    restrict:'EA',
    scope:false,
    link:function($scope,element,attrs,controller,transclude){
      $scope.status = '  ';
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');    
      $scope.importFromSoundCloud=function(){
        soundcloudLogin.soundCloudLogin().then(function(response){
          ngToast.create("Successfully Import data from soundcloud");
          $mdDialog.hide();
          $location.path("/myLaunchedWork/audio");
          console.log("respponse soundCloud=",response);
        },function(reason){

        });
      }

      $scope.importFromYouTube=function(){
        youtubeLogin.youtube().then(function(response){
          ngToast.create("Successfully Import data from youtube");
          $mdDialog.hide();
          $location.path("/myLaunchedWork/video");
          console.log("respponse youtube=",response);
        },function(reason){

        });;
      }

      $scope.addAudioModal = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          scope:$scope.$new(),
          controller: DialogController,
          templateUrl: 'directive/launchMyWork/addAudioModal.html',
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
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };    


      $scope.addVideoModal = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
         scope:$scope.$new(),
         controller: DialogController,
         templateUrl: 'directive/launchMyWork/addVideoModal.html',
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
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };    
    }
  }
});



