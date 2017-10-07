<!DOCTYPE html>
<html ng-app="main.module">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <title>GPCA Admin Panel</title>
  <!--Font Awosome-->
  <!--   <link rel="stylesheet" href="css/font-awesome.min.css" /> -->
  <!-- Favicon-->
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="stylesheet" type="text/css" href="libjs/test/angular-material.min.css">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">

  <!-- Bootstrap Core Css -->
  <link href="plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

  <!--WaitMe Css-->
  <link href="plugins/waitme/waitMe.css" rel="stylesheet" />

  <!-- Waves Effect Css -->
  <link href="plugins/node-waves/waves.css" rel="stylesheet" />

  <!-- Bootstrap Material Datetime Picker Css -->
  <link href="plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css" rel="stylesheet" />

  <!-- Animation Css -->
  <link href="plugins/animate-css/animate.css" rel="stylesheet" />

  <!-- Bootstrap Select Css -->
  <link href="plugins/bootstrap-select/css/bootstrap-select.css" rel="stylesheet" />

  <!-- Morris Chart Css-->
  <link href="plugins/morrisjs/morris.css" rel="stylesheet" />

  <!-- Custom Css -->
  <link href="css/style.css" rel="stylesheet">
  <link href="css/external.css" rel="stylesheet">
  <link href="css/addblog.css" rel="stylesheet">

  <!-- AdminBSB Themes. You can choose a theme from css/themes instead of get all themes -->
  <link href="css/themes/all-themes.css" rel="stylesheet" />
  <style type="text/css">
    .slimScrollBar{
      width: 12px !important;
    }
  </style>
  <style>
    .ng-enter{
      transition: 2s;
      opacity: 0;
    }
    .ng-enter-active{
      opacity: 1;
    }

    .ng-leave{
      transtion: 1s;
      opacity: 1;
    }
    .ng-leave-active{
      opacity: 0;
    }
  </style>
  <style>
    .animate-if {
      background:white;
      border:1px solid black;
      padding:10px;
    }

    .animate-if.ng-enter, .animate-if.ng-leave {
      transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
    }

    .animate-if.ng-enter,
    .animate-if.ng-leave.ng-leave-active {
      opacity:0;
    }

    .animate-if.ng-leave,
    .animate-if.ng-enter.ng-enter-active {
      opacity:1;
    }
  </style>
  <!-- this is new css from business controller -->
  <style>
    textarea {
      resize: none;
    }
    .pac-container {
      z-index: 100000 !important;
    }
    .md-virtual-repeat-container.md-autocomplete-suggestions-container {
      position: absolute;
      box-shadow: 0 2px 5px rgba(0,0,0,.25);
      height: 225.5px;
      max-height: 225.5px;
      z-index: 100000;
    }

    .animate-show.ng-hide-add, .animate-show.ng-hide-remove {
      transition: all linear 0.5s;
      display: block !important;
    }

    .animate-show.ng-hide-add.ng-hide-add-active, .animate-show.ng-hide-remove {
      opacity: 0;
    }

    .animate-show.ng-hide-add, .animate-show.ng-hide-remove.ng-hide-remove-active {
      opacity: 1;
    }
  </style>
  <style type="text/css">
    input.ng-invalid.ng-dirty {
      border-color:red;
    }
    input.ng-valid.ng-dirty {
      border-color:lightgreen;
    }

    .invalidText{
      color:red;
    }
    .calTypeContainer.ng-scope.gregorian,
    .ADMdtp-calendar-container footer .today{
      display:none !important;
    }

    .ADMdtp-calendar-container .days > span > .today,
    .ADMdtp-calendar-container .days > span > .today:hover {
      background-color:#fc5f2a !important;
      color:#fff!important;
    }

    .ng-enter{
      transition: 1s;
      opacity: 0;
    }
    .ng-enter-active{
      opacity: 1;
    }

    .ng-leave{
      transtion: 1s;
      opacity: 1;
    }
    .ng-leave-active{
      opacity: 0;
    }
    /*tiny mce style*/
    .mce-menubar,#mceu_28-body,#mceu_21-body,#mceu_11,#mceu_12,#mceu_42,#mceu_43,#mceu_31,#mceu_32,#mceu_59-body,#mceu_73,#mceu_74,#mceu_62,#mceu_63,#mceu_90-body,#mceu_104,#mceu_105,#mceu_93,#mceu_94,#mceu_121-body,#mceu_152-body,#mceu_183-body{
     display:none !important;
   }
   div[id$="-body" && id^="mceu_"]{
    display: none !important;
  }
  .md-scroll-mask{
    position: initial
  }

  /*animation when image tag source chnage*/
  .animate-show.ng-hide-add, .animate-show.ng-hide-remove {
    transition: all linear 0.5s;
    display: block !important;
  }

  .animate-show.ng-hide-add.ng-hide-add-active, .animate-show.ng-hide-remove {
    opacity: 0;
  }

  .animate-show.ng-hide-add, .animate-show.ng-hide-remove.ng-hide-remove-active {
    opacity: 1;
  }

  /*angular animation*/
  .container {
    height:250px;
    width:250px;
    position:relative;
    overflow:hidden;
    border:2px solid black;
  }
  .container.cell {
    font-size:150px;
    text-align:center;
    line-height:250px;
    position:absolute;
    top:0;
    left:0;
    right:0;
    border-bottom:2px solid black;
  }
  .swap-animation.ng-enter, .swap-animation.ng-leave {
    transition:0.5s linear all;
  }
  .swap-animation.ng-enter {
    top:-250px;
  }
  .swap-animation.ng-enter-active {
    top:0px;
  }
  .swap-animation.ng-leave {
    top:0px;
  }
  .swap-animation.ng-leave-active {
    top:250px;
  }

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

