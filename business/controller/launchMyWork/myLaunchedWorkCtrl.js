var app=angular.module("myLaunchedWork.module",["commonDirective.module","ngMaterial","common.module"]);
app.controller('myLaunchedWorkCtrl', ["$sce","$state","$rootScope","ngToast","deleteItemFactory","$scope","$rootScope","albumAccordingObjMaker","timeMaker","getNextAndPreviousSource","$stateParams","lmwRecordCountFactory","$window","getMyWorkFactory", 
	function($sce,$state,$rootScope,ngToast,deleteItemFactory,$scope,$rootScope,albumAccordingObjMaker,timeMaker,getNextAndPreviousSource,$stateParams,lmwRecordCountFactory,$window,getMyWorkFactory) {
		$scope.tabStatus=$stateParams.category;
		$scope.recordsCount="";
		$scope.albumTabStatus="all";
		$scope.changeAlbumTab=function(val){
			$scope.albumTabStatus=val;
		}
		$scope.mediaObj=[];
		$scope.textSearch="";
		// $scope.$on("searchEvent",function(event,val){
		// 	$scope.textSearch=val;
		// });
		
		$scope.init=function(){
			$scope.show=true;
			getMyWorkFactory.getMyWork().then(function(response){
				console.log("response of work=",response.length);
				if(response.length==0){
					$state.go("launchMyWork");
					$rootScope.$apply();
				}
				else{
					$scope.isShow=true;
					$scope.mediaObj=albumAccordingObjMaker.albumFind(response);
				// $scope.$broadcast("mediaData",$scope.mediaObj);
				$scope.$emit("mediaData",$scope.mediaObj);
				$scope.recordsCount=lmwRecordCountFactory.countRecord($scope.mediaObj);
				$scope.show=false;
			}
		},function(reason){
		});
		}

		$scope.init();
		$scope.$on("init",function(data){
			$scope.init();
			ngToast.create('Successfully Item Delete');
		});
		$scope.deleteFromPopUp=function(event,id) {
			deleteItemFactory.deleteItem(event,id).then(function(response){
				$scope.$emit("init");
			},function(reason){

			});
		};

		

		$rootScope.currentAlbum=null;
		$scope.$on("setAlbumSource",function(event,source){
			$scope.currentAlbum=source;
			$rootScope.currentAlbum=true;
			$scope.albumRecordsCount=lmwRecordCountFactory.countRecord($scope.mediaObj,$scope.currentAlbum);
		});

		$scope.resetAlbum=function(){
			$rootScope.currentAlbum=null;
		}
		$scope.$on("setImageSource",function(event,source){
			$scope.$broadcast("setImageSourceController", source);
		});
		$scope.$on("setVideoSource",function(event,source){
			$scope.$broadcast("setVideoSourceController",source);
		});
		$scope.$on("setAudioSource",function(event,source){
			$scope.$emit("setAudioSourceController",source);
		});

	}
	]);

