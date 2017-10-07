var cardApp=angular.module('card.module', ["cardDirective.module","ngSanitize"]);

cardApp.controller('cardController', ['$scope','cardGridFactory',
	"$compile", function($scope,cardGridFactory,$compile){

	}]);

cardApp.factory("cardGridFactory",function($http,$q){
	var grid={};
	var defer=$q.defer();
	grid.maker=function(obj){
		var html="";
		var flag=0;

		var len=obj.length;
		var rem=0;
		for(var i=0;i<len&&i<5;i++)
		{
			//console.log("obj[i].profile_type",obj[i].profile.profile_type);
			if(i%2==0)
			{
				html+="<li>";
			}
			if(flag==0||flag==3||flag==4)
			{
				html+=['<gp-card username='+obj[i].profile.username+' isBookmarkedByme='+obj[i].bookmark+' profiletype="'+obj[i].profile.profile_type+'" profilecover="'+obj[i].profile.cover+'" profilepic="'+obj[i].profile.profile_pic+'" rating="'+obj[i].profile.rating+'" name="'+obj[i].profile.name+'"',
				'id="'+obj[i].profile._key+'"></gp-card>'].join('');	
			}
			else
			{
				html+=['<gp-card-small username='+obj[i].profile.username+' isBookmarkedByme='+obj[i].bookmark+' profiletype="'+obj[i].profile.profile_type+'" profilecover="'+obj[i].profile.cover+'" profilepic="'+obj[i].profile.profile_pic+'" rating="'+obj[i].profile.rating+'" name="'+obj[i].profile.name+'"',
				'id="'+obj[i].profile._key+'"></gp-card-small>'].join('');
			}
			if(i%2!=0)
			{
				
				html+="</li>";
			}
			flag++;
			if(flag==6)
			{
				flag=0;
			}
		}

		html+='<upgrade-plan></upgrade-plan></li>';
		return html;


	}
	return grid;

	
});
