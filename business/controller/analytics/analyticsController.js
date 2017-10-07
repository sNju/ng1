var app=angular.module('analytics.module', []);
app.directive("analyticsDirective",function(getAnalyticsFactory,$filter,$rootScope){
	return{
		replace:true,
		scope:false,
		restrict:'EA',
		link:function($scope,$attr,$element,controller,transclude){
			$scope.show=true;
			function analyticsAssign(analytics){

				var booking=c3.generate({
					bindto: '#bookingChart',
					data: {
						x: 'x',
						columns: [
						analytics.bookingTime,
						analytics.booking
						]
					},
					axis:{
						x : {
							type : 'timeseries',
							tick: {
								format: function (x) { return convertDateFormat(x); }
							}
						},
						y: {
							label: {
								text: 'Number of Bookings',
								position: 'outer-middle'
							}
						}
					},color: {
						pattern: ['rgb(148, 103, 189)']
					}

				});
				var partyAndDeal=c3.generate({
					bindto: '#partyAndDealChart',
					data: {
						x: 'x',
						columns: [
						analytics.partyTime,
						analytics.party,
						analytics.deal,
						]
					},
					axis : {
						x : {
							type : 'timeseries',
							tick: {
								format: function (x) {return convertDateFormat(x); }
							}
						},
						y: {
							label: {
								text: 'Number of Party And Deal',
								position: 'outer-middle'
							}
						}
					},
					color:{
						pattern:['rgb(44, 160, 44)','rgb(214, 39, 40)']
					}
				});

				var myWorkChart=c3.generate({
					bindto: '#myWorkChart',
					data: {
						x: 'x',
						columns: [
						analytics.workTime,
						analytics.work

						]
					},
					axis : {
						x : {
							type : 'timeseries',
							tick: {
								format: function (x) {return convertDateFormat(x); }
							}
						},
						y: {
							label: {
								text: 'Number of Works',
								position: 'outer-middle'
							}
						}
					},
					color:{
						pattern:['rgb(255, 127, 14)']
					}
				});

				var social=c3.generate({
					bindto: '#socialChart',
					data: {
						x: 'x',
						columns: [
						analytics.postTime,
						analytics.post
						]
					},
					axis : {
						x : {
							type : 'timeseries',
							color:"green",
							tick: {
								format: function (x) { return convertDateFormat(x); }
							}
						},
						y: {
							label: {
								text: 'Number of Post',
								position: 'outer-middle'
							}
						}
					}

				});

				var all=c3.generate({
					bindto: '#allAnalytics',
					data: {
						x: 'x',
						columns: [
						analytics.partyTime,
						analytics.post,
						analytics.work,
						analytics.party,
						analytics.deal,
						analytics.booking
						]
					},
					transition: {
						duration: 500
					},
					axis : {
						x : {
							type : 'timeseries',
							tick: {
								format: function (x) { return convertDateFormat(x); }
							}
						},
						y: {
							label: {
								text: 'Number of Item',
								position: 'outer-middle'
							}
						}
					}
				});	

				booking.load({
					done: function() {
						$(window).trigger('resize');}
					});
				all.load({
					done: function() {$(window).trigger('resize');}
				});

				partyAndDeal.load({
					done: function() {$(window).trigger('resize');}
				});
				
			}

			function convertDateFormat(time){

				var day=time.getDate()<10?("0"+time.getDate()):time.getDate();
				var month=time.getMonth()<10?("0"+time.getMonth()):time.getMonth();
				var year=time.getFullYear();

				return $filter("dateFormat")(day+"-"+month+"-"+year," ");
			}


			$scope.booking=[];
			$scope.deal=[];
			$scope.party=[];
			$scope.post=[];
			$scope.work=[];

			Date.prototype.yyyymmdd = function(){
			  var mm = this.getMonth() + 1; // getMonth() is zero-based
			  var dd = this.getDate();
			  return [this.getFullYear(), !mm[1] && '-', mm, !dd[1] && '-', dd].join(''); // padding
			};

			var defaultobj={};
			defaultobj.booking=["booking",0];
			defaultobj.bookingTime=["x",new Date().yyyymmdd()];
			defaultobj.deal=["deal",0];
			defaultobj.deal=["Deal",0];
			defaultobj.dealTime=["x",new Date().yyyymmdd()];
			defaultobj.party=["Party",0];
			defaultobj.partyTime=["x",new Date().yyyymmdd()];
			defaultobj.post=["Post",0];
			defaultobj.postTime=["x",new Date().yyyymmdd()];
			defaultobj.work=["Work",0];
			defaultobj.workTime=["x",new Date().yyyymmdd()];
			$scope.init=function(){
				
				getAnalyticsFactory.getAnalyticsUpdated().then(function(response){
					$scope.analytics=response.data.data.analytics;
					$scope.analyticsData=getAnalyticsFactory.makeAnalyticsArrayUpdated($scope.analytics);
					analyticsAssign($scope.analyticsData);
					$scope.show=false;
				},function(reason){

				});
			}

			$scope.init();
		}
	}
});