app.controller('audioGalleryCtrl',['$scope','deleteItemFactory',"$rootScope",'$window','$filter','timeMaker','getNextAndPreviousSource'
	,function($scope,deleteItemFactory,$rootScope,$window,$filter,timeMaker,getNextAndPreviousSource){
		
		$scope.deleteFromPopUp=function(event,id) {
			deleteItemFactory.deleteItem(event,id).then(function(response){
				$scope.$emit("init");
			},function(reason){

			});
		};

		$scope.isAudioListShow=true;
		$scope.audioListToggle=function(){
			$scope.isAudioListShow=$scope.isAudioListShow==true?false:true;
		}
		$rootScope.$on("mediaData",function(event,source){
			$scope.mediaObj=source;

		});
		$scope.audioPlayer=document.getElementById("audioPlayer");
		$scope.isAudioPlay=false;
		$scope.currentAudio="";
		$scope.audioIndex=0;
		$rootScope.$on("setAudioSourceController",function(event,source){
			$scope.audioArray=$filter('filterImageAudioAndVideoArray')($scope.mediaObj,source);
			console.log("$scope.audioArray",$scope.audioArray);
			$scope.audioArrayLength=$scope.audioArray.length;
			$scope.setAudioSource(source);
			console.log("$scope.audioArray",$scope.audioArray);

		});
		$scope.setAudioSource=function(source,index){
			index=index||null;
			if(index==null){
				$scope.audioIndex=getNextAndPreviousSource.findCurrentIndex($scope.audioArray,source);
			}
			else
			{
				$scope.audioIndex=index;
			}
			console.log("$scope.audioIndex",$scope.audioIndex);
			console.log("$scope.audioArray",$scope.audioArray);
			//var obj=$filter('shiftArray')($scope.audioArray,$scope.audioIndex);
			var obj=$scope.audioArray;
			$scope.audioArray=obj;
			//$scope.audioIndex=$scope.audioIndex;
			$scope.currentAudio=$scope.audioArray[$scope.audioIndex];
			$scope.audioPlayer.autoplay = true;
			$scope.isAudioPlay=true;
			$scope.audioPlayer.load();
			$scope.audioPlayer.volumeClass=100;
			$scope.audioPlayer.volume=1;
			document.getElementById("audioVolumn").value=1;
			$window.scrollTo(0, 0);
		}
		$scope.calculateTotalTime=function(duration){
			return timeMaker.makeTime(duration);
		}
		$scope.audioToggle=function(){

			if ($scope.audioPlayer.paused) {
				$scope.audioPlayer.play();
				$scope.isAudioPlay=true;
			} else {
				$scope.audioPlayer.pause();
				$scope.isAudioPlay=false;
			}
		}
		$scope.nextAudio=function(){
			$scope.audioPlayer.pause();
			$scope.audioPlayer.removeAttribute('src');
			$scope.audioPlayer.autoplay=true;
			$scope.audioPlayer.load();
			$scope.audioIndex=getNextAndPreviousSource.findNextIndex($scope.audioArray,$scope.currentAudio);
			$scope.audioPlayer.src =$scope.currentAudio.fileurl;
			$scope.currentAudio=$scope.audioArray[$scope.audioIndex];
			setTimeout(function () {      
				$scope.audioPlayer.play();
			}, 150);

			$scope.isAudioPlay=true;
		}
		$scope.previousAudio=function(){
			$scope.audioPlayer.pause()
			$scope.audioPlayer.removeAttribute('src');
			$scope.audioPlayer.autoplay=true;
			$scope.audioPlayer.load();
			$scope.audioIndex=getNextAndPreviousSource.findPreviousIndex($scope.audioArray,$scope.currentAudio);
			$scope.audioPlayer.src =$scope.currentAudio.fileurl;
			$scope.currentAudio=$scope.audioArray[$scope.audioIndex];
			setTimeout(function () {      
				$scope.audioPlayer.play();
			}, 150);
			$scope.isAudioPlay=true;


		}
		$scope.audioSeek=document.getElementById("gp-media-status");
		$scope.audioPlayer.onended=function(e){
			$scope.nextAudio();
		}
		$scope.audioSeekClick=function(event){
			$scope.audioPlayer.currentTime=$scope.audioSeek.value;

		}
		$scope.backWardAudioClick=function(evt){
			var perc = evt.offsetX/ $("#elapsedSpan").width() * 100;
			$scope.audioPlayer.currentTime=($scope.audioPlayer.currentTime*perc)/100;
		}
		$scope.bufferedClick=function(evt){
			var perc = evt.offsetX/ $("#buffered").width() * 100;
			$scope.audioPlayer.currentTime=($scope.audioPlayer.duration*perc)/100;
		}

		$scope.audioVolumeSeekClick=function(evt){
			var perc = evt.offsetX/ $("#audioVolumeSeek").width()*100;
			document.getElementById("audioVolumn").value=perc/100;
			audioPlayer.volumeClass=perc;
			$scope.audioPlayer.volume=perc/100;


	// $scope.audioPlayer.currentTime=($scope.audioPlayer.duration*perc)/100;
}
$scope.audioElapsedSecond=0;
$scope.audioElapsedPercent=0;
$scope.audioBuffered=0;


$scope.audioPlayer.ontimeupdate=function(){
	var b=$scope.audioPlayer.buffered;
	var i=b.length;
	var vl=$scope.audioPlayer.duration;
	var x1,x2;
	while (i--) {
		x1 = b.start(i) / vl;
		x2 = b.end(i) / vl;
		$scope.audioBuffered=(x2-x1)*100;
		
	}
	$scope.audioDuration=timeMaker.makeTime(audioPlayer.duration);
	$scope.audioElapsedPercent=Math.ceil(($scope.audioPlayer.currentTime/$scope.audioPlayer.duration)*100);
	var timeElapsed=(Math.ceil($scope.audioPlayer.currentTime));
	$scope.audioElapsedSecond=timeMaker.makeTime(timeElapsed);
	$scope.audioSeek.value=$scope.audioPlayer.currentTime;
	$scope.$apply();
}

$scope.stopAudio=function(){
	$scope.audioPlayer.pause();
	$scope.audioPlayer.currentTime=0;
}
$scope.playerOpen=function(){
	$scope.currentAudio.autoplay = true;
	$scope.currentAudio.load();
}

$scope.audioVolumeChange=function(evt){
	var volume=document.getElementById("audioVolumn").value;
	$scope.audioPlayer.volume=volume;
	if(volume==0){
		$scope.audioPlayer.muted=true;
	}
	else
	{
		$scope.audioPlayer.muted=false;
	}
	$scope.audioPlayer.volumeClass=volume*100;
}
}]);