/*ng-repeat animation start*/
/* Styles go here */

.example-animate-container {
  background:white;
  list-style:none;
  margin:0;
  padding:0 10px;
}

.animate-repeat {
  line-height:40px;
  list-style:none;
  box-sizing:border-box;
}

.animate-repeat.ng-move,
.animate-repeat.ng-enter,
.animate-repeat.ng-leave {
  -webkit-transition:all linear 0.1s;
  transition:all linear 0.1s;
}

.animate-repeat.ng-leave.ng-leave-active,
.animate-repeat.ng-move,
.animate-repeat.ng-enter {
  opacity:0;
  max-height:0;
}

.animate-repeat.ng-leave,
.animate-repeat.ng-move.ng-move-active,
.animate-repeat.ng-enter.ng-enter-active {
  opacity:1;
  max-height:40px;
}
/* animation end*/



</style>
<style>
  .c3-axis-y text {
   fill: red;
   font-size:12px;
 }
 .c3-axis-x text {
  font-size:12px;
  fill:purple;
}
</style>
<style>

  .partycircle {
    margin-right:9px;
  }
  .profilecircle {
    margin-right:5px;
  }

  .partyrow{
    color:#E91E63 !important ;
  }
  .artistrow{

  }
  .profilerow{
    color:#FF9800 !important;
  }
  .bandrow{

  }
  .djrow{

  }


</style>
<style>

</style>
</head>

<body ng-controller="parentController" class="theme-red" ui-sref-click notification-directive add-user-directive>

  <!-- Page Loader -->
  <div style="z-index:9999;" ng-show="parentpreloader<1" class="page-loader-wrapper full-prloader"  set-dymanic-width>
    <div class="loader">
      <div class="preloader">
        <div class="spinner-layer pl-red">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <p>Please wait...</p>
    </div>
  </div>

<!--   <div ng-show="(nestedloader||internalhttpcall)" style="top:62px;left:300px; width:auto;"  class="page-loader-wrapper half-prloader">
    <div class="loader">
      <div class="preloader">
        <div class="spinner-layer pl-red">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <p>Please wait...</p>
    </div>
  </div>
-->





   <!--  <div class="animate-if" ng-if="parentpreloader>2&&(nestedloader||internalhttpcall)" ng-include="'directive/nestedpreloader.html'" scope="" onload=""></div>
 -->
 <!-- <div ng-show="(nestedloader||internalhttpcall)" style="width: 100px;height: 100px;z-index: 1000000;background-color:blue"></div>
-->
<!-- <div ng-if="parentpreloader>2&&nestedloader" style="width: 500px;height: 500px;z-index: 1000000;background-color: red;"></div> -->

<!-- #END# Page Loader -->
<!-- Overlay For Sidebars -->
<div class="overlay"></div>
<!-- #END# Overlay For Sidebars -->
<!-- Search Bar -->
<div ng-if="islogin"  data-ng-include="'directive/adminheader.html'"></div>
<!-- #Top Bar -->

<!-- #Top Bar -->
<section>
  <!-- Left Sidebar -->
  <div ng-if="islogin"  data-ng-include="'directive/leftsidebar.html'"></div>
  <!-- <left-side-bar-template islogin="{{islogin}}"></left-side-bar-template> -->
</section>
<section class="content" >
  <div ui-view>

  </div>
</section>

<!-- Jquery Core Js -->
<script src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyDs4QGFiUhr_M9mhmA3PSR6c2T0N6HroZA"></script>
<script src="plugins/jquery/jquery.min.js"></script>

<!-- Bootstrap Core Js -->
<script src="plugins/bootstrap/js/bootstrap.js"></script>

<!-- Select Plugin Js -->


<!-- Slimscroll Plugin Js -->
<script src="plugins/jquery-slimscroll/jquery.slimscroll.js"></script>

<!-- Waves Effect Plugin Js -->
<script src="plugins/node-waves/waves.js"></script>

<!-- Jquery CountTo Plugin Js -->


<!-- Morris Plugin Js -->
<script src="plugins/morrisjs/morris.js"></script>
<script src="plugins/bootstrap-notify/bootstrap-notify.js"></script>

<script src="plugins/autosize/autosize.js"></script>
<script src="https://use.fontawesome.com/8f69748063.js"></script>
<!-- ChartJs -->
<!-- Flot Charts Plugin Js -->
<!-- Sparkline Chart Plugin Js -->
<!-- Custom Js -->
<!-- Demo Js -->
<script src="js/demo.js"></script>
<script src="libjs/angular.min.js"></script>
<script src="libjs/angular-facebook.js"></script>
<script src="libjs/test/angular-animate.min.js"></script>
<script src="libjs/test/angular-aria.min.js"></script>
<script src="libjs/test/angular-messages.min.js"></script>
<script src="libjs/test/angular-material.min.js"></script>

<script src="libjs/angular-ui-router.js"></script>

<script src="libjs/ocLazyLoad.js"></script>
<script src="js/controller/miscellaneous/commonController.js"></script>
<script src="js/controller/miscellaneous/filter.js"></script>
<script src="plugins/bootstrap-select/js/bootstrap-select.js"></script>
<!-- This javascript file use for drop down value select in angularjs -->
<script src="libjs/angular-bootstrap-select.min.js"></script>
<script src="libjs/socket.io.js"></script>
<script src="libjs/scrollglue.js"></script>
<script src="js/app.js"></script>
</body>
</html>
