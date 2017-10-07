//inject angular file upload directives and services.
var app = angular.module('launchAlbum.module', ['ngFileUpload','launchMyWork.module','common.module','commonDirective.module','ngMaterial']);
app.controller("launchAlbumController",['$scope','getEditableAlbumObject','$stateParams','$mdDialog','autoCompleteThemeGenreAndProfile','ngToast','$location','$window','urlFactory','Upload','postAlbumInfo',
  function($scope,getEditableAlbumObject,$stateParams,$mdDialog,autoCompleteThemeGenreAndProfile,ngToast,$location,$window,urlFactory,Upload,postAlbumInfo){
    $scope.albumGenres=[];
    $scope.albumTheme=[];
    $scope.myFiles=[];
    $scope.isEdit=false;
    $scope.isFileUploading=false;
    $scope.uploadcount=0;
    $scope.id=$stateParams.id;
    $scope.albumObj=[];
    if($scope.id!=undefined&&$scope.id!=null&&$scope.id!="no"&&$scope.id!=""){
      $scope.isEdit=true;
      getEditableAlbumObject.getInfo($scope.id).then(function(response){
        $scope.albumObj.push(response);
      },function(reason){

      });
    }
    
    $scope.searchTheme=function(query){
      return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
    }
    $scope.searchGenre=function(query){
      return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
    }

    $scope.uploadAlbum =function(files){
      var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
      url+=urlFactory.getUrl("uploadfile").value;
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          if(files[i].isUploading==false){
           (function(file) {
            $scope.uploadcount++;
            if(file.worktype=="audio"){

              file.thumburl="images/audio-default-img.jpg";
            }
            else if(file.worktype=="video"){
             file.thumburl="images/video-default-img.jpg";
           }
           else
           {
             file.thumburl="https://s3.ap-south-1.amazonaws.com/gpcaweb/default/default-album.jpg";
           }
           var data={};
           data.file=file;
           
           file.status = Upload.upload({
            url: url, 
            data:data,
            file: file, 
          }).progress(function(evt) {
            file.progress = Math.round(evt.loaded * 100 / evt.total);
            file.isUploading=true;
          }).success(function(response) {
            console.log("response come from uplaoding=",response);
            $scope.uploadcount--;
            if(file.type.substr(0,file.type.lastIndexOf("/"))=="image"){
              file.fileurl=response.data.file.fileurl;
              file.thumburl=response.data.file.fileurl;
            }
            else{
              file.fileurl=response.data.file.fileurl;
              file.thumburl=response.data.file.thumburl;
              file.duration=Math.floor(response.data.file.duration*1000);
            }
              // if(file.worktype=="image")
              //   file.worktype="photo";
              //console.log("response.data.uploaded.thumburl",response.data.uploaded.thumburl);
              //console.log("response.data.uploaded.meta",response.data.uploaded.meta);
              

          //$scope.$apply();
        });
        })(files[i]);
      }
    }
  }
}

$scope.assignAlbum=function(files){

  for(var i=0;i<files.length;i++){
    files[i].title=files[i].name.substr(0,files[i].name.lastIndexOf("."));
    files[i].worktype=files[i].type.substr(0,files[i].type.lastIndexOf("/"));
    files[i].user=$window.sessionStorage.getItem("userId");
    files[i].progress=0;
    files[i].description="";
    files[i].genre=[];
    files[i].theme=[];
    files[i].isUploading=false;
    files[i].fileurl="";
    files[i].thumburl="";
    files[i].duration=0;
    files.albumid=null;
    $scope.myFiles.push(files[i]);
  }

  $scope.uploadAlbum($scope.myFiles);
} 

$scope.assignAlbumPicture=function(files){
  $scope.albumObj=[];
  for(var i=0;i<files.length;i++){
    files[i].title=files[i].name.substr(0,files[i].name.lastIndexOf("."));
    files[i].worktype="album";
    files[i].user=$window.sessionStorage.getItem("userId");
    files[i].progress=0;
    files[i].description="";
    files[i].isUploading=false;
    files[i].genre=[];
    files[i].theme=[];
    files[i].fileurl="";
    files[i].thumburl="";
    files[i].duration=0;
    files.albumid=null;

  }

  $scope.albumObj.push(files[0]);
  $scope.uploadAlbum($scope.albumObj);
}

$scope.changeAlbum=function(files,index){
 for(var i=0;i<files.length;i++){
  files[i].title=files[i].name.substr(0,files[i].name.lastIndexOf("."));
  files[i].worktype="album";
  files[i].user=$window.sessionStorage.getItem("userId");
  files[i].progress=0;
  files[i].description="";
  files[i].genre=[];
  files[i].theme=[];
  files[i].isUploading=true;
  files[i].change=true;
  files[i].fileurl="";
  files[i].thumburl="";
  files[i].duration=0;
  files.albumid=null;
    //$scope.myFiles[index]=files[i];
    $scope.uploadImage($scope.myFiles,index,files[i]);
  }

}
$scope.uploadImage=function(files,index,file){
 var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
 url+=urlFactory.getUrl("uploadfile").value;
 (function(file) {
  $scope.uploadcount++;
  var data={};
  data.file=file;
  file.status = Upload.upload({
    url:url, 
    data:data,
    file:file, 
  }).progress(function(evt) {
    files[index].progress=Math.round(evt.loaded*100/evt.total);
    files[index].isUploading=true;
  }).success(function(response) {
    $scope.uploadcount--;
    files[index].thumburl=response.data.file.fileurl;
  });
})(file);
}

$scope.deleteItem=function(index,ev){

  var confirm = $mdDialog.confirm()
  .title('Are You Sure Want To delete This Item')
  .textContent('')
  .ariaLabel('Lucky day')
  .targetEvent(ev)
  .ok('Yes')
  .cancel('No');
  $mdDialog.show(confirm).then(function(){
    $scope.myFiles.splice(index,1);
  },function(){

  });

}

$scope.publishAlbum=function(isValid){
  debugger;
  if($scope.uploadcount==0){
    if($scope.isEdit==false){
      $scope.albumObj[0].genre=$scope.albumGenres;
      $scope.albumObj[0].theme=$scope.albumTheme;
      postAlbumInfo.postInfo($scope.albumObj[0],$scope.myFiles,$scope.isEdit,"").then(function(response){
        ngToast.create('SuccessFull Album Post');
        $location.path("/myLaunchedWork/album");
      },function(reason){

      });}
      else{
       postAlbumInfo.postInfo($scope.albumObj[0],$scope.myFiles,$scope.isEdit,$scope.id).then(function(response){
        ngToast.create('SuccessFull Album Update');
        $location.path("/myLaunchedWork/album");
      },function(reason){

      });
     }
   }  
   else{
    ngToast.create({
      className:"warning",
      content:"Please wait while content uploading"
    })
  }
}
}]);