app.controller('videoGalleryCtrl', ['$scope','$filter','timeMaker','getNextAndPreviousSource',
	function($scope,$filter,timeMaker,getNextAndPreviousSource){
		$scope.isVideoListShow=true;
		$scope.videoListToggle=function(){
			$scope.isVideoListShow=$scope.isVideoListShow==true?false:true;
		}
		$scope.currentVideo="";
		$scope.$on("setVideoSourceController",function(event,source){
			$scope.videoArray=$filter('filterImageAudioAndVideoArray')($scope.mediaObj,source);
			$scope.videoArrayLength=$scope.videoArray.length;
			$scope.setVideoSource(source);
		});

		$scope.setVideoSource=function(source,index){
			index=index||null;
			if(index==null){
				$scope.videoIndex=getNextAndPreviousSource.findCurrentIndex($scope.videoArray,source);
			}
			else
			{
				$scope.videoIndex=index;
			}

			//console.log("source",source);
			// var obj=$filter('shiftArray')($scope.videoArray,$scope.videoIndex);
			// $scope.videoArray=obj.array;
			// $scope.videoIndex=obj.index;
			$scope.currentVideo=source;
			$scope.videoPlayer.autoplay = true;
			$scope.isVideoPlay=true;
			$scope.videoPlayer.load();
			$scope.videoPlayer.videoVolumeClass=100;
			$scope.videoPlayer.volume=1;
			document.getElementById("volume-bar").value=1;
		}
		$scope.$on("mediaData",function(event,source){
			$scope.mediaObj=source;
		});

		$scope.videoVolumeSeekClick=function(evt){
			var perc = evt.offsetX/ $("#videoVolumeSeek").width()*100;
			document.getElementById("volume-bar").value=perc/100;
			$scope.videoPlayer.videoVolumeClass=perc;
			$scope.videoPlayer.volume=perc/100;
		}

		$scope.videoVolumeChange=function(evt){
			var volume=document.getElementById("volume-bar").value;
			$scope.videoPlayer.volume=volume;
			if(volume==0){
				$scope.videoPlayer.muted=true;
			}
			else
			{
				$scope.videoPlayer.muted=false;
			}
			$scope.videoPlayer.videoVolumeClass=volume*100;
	// console.log("$scope.videoPlayer.videoVolumeClass",$scope.videoPlayer.videoVolumeClass);
}

$scope.videoPlayer=document.getElementById("video");


$scope.calculateTotalTime=function(duration){
	console.log("duration",duration);
	return timeMaker.makeTime(duration);
}



$scope.stopVideo=function(){
	$scope.videoPlayer.pause();
	$scope.videoPlayer.currentTime=0;
}
$scope.videoToggle=function(){
	
	if ($scope.videoPlayer.paused) {
		$scope.videoPlayer.play();
		$scope.isVideoPlay=true;
	} else {
		$scope.videoPlayer.pause();
		$scope.isVideoPlay=false;
	}
}
$scope.currentVideo
$scope.nextVideo=function(){
	$scope.videoPlayer.pause();
	$scope.videoPlayer.removeAttribute('src');
	$scope.videoPlayer.autoplay=true;
	$scope.videoPlayer.load();
	$scope.videoIndex=getNextAndPreviousSource.findNextIndex($scope.videoArray,$scope.currentVideo);
	$scope.currentVideo.src =$scope.currentVideo.fileurl;
	$scope.currentVideo=$scope.videoArray[$scope.videoIndex];
	setTimeout(function () {      
		$scope.videoPlayer.play();
	}, 150);
	$scope.isVideoPlay=true;
	
}
$scope.previousVideo=function(){
	$scope.videoPlayer.pause()
	$scope.videoPlayer.removeAttribute('src');
	$scope.videoPlayer.autoplay=true;
	$scope.videoPlayer.load();
	$scope.videoIndex=getNextAndPreviousSource.findPreviousIndex($scope.videoArray,$scope.currentVideo);
	$scope.videoPlayer.src =$scope.currentVideo.fileurl;
	$scope.currentVideo=$scope.videoArray[$scope.videoIndex];
	setTimeout(function () {      
		$scope.videoPlayer.play();
	}, 150);
	
	$scope.isVideoPlay=true;
	
}
$scope.videoPlayer.onended=function(e){
	setTimeout($scope.nextVideo(),1000);
	$scope.$digest();
	
}
$scope.$on("videoStatus",function(event,source){
	$scope.isVideoPlay=source;
	$scope.$digest();
});
// $scope.audioSeek=document.getElementById("gp-media-status");
// $scope.audioPlayer.onended=function(e){
// 	$scope.nextAudio();
// }
// $scope.audioSeekClick=function(event){
// 	$scope.audioPlayer.currentTime=$scope.audioSeek.value;
// }
$scope.backWardVideoClick=function(evt){
	var perc = evt.offsetX/ $("#buffredVideoSpan").width()*100;
	$scope.videoPlayer.currentTime=($scope.videoPlayer.currentTime*perc)/100;
}
$scope.bufferedVideoClick=function(evt){
	var perc = evt.offsetX/ $("#elapsedVideoSpan").width()*100;
	$scope.videoPlayer.currentTime=($scope.videoPlayer.duration*perc)/100;
}

$scope.videoPlayer.ontimeupdate=function(){
	var b=$scope.videoPlayer.buffered;
	var i=b.length;
	var vl=$scope.videoPlayer.duration;
	var x1,x2;
	while (i--) {
		x1 = b.start(i) / vl;
		x2 = b.end(i) / vl;
		$scope.videoBuffered=(x2-x1)*100;
		
	}
	$scope.videoDuration=timeMaker.makeTime($scope.videoPlayer.duration);
	$scope.videoElapsedPercent=Math.ceil(($scope.videoPlayer.currentTime/$scope.videoPlayer.duration)*100);
	var timeElapsed=(Math.ceil($scope.videoPlayer.currentTime));
	$scope.videoElapsedSecond=timeMaker.makeTime(timeElapsed);
	//$scope.videoSeek.value=$scope.videoPlayer.currentTime;
	$scope.$apply();
}

$scope.videoVolumeChange=function(evt){
	var volume=document.getElementById("volume-bar").value;
	$scope.videoPlayer.volume=volume;
	if(volume==0){
		$scope.videoPlayer.muted=true;
	}
	else
	{
		$scope.videoPlayer.muted=false;
	}
	
}

}]);


