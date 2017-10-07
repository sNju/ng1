var card=angular.module("cardDirective.module",[]);
card.controller('dirController', ['$scope', function($scope){
	
}]);


card.directive("gpCard",function($rootScope){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/gp-profileCard.html",
		link:function($scope,element,attr,controller,transclude){
			if(attr.profilepic.length>0)
				$scope.profilepic=attr.profilepic
			else
				$scope.profilepic="https://s3-ap-southeast-1.amazonaws.com/gopartiesnew/images/gpba-images/user-default-pic.jpg";	
			
			$scope.isbookmarkedbyme=attr.isbookmarkedbyme;
			//console.log("$scope.isbookmarkedbyme",$scope.isbookmarkedbyme);
			$scope.profiletype=attr.profiletype;
			$scope.id=attr.id;
			$scope.profilecover=attr.profilecover;
			$scope.name=attr.name;
			$scope.username=attr.username;
			$scope.rating=attr.rating;
			$scope.book=function(profiletype,name,profilepic,id){
				$scope.showPopUp(profiletype,name,profilepic,id);
			}
		}
	};
});
card.directive("gpCardSmall",function($rootScope){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/gp-profileCardSmall.html",
		link:function($scope,element,attr,controller,transclude){
			if(attr.profilepic.length>0)
				$scope.profilepic=attr.profilepic
			else
				$scope.profilepic="https://s3-ap-southeast-1.amazonaws.com/gopartiesnew/images/gpba-images/user-default-pic.jpg";	
			
				$scope.isbookmarkedbyme=attr.isbookmarkedbyme;
				//console.log("$scope.isbookmarkedbyme",$scope.isbookmarkedbyme);
				$scope.profiletype=attr.profiletype;
				$scope.id=attr.id;
				$scope.profilecover=attr.profilecover;
				$scope.name=attr.name;
				$scope.username=attr.username;
				$scope.rating=attr.rating;
				$scope.book=function(profiletype,name,profilepic,id){
					$scope.showPopUp(profiletype,name,profilepic,id);
				}

				

			}
		}
	});
card.directive("upgradePlan",function(){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/upgradePlan.html",
		link:function($scope,element,attr,controller,transclude){
			
		}
	}
});
card.directive("showInterestModal",function(){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/showInterestModal.html",
		link:function($scope,element,attr,controller,transclude){
		}
	}
});