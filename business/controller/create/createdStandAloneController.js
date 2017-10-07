var app=angular.module("createdDeals.module",["create.module"]);
app.controller('createdDealsCtrl', ['$scope','$location','updateDealFactory','countDealAndFactory','ngToast','$stateParams','$filter','getCreatedDeal','$compile','createDealCardGridMaker',
	function($scope,$location,updateDealFactory,countDealAndFactory,ngToast,$stateParams,$filter,getCreatedDeal,$compile,createDealCardGridMaker){
		$scope.deals=[];
		$scope.init=function(){
			$scope.show=true;
			$scope.category=$stateParams.category;
			getCreatedDeal.getMyDeal().then(function(response){
				var data=response.data.data.deal;
				$scope.deals=data;
				$scope.come=true;
				$scope.categoryObj=countDealAndFactory.countSpecificType(data);
				$scope.show=false;
			},function(reason){

			})
		}
		$scope.come=false;
		$scope.default=function(length){
			if(length==0&&$scope.come==true)
				return 'directive/create/defaultdeal.html';
			return "";
		}
		$scope.enbaleAndDisable=function(key,status){
			status=status==null?false:status;
			updateDealFactory.changeStatus(key,status).then(function(response){
				if(status==true){
					ngToast.create("Deal Successfully Disabled");
					$location.path("createdStandAloneDeals/archived");
				}
				else
				{
					ngToast.create("Deal Successfully Enabled");
					$location.path("createdStandAloneDeals/live");
				}
			},function(reason){
				ngToast.create({
					className:"warning",
					content:"Something Went Wrong"
				});
			});
		}
		
		$scope.$on("statusChange",function(event,key,status){
			$scope.enbaleAndDisable(key,status);
		});
		$scope.init();
	}]);

app.factory("updateDealFactory",function($http,$q,$window,urlFactory,$mdDialog){
	var obj={};
	obj.changeStatus=function(key,status){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("deal").value;
		var obj={};
		obj.id=key;
		obj.isactive=status==false?true:false;
		var text=status==false?"Enable":"Disable";
		var confirm=$mdDialog.confirm()
		.title('Are You Sure Want To '+text+' This Deal')
		.textContent('')
		.ariaLabel('Lucky day')
		.targetEvent(event)
		.ok('Yes')
		.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.put(url,obj).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
		},function(reason) {
			
		});
		return defer.promise;
	}
	return obj;
});

app.factory("countDealAndFactory",function(){
	var obj={};
	obj.countSpecificType=function(array){
		var data={};
		var timestamp=new Date().getTime();
		data.all=array.length;
		data.live=0;
		data.archived=0;
		data.draft=0;
		for(var i=0;i<array.length;i++){
			if(array[i].isactive==true&&timestamp<=array[i].enddate)
				data.live++;
			else if((array[i].isactive==false||timestamp>array[i].enddate)&&array[i].isactive!=null)
				data.archived++;
			else data.draft++;

		}
		
		return data;
	}
	return obj;
});



app.factory("getCreatedDeal",function($http,$q,$window,urlFactory){
	var obj={};
	obj.getMyDeal=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId")+"&target=deal";
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});

app.factory("createDealCardGridMaker",function(makePartyAndDealArrayProper){
	var obj={};
	obj.CardGrid=function(array){
		var keyArray=["isactive","_key","country","startdate","enddate","locaiton","title","thumburl"];
		array=makePartyAndDealArrayProper.formatArray(array,keyArray);
		var html='<li><gp-create-deal-plus></gp-create-deal-plus>';
		for(var i=0;i<5&&i<array.length;i++){
			if(i==1||i==3)
				html+='<li>';
			if(i==0||i==1||i==4){
				html+='<gp-deal-card-small isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-deal-card-small>';
			}
			else{
				html+='<gp-deal-card isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-deal-card>';
			}
			
			if(i==0||i==2||i==4)
				html+='</li>';
		}
		if(array.length>=5){
			for(var i=5;i<array.length;i++){
				var index=(i-5)%6;
				if(index%2==0){
					html+='<li>';
				}

				if(index==0||index==3||index==4){
					html+='<gp-deal-card isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-deal-card>';
				}
				else
				{
					html+='<gp-deal-card-small isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-deal-card-small>';
				}
				if(index%2!=0){
					html+='</li>';
				}

			}
		}
		return html;
	}
	return obj;
});

app.directive("gpDealCardSmall",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		templateUrl:'directive/create/gpDealCardSmall.html',
		link:function($scope,element,attr,controller,transclude){
			$scope._key=attr.key;
			$scope.startdate=attr.startdate;
			$scope.locaiton=attr.locaiton;
			$scope.title=attr.title;
			$scope.thumburl=attr.thumburl;
			$scope.isactive=attr.isactive;

		}
		
	}
});
app.directive("gpDealCard",function(calculateRemainTime){
	return{
		restrict:'EA',
		replace:true,
		scope:{
			dealObj:'='
		},
		templateUrl:'directive/create/gpDealCard.html',
		link:function($scope,element,attr,controller,transclude){
			// if($scope.dealObj.isactive==true)
			// 	$scope.dealObj.isactive='true';
			// else if($scope.dealObj.isactive==false){
			// 	$scope.dealObj.isactive='false';
			// }	
			$scope.enbaleAndDisable=function(key,state){
				$scope.$emit("statusChange",key,state);
			}
			$scope.getRemainTime=function(date){
				return calculateRemainTime.calculate_remainingtime(date)+" "+calculateRemainTime.calculateDays_string(date);
			}
			
		}
		
	}
});
app.directive("gpCreateDealHeader",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:'directive/create/gpCreateDealHeader.html',
		link:function($scope,element,attr,controller,transclude){
		}
	}
});

app.directive("gpCreateDealPlus",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		templateUrl:'directive/create/gpCreateDealPlus.html',
		link:function($scope,element,attr,controller,transclude){
		}
	}
});


app.filter("filterPartyAndDeal",function(){
	return function(array,category){
		var timestamp=new Date().getTime();
		return array.filter(function(obj){
			
			if(category=="all"){
				return true;
			}
			else if((timestamp>obj.enddate&&category=="archived")&&obj.isactive!=null){
				obj.isactive=false;
				return true;
			}
			else if(category=="live"&&obj.isactive==true&&timestamp<obj.enddate){
				obj.isactive=true;
				return true;
			}
			else if(category=="archived"&&obj.isactive==false&&obj.isactive!=null){
				obj.isactive=false;
				return true;
			}
			else if((category=="draft")&&(obj.isactive==null)){
				return true;
			}
			else return false;
		});
	}
});
