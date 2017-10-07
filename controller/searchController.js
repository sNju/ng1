var app=angular.module("main.module");
app.controller('searchController', ['$scope','cachedataservice','$timeout','$rootScope','httpService','$filter','$httpParamSerializer','genreCoversionFactory','autoCompleteThemeGenreAndProfile','$location',
	function($scope,cachedataservice,$timeout,$rootScope,httpService,$filter,$httpParamSerializer,genreCoversionFactory,autoCompleteThemeGenreAndProfile,$location){
		$(document).ready(function(){
			$('[data-toggle="tooltip"]').tooltip();
		});



		$scope.$watch("filterobj",function(newVal,oldval,scope){
			if(newVal!=oldval){
				if($rootScope.loadmore==false){
					newVal.since=0;
					newVal.limit=$rootScope.paginationcount;
					
					
				}
				$scope.changefilterobj(newVal);
				$scope.$broadcast("changefilterobj");
			}
		},true);

		$scope.selectallcategory=function(){
			$scope.selectall=true;
			for(var i in arguments){
				var category=arguments[i];
				if($scope.filterobj.category.indexOf(category)>=0){

				}
				else{
					$scope.filterobj.category.push(category);
				}
			}
		}




		$scope.checkcategory=function(category){
			if($scope.filterobj.category.indexOf(category)>=0){
				return 'active';
			}
		}

		

		function converttwodigit(num){
			return num<10?'0'+num:num;
		}

		$scope.setSearchDate=function(day){
			var date=new Date();
			date.setDate(date.getDate()+day);
			date=converttwodigit(date.getMonth()+1)+"/"+converttwodigit(date.getDate())+"/"+date.getFullYear();
			timestamp=new Date(date).getTime();
			$scope.filterobj.date=$filter("timestamptobootstrapdate")(timestamp);
		}



		$scope.filterbyType=function(category){
			switch(category){
				case 'table':
				$scope.filterobj.tablebooking=true;
				$scope.filterobj.guestlist=false;
				$scope.filterobj.category=[];
				break;
				case 'guest':
				$scope.filterobj.tablebooking=false;
				$scope.filterobj.guestlist=true;
				$scope.filterobj.category=[];
				break;
			}
		}

		$scope.changecategory=function(category){
			delete $scope.filterobj.category;
			$scope.filterobj.category=[];
			$scope.filterobj.category[0]=category;
			$scope.filterobj.tablebooking=false;
			$scope.filterobj.guestlist=false;
		}


		
		function dateCalculation(filterdate){

			if(filterdate==undefined || filterdate==""){
				return deafultfilterobjshow.date;
			}
			filterdate=parseInt(filterdate);
			var date=new Date();
			date=converttwodigit(date.getMonth()+1)+"/"+converttwodigit(date.getDate())+"/"+date.getFullYear();
			var today=new Date(date).getTime();
			var tomorrow=today+24*60*60*1000;
			var dayafter=tomorrow+24*60*60*1000;

			switch(filterdate){
				case today:
				return "Today";
				break;
				case tomorrow:
				return "Tomorrow";
				break;
				case dayafter:
				return "Day After";
				break;
				default:
				date=new Date(filterdate);
				return converttwodigit(date.getDate())+"/"+converttwodigit(date.getMonth()+1)+"/"+date.getFullYear()
			}
		}

		function sortbyAnalysis(sort){
			switch(sort){
				case 'r':
				return 'Recommended';
				break;
				case 't':
				return 'Trending';
				break;
				case 'n':
				return 'Near You';
				break;
				default:
				return deafultfilterobjshow.sortby;
			}

		}



		function filterbyType(obj){
			if(obj.guestlist=="true")
				return 'Guest List';
			if(obj.tablebooking=="true")
				return 'Book Table';
			debugger;
			if(obj.category!=undefined&&obj.category.length>0){
				if(obj.category.toLowerCase().indexOf('party')>-1)
					return 'Party';
				else return 'Performers';
			}
			return deafultfilterobjshow.category;
		}



		var deafultfilterobjshow={};
		deafultfilterobjshow.date='Pick a Date';
		deafultfilterobjshow.category='Filter by Type';
		deafultfilterobjshow.sortby='Sort By';

		$scope.filterobjshow={};
		$scope.filterobjshow.date=deafultfilterobjshow.date;
		$scope.filterobjshow.category=deafultfilterobjshow.category;
		$scope.filterobjshow.sortby=deafultfilterobjshow.sortby;

		function filterobjectShowSetting(obj){
			$scope.filterobjshow.date=dateCalculation(obj.date);
			$scope.filterobjshow.category=filterbyType(obj)
			$scope.filterobjshow.sortby=sortbyAnalysis(obj.sort)
		}




		function prepareobjectgetdata(obj){
			var object=Object.assign({},obj);
			object.genre=genreCoversionFactory.convertGenreToString(object.genre);
			object.theme=genreCoversionFactory.convertGenreToString(object.theme);
			object.date=$filter("bootstrapdatetotimestamp")(object.date);
			if(Array.isArray(object.category)){
				object.category=object.category.join(",");
			}
			return object;
		}

		function prepareobjectsetfilterobject(obj){
			var object=Object.assign({},obj);
			object.genre=genreCoversionFactory.makergenreArray(object.genre);
			object.theme=genreCoversionFactory.makergenreArray(object.theme);

			if(object.category!=undefined&&object.category!=""){
				object.category=object.category.split(',');
			}

			else{
				object.category=[];
			}

			if(object.deal!=undefined){
				object.deal=JSON.parse(object.deal);
			}
			if(object.guestlist!=undefined){
				object.guestlist=JSON.parse(object.guestlist);
			}
			if(object.tablebooking!=undefined){
				object.tablebooking=JSON.parse(object.tablebooking);
			}

			object.date=$filter("timestamptobootstrapdate")(object.date);

			if(object.genre==undefined){
				object.genre=[];
			}
			if(object.theme==undefined){
				object.theme=[];
			}
			return object;
		}


		$scope.searchGenre=function(query){

			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
		}

		$scope.searchTheme=function(query){

			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
		}


		$scope.changefilterobj=function(object){
			var obj=prepareobjectgetdata(object);
			if(obj.address==undefined||obj.address==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			var path=$location.path();
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}
			$timeout(function(){ 
				$location.url(path);
			},1);
		}



		$scope.getdata=function(obj){
			filterobjectShowSetting(obj);
			$rootScope.$emit("childloading",true);
			var url=$rootScope.apiBaseUrl;
			url+="/search_v2";
			url+='?'+$httpParamSerializer(obj);
			$scope.$emit("TitlePage","Search GoParties | Your Party App");
			cachedataservice.getlocal(url).then(function(response){
				$scope.parse(response);	
			});
			httpService.get(url).then(function(response){
				$scope.parse(response);
			},function(reason){

			})
		}

		$


		$scope.parse=function(response){
			if(response!=undefined){
				$rootScope.$emit("childloading",false);
				//console.log(response);
				if($rootScope.loadmore==true){
					for(index in response.data.search){
						$scope.cards.push(response.data.search[index]);
					}
				}
				else if(response.data!=undefined){
					$scope.cards=response.data.search;
				}


				if($scope.register==false){
					$scope.$on("$locationChangeStart",function(){
						$scope.urlchange();
					});
				}

				if(response.data!=undefined&&response.data.search.length>=$rootScope.paginationcount){
					$scope.loadshow=true;
				}
				else{
					$scope.loadshow=false;
				}
				$rootScope.$emit("loadmore",false);
				$scope.register=true;

				

			}
		}
		

		$scope.$on("txtlocation",function($event,obj){
			$scope.filterobj.address=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.changefilterobj($scope.filterobj);
		});

		$scope.$on("txtlocationtext",function($event,val){
			if(val==undefined||val==""){
				$scope.filterobj.address=val;
				$scope.changefilterobj($scope.filterobj);
			}
		});


		$scope.urlchange=function(load){

			$scope.getdata($location.search());
		}

		$scope.init=function(load){
			$rootScope.keyword=$location.search().keyword;
			var data=$location.search();
			data.since=0;
			data.limit=(data.limit<=0||isNaN(data.limit))?10:data.limit;
			$scope.filterobj=prepareobjectsetfilterobject(data);
			$scope.getdata($location.search());
		}

		$scope.register=false;
		$scope.init(false);
	}]);


