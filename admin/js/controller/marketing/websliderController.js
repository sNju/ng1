var app=angular.module("slider.module",['main.module','ui.sortable']);
app.controller("websliderController",["$scope","$rootScope","sliderObjectStateSave","partyandpartySpotobject","$location","$filter","httpService","$httpParamSerializer",
	function($scope,$rootScope,sliderObjectStateSave,partyandpartySpotobject,$location,$filter,httpService,$httpParamSerializer){

		
		var parentindex;
		var childindex;
		$scope.list=[];
		for (var i = 1; i <= 6; i++){
			$scope.list.push({
				text: 'Item ' + i,
				value: i
			});
		}

		$scope.setIndex=function(i){
			parentindex=i;
			$scope.selectparty();
		}

		$scope.selectparty=function(){
			$rootScope.prevurl=$location.url();
			sliderObjectStateSave.set($scope.sliders,parentindex-1);
			$location.url("/objectselection");
		}


		$scope.removeparty=function(obj,index){
			obj.splice(index,1);
		}



		function parse(rangeobj,data){
			var day=24*60*60*1000;
			for(var i=rangeobj.startdate;i<=rangeobj.enddate;i=i+day)
			{
				var check=data.find(function(element){
					if(parseInt(element._key)==i)
						return true;
					return false;
				});

				if(check==undefined){
					data.push({
						_key:i,
						party:[]
					});
				}
			}


			data.sort(function(a,b){
				return parseInt(a._key)-parseInt(b._key);
			});
			$scope.sliders=data;
			$scope.savenow=true;
			
			console.log("$scope.sliders",$scope.sliders);
		}






		$scope.slders=[];
		$scope.getAndSpreadSlider=function(obj){
			if(obj.startdate!=undefined && obj.enddate!=undefined){
				var object={};
				object.startdate=$filter("dateddmmyyyytotimestamp")(obj.startdate);
				object.enddate=$filter("dateddmmyyyytotimestamp")(obj.enddate);
				var url=$rootScope.apiBaseUrl;
				url+="/getsliderparty?"+$httpParamSerializer(object);
				httpService.get(url).then(function(response){
					if(response.data!=undefined){
						parse(object,response.data.sliderparty)	
					}

				},function(reason){

				});
			}
		}

		$scope.saveslider=function(data){
			console.log("$scope.sliders",$scope.sliders);
			var url=$rootScope.apiBaseUrl;
			url+="/postsliderparty";
			httpService.post(url,data).then(function(response){
				if(response.data!=undefined){
					$scope.sliders={};
					$scope.$emit("status","successfully update slider","alert-success",response.data,undefined);
				}
				else{
					$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
				}
				console.log("response come from",response);
			},function(resolve){

			});
		}




		function setslider(partyobj){
			parentindex=sliderObjectStateSave.getIndex().parentindex;
			if(parentindex<0){
				for(var i=0;i<$scope.sliders.length;++i){
					$scope.sliders[i].party.push(partyobj);
				}
			}
			else{
				$scope.sliders[parentindex].party.push(partyobj);
			}
		}




		$scope.init=function(){
			$scope.sliders=sliderObjectStateSave.get();
			var partyobj=partyandpartySpotobject.getprofiles();
			partyandpartySpotobject.resetprofiles();
			console.log("keys",Object.keys(partyobj).length);
			if(Object.keys(partyobj).length>0){
				$scope.savenow=true;
				setslider(partyobj);
			}
		}





		$scope.init();

	}]);



app.factory("sliderObjectStateSave",function(){
	var obj={};
	var slider=[];
	var index={};
	obj.get=function(){
		return slider;
	}

	obj.getIndex=function(){
		return index;
	}

	obj.set=function(data,parentindex){
		slider=data;
		index.parentindex=parentindex;
	}

	obj.push=function(data){
		slider.push(data);
	}
	return obj;
});


app.directive("gpCard",function($window){
	return {
		replace:true,
		scope:{
			'party':'@',
			'calbackFn':'&'
		},
		templateUrl:'directive/gpcard.html',
		link:function($scope,element,$attr,controller,transclude){
			
			$attr.$observe("party",function(value){
				$scope.party=$window.JSON.parse($scope.party);
			});
		}
	}
});