app.controller('imageGalleryCtrl', ['$scope','$filter','getNextAndPreviousSource'
	,function($scope,$filter,getNextAndPreviousSource){
		$scope.imageIndex=0;
		$scope.isImageListShow=true;
		$scope.imageListToggle=function(){
			$scope.isImageListShow=$scope.isImageListShow==true?false:true;
		}
		$scope.$on("mediaData",function(event,source){
			$scope.mediaObj=source;
		});
		$scope.$on("setImageSourceController",function(event,source){
			$scope.currentImage=source;
			$scope.imageArray=$filter('filterImageAudioAndVideoArray')($scope.mediaObj,source);
			$scope.imageArrayLength=$scope.imageArray.length;
		});
		$scope.prevImage=function(){

			$scope.imageIndex=getNextAndPreviousSource.findPreviousIndex($scope.imageArray,$scope.currentImage);
			$scope.currentImage=$scope.imageArray[$scope.imageIndex];
			

		}
		$scope.nextImage=function(){
			$scope.imageIndex=getNextAndPreviousSource.findNextIndex($scope.imageArray,$scope.currentImage);
			$scope.currentImage=$scope.imageArray[$scope.imageIndex];
			
		}
		$scope.slidePhoto=function($event){
			if($event.keyCode==37)
				$scope.prevImage();
			else if($event.keyCode==39)
				$scope.nextImage();
		}
		$scope.setSource=function(index,obj){
			$scope.imageIndex=index;
			$scope.currentImage=obj;
		}
		$scope.shiftImageArray=function(val){
			//$filter('filterImageAudioAndVideoArray')($scope.mediaObj,source);
			var obj=$filter('shiftArray')($scope.imageArray,val);
			$scope.imageArray=obj.array;
			if(val>0){
				while(val>0){
					$scope.nextImage();
					val--;
				}
			}
			else
			{
				val=Math.abs(val);
				while(val>0){
					$scope.prevImage();
					val--;
				}
			}
			// $scope.imageIndex=obj.index;
			// $scope.currentImage=$scope.imageArray[$scope.imageIndex];
			
		}
	}]);



app.filter("lmwSearchBaseFilter",function(){
	return function(array,parms){
		return array.filter(function(obj){
			if(parms.length==0)
				return true;
			if(obj.title.toLowerCase().indexOf(parms.toLowerCase())>=0||obj.description.toLowerCase().indexOf(parms.toLowerCase())>=0)
			{
				return true;
			}
		})
	}
});

app.filter("shiftArray",function(){
	return function(array,val){
		var shiftedArray=[];
		val=parseInt(val);
		var index=0;
		var obj={};
		shiftedArray=array.slice(val);
		if(val>0){
			index=index-val<0?0:index-val;
			for(var i=0;i<val;i++)
				shiftedArray.push(array[i]);
		}
		else
		{
			index=index+val>=array.length?index+val-1:index-val;
			for(var i=0;i<array.length-Math.abs(val);i++)
				shiftedArray.push(array[i]);
		}
		obj.array=shiftedArray;
		obj.index=index;
		return obj;
	}
})

app.filter("filterImageAudioAndVideoArray",function($rootScope,$q){
	
	return function(array,source){
		var index=0;
		return array.filter(function(obj){
			if($rootScope.currentAlbum!=null){
				var val=obj.worktype==source.worktype&&obj.albumid==source.albumid;
				if(val==true){
					obj.index=index;
					index++;
				}
				return val;
			}
			else { 
				var val=obj.worktype==source.worktype;
				if(val==true){
					obj.index=index;
					index++;
				}
				return val;
			}
		});
		
		
	};
});

app.factory("albumAccordingObjMaker",function($rootScope){
	var obj={};
	idExistAsAlbumId=function(id,array){
		var obj=[];
		for(var i=0;i<array.length;i++){
			if(array[i].albumid==id)
			{
				return true;
			}

		}
		return false;
	}
	obj.albumFind=function(array){
		var obj=[];
		var albumFlag={};
		var albumCount=0;
		for(var i=0;i<array.length;i++){
			if(idExistAsAlbumId(array[i]._key,array)==true){
				albumCount++;
				array[i].worktype="album";
			}
		}
		$rootScope.albumCount=albumCount;
		return array;

	}

	return obj;
})



app.factory("timeMaker",function($q){
	var obj={};

	obj.makeTime=function(time){
		var hour;
		if(time>3600){
			hour=parseInt(time/3600);
			if(hour<10)
			{
				hour="0"+hour.toString();
			}
		}
		var defer=$q.defer();
		var min=parseInt(time/60);
		var second=parseInt(time%60);
		if(min<10){
			min="0"+min.toString();
		}
		if(second<10){
			second="0"+second.toString();
		}
		if(time<3600)
			return (min+':'+second);
		else 
			return hour+":"+min+':'+second;
		
	}
	return obj;
});