app.factory("getAnalyticsFactory",function($http,$q,urlFactory,$filter,$window){
	var obj={};
	function isExist(timeObj,data){
		data.startdate=parseInt(data.startdate);
		data.enddate=parseInt(data.enddate);
		if((timeObj.start<=data.startdate&&timeObj.end>=data.startdate)||
			(timeObj.start<=data.enddate&&timeObj.end>=data.enddate)||
			(data.enddate>=timeObj.end&&timeObj.end>=data.startdate)||
			(data.enddate>=timeObj.start&&timeObj.start>=data.startdate)){
			return true;
	}
	return false;
}

obj.getAnalytics=function(){
	var defer=$q.defer();
	var endDate=new Date().getTime();
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()
	var startRawDate=new Date(year,month-1,day).getTime();
	var startDate=startRawDate-24*10*60*60*1000;
	var url="http://52.77.185.79:6789/analytics?startdate="+startDate+"&enddate="+endDate;
	$http.get(url).then(function(response){
		defer.resolve(response);
	},function(reason){
		defer.reject(reason);
	})
	return defer.promise;
}

obj.getAnalyticsUpdated=function(){
	var defer=$q.defer();
	var endDate=new Date().getTime();
	var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
	url+=urlFactory.getUrl("profile").value;
	url+="?id="+$window.sessionStorage.getItem("userId")+"&target=analytics&until="+endDate;
	$http.get(url).then(function(response){
		defer.resolve(response);
	},function(reason){
		defer.reject(reason);
	});
	return defer.promise;
}

obj.getRawDate=function(){
	var endDate=new Date().getTime();
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()
	var startDate=new Date(year,month-1,day).getTime();
	var timeArray=[];
	for(var i=0;i<10;i++){
		timeArray.push({
			start:startDate,
			end:endDate
		});
		endDate=startDate-1;
		startDate=startDate-24*60*60*1000;
	}
	return timeArray;
}


obj.makeAnalyticsArray=function(data){
	var bookingArray=data.booking;
	var dealArray=data.deal;
	var partyArray=data.party;
	var workArray=data.work;
	var postArray=data.post;
	var analyticsData={};
	analyticsData.party=[]
	analyticsData.deal=[]
	analyticsData.booking=[]
	analyticsData.work=[]
	analyticsData.post=[]
	analyticsData.time=[];
	var timeArray=obj.getRawDate();
	for(var i=0;i<10;i++){
		var booking=0;
		var party=0;
		var deal=0;
		var work=0;
		var post=0;
		for(var j=0;j<bookingArray.length;j++){
			if(isExist(timeArray[i],bookingArray[j])==true){
				booking++;
			}
		}

		for(var j=0;j<dealArray.length;j++){
			if(isExist(timeArray[i],dealArray[j])==true){
				deal++;
			}
		}

		for(var j=0;j<partyArray.length;j++){
			if(isExist(timeArray[i],partyArray[j])==true){
				party++;
			}
		}

		for(var j=0;j<workArray.length;j++){
			if(timeArray[i].start<=workArray[j].createdat&&timeArray[i].end>=workArray[j].createdat){
				work++;
			}
		}
		for(var j=0;j<postArray.length;j++){
			if(timeArray[i].start<=postArray[j].createdat&&timeArray[i].end>=postArray[j].createdat){
				post++;
			}
		}

		analyticsData.party.push(party);
		analyticsData.deal.push(deal);
		analyticsData.booking.push(booking);
		analyticsData.work.push(work);
		analyticsData.post.push(post);
		analyticsData.time.push($filter("timeStampToDate")(timeArray[i].start/1000,"yyyy-mm-dd","-",1).substring(0,10));

	}

	analyticsData.time.push('x');
	analyticsData.booking.push("Booking");
	analyticsData.party.push("Party");
	analyticsData.deal.push("Deal");
	analyticsData.work.push("Work");
	analyticsData.post.push("Post");
	analyticsData.party.reverse();
	analyticsData.deal.reverse();
	analyticsData.booking.reverse();
	analyticsData.work.reverse();
	analyticsData.time.reverse();
	analyticsData.post.reverse();
	return analyticsData;
}
obj.makeAnalyticsArrayUpdated=function(analyticsData){
	var formatData={};
	formatData.booking=[];
	formatData.bookingTime=[];
	formatData.party=[];
	formatData.partyTime=[];
	formatData.deal=[];
	formatData.dealTime=[];
	formatData.work=[];
	formatData.workTime=[];
	formatData.post=[];
	formatData.postTime=[];
	formatData.booking.push("Booking");
	formatData.bookingTime.push("x");
	formatData.party.push("Party");
	formatData.partyTime.push("x");
	formatData.deal.push("Deal");
	formatData.dealTime.push("x");
	formatData.work.push("Work");
	formatData.workTime.push("x");
	formatData.post.push("Post");
	formatData.postTime.push("x");



	for(var i=0;i<analyticsData.booking.length;i++){
		formatData.booking.push(analyticsData.booking[i].count);
		formatData.bookingTime.push($filter("timeStampToDate")(analyticsData.booking[i].day,"yyyy-mm-dd","-",1).substring(0,10));
	}
	for(var i=0;i<analyticsData.party.length;i++){
		formatData.party.push(analyticsData.booking[i].count);
		formatData.partyTime.push($filter("timeStampToDate")(analyticsData.party[i].day,"yyyy-mm-dd","-",1).substring(0,10));
	}
	for(var i=0;i<analyticsData.deal.length;i++){
		formatData.deal.push(analyticsData.deal[i].count);
		formatData.dealTime.push($filter("timeStampToDate")(analyticsData.deal[i].day,"yyyy-mm-dd","-",1).substring(0,10));
	}
	for(var i=0;i<analyticsData.work.length;i++){
		formatData.work.push(analyticsData.work[i].count);
		formatData.workTime.push($filter("timeStampToDate")(analyticsData.work[i].day,"yyyy-mm-dd","-",1).substring(0,10));
	}
	for(var i=0;i<analyticsData.post.length;i++){
		formatData.post.push(analyticsData.work[i].count);
		formatData.postTime.push($filter("timeStampToDate")(analyticsData.post[i].day,"yyyy-mm-dd","-",1).substring(0,10));
	}
	return formatData;
}

return obj;
});
