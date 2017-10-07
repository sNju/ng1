var app=angular.module("main.module");


/*Booking Directive*/
app.directive("booking",function($rootScope,$filter,ngToast,httpService,$window){
	return{
		restrict:'EA',
		scope:true,
		templateUrl:"directive/booking.html",
		link:function($scope,$attr,$element){
			var paymenturl;
			var verification_value;
			$scope.txtdisable=false;
			function bookingobjinit(){
				$scope.bookingobj.nop_couple=0;
				$scope.bookingobj.nop_male=0;
				$scope.bookingobj.nop_female=0;
				$scope.bookingobj.total=0;
				$scope.bookingobj.details={};
				if(Object.keys($rootScope.userinfo).length>0){
					debugger;
					$scope.bookingobj.details.name=$rootScope.userinfo.name;
					$scope.bookingobj.details.email=$rootScope.userinfo.email;
					$scope.bookingobj.details.phone=$rootScope.userinfo.phone;
					$scope.txtdisable=true;	
				}
				
			}


			$scope.$watch("$root.userinfo",function(newvalue,oldval,scope){
				if(newvalue!=oldval){
					bookingobjinit();
				}
			},true);



			(function(){
				$scope.bookingobj={};
				bookingobjinit();
			})();

			$scope.$on("bookingdetail",function(event,data){
				$scope.dataobj=data;
				$scope.bookingobj.type=$scope.dataobj.type;
				$scope.dataobj.booking=$scope.dataobj.booking||{};
				if($scope.dataobj.booking.tablebooking==true || $scope.dataobj.booking.guestlist==true){
					$scope.bookingobj.bookingtype='guestlist';
				}
			});

			$scope.selectbookingtype=function(obj,value){
				obj.bookingtype=value;
			}

			$scope.checkDate=function(data_date)
			{
				var now_date=new Date().getTime();
				return data_date.enddate<now_date;
			}

			$scope.changebookingmode=function(mode){
				$scope.bookingobj.mode=mode;
			}

			$scope.choosesegment=function(obj,index,iscall){
				if(obj!=undefined){
					$scope.$emit("setplan",true);
					if(iscall!=true){
						bookingobjinit();
					}
					$scope.plan=obj;
				//console.log("$scope.plan=",$scope.plan);
				$scope.bookingobj.segment=obj.segment;
				$scope.bookingobj.price=obj.amount;
			}
		}

		$scope.checkplanlength=function(arr){
			if(arr==undefined) {
				return false;
			}
			if(arr.length>1)
				return true;
			$scope.choosesegment(arr[0],0,true);
			return false;
		}



		$scope.calculatetotal=function(){
			$scope.bookingobj.subtotal=parseFloat($scope.bookingobj.nop_male*($scope.plan.male.amount)+$scope.bookingobj.nop_female*($scope.plan.female.amount)+$scope.bookingobj.nop_couple*($scope.plan.couple.amount));
			if($scope.dataobj.handling == undefined || $scope.dataobj.handling == null)
			{
				$scope.dataobj.handling=0;
			}

			$scope.bookingobj.total=parseFloat(JSON.stringify($scope.bookingobj.subtotal+$scope.dataobj.handling));
		}




		$scope.increment=function(type){
			switch(type){
				case 'nop_male':
				$scope.bookingobj.nop_male++;
				break;
				case 'nop_female':
				$scope.bookingobj.nop_female++;
				break;
				case 'nop_couple':
				$scope.bookingobj.nop_couple++;
				break;
			}
			$scope.calculatetotal();
		}

		$scope.decrement=function(type){
			switch(type){
				case 'nop_male':
				$scope.bookingobj.nop_male=$scope.bookingobj.nop_male>0?$scope.bookingobj.nop_male-1:$scope.bookingobj.nop_male;
				break;
				case 'nop_female':
				$scope.bookingobj.nop_female=$scope.bookingobj.nop_female>0?$scope.bookingobj.nop_female-1:$scope.bookingobj.nop_female;
				break;
				case 'nop_couple':
				$scope.bookingobj.nop_couple=$scope.bookingobj.nop_couple>0?$scope.bookingobj.nop_couple-1:$scope.bookingobj.nop_couple;
				break;
			}
			$scope.calculatetotal();

		}

		function redirectpaymentmethod(){
			$window.location=paymenturl;
		}


		$scope.submitbooking=function(obj,isvalid){
			debugger;
			var data=JSON.parse(JSON.stringify(obj));
			data.selectdate=$filter("dateddmmyyyytotimestamp")(data.selectdate);
			console.log("datadatadata",data);
			// if(($rootScope.userinfo==undefined || $rootScope.userinfo._key==undefined) && (data.details==undefined||(data.details.email==undefined||data.details.phone==undefined))){
			// 	ngToast.create({
			// 		content:"Email and Mobile field are mandatory",
			// 		className:"warning"
			// 	});
			// 	return ;
			// }
			
			if(data.bookingtype==undefined && $scope.dataobj.profile_type!=undefined){
				ngToast.create({
					content:"Please Select Preference",
					className:"warning"
				});
				isvalid=false;
			}
			
			if(isvalid==false)
				return ;

			if(data.mode==undefined){
				data.mode=$scope.dataobj.isonline==true?'online':'poa';
			}

			if(data.nop_couple==0&&data.nop_female==0&&data.nop_male==0)
			{
				ngToast.create({
					content:"Please select at least one category",
					className:"warning"
				});
				isvalid=false;
			}
			else if(data.mode==undefined)
			{
				ngToast.create({
					content:"Please Select Payment mode before proceeding",
					className:"warning"
				});

				isvalid=false;
			}

			else{
				isvalid=true;
			}
			data.to=$scope.dataobj._key;
			data.byweb=true;
			if(isvalid==true){
				data.user=0;
				if($rootScope.userinfo!=undefined&&$rootScope.userinfo._key!=undefined){
					data.user=$rootScope.userinfo._key;	
				}
				$rootScope.$emit("loading",true);
				var url=$rootScope.apiBaseUrl;
				debugger;
				url+="/order";
				console.log("data",data);
				httpService.post(url,data).then(function(response){
					console.log("response",response);
					$rootScope.$emit("loading",false);
					if(response.data!=undefined){
						
						paymenturl=response.data.order.info.paymenturl;
						console.log(paymenturl);
						if(response.data.order.verification_required==true)
						{
							$("#login-confirm").modal("show");
							verification_value=response.data.order.verification_value;
						}
						else{
							redirectpaymentmethod()
						}
					}

				},function(reason){

				});

			}
		}




		$scope.wrongcodesend=false;
		$scope.verify=function(otp,isvalid){
			if(isvalid==true){
				var obj={};
				$rootScope.$emit("childloading",true);
				obj.value=verification_value;
				obj.otp=otp;
				var url=$rootScope.apiBaseUrl+"/verify";
				httpService.post(url,obj).then(function(response){
					$rootScope.$emit("childloading",false);
					console.log("response",response);
					if(response.data!=undefined&&response.data.verify==true){
						$("#login-confirm").modal("hide");
						redirectpaymentmethod();
					}

					else{

						$scope.wrongcodesend=true;
						setTimeout(function(){
							debugger;
							$scope.wrongcodesend=false;
							$scope.$digest();
						},2000);
						$scope.$emit("otpverification",true);

						setTimeout(function(){
							$scope.$emit("otpverification",false);
						},1000);
					}
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}
		}


		
		$scope.resend=function(){
			$rootScope.$emit("childloading",true);
			var obj=new Object();
			obj.value=verification_value;
			var url=$rootScope.apiBaseUrl+"/resend";
			httpService.post(url,obj).then(function(response){
				console.log("response resend",response);
				debugger;
				$rootScope.$emit("childloading",false);
				if(response.data!=undefined){
					ngToast.create("Otp Resend");
				}
				else{
					ngToast.create({
						content:response.error.message,
						className:"warning"
					});
				}
			},function(reason){
				$rootScope.$emit("childloading",false);
			});

		}
	}
}
});




app.filter("formatbookingnumber",function(){
	return function(num){
		if(num<10)
			return "0"+num;
		return num;
	}
});

app.directive("bookingDirective",function(){
	return{
		restrict:'EA',
		scope:false,
		link:function($scope,element,attrs){
			
			var setplan=false;
			$scope.$on("setplan",function($event,set){
				setplan=set;
			});

			$(document).ready(function(){

				var slidetoggle=function(){
					if(setplan==true)
						$("#plancatagory").slideToggle("slow");
				}

				$("body").on("click",".plan",slidetoggle);
			});



			$scope.$on("$destroy",function(){
				$("body").off("click");
			});
		}
	}
})

