var app=angular.module("createdParties.module",["create.module"]);
app.controller('createdPartiesCtrl', ['$scope','countDealAndFactory','ngToast','$location','updatePartyFactory','$filter','$stateParams','getCreatedParty','$compile','createPartyCardGridMaker',
	function($scope,countDealAndFactory,ngToast,$location,updatePartyFactory,$filter,$stateParams,getCreatedParty,$compile,createPartyCardGridMaker){
		$scope.parties=[];

		$scope.init=function(){
			$scope.show=true;
			$scope.category=$stateParams.category;
			getCreatedParty.getMyParty().then(function(response){
				var data=response.data.data.party;
				$scope.parties=data;
				$scope.come=true
				$scope.categoryObj=countDealAndFactory.countSpecificType(data);
				$scope.show=false;
			},function(reason){
			});
		}
		$scope.come=false;
		$scope.getDefaultPage=function(length){
			if($scope.come==true&&length==0){
				return 'directive/create/defaultparty.html';
				return "";
			}
		}

		$scope.enbaleAndDisable=function(key,status){
			debugger;
			status=status==null?false:status;
			updatePartyFactory.changeStatus(key,status).then(function(response){
				if(status==true){
					ngToast.create("Party Successfully Disabled");
					$location.path("createdParties/archived");
				}
				else
				{
					ngToast.create("Party Successfully Enabled");
					$location.path("createdParties/live");
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

app.factory("updatePartyFactory",function($http,$q,$window,urlFactory,$mdDialog){
	var obj={};
	obj.changeStatus=function(key,status){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("party").value;
		var obj={};
		obj.id=key;
		obj.isactive=status==false?true:false;
		var text=status==false?"Enable":"Disable";
		var confirm=$mdDialog.confirm()
		.title('Are You Sure Want To '+text+' This Party')
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


app.factory("getCreatedParty",function($http,$q,$window,urlFactory){
	var obj={};
	obj.getMyParty=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId")+"&target=party";
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});


app.factory("createPartyCardGridMaker",function(makePartyAndDealArrayProper,$rootScope){
	var obj={};
	obj.CardGrid=function(array){
		//$filter('shiftArray')($scope.videoArray,$scope.videoIndex);
		
		var keyArray=["isactive","_key","country","startdate","enddate","locaiton","title","thumburl"];
		array=makePartyAndDealArrayProper.formatArray(array,keyArray);
		var html='<li><gp-create-party-plus></gp-create-party-plus>';
		for(var i=0;i<5&&i<array.length;i++){
			if(i==1||i==3)
				html+='<li>';
			if(i==0||i==1||i==4){
				html+='<gp-party-card-small isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-party-card-small>';
			}
			else{
				html+='<gp-party-card isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-party-card>';
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
					html+='<gp-party-card isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-party-card>';
				}
				else
				{
					html+='<gp-party-card-small isactive="'+array[i].isactive+'" locaiton="'+array[i].locaiton+'" key="'+array[i]._key+'" thumburl="'+array[i].thumburl+'" title="'+array[i].title+'" startdate="'+array[i].startdate+'"></gp-party-card-small>';
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

app.directive("gpPartyCardSmall",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		templateUrl:'directive/create/gpPartyCardSmall.html',
		link:function($scope,element,attr,controller,transclude){
			//["_key","country","startdate","enddate","locaiton","title","thumburl"];
			$scope._key=attr.key;
			$scope.startdate=attr.startdate;
			$scope.locaiton=attr.locaiton;
			$scope.title=attr.title;
			$scope.thumburl=attr.thumburl;
			$scope.isactive=attr.isactive;
		}
		
	}
});
app.directive("gpPartyCard",function(calculateRemainTime){
	return{
		restrict:'EA',
		replace:true,
		scope:{
			partiesObj:'=partiesObj'
		},
		templateUrl:'directive/create/gpPartyCard.html',
		link:function($scope,element,attr,controller,transclude){
			$scope.enbaleAndDisable=function(key,state){
				$scope.$emit("statusChange",key,state);
			}
			$scope.getRemainTime=function(date){
				return calculateRemainTime.calculate_remainingtime(date)+" "+calculateRemainTime.calculateDays_string(date);
			}
		}
		
	}
});
app.directive("gpCreatePartyHeader",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		templateUrl:'directive/create/gpCreatePartyHeader.html',
		link:function($scope,element,attr,controller,transclude){

		}
	}
});

app.directive("gpCreatePartyPlus",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		templateUrl:'directive/create/gpCreatePartyPlus.html',
		link:function($scope,element,attr,controller,transclude){
		}
	}
});

app.filter("localPartyAndDealFilter",function(){
	return function(array,search){
		return array.filter(function(obj){
			return (search==undefined||obj.title.toLowerCase().indexOf(search.toLowerCase())>=0||
				obj.description.toLowerCase().indexOf(search.toLowerCase())>=0||(obj.locaiton.toLowerCase().indexOf(search.toLowerCase())>=0));
		})
	}
})