app.factory("postAlbumInfo",function(ngToast,genreCoversionFactory,$http,$q,urlFactory,$location){
  var obj={};

  var postAlbum=function(obj){
    var defer=$q.defer();
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
    url+=urlFactory.getUrl("album").value;
    $http.post(url,obj).then(function(response){
      defer.resolve(response);
    },function(reason){
      defer.reject(reason);
    });
    return defer.promise;
  }
  obj.postInfo=function(albumObj,files,isEdit,id){
    isEdit=isEdit||null;

    var defer=$q.defer();
    var albumContainer=[];
    debugger;
    var album={};
    for(var i=0;i<files.length;i++){
      albumContainer.push({
        "description":files[i].description,
        "fileurl":files[i].fileurl,
        "thumburl":files[i].thumburl,
        "title":files[i].title,
        "user":files[i].user,
        "worktype":files[i].worktype,
        "genre":genreCoversionFactory.convertGenreToString(files[i].genre),
        "theme":genreCoversionFactory.convertGenreToString(files[i].theme),
        "duration":files[i].duration,
        "albumid":files[i].albumid
      });
    }
    if(isEdit==false||isEdit==null){
      album.description=albumObj.description;
      album.fileurl=albumObj.fileurl;
      album.thumburl=albumObj.thumburl;
      album.title=albumObj.title;
      album.user=albumObj.user;
      album.worktype="album";
      album.genre=genreCoversionFactory.convertGenreToString(albumObj.genre);
      album.theme=genreCoversionFactory.convertGenreToString(albumObj.theme);
      album.duration=albumObj.duration;
    }
    else{
      album._key=id;
    }
    //album.albumid=albumObj.albumid;
    var obj={};
    
    obj.works=albumContainer;
    obj.album=album;
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value+"/album";
    $http.post(url,obj).then(function(response){

      ngToast.create('SuccessFull Album Post');
      $location.path("/myLaunchedWork/album");
    },function(reason){

    });

    return defer.promise;
  };

  return obj;
});

app.factory("getEditableAlbumObject",function(urlFactory,genreCoversionFactory,$http,$q,ngToast,$location){
  var obj={};

  obj.getInfo=function(id){
    var defer=$q.defer();
    var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
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
    var url=
    obj.genre=genreCoversionFactory.convertGenreToString(obj.genre);
    var defer=$q.defer();album
    $http.put(url,obj).then(function(response){
      defer.resolve(response);
      ngToast.create('Successfully Album Update');
      $location.path("myLaunchedWork/album");
    },function(reason){
      defer.reject(reason);
    });
    return defer.promise;
  }
  return obj;
});

app.directive("albumPicUpload",function($parse){
  return{
    replace:true,
    restrict:'EA',
    scope:true,
    link:function($scope,element,attrs,controller,transclude){
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      var fileArray=[];
      element.bind('change', function(){

        fileArray=[];
        $scope.$apply(function(){
          for(var i=0;i<element[0].files.length;i++)
          {
            fileArray.push(element[0].files[i]);
          }
         // console.log("file array in album upload=",fileArray);
         $scope.assignAlbumPicture(fileArray);
       });
      });
    }
  }
});




app.directive("albumUpload",function($parse){
  return{
    replace:true,
    restrict:'EA',
    scope:true,
    link:function($scope,element,attrs,controller,transclude){
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      var fileArray=[];
      element.bind('change', function(){

        fileArray=[];
        $scope.$apply(function(){
          for(var i=0;i<element[0].files.length;i++)
          {
            fileArray.push(element[0].files[i]);
          }
          //console.log("file array in album upload=",fileArray);
          $scope.assignAlbum(fileArray);
        });
      });
    }
  }
});

app.directive("albumUploadChange",function($parse){
  return{
    replace:true,
    restrict:'EA',
    scope:true,
    link:function($scope,element,attrs,controller,transclude){
      var model = $parse(attrs.fileModel);

      var modelSetter = model.assign;
      var fileArray=[];
      element.bind('change', function(){
        fileArray=[];
        $scope.$apply(function(){
          for(var i=0;i<element[0].files.length;i++)
          {
            fileArray.push(element[0].files[i]);
          }
          var indexofFIle=parseInt(attrs.index);
          //console.log("indexofFIle",indexofFIle);
          //console.log("file array in album upload=",fileArray);
          $scope.changeAlbum(fileArray,indexofFIle);
        });
      });
    }
  }
});