app.factory("getNextAndPreviousSource",function($rootScope){
	var factoryObj={};
	factoryObj.findCurrentIndex=function(data,obj){
		for(var i=0;i<data.length;i++){
			if(data[i]._key==obj._key)
				return i;
		}
		return -1;
	}
	factoryObj.findNextIndex=function(data,obj){
		var currentIndex=factoryObj.findCurrentIndex(data,obj);
		var flag=true;
		currentIndex++;
		if($rootScope.currentAlbum!=null){
			while(flag)
			{
				if(currentIndex>=data.length)
					currentIndex=0;
				if(obj.worktype!=null&&obj.worktype!=undefined&&data[currentIndex].worktype!=null&&data[currentIndex].worktype!=undefined&&data[currentIndex].worktype.toLowerCase()==obj.worktype.toLowerCase()
					&&data[currentIndex].albumid==obj.albumid)
				{
					return currentIndex;
				}
				currentIndex++;
			}
		}
		else
		{
			while(flag)
			{
				if(currentIndex>=data.length)
					currentIndex=0;
				if(obj.worktype!=null&&obj.worktype!=undefined&&data[currentIndex].worktype!=null&&data[currentIndex].worktype!=undefined&&data[currentIndex].worktype.toLowerCase()==obj.worktype.toLowerCase())
				{
					return currentIndex;
				}
				currentIndex++;
			}
		}

	};
	factoryObj.findPreviousIndex=function(data,obj){
		var currentIndex=factoryObj.findCurrentIndex(data,obj);
		var flag=true;
		currentIndex--;
		if($rootScope.currentAlbum!=null)
		{
			while(flag)
			{
				if(currentIndex<0)
					currentIndex=data.length-1;
				if(obj.worktype!=null&&obj.worktype!=undefined&&data[currentIndex].worktype!=null&&data[currentIndex].worktype!=undefined&&data[currentIndex].worktype.toLowerCase()==obj.worktype.toLowerCase()
					&&data[currentIndex].albumid==obj.albumid)
				{
					return currentIndex;
				}
				currentIndex--;
			}
		}
		else
		{
			while(flag)
			{
				if(currentIndex<0)
					currentIndex=data.length-1;
				if(obj.worktype!=null&&obj.worktype!=undefined&&data[currentIndex].worktype!=null&&data[currentIndex].worktype!=undefined&&data[currentIndex].worktype.toLowerCase()==obj.worktype.toLowerCase())
				{
					return currentIndex;
				}
				currentIndex--;
			}
		}
	}
	return factoryObj;
})

app.filter("filterAlbumObject",function(){
	return function(array,albumObj){
		return array.filter(function(obj){
			if(albumObj!=undefined&&albumObj!=null)
				return albumObj._key==obj.albumid;
			return false;
		})
	}
})

app.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);

app.filter("workCategoryFilter",function(){
	return function(array,tabStatus){
		return	array.filter(function(obj){
			
			if(tabStatus.toLowerCase()=="all")
				return true;
			else if(tabStatus.toLowerCase()==obj.worktype.toLowerCase())
				return true;
			else if(obj.worktype==null||tabStatus==null)
				return false;
			else return false;
		});
	}	
});

app.factory("lmwRecordCountFactory",function(){
	var obj={};
	obj.countRecord=function(array,albumObj)
	{
		albumObj=albumObj||null;
		var countObj={};
		countObj.audioCount=0;
		countObj.allCount=0;
		countObj.photoCount=0;
		countObj.videoCount=0;
		countObj.albumCount=0;
		if(albumObj==null){
			countObj.allCount=array.length;
			for(var i=0;i<array.length;i++)
			{

				if(array[i].worktype==null);
				else if(array[i].worktype=="audio")
					countObj.audioCount++;
				else if(array[i].worktype.toLowerCase()=="video")
					countObj.videoCount++;
				else if(array[i].worktype.toLowerCase()=="album")
					countObj.albumCount++;
				else countObj.photoCount++;

			}
		}
		else{
			for(var i=0;i<array.length;i++){
				if(array[i].worktype==null);
				else if(array[i].worktype=="audio"&&array[i].albumid==albumObj._key)
				{
					countObj.audioCount++;
					countObj.allCount++;
				}
				else if(array[i].worktype.toLowerCase()=="video"&&array[i].albumid==albumObj._key)
				{
					countObj.videoCount++;
					countObj.allCount++;
				}
				else if(array[i].worktype.toLowerCase()=="image"&&array[i].albumid==albumObj._key)
				{
					countObj.photoCount++;
					countObj.allCount++;
				}
			}
		}
		
		return countObj;
	}
	return obj;
});



