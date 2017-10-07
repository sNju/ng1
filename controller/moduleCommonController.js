var app=angular.module("main.module");

app.directive("uploadClickDirective",function(){
	return{
		restrict:'EA',
		link:function($scope,$element,$attr){
			$(document).ready(function(){
			//alert("here");
				$("body").on("click",".fb-content",function(event){
				console.log("events",event);
					$(this).closest(".cover-img").siblings(".fileupload").click();
				});

			})
		}
	}
});

app.directive("imageUpload",function($parse){
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
				var reader = new FileReader;
				reader.readAsDataURL(element[0].files[0]);
				$scope.$apply(function(){
					for(var i=0;i<element[0].files.length;i++)
					{
						fileArray.push(element[0].files[i]);
					}
					reader.onload=function() {
						var eventname=attrs.imageUpload;
						var image=new Image();
						image.src=reader.result;

						var obj={};
						obj.images=fileArray;
						obj.image=image;
						console.log("eventname",eventname);
						$scope.$emit(eventname,obj);
					};
				});
			});
		}
	}
});


app.factory("autoCompleteThemeGenreAndProfile",function($q,$http,$window,$rootScope,httpService){
	var obj={};
	var genre=[];
	var theme=[];
	var called=false;
	function getsearchData(data){
		return data.map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}

	obj.loadTheme=function(){
		if(theme==""&&called==false){
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/theme";

			$http({
				method:'GET',
				url:url,
				headers:{
					authorization:"public"
				}
			}).then(function(response){
				called=true;
				theme=response.data.data.theme;
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		return getsearchData(theme);
	};

	obj.querySearch=function(query,method) {
		if(query==null||query=="")
		{
			return obj.loadStates();
		}
		var results = query ? obj[method]().filter(function(state){
			var lowercaseQuery = angular.lowercase(query);
			return (state.value.indexOf(lowercaseQuery) === 0);
		}) :  obj[method]();
		if(results.length==0)
		{
			results.push({
				value: query.toLowerCase(),
				display: query,
				image:"",
				name:query.toUpperCase(),
				email:""
			})
		}
		return results;
	};

	obj.loadGenre=function()
	{
		if(genre==""){
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/"+"genre";

			$http({
				method:'GET',
				url:url,
				headers:{
					authorization:"public"
				}
			}).then(function(response){
				genre=response.data.data.genre;
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			})
		}
		return getsearchData(genre);
	}

	obj.loadProfile=function(){
		var allStates = 'Alabamaaaaaaaaaaa, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
		Florida, Georgia, aawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
		Maine, Maryland, aassachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
		Nebraska, Nevada, aew Hampshire, New Jersey, New Mexico, New York, North Carolina,\
		North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
		South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
		Wisconsin, Wyoming';
		return allStates.split(/, +/g).map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}
	obj.loadGenre();
	obj.loadTheme();
	return obj;
});






app.factory("genreCoversionFactory",function(){
	var obj={};
	obj.makergenreArray=function(string){
		if(string==null||string=="")
			return new Array();
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
		for(var i=0;i<genres.length-1;i++){
			genre+=genres[i].display+",";
		}
		if(genres.length>0)
			genre+=genres[genres.length-1].display;
		return genre;
	}
	return obj;
});

