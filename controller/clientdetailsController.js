var app=angular.module("main.module");
app.controller('clientdetailsController', ['$scope','Upload','$filter','genreCoversionFactory','autoCompleteThemeGenreAndProfile','$stateParams','$rootScope','httpService','$location'
	,function($scope,Upload,$filter,genreCoversionFactory,autoCompleteThemeGenreAndProfile,$stateParams,$rootScope,httpService,$location){
		$scope.userobj={};
		$scope.userobj.genre=[];
		$scope.userobj.theme=[];
		$scope.userobj.performing=[];

		$scope.$on("txtlocation",function($event,data){
			$scope.userobj.location=data.value;
			$scope.userobj.latitude=data.latitude;
			$scope.userobj.longitude=data.longitude;

		});
		$scope.getuser=function(id){
		    debugger;
			var url=$rootScope.apiBaseUrl;
			url+="/onboardinglink/?token="+id;
			httpService.get(url).then(function(response){

			console.log("apiresponse",response);
			if(response.data!=undefined && response.data.data.user.token==undefined){
            	 $scope.isedit=false;
                 $scope.$emit("poperror","error");
            }
            else if(response.data!=undefined && response.data.data.user.token!=id){
                $scope.isedit=false;
                $scope.$emit("poperror","error");
            }
           	else if(response.data!=undefined && response.error==undefined && response.data.data.user.token!=undefined){
					$scope.isedit=true;
					var user=response.data.data.user;
                    $scope.parse(user);
			}

			else if(response.error!=undefined && response.data==undefined){
				    $scope.isedit=false;
				    $scope.$emit("poperror","error");
			}


			},function(reason){

			});
		}

		$scope.image=function(data,type){
			if(data==undefined){
				if(data==undefined && type=='cover'){
					return "https://s3.ap-south-1.amazonaws.com/gpcaweb/default/past-4.jpg";
				}

				if(data==undefined && type=='profilepic'){
					return "https://s3.ap-south-1.amazonaws.com/gpcaweb/default/profile2.jpg";
				}
			}
			else{
				return data;
			}
		}
		$scope.parse=function(user){
			user.genre=genreCoversionFactory.makergenreArray(user.genre);
			user.theme=genreCoversionFactory.makergenreArray(user.theme);
			user.performing=genreCoversionFactory.makergenreArray(user.performing);
			if(user.booking==undefined||user.booking.header==undefined){
				if(user.booking==undefined)
					user.booking={};
				user.booking.header=[];
			}
			var header=[];
			for (var key in user.booking.header) {
				if (user.booking.header.hasOwnProperty(key))
					header.push({
						"key":key,
						"val":user.booking.header[key]
					});
			}
            var header=[];

            for (var key in user.booking.header) {
           				if (user.booking.header.hasOwnProperty(key))
           					header.push({
           						"key":key,
           						"val":user.booking.header[key]
           					});
           			}
           user.booking.header=header;


			if(user.booking.header.length==0){
				$scope.addsegment(user.booking.header);
			}

			user.booking.starttime=$filter("timestamptotime")(user.booking.starttime);
			user.booking.endtime=$filter("timestamptotime")(user.booking.endtime);
			if(user.manager==undefined){
				user.manager=[];
			}
			if(user.deal!=undefined){
				user.deal.startdate=$filter("timestamptodatetimepickerformat")(user.deal.startdate);
				user.deal.enddate=$filter("timestamptodatetimepickerformat")(user.deal.enddate);
			}
			if(user.manager.length==0){
				$scope.addmanager(user.manager);
			}

			$scope.userobj=user;
		}


		$scope.searchTheme=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadTheme");
		}


		$scope.searchGenre=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
		}


		$scope.searchProfile=function(query){
			return autoCompleteThemeGenreAndProfile.querySearch(query,"loadProfile");
		}

		$scope.imageupload=function(file,target){
			var url=$rootScope.apiBaseUrl;
			$rootScope.$emit("childloading",true);
			url+="/uploadfile";
			(function(file) {
				var data={};
				data.file=file;
				file.status = Upload.upload({
					url: url,
					data:data,
					file: file,
					headers:{
						authorization:"public"
					}
				}).progress(function(evt) {
					file.loadingPercent=Math.round(evt.loaded * 100 / evt.total);
				}).success(function(response) {
					$scope.userobj[target]=response.data.file.fileurl;
					$rootScope.$emit("childloading",false);
				});
			})(file);
		}

		$scope.$on("profilecover",function($event,object){
			$scope.userobj.cover=object.image.src;
			$scope.imageupload(object.images[0],'cover');
			$scope.$digest();
		});

		$scope.$on("profilepic",function($event,object){
			$scope.userobj.profile_pic=object.image.src;
			$scope.imageupload(object.images[0],'profile_pic');
			$scope.$digest();
		});

		$scope.updateprofile=function(data){

			var url=$rootScope.apiBaseUrl;
			url+="/updateuser/?token="+$stateParams.token;
			httpService.post(url,data).then(function(response){
				$rootScope.$emit("loading",false);
				if(response.data!=undefined){
					$scope.$emit("popsuccess","Awesome","Details updated successfully");
				}
				else{

					$scope.$emit("poperror","error");
				}

			},function(reason){

			});
		}


		$scope.$on("popsuccess",function($event,head,message){
			$(document).ready(function() {
				$scope.heading=head;
				$scope.message=message;

				$('#successmodal').modal('show');
				$('body').removeClass('modal-open').addClass('modal-openNew');
				$('.clicktocall').appendTo('body');


			})
		});

		$scope.$on("poperror",function($event,data){
			$(document).ready(function() {
				$('#tokenexpired').modal('show');
				$('body').removeClass('modal-open').addClass('modal-openNew');
				$('.clicktocall').appendTo('body');

			})
		});


		$scope.makeprofileobject=function(data,isvalid,checkbox){
			if(isvalid==true && checkbox==true){
				$rootScope.$emit("loading",true);
				var object=JSON.parse(JSON.stringify(data))
				object.genre=genreCoversionFactory.convertGenreToString(object.genre);
				object.theme=genreCoversionFactory.convertGenreToString(object.theme);
				var header={};
				var manager=[];

				for(index in object.booking.header){
					var obj=object.booking.header[index];
					if(angular.equals({}, obj)!=true)
						header[obj.key]=obj.val;
				}

                for(key in object.manager){
                    if(object.manager[key].email!="" && object.manager[key].name!="" && object.manager[key].phone!=""){
                        manager.push({"email": object.manager[key].email,"name":object.manager[key].name,"phone":object.manager[key].phone});

                    }
                }
                object.manager=manager;
				object.booking.header=header;

				object.booking.starttime=$filter("timetotimestamp")(object.booking.starttime);
				object.booking.endtime=$filter("timetotimestamp")(object.booking.endtime);

				if(object.deal!=undefined){
					if(object.deal.startdate!=undefined){
						object.deal.startdate=$filter("dateddmmyyyytotimestamp")(object.deal.startdate);
					}
					if(object.deal.enddate!=undefined){
						object.deal.enddate=$filter("dateddmmyyyytotimestamp")(object.deal.enddate);
					}
				}

				if(object.latitude!=undefined && object.longitude!=undefined){
					object.geo=[];
					object.geo.push(object.latitude);
					object.geo.push(object.longitude);
				}
				if($scope.isedit==true){

					$scope.updateprofile(Object.assign({},object));
				}

			}

		}

		$scope.deletesegment=function(array,index){
			array.splice(index,1);
		}

		$scope.addsegment=function(array){
			if(array==undefined)
				array=[];
			array.push({"key":"","value":""});
		}

		$scope.addmanager=function(array){
			if(array==undefined)
				array=[];
			array.push({"name":"","email":"","phone":""});

		}

		$scope.init=function(){
			$scope.isedit=false;
			if($stateParams.token!=undefined){
				$scope.getuser($stateParams.token);
			}

		}

		$scope.init();


	}]);

app.directive("validateDate",function(){
	return{
	restrict:'EA',
	link:function($scope,$attr,$element){
    	$(document).ready(function () {
               $('#endtime').bootstrapMaterialDatePicker({date: false,format: 'HH:mm'}).on('change', function(e, date)
               {
                    $('#starttime').bootstrapMaterialDatePicker('setMaxDate', date);
               });

               $('#starttime').bootstrapMaterialDatePicker({date: false,format: 'HH:mm'}).on('change', function(e, date)
               {
                 $('#endtime').bootstrapMaterialDatePicker('setMinDate', date);
               });

               $('#dealenddate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
               {
                    $('#dealstartdate').bootstrapMaterialDatePicker('setMaxDate', date);
               });

               $('#dealstartdate').bootstrapMaterialDatePicker({ weekStart : 0 ,format: 'DD MMMM YYYY - HH:mm'}).on('change', function(e, date)
               {
                 $('#dealenddate').bootstrapMaterialDatePicker('setMinDate', date);
               });

             });//end ready function
	}
  }
});