app.service("getMyWorkFactory",function($http,$q,urlFactory,$window){
	var obj={};
	obj.getMyWork=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value+"/profile";
		url+="?id="+$window.sessionStorage.getItem('userId')+"&target=work";
		$http.get(url).then(function(response){
			defer.resolve(response.data.data.work);
		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	}
	return obj;
});

app.directive("mediaDirectory",function($location,$mdMedia,deleteItemFactory,$mdDialog,$http,urlFactory){
	return{
		restrict:'EA',
		replace:true,
		scope:{
			mediaObj:'='
		},
		link:function($scope,element,attr,controller,transclude){
			var category=$scope.mediaObj.worktype;
			$scope.source=$scope.mediaObj.fileurl;
			$scope.id=$scope.mediaObj._key
			var obj={};
			obj.source=$scope.source;
			obj.thumburl=$scope.mediaObj.thumburl;

			$scope.setAlbum=function(){
				$scope.$emit("setAlbumSource",$scope.mediaObj);
			}
			// $scope.closeModalAndEdit=function(){
			// 	debugger;
			// 	$('#gpLaunchedAlbumModal').modal('hide');
			// 	var path="launchMyWork({id:"+$scope.id+"})";
			// 	//angular.element('#gpLaunchedAlbumModal').modal('hide');
			// 	$location.path("launchMyWork");
			// 	$scope.$apply();
			// }

			$scope.setAudioSource=function(){
				$scope.$emit("setAudioSource",$scope.mediaObj);
			}
			
			$scope.setVideoSource=function(){
				$scope.$emit("setVideoSource",$scope.mediaObj);
			}
			$scope.setImageSource=function(){
				$scope.$emit("setImageSource",$scope.mediaObj);
			}
			if(category=="audio"){
				
				$scope.myTemplate="directive/launchMyWork/mp3.html";
			}
			else if(category=="video"){
				$scope.myTemplate="directive/launchMyWork/mp4.html";
			}
			else if(category=="album")
			{
				$scope.myTemplate="directive/launchMyWork/album.html";
			}
			else
			{
				$scope.myTemplate="directive/launchMyWork/image.html";
			}



			$scope.shareModal = function(ev) {
				debugger;
				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

				$mdDialog.show({
					controller: DialogController,
					templateUrl: 'directive/launchMyWork/shareModal.tmpl.html',
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

			
			$scope.deleteDialog= function(event) {
				deleteItemFactory.deleteItem(event,$scope.id).then(function(response){
					$scope.$emit("init");
				},function(reason){

				});
			};
		},
		template:'<li ng-include="myTemplate"></li>'
	}
});

app.factory("deleteItemFactory",function($q,$http,$mdDialog,urlFactory,ngToast){
	var obj={};
	obj.deleteItem=function(event,id){
		var defer=$q.defer();
		var confirm = $mdDialog.confirm()
		.title('Are You Sure Want To delete This Item')
		.textContent('')
		.ariaLabel('Lucky day')
		.targetEvent(event)
		.ok('Yes')
		.cancel('No');
		$mdDialog.show(confirm).then(function() {
			var url=urlFactory.getUrl("apiBaseUrlUpdated").value+"/work/"+id;
			$http.delete(url).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
			
		}, function(reason) {
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})

app.directive("audioDirectory",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			elemend.bind()
		}
	}
});

app.directive("mylaunchedWorkHeader",function($window){
	return {
		replace:true,
		scope:false,
		restrict:'EA',
		templateUrl:'directive/launchMyWork/myLaunchedWorkHeader.html',
		link:function($scope,element,attr,controller,transclude){
			$scope.textSearch="";
			$scope.$watch("textSearch",function(newval,oldval){
				if(newval!=oldval)
					$scope.textSearch=newval;
					//$scope.$emit("searchEvent",newval);
				});
		}
	}
})













// My Launched Work Listing //
app.directive("launchedWork",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			$('.launched-work > .work-figure-wrap').on('click', function(e){
				e.preventDefault();



				
			});		
			
		}
	}
});


// GP Full Screen Modal //
app.directive("gpModal",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			/*
			 *	GP Modal Full Screen
			 */
			 function gp_modal_height_resize() {
			 	var window_height = $(window).height();
			 	var gp_modal_body_height = window_height - 70 /* height of the gp-modal-header */;	


			 	var gp_media_player_header_height = $('#gpAudioPlayerModal .gp-media-player-header').innerHeight();
			 	var gp_media_wrap_height = $('#gpAudioPlayerModal .gp-media-wrap').innerHeight();

			 	var gp_video_player_header_height = $('#gpVideoPlayerModal .gp-media-player-header').innerHeight();
			 	var gp_video_wrap_height = $('#gpVideoPlayerModal .gp-media-wrap').innerHeight();

			 	var gp_video_player_header_height = $('#gpVideoPlayerModal .gp-media-player-header').innerHeight();
			 	var gp_video_wrap_height = $('#gpVideoPlayerModal .gp-media-wrap').innerHeight();

			 	var gp_media_player_body_height = gp_modal_body_height - (gp_media_player_header_height + gp_media_wrap_height);

			 	var gp_video_player_body_height = gp_modal_body_height - (gp_video_player_header_height + gp_video_wrap_height);

			 	

			 	$('.gp-photo-gallery').css({ 'height': gp_modal_body_height });

				$('.gp-modal-body').css({ 'height': gp_modal_body_height }); // Should have $this reference
				
				if ( $('#gpAudioPlayerModal').has('.gp-audio-media-player') ) {
					$('#gpAudioPlayerModal .gp-media-player-body').css({ 'height': gp_media_player_body_height });




				}




				if ( $('#gpVideoPlayerModal').has('.gp-video-media-player') ) {
					$('#gpVideoPlayerModal .gp-media-player-body').css({ 'height': gp_video_player_body_height });


				}

				// console.log($(this));
				//console.log(gp_media_player_header_height);
				//console.log(gp_media_player_body_height);
			}

			$('#gpAudioPlayerModal, #gpVideoPlayerModal').on('shown.bs.modal', gp_modal_height_resize );	

			$(window).resize(function(){
				gp_modal_height_resize();	
			}).resize();

			/* GP Modal - Audio Player */
			$('#gpAudioPlayerModal').on('shown.bs.modal', function(){
				$(this).find('.media-poster > img').addClass('has-animation');	
			});


			
			/* GP Modal - Photo Gallery */
			$('#gpPhotoGalleryModal').on('shown.bs.modal', function(){
				$(this).find('.gp-gallery-thumbs-container').addClass('has-animation');	
			});



			/*
			 *	GP Modal Controls 
			 */

			// GP Media Info //
			// $('body').on('click', '.media-info-toggle', function() {
			// 	$(this).addClass('active');

			// 	var current_media_info_el = $(this).closest('.gp-modal').find('.main-media-info');

			// 	// if ( current_media_info_el.prev().hasClass('gp-photo-gallery') ) {
			// 	// 	current_media_info_el.addClass('slide-from-right');
			// 	// 	current_media_info_el.closest('.gp-media-container').addClass('squeezed')
			// 	// }
			// 	/*
			// 	else {
			// 		current_media_info_el.slideToggle(300);
			// 		//current_media_info_el.addClass('open');
			// 	}
			// 	*/
			// });


			// Minimize Modal Control //			
			$('body').on('click', '.compress-media', function(e){
				e.preventDefault();
				//var model= $('.modal .gp-modal .in');
				$(this).closest('.gp-modal').addClass('minimized').removeClass('expanded');
				$(this).addClass('expand-media').removeClass('compress-media');
				$(".modal-backdrop").remove();


				if ( $('#gpAudioPlayerModal').hasClass('minimized') ) {
					$('#gpAudioPlayerModal').find('.gp-modal-body').css({'height':'auto'});	
				}
			});

			//audio player show modal hide scrool edit by manoj yadav

			$('body').on('click',".compress-media", function(){
				if ($('body').hasClass('modal-open')){
					$('body').removeClass('modal-open');
				} else {
					$('body').addClass('body-scroll');
				}
			});

			$('body').on("click",".expand-media",function(){
				$('body').removeClass('body-scroll');
				$('body').addClass('modal-open');
			})

			$('body').on("click",".nav-sub-tabs",function(){
				$('body').addClass('body-scroll');
				// $('body').addClass('modal-open');
			})

			$('body').on("click",".launched-work",function(){
				$('body').removeClass('body-scroll');
				// $('body').addClass('modal-open');
			})

			//snap popup
			$('body').on("click","#snap-popup-close",function(){
				 //$('body').removeClass('body-scroll');
				 $('body').addClass('modal-open');
				})
			//video black overlay remove
			
			$('body').on('click',".media-info-edit", function(){
				$("div").removeClass("modal-backdrop");
				$('body').removeClass("modal-open");
			});


			//audio player show modal
			$("body").on("click",".modelOpen",function(){
				$("#gpAudioPlayerModal").modal('show');
			});

			// Maximize Modal Control //			
			$('body').on('click', '.expand-media', function(e){
				e.preventDefault();
				$(this).closest('.gp-modal').removeClass('minimized').addClass('expanded');
				$(this).addClass('compress-media').removeClass('expand-media');

				gp_modal_height_resize(); /* Resizing Modal Height On Maximize */	
			});


			// Close Modal Control //
			$('body').on('click', '.close', function(){
				if ( $(this).closest('.gp-modal').hasClass('minimized') ) {
					$(this).closest('.gp-modal').removeClass('minimized');
				}
			});

			// Tooltip Initialization 
			$('[data-toggle="tooltip"]').tooltip({
				container: 'body',
				placement: 'auto bottom',
				trigger: 'hover'	
			});

			// GP Modal Sub Menu  
			$('body').on('click', '.nav-sub-tabs > a', function(e){
				$('.nav-sub-tabs').removeClass('active');
				$(this).closest('.nav-sub-tabs').addClass('active');	
			});

		}
	}
});


