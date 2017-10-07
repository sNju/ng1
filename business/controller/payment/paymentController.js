var app=angular.module("payment.module",['ui-rangeSlider']);

app.controller('paymentCtrl', ['$scope','urlFactory','$http','$mdMedia','$mdDialog','ngToast','creditCardTypeCheck','makeCreditCardObjectProperFormat','creditCardHttpMethod',
	function($scope,urlFactory,$http,$mdMedia,$mdDialog,ngToast,creditCardTypeCheck,makeCreditCardObjectProperFormat,creditCardHttpMethod){
		$scope.show=true;
		$scope.$on("init",function($event){
			$scope.init();
		})

		$scope.init=function(){
			$scope.show=true;
			creditCardHttpMethod.getCreditCard().then(function(response){
				$scope.cards=makeCreditCardObjectProperFormat.make(response.data.data.paymentcard);
				$scope.show=false;
			},function(reason){
			});
		}
		$scope.cardType=function(number){
			var cardType=creditCardTypeCheck.checkCreditCardCompanyType(number);
			return cardType;
		}
		$scope.init();

		$scope.delete=function(obj,index){
			creditCardHttpMethod.delete(obj).then(function(response){
			},function(reason){

			});
		}
		$scope.toggle=function(obj,index){
			creditCardHttpMethod.toggle(obj).then(function(response){
				if(response.data.data.paymentcard.isdefault==true){
					ngToast.create("successfully default card set");
					$scope.init();
				}
				else{
					ngToast.create({
						className:"warning",
						content:"Something Went Wrong"
					})
				}

			},function(reason){
				ngToast.create({
					className:"warning",
					content:"Something Went Wrong"
				})
			});

		}


		$scope.delete=function(obj,index){
			var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
			url+="/paymentcard";
			url+="?id="+obj._key;
			var confirm=$mdDialog.confirm()
			.title('Are You Sure Want To delete')
			.textContent('')
			.ariaLabel('Lucky day')
			.targetEvent(event)
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$http.delete(url).then(function(response){
					if(response.data.data!=undefined){
						ngToast.create("successfully delete");
						$scope.init();
					}
				},function(reason){

				});

			},function(reason) {

			});
		}



	}]);


app.factory("makeCreditCardObjectProperFormat",function(){
	var obj={};
	obj.make=function(array){
		for(var i=0;i<array.length;i++){
			if(array[i].isdefault==undefined||array[i].isdefault=="false")
				array[i].isdefault=false;
			else if(array[i].isdefault=="true")
				array[i].isdefault=true;
		}
		var defaultArray=[];
		var anotherArray=[];
		for(var i=0;i<array.length;i++){
			if(array[i].isdefault==true){
				defaultArray.push(array[i])
			}
			else{
				anotherArray.push(array[i])
			}

		}
		array= defaultArray.concat(anotherArray);
		return array;
	}
	return obj;
});




app.factory('creditCardTypeCheck',function(){
	var obj={};
	obj.checkCreditCardCompanyType=function(number){

		if(number==undefined||number=="")
			return "";
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
    	return {
    		cardtype:"visa",
    		image:"images/creditCardIcon/Visa@3x.png"
    	};
	// Mastercard
	re = new RegExp("^5[1-5]");
	if (number.match(re) != null)
		return {
			cardtype:"mastercard",
			image:"images/creditCardIcon/Maestro@3x.png"
		};


    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
    	return {
    		cardtype:"amex",
    		image:"images/creditCardIcon/Maestro@3x.png"
    	};

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
    	return {
    		cardtype:"discover",
    		image:"images/creditCardIcon/Discover@3x.png"
    	};

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
    	return {
    		cardtype:"diners",
    		image:"images/creditCardIcon/Maestro@3x.png"
    	};
// Diners - Carte Blanche
re = new RegExp("^30[0-5]");
if (number.match(re) != null)
	return {
		cardtype:"diners-Carte Blanche",
		image:"images/creditCardIcon/Maestro@3x.png"
	};

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
    	return {
    		cardtype:"jcb",
    		image:"images/creditCardIcon/Maestro@3x.png"
    	};

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
    	return {
    		cardtype:"visa electoron",
    		image:"images/creditCardIcon/Maestro@3x.png"
    	};
    	

    	return "";

    }
    return obj;
});









app.directive("hasAddNewPaymentCardDialog",function($mdMedia,$mdDialog){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			$scope.status = '';
			$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');    
			$scope.addNewPaymentCardDialog=function(ev){
				                

				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
				$mdDialog.show({
					scope:$scope.$new(),
					    controller:addNewPaymentCardCtrl,
					    templateUrl: 'directive/payments/addNewCard.html',
					    parent: angular.element(document.body),
					    targetEvent: ev,
					    clickOutsideToClose:true,
					    fullscreen: useFullScreen
				})
				.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
				});

				$scope.$watch(function() {    
					return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === false);
				});
			};
		}
	}
});


function addNewPaymentCardCtrl($scope,$mdDialog,$mdMedia,ngToast,creditCardTypeCheck,creditCardHttpMethod){
	$scope.creditCardObj={};
	$scope.cardImage="";
	$scope.creditCardObj.cardtype="";
	$scope.creditCardObj.isdefault=false;
	$scope.toggleDefault=function(){
		$scope.creditCardObj.isdefault=$scope.creditCardObj.isdefault==true?false:true;
	}
	$scope.checkCreditCardCompany=function(number){
		var obj=creditCardTypeCheck.checkCreditCardCompanyType(number);
		$scope.creditCardObj.cardtype=obj.cardtype;
		$scope.cardImage=obj.image;
		
	}

	$scope.years=[
	{value:2016,year:2016},
	{value:2017,year:2017},
	{value:2018,year:2018},
	{value:2019,year:2019},
	{value:2020,year:2020}
	];
	$scope.months=[
	{value:01,month:01},
	{value:02,month:02},
	{value:03,month:03},
	{value:04,month:04},
	{value:05,month:05},
	{value:06,month:06},
	{value:07,month:07},
	{value:08,month:08},
	{value:09,month:09},
	{value:10,month:10},
	{value:11,month:11},
	{value:12,month:12}
	];
	$scope.issubmit=false;
	$scope.submit=function(data,valid){
		debugger;
		$scope.issubmit=true;
		if(valid==true){
			creditCardHttpMethod.addCreditCard(data).then(function(response){
				console.log("response",response);
				if(response.data.hasOwnProperty("error"))
					ngToast.create({
						className:"warning",
						content:response.data.error.message
					})
				else{
					$scope.issubmit=false;
					ngToast.create("Successfully Post");
					$scope.cancel();	
				}
				
			},function(reason){

			});
		}
	}

	



	$scope.cancel=function(param){
		param=param||null;
		$mdDialog.cancel();
		if(param==null)
			$scope.$emit("init");
	};
};

app.factory("creditCardHttpMethod",function($http,$q,urlFactory,$window){
	var obj={};

	obj.addCreditCard=function(data){
		var defer=$q.defer();
		data.user=$window.sessionStorage.getItem("userId");
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/paymentcard";
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.getCreditCard=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		url+="?id="+$window.sessionStorage.getItem("userId");
		url+="&target=paymentcard";
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.toggle=function(obj){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/paymentcard";
		var data={};
		data.id=obj._key;
		data.isdefault=obj.isdefault==true?false:true;
		$http.put(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.delete=function(obj){

	}
	return obj;
})

