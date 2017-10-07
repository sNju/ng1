var app=angular.module('createAvailability.module', ["create.module"]);
app.controller('createAvailabilityCtrl', ['$scope','validationRuleFactory','ngToast','AvailabilityOperation','urlFactory', 
	function($scope,validationRuleFactory,ngToast,AvailabilityOperation,urlFactory){
		
		$scope.minfromdate=new Date().getTime()-24*60*60*1000;
		$scope.validate=validationRuleFactory.getRegEx();
		$scope.isSubmit=false;
		$scope.postAvailability=function(obj,isValid,form){
			debugger;
			$scope.isSubmit=true;
			var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
			url+="/availability";
			if(isValid==true){
				if($scope.isEdit==false){
					AvailabilityOperation.post(url,obj).then(function(response){
						ngToast.create("Successfullly post availability");
						$scope.init();
						$scope.renderCalendar();
						$scope.isSubmit=false;
					},function(reason){

					});
				}
				else{
					url+="/"+obj._key;
					AvailabilityOperation.edit(url,obj).then(function(response){
						ngToast.create("Successfullly update");
						$scope.init();
						$scope.renderCalendar();
						$scope.isSubmit=false;
					},function(reason){

					});
				}
			}
		}
		
		$scope.$on("edit",function($event,obj){
			$scope.obj=obj;
			$scope.isEdit=true;

		})
		$scope.init=function(){
			$scope.isEdit=false;
			$scope.obj={};
			$scope.obj.minprice=0;
			$scope.obj.maxprice=5000;
		}
		$scope.init();

	}]);