// GP Media Player //
app.directive("gpMediaInfo",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){


			// $("body").on("click",".media-info-toggle",function(){
			// 	debugger;
			// 	//var obj=$(this).closest('.gp-modal').find('.gp-media-info');
			// 	$(".main-media-info").slideToggle();
			// 	//$(this).closet(".gp-media-info").find(".gp-media-info")
			// })


			var window_width = $(window).width();
			$("body").on("click",".videoInfoToggle",function(){
				
				if ( window_width >= 1024 ) {
					$(".videoInfo").slideToggle();
				}

				else{
					$(".video-media-info").toggleClass("open-media-description");
					
				}
			})

			$("body").on("click",".audioInfoToggle",function(){
				
				if ( window_width >= 1024 ) {
					$(".audioInfo").slideToggle();
					
				}
				else{
					$(".audio-media-info").toggleClass("open-media-description");
				}
			})
			
			// mobile media slide info
			


			/*


			/*
			 *	GP Media Player Controls 
			 */

			// Media Player Progress Bar
			// var gp_media_progress_bar = document.getElementById('gp-media-status');  
			// document.getElementById('gp-media-status').addEventListener('input', function(){
				
				// var gp_media_progress = this.value;
				// var gp_media_progress_bar = $(this).parent();

				// gp_media_progress_bar.addClass('media-progressing');
				// if( gp_media_progress_bar.hasClass('media-progressing') ) {
				// 	gp_media_progress_bar.children('.current-status').addClass('in');		
				// 	//gp_media_progress_bar.children('.current-progress').css({ 'width': gp_media_progress + '%' });
				// 	//gp_media_progress_bar.data('media-progress', gp_media_progress);		
				// }
			// });
		}
	}
});






