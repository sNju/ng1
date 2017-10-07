<?php
// check if the cookie exists
// add the cookie with infinite expiration...
if(!$_COOKIE['firstuser']){
  setcookie('firstuser','welcome to goparties',time()+(5 * 365 * 24 * 3600));
}
$expires = 24*60*60; // 1 month in seconds
header("Pragma: public");
header("Cache-Control: maxage=".$expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');
?>
<!DOCTYPE html>
<html ng-app="main.module">
<html lang="en" hreflang="en-us">
<head>
  <?php 
  require 'header.php';
  ?>

  <script type="application/ld+json">
    {
      "@context" : "https://schema.org",
      "@type" : "Organization",
      "name" : "Go Parties",
      "url" : "https://goparties.com/",
      "logo": "https://goparties.com/images/favicon.ico",
      "sameAs" : [
      "https://www.facebook.com/goparties",
      "https://www.twitter.com/go_parties",
      "https://plus.google.com/+goparties",
      "http://instagram.com/goparties",
      "https://www.linkedin.com/company/goparties",
      "https://www.youtube.com/c/goparties"
      ]
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "B-10/8, DLF Phase I, Gurgaon, Haryana, Gurgaon",
        "addressLocality": "Delhi-NCR",
        "addressRegion": "Haryana",
        "postalCode": "122002"
      },
      "email": "support@goparties.com",
      "telePhone": "9711-9712-44",
      "url": "https://www.goparties.com",
      "paymentAccepted": [ "cash", "credit card" ],
      "openingHours": "Tu,We,Th,Fr,Sa 09:00-18:00",
      "priceRange":"$"
    }
  </script>

  <base href="/">
  <meta name="google-site-verification" content="epYT8HTbMjUdw73yVI2QSdtoObZFQHc496MQQfO0ndg" />
  <!-- <meta name="google-site-verification" content="hXTA-zi8IF09IJgNome4a6C480rFwaTtv2zEYO-bkEU" /> -->
  <meta name="p:domain_verify" content="0e5ec31ce0e8442c8963688b33cdf812"/>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <meta http-equiv="pragma" content="no-cache" /> -->
  <!-- <meta property="og:title"   content="GoParties" />
  <meta name="twitter:image" content="{{image}}">-->

  <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
  <?php
  if(strpos($_SERVER['SERVER_NAME'], 'goparties.com') !== false) {
      // echo '<link href="/css/testing.css" rel="stylesheet">';
    echo '<link href="loadcss.php?files=libcss/angular-material.min.css,libcss/bootstrap.min.css,libcss/font-awesome.css,libcss/flaticon.css,libcss/ngToast.min.css,libcss/ngToast-animations.css,css/common.css,css/home.css,css/downloadPopupPage.css,css/lightgallery.css" rel="stylesheet">';
  } else {
    ?>
    <link rel="stylesheet" type="text/css" href="/libcss/angular-material.min.css">
    <link href="/libcss/bootstrap.min.css" rel="stylesheet">
    <!-- <link rel="stylesheet" href="css/main.css"> -->
    <link href="/libcss/font-awesome.css" rel="stylesheet">   
    <link rel="stylesheet" href="/libcss/ngToast.min.css">
    <link rel="stylesheet" href="/libcss/ngToast-animations.css">
    <!--new file for home page-->
    <link href="/css/common.css" rel="stylesheet">
    <link href="/css/home.css" rel="stylesheet">
    <!--downloadPopupPage-->
    <link href="/css/downloadPopupPage.css" rel="stylesheet">
    <!--Lightgallary-->
    <link href="/css/lightgallery.css" rel="stylesheet">
    <?php
  }
  ?>
  <link href="" rel="stylesheet" ng-disabled="activetab!=''">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">



<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
      <![endif]-->

    </head>

    <body preloader-directive ng-controller="parentController" >

     <?php require 'content.php';?>

     <toast></toast>
     <div ui-view style="background-color: #f2f2f2;" class="main"></div>

     <!-- footer category start -->
     <footer-page ng-hide="loading&&!loadmore"  ng-class="{displayValue: activetab=='/ios' || activetab=='/android'}" ></footer-page>
   </div>

   <!--Scroll to Top start-->
   <a href="#" id="scrollToTop" title="Go to Top" style="display: none;" go-back-to-top>Top<span></span></a>
   <!--Scroll to Top End-->

   <!-- <div  class="preloader-wrap full-width-wrap fade-out-animation"> -->
   <div ng-show="loading&&!childloading" class="preloader-wrap full-width-wrap">
    <img class="preloader" alt="GoParties - Your Party App" src="https://s3.ap-south-1.amazonaws.com/gpcaweb/images/preloader-img.png">
    <span class="preloader-text">Grooving for you. Please wait...</span>
  </div>
</body>

<script src="libjs/jquery.min.js"></script>
<?php
echo '<script src="loadjs.php?files=libjs/bootstrap.min.js,js/slider/banner-slider/jssor.slider-21.1.6.mini.js,js/input-type-control.js,js/video-button-controler.js"></script>';
if(strpos($_SERVER['SERVER_NAME'], 'goparties.com') !== false) {
  echo '<script src="loadjs.php?files=libjs/angular.min.js,libjs/ocLazyLoad.js,libjs/angular-ui-router.min.js,libjs/angular-animate.min.js,libjs/angular-sanitize.min.js,libjs/ngToast.min.js,libjs/angular-aria.min.js,libjs/angular-messages.min.js,libjs/angular-material.min.js,libjs/ie10-viewport-bug-workaround.js,controller/commonController.js,controller/filterController.js,controller/home/homeController.js,controller/service.js,js/app.js,js/jquery.easing.min.js,js/scrolling-nav.js,js/google-analytics.js,js/loadtime.js"></script>';
} else {
  ?>
  <script src="/libjs/angular.min.js"></script>
  <script src="/libjs/ocLazyLoad.js"></script>
  <script src="/libjs/angular-ui-router.min.js"></script>
  <script src="/libjs/angular-animate.min.js"></script>
  <script src="/libjs/angular-sanitize.min.js"></script>
  <script src="/libjs/ngToast.min.js"></script>
  <script src="/libjs/angular-aria.min.js"></script>
  <script src="/libjs/angular-messages.min.js"></script>
  <script src="/libjs/angular-material.min.js"></script>
  <script src="/libjs/ie10-viewport-bug-workaround.js"></script>
  <script src="/controller/commonController.js"></script>
  <script src="/controller/filterController.js"></script>
  <script src="/controller/home/homeController.js"></script>
  <script src="/controller/service.js"></script>
  <script src="/js/app.js"></script>
  <script src="/js/jquery.easing.min.js"></script>
  <script src="/js/scrolling-nav.js"></script>
  <script src="/js/google-analytics.js"></script>    
  <script src="/js/loadtime.js"></script> 
  <?php
}
?>
<script src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.5/waypoints.min.js"></script>
<script src="https://www.google.com/jsapi"></script>
<script src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyDs4QGFiUhr_M9mhmA3PSR6c2T0N6HroZA"></script>
</html>