app.directive("searchDirective",function($location,$httpParamSerializer){
	return {
		restrict:'EA',
		scope:false,
		link:function($scope,$element,attr){
			

			$scope.$on("changefilterobj",function(){
				if($(".dropdown").hasClass("open")){
					$(".dropdown").removeClass("open");
				}
			});


			$scope.checkvisible=function(filtername,filterobj){
				var obj=$location.search();
				switch(filtername){
					case 'deal':
					if(obj.category!=undefined&&obj.category.indexOf("band")>-1)
					{
						filterobj.deal=false;
						return false;
					}
					break;
					case 'date':
					if((obj.category!=undefined&&obj.category.indexOf("band")>-1) ||
						(obj.guestlist!=undefined && obj.guestlist=="true") || 
						(obj.tablebooking!=undefined && obj.tablebooking=="true"))
					{
						delete filterobj.date;
						return false;
					}
					break;
					case 'near':
					if(obj.category!=undefined&&obj.category.indexOf("band")>-1)
					{
						return false;
					}
					default:return true;
				}
				return true;
			}




			$(document).ready(function(){
				function isOnScreen(element)
				{
					var scrolltop=$(window).scrollTop();
					var curPos = element.offset();
					var curTop = curPos.top;
					var screenHeight = $(window).height();
					return scrolltop+screenHeight>curTop;

				}
			});
		}
	}
});

app.directive("stopFilter",function(){
	return {
		restrict:'EA',
		scope:false,
		link:function($scope,$element,attr){
			$(document).ready(function(){
				var filterPosition = 0;
				var setWidth = $('#filters').parent().width();
				


				$(window).scroll(function()
				{
					var scrollPos = $('#secondary').height() + $('#primarynav').height() + $('#filters').height() - $(window).height() + 100;
					if((document.body.scrollTop > scrollPos || document.documentElement.scrollTop > scrollPos)) {
						$('#filters').addClass('stopFilter').css('width',setWidth);
					}
					else{
						$('#filters').removeClass('stopFilter');//.css('width',setWidth);;
					}


					if($(window).scrollTop() + $(window).height() > $(document).height() - $("#footer").height()) {
						if(filterPosition==0){
							filterPosition = ($('#footer').offset().top - $('#filters').height() - 60);
							$('#filters').removeClass('stopFilter');//.css('width',setWidth);;
							$('#filters').css({top:filterPosition + 'px', position:'absolute', width: setWidth});
						} 
					} else {
						if(filterPosition!=0) {
							$('#filters').removeAttr("style");
							$('#filters').addClass('stopFilter').css('width',setWidth);;
							filterPosition = 0;
						}
					}
				});

			});
		}
	}
});