// GP Media Player Controls //
app.directive("gpMediaPlayerControlsNav",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			/*
			 *	GP Media Player Controls
			 */

			// Play/Pause Media Control // 
			// $('.play-pause-media').on('click', function(e){
			// 	e.preventDefault();
			// 	$(this).toggleClass('media-playing');
			// });
			

		}
	}
});

app.directive("gpAudioMediaPlayer",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){
			
			$("#audioVolumn").on("change", function () {
				var myVideo = $("#audioPlayer")[0];
				myVideo.volume = $(this).val();
				var prec=parseFloat($(this).val())*100;
				$("#audioVolumeSeek").css("width",prec+"%");
			});
		}
	}
})

// GP Video Media Player //
app.directive("gpVideoMediaPlayer",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){

			/*
			 *	GP Video Media Player Controls 
			 */

			 $("#Layer").css({
		       /* position: "absolute",
		        width: $("#video").outerWidth(),
		        height: $("#video").outerHeight()*/
		    });

		    //Switching play/pause image on the player
		    $("#Layer").on("click", function (e) {

		    	var myVideo = $("#video")[0];
		    	if (myVideo.paused) {
		    		myVideo.play();
		    		$(this).addClass("pause");
		    		$scope.$emit("videoStatus",true);
		    	} else {
		    		myVideo.pause();
		    		$(this).removeClass("pause");
		    		$scope.$emit("videoStatus",false);
		    	}
		    });

			//Toggle behaviour for play/pause 
			$("#video").on("click", function (e) {
				var myVideo = $(this)[0];
				if (myVideo.paused) {
					myVideo.play();
					$scope.$emit("videoStatus",true);
				} else {
					myVideo.pause();
					$scope.$emit("videoStatus",false);
				}
			});


		    //Showing/Hiding layer on top of the player
		    $("#video").on("mouseenter", function (e) {
		    	//$("#Layer").toggle();
		    });

		    //Volume bar to control video volume
		    $("#volume-bar").on("change", function () {
		    	var myVideo = $("#video")[0];
		    	myVideo.volume = $(this).val();
		    	var prec=parseFloat($(this).val())*100;
		    	$("#videoVolumeSeek").css("width",prec+"%");
		    });

		    //Seek bar to sync with the current playing video
		    $("#video").on("timeupdate", function () {
		    	var myVideo = $(this)[0];
		    	var value = (100 / myVideo.duration) * myVideo.currentTime;
		    	$("#seek-bar").val(value);
		    });

		    var video = document.getElementById('video');

		    video.addEventListener("loadedmetadata", function(){
		    	var intrinsicRatioPercentage = (video.videoHeight / video.videoWidth ) * 100 + '%';

		    	var videoPlayerBodyHeight = $('#gpVideoPlayerModal .gp-media-player-body').innerHeight();

		    	

		    	/*$('#videoResponsiveContainer').css({ 'padding-bottom': intrinsicRatioPercentage });

		    	if( video.videoHeight > videoPlayerBodyHeight ) {
		    		$('.video-outer-container').css({ 'max-width':'300px' });
		    	}
		    	else {
		    		$('.video-outer-container').css({ 'max-width':'70%' });
		    	}
		    	*/

		    	/*
		    	if ( video.videoHeight > videoPlayerBodyHeight ) {
		    		$('#gpVideoPlayerModal .video-outer-container').css({ 'max-width': '90%', 'left':'5%' });
		    	}
		    	else {
		    		$('#gpVideoPlayerModal .video-outer-container').css({ 'max-width': '100%', 'left':'0' });
		    	}
		    	*/
		    	
				/*	
		    	if (actualRatio>1.22 && actualRatio<1.40) {
		    		console.log("actualRatio if",actualRatio);

		    		if($("#aspectRatio").hasClass('embed-responsive-16by9')==true)
		    			$("#aspectRatio").removeClass('embed-responsive-16by9');
		    		$("#aspectRatio").addClass('embed-responsive-4by3');
		    	}
		    	else {
		    		console.log("actualRatio else",actualRatio);
		    		if($("#aspectRatio").hasClass('embed-responsive-4by3')==true)
		    			$("#aspectRatio").removeClass('embed-responsive-4by3');
		    		$("#aspectRatio").addClass('embed-responsive-16by9');
		    	}
		    	*/

		    	//$("#aspectRatio").addClass("embed-responsive-"+video.videoWidth+"by"+video.videoHeight)
		    	//var targetRatio=$(video).width()/$(video).height()
		    	//console.log(actualRatio);
		    	//var adjustmentRatio=targetRatio/actualRatio
		    	//$(video).css("-webkit-transform","scaleX(#{"+adjustmentRatio+"})")
		    });
		    //Seek bar drag to move the current playing video at the time.
		    $("#seek-bar").on("mouseup", function () {
		    	var myVideo = $("#video")[0];

		    	var currentTime = $("#seek-bar").val() / (100 / myVideo.duration);
		    	myVideo.currentTime = currentTime;
		    });

		    $("#seek-bar").on("mousedown", function () {
		    	var myVideo = $("#video")[0];
		    	myVideo.pause();
		    }); 



		}
	}
});


function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}