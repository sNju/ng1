<!DOCTYPE html>
<html ng-app="app.module">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GoParties - Your Party App</title>
    <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
    <link href="libcss/bootstrap.min.css" rel="stylesheet">
    <link href="css/landing-page.css" rel="stylesheet">

    <!-- Facebook Open Graph Meta Tags -->
    <meta property="og:url" content="http://www.goparties.com/android">
    <meta property="og:type" content="article">
    <meta property="og:title" content="Go get the GoParties Android App from Play Store">
    <meta property="og:description" content="The new style the world Parties! Get your Party App right now:">
    <meta property="og:image" content="http://goparties.com/images/gp-logo-big.png">

    <!-- Twitter Card -->    
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="http://www.goparties.com/android">
    <meta name="twitter:title" content="Go get the GoParties Android App from Play Store">
    <meta name="twitter:description" content="The new style the world Parties! Get your Party App right now:">
    <meta name="twitter:image" content="http://goparties.com/images/gp-logo-big.png">

    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script src="libjs/angular.min.js"></script>
        <script>
            var app=angular.module('app.module', []);
            app.controller('androidController', ['$scope', function($scope){
                $scope.second=3;
                $scope.init=function(){
                    if($scope.second==0){
                        window.location = "https://play.google.com/store/apps/details?id=com.goparties.gpuser&hl=en";
                    }
                    else{
                        setTimeout($scope.elapsed,1000);
                    }
                }
                $scope.elapsed=function(){
                 $scope.second--;
                 $scope.$digest();
                 $scope.init();
             }

             $scope.init();
         }]);
     </script>

     <style>
        html,
        body {
            height:100%;
        }

        body {
            padding:0;
        }

        /* Full Screen Wrapper */
        .full-screen-wrapper {
            display:-webkit-flex;
            display:flex;
            width:100%;
            height:100%;

            -webkit-flex-direction:column;
            flex-direction:column;
        }

        .full-screen-wrapper .flex-wrap,
        .has-gp-bg {
            background:url('../images/bg.png') repeat rgba(90, 19, 133, .85);
            background-color:#fff;


            -webkit-flex:1;
            flex:1;

            display:-webkit-flex;
            display:flex;

        /*
            -webkit-flex-direction:column;
                    flex-direction:column;
                    */
                    -webkit-align-items:center;
                    align-items:center;
                    -webkit-justify-content:center;     
                    justify-content:center;

                }

                .flex-item {
                    text-align:center;
                    color:#000;
                }

                .logo-text h1 {
                    font-family:'misoregular';
                    font-size:35px;
                    line-height:normal;
                    font-weight:700;
                    margin:0;
                    color:#965fb8;
                    letter-spacing:.02em;
                    text-transform:uppercase;
                }

                .logo-text p {
                    font-family:'jenna_sueregular';    
                    font-size:28px;
                    margin:0;
                    padding:0;
                    font-weight:bold;
                    line-height:normal;
                }

                .flex-item .gp-logo {
                    display:inline-block;
                    float:none;
                    max-height:120px;
                    margin-bottom:10px;
                }

                .msg {
                    margin-top:15px;
                    font-size:16px;
                }


            </style>
            
        </head>
        <body ng-controller="androidController">

            <div class="full-screen-wrapper">
                <div class="flex-wrap has-gp-bg">
                    <div class="flex-item center-content">
                        <div class="gp-logo-wrap">
                            <img class="gp-logo" src="images/goparties-logo-big.png">
                        </div>
                        <div class="logo-text">
                            <h1>GoParties</h1>
                            <p>Your Party App</p>
                        </div>

                        <p class="msg">Redirecting you to Play Store in {{second}} sec</p>
                    </div>  
                </div>
            </div>        

        </body>
        </html>