app.factory("AvailabilityOperation",function($http,$q,$window,dateFactory){
	var obj=new Object();
	obj.post=function(url,data){
		data.user=$window.sessionStorage.getItem("userId");
		data.startdate=dateFactory.converttoTimeStamp(data.startdate,"dd-mm-yyyy");
		data.enddate=dateFactory.converttoTimeStamp(data.enddate,"dd-mm-yyyy")+1;
		var defer=$q.defer();
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.get=function(url){
		var defer=$q.defer();
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.edit=function(url,data){
		data.startdate=dateFactory.converttoTimeStamp(data.startdate,"dd-mm-yyyy");
		data.enddate=dateFactory.converttoTimeStamp(data.enddate,"dd-mm-yyyy")+1;
		var defer=$q.defer();
		$http.put(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.delete=function(url){
		var defer=$q.defer();
		$http.delete(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})


app.factory("generateCalendarEvent",function($filter){
	var obj=new Object();
	obj.generate=function(array,startdate,enddate){
		var day=24*60*60*1000;
		var event=[];

		while(startdate<enddate){
			event.push({
				title:0,
				start:startdate,
				end:startdate+day,
				className:"deal"
			});
			startdate+=day;
		}
		event.forEach(function(element){
			array.forEach(function(eventObj){
				if((element.start<=eventObj.enddate&&eventObj.enddate<element.end)||(element.start<=eventObj.startdate&&eventObj.startdate<element.end)||(eventObj.startdate<=element.start&&eventObj.enddate>=element.end)||(eventObj.startdate<element.end&&eventObj.enddate>=element.end)){
					// element.title++
					//console.log("eventObj.startdate<=element.start&&eventObj.enddate>=element.end",eventObj.startdate<=element.start&&eventObj.enddate>=element.end);
					element.title=undefined;
				}
			});
		})
		
		event=event.filter(function(element){
			if(element.title==0)
			{
				return false;
			}
			else{
				element.start=$filter("timeStampToDate")(element.start,"yyyy-mm-dd","-",1,1);
				element.end=$filter("timeStampToDate")(element.end,"yyyy-mm-dd","-",1,1);
				return true;
			}
		});

		
		return event;

	}
	return obj;
});


app.directive("masterCalendarDirective",function($mdMedia,$timeout,$q,generateCalendarEvent,ngToast,$mdDialog,$rootScope,$window,AvailabilityOperation,urlFactory){
	return{
		restrict:'EA',
		scope:false,
		replace:true,
		link:function($scope,$element,attr,controller,transclude){
			var calendarstartdate,calendarenddate;
			$scope.getAvail=function(startdate,enddate){
				debugger;
				$scope.availabilities=[];
				// startdate=startdate|null;
				// enddate=enddate|null;
				var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
				url+="/profile";
				url+="?id="+$window.sessionStorage.getItem("userId");
				url+="&target=availability";
				var defer=$q.defer();
				AvailabilityOperation.get(url).then(function(response){
					$scope.availabilities=response.data.data.availability;
					defer.resolve(generateCalendarEvent.generate($scope.availabilities,startdate,enddate));
					
				},function(reason){
					defer.reject(reason);
				});
				return defer.promise;
			}

			$scope.edit=function(obj){
				$("#manageAvailabilityModal").modal("hide");
				$("#insertAvailabilityModal").modal("show");
				$scope.$emit("edit",obj);
			}

			$scope.delete=function(id,event,index){
				var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
				url+="/availability/"+id;
				var confirm = $mdDialog.confirm()
				.title('Are You Sure Want To delete This Item')
				.textContent('')
				.ariaLabel('Lucky day')
				.targetEvent(event)
				.ok('Yes')
				.cancel('No');
				$mdDialog.show(confirm).then(function(){
					AvailabilityOperation.delete(url).then(function(response){
						$scope.availabilities=response.data.data.availability;
						$scope.renderCalendar();
						ngToast.create("Successfully entry delete");
					},function(reason){

					});
				},function(){

				})
			}

			$(document).ready(function(){
				initilaizeCalendar([]);
				$timeout(function(){
					$('#calendar').fullCalendar('render')
				},100);
			});
			
			$scope.renderCalendar=function(){
				$("#insertAvailabilityModal").modal("hide");
				$scope.getAvail(calendarstartdate,calendarenddate).then(function(response){
					addEventSource(response);
				},function(reason){

				});
			}

			function initilaizeCalendar(eventArray)
			{
				$('#calendar').html("");
				$('#calendar').fullCalendar({
					contentHeight:($(window).width()<768?410:800),
					
					header: {
						left: 'title',
						center: '',
						right: 'prev,next'
					},
					events:eventArray,
					dayClick: function(date, jsEvent, view) {
					},
					eventClick:function(calEvent,jsEvent,view)
					{
					},
					viewRender: function (view, element) {
						var date= $('#calendar').fullCalendar('getDate');
						date=date._d;
						var year=date.getFullYear();
						var month=date.getMonth();
						calendarstartdate=new Date(year,month,1).getTime();
						calendarenddate=new Date(year,month+1,0).getTime();
						$scope.getAvail(calendarstartdate,calendarenddate).then(function(response){
							addEventSource(response);
						},function(reason){

						});
					}
				});
			}

			function addEventSource(eventArray)
			{	$('#calendar').fullCalendar( 'removeEvents');
			$('#calendar').fullCalendar( 'addEventSource', eventArray);
			$('#calendar').fullCalendar( 'rerenderEvents' );
		}

		$('td.fc-day').mouseover(function() {
			var strDate = $(this).data('date');
			$(this).addClass('fc-highlight');
		});
		$('td.fc-day-number').mouseover(function() {
			var strDate = $(this).data('date');
			$("td.fc-day").filter("[data-date='" + strDate + "']").addClass('fc-highlight');
		});
		$('td.fc-day').mouseout(function() {
			$(this).removeClass('fc-highlight');
		})
		$('td.fc-day-number').mouseout(function() {
			var strDate = $(this).data('date');
			$("td.fc-day").filter("[data-date='" + strDate + "']").removeClass('fc-highlight');
		})
	}
}
});


