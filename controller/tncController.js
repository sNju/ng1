(function(){
  var app=angular.module("tnc.module",[]);
  app.controller("tncController",["$scope",function($scope){
    $scope.$emit("TitlePage","Terms & Conditions - GoParties | Your Party App");

  }]);

  app.directive("tncDirective",function(){
    return {
      restrict:'EA',
      replace:true,
      scope:true,
      link:function($scope,$attr,$element){
       $(document).ready(function(){
        $("#forgotPassword_popup").hide();
        $("#forgotPasswordPopup").click(function(){
          $("#businessLogin_popup").hide();
          $("#forgotPassword_popup").show();
        });
        $("#loginPopup").click(function(){
          $("#forgotPassword_popup").hide();
          $("#businessLogin_popup").show();
        });
      });
     }
   }
 })
})();