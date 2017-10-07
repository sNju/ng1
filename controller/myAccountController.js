var app=angular.module("main.module");

app.controller('myAccountController1', ['$scope','ngToast','Upload','$rootScope','httpService','$timeout'

    ,function($scope,ngToast,Upload,$rootScope,httpService,$timeout){

        $scope.init=function(){

            $scope.userobj=Object.assign({},$rootScope.userinfo);

        }

        $scope.init();

        $scope.editclick=function(){

            $scope.init();

            $scope.phonesave=false;

            $scope.emailsave=false;

            $scope.otpsendEmail=true;

            $scope.otpsendPhone=true;

            $scope.otpresendEmail=false;

            $scope.otpresendPhone=false;

            $scope.imgloader=false;

            $scope.editborder=false;

            $scope.namesave=false;

            $scope.isedit=$scope.isedit==true?false:true;   

        }

        $scope.uploadpic=function(file,target){

            var url=$rootScope.devapiBaseUrl;

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

                    

                    $scope.imgloader=true;

                    

                }).success(function(response) {

                    response.data=response.data||{};

                    response.data.file=response.data.file||{};

                    $scope.userobj[target]=response.data.file.fileurl;

                    //console.log("$scope.userobj",$scope.userobj);

                    $scope.imgloader=false;

                });

            })(file);

        }

        $scope.$on("profilepic",function($event,object){

            $scope.userobj.profile_pic=object.image.src;

            $scope.uploadpic(object.images[0],'profile_pic');

            $scope.$digest();

        });

        $scope.updateemail=function(value,isvalid){

            if(isvalid==true){

                var data={};

                data.user=$scope.userobj._key;

                data.email=value;

                var url=$rootScope.apiBaseUrl+"/addemail"

                httpService.post(url,data).then(function(response){

                    //console.log("updateemail response",response);

                    $scope.otpsendEmail=true;

                    $scope.otpresendEmail=false;

                    response.data=response.data||{};

                    if(response.data.addemail){

                        $("#email-update-modal").modal('show');

                    }

                    else{

                        ngToast.create({

                            content:'Email id already added with another account',

                            className:"warning"

                        });

                    }

                },function(reason){

                })

            }

        }

        $scope.addemailresend=function(value,isvalid){

            if(isvalid==true){

                $scope.blink=true;

                var data={};

                data.user=$scope.userobj._key;

                data.email=value;

                var url=$rootScope.apiBaseUrl+"/addemailresend"

                httpService.post(url,data).then(function(response){

                    $scope.blink=false;

                   // console.log("updateemailresend response",response);

                    $scope.otpsendEmail=false;

                    $scope.otpresendEmail=true; 

                    response.data=response.data||{};

                    if(response.data.addemail){

                        //console.log(response);

                    }

                    else{

                        ngToast.create({

                            content:'Email id already added with another account',

                            className:"warning"

                        });

                    }

                },function(reason){

                })

            }

        }

        $scope.verifyemailcall=function(otp,isvalid){

            if(isvalid==true){

                var data={};

                data.user=$scope.userobj._key;

                data.email=$scope.userobj.email;

                data.otp=otp;

                var url=$rootScope.apiBaseUrl+"/verifyemail"

                httpService.post(url,data).then(function(response){

                    response.data=response.data||{};

                    //console.log("verifyemail response",response);

                    if(response.data.verifyemail){

                        $scope.emailsave=false;

                        $rootScope.$emit("userinfo",{"email":data.email});

                        $("#email-update-modal").modal('hide');   

                        ngToast.create({

                            content:'Successfully Updated & Saved',

                            className:"success"

                        });

                        $scope.otpsendEmail=true;

                        $scope.otpresendEmail=false;

                    }

                    else{

                        $scope.verifyemailstatus=!response.data.verifyemail;

                        setTimeout(function(){

                            $scope.verifyemailstatus=false;

                            $scope.$digest();

                        },1000);

                    }

                    

                },function(reason){

                })

            }

        }

        $scope.updatephone=function(value,isvalid){

            if(isvalid==true){

                var data={};

                data.user=$scope.userobj._key;

                data.phone=value;

                var url=$rootScope.apiBaseUrl+"/addphone"

                httpService.post(url,data).then(function(response){

                    $scope.otpsendPhone=true;

                    $scope.otpresendPhone=false;

                    response.data=response.data||{};

                    if(response.data.addphone){

                        $("#phone-update-modal").modal('show');

                    }

                    else{

                        ngToast.create({

                            content:'Phone number already registered with another account',

                            className:"warning"

                        });

                    }

                    //console.log("updatephone response",response);

                },function(reason){

                })

            }

        }

        $scope.updatephoneresend=function(value,isvalid){

            if(isvalid==true){

                $scope.blink1=true;

                var data={};

                data.user=$scope.userobj._key;

                data.phone=value;

                var url=$rootScope.apiBaseUrl+"/addphoneresend"

                httpService.post(url,data).then(function(response){

                    $scope.blink1=false;

                    response.data=response.data||{};

                    $scope.otpsendPhone=false;

                    $scope.otpresendPhone=true;

                    if(response.data.addphone){

                        //console.log(response)

                    }

                    else{

                        ngToast.create({

                            content:'Phone number already registered with another account',

                            className:"warning"

                        });

                    }

                    //console.log("updatephoneresend response",response);

                },function(reason){

                })

            }

        }

        $scope.verifyphonecall=function(otp,isvalid){

            if(isvalid==true){

                var data={};

                data.user=$scope.userobj._key;

                data.phone=$scope.userobj.phone;

                data.otp=otp;

                var url=$rootScope.apiBaseUrl+"/verifyphone"

                httpService.post(url,data).then(function(response){

                    response.data=response.data||{};

                   // console.log("verifyphone response",response);

                    if(response.data.verifyphone){

                        $scope.phonesave=false;

                        $rootScope.$emit("userinfo",{"phone":data.phone});

                        $("#phone-update-modal").modal('hide');

                        ngToast.create({

                            content:'Successfully Updated & Saved',

                            className:"success"

                        });

                        $scope.otpsendPhone=true;

                        $scope.otpresendPhone=false;

                    }

                    else{

                        $scope.verifyphonestatus=!response.data.verifyphone;

                        setTimeout(function(){

                            $scope.verifyphonestatus=false;

                            $scope.$digest();

                        },1000);                    }

                    },function(reason){

                    })

            }

        }

        $scope.updateuserinfo=function(obj,isvalid){

            let data={};

            data.profile_pic=obj.profile_pic;

            data.name=obj.name;

            if(isvalid){

                var url=$rootScope.apiBaseUrl+"/profile/"+obj._key

                httpService.put(url,data).then(function(response){

                    response.data=response.data||{};

                    if(response.data.profile!=undefined){

                        ngToast.create({

                            content:'Successfully Updated & Saved',

                            className:"success"

                        });

                        $rootScope.$emit("userinfo",{"name":data.name,"profile_pic":data.profile_pic});

                        $scope.editclick();

                    }

                   // console.log("response come from update information",response);

                },function(reason){

                });

            }

        }

    }]);

app.directive("imageUpload",function($parse){

    return{

        replace:true,

        restrict:'EA',

        scope:true,

        link:function($scope,element,attrs,controller,transclude){

            var model = $parse(attrs.fileModel);

            var modelSetter = model.assign;

            var fileArray=[];

            

            element.bind('change', function(){

                fileArray=[];

                var reader = new FileReader;

                reader.readAsDataURL(element[0].files[0]);

                $scope.$apply(function(){

                    for(var i=0;i<element[0].files.length;i++)

                    {

                        fileArray.push(element[0].files[i]);

                    }

                    reader.onload=function() {

                        var eventname=attrs.imageUpload;

                        var image=new Image();

                        image.src=reader.result;

                        var obj={};

                        obj.images=fileArray;

                        obj.image=image;

                        $scope.$emit(eventname,obj);

                    };

                });

            });

        }

    }

});

app.directive('focus', function($timeout) {

    return {

        link: function ($scope, element, attrs) {

            attrs.$observe("focus", function(newValue){

                if (newValue === "true")

                    $timeout(function(){

                        element[0].focus()

                        $scope.editborder=true;

                    });

            });

        }

    };

});