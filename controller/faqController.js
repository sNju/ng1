(function(){
    var app=angular.module("faq.module",[]);
    app.controller("faqController",["$scope",function($scope){
        $scope.$emit("TitlePage","FAQs - GoParties | Your Party App" );

    }]);
    app.directive("faqDirective",function(){
        return{
            replace:true,
            restrict:'EA',
            scope:true,
            link:function($scope,$attr,$element){
            //  function openNav() {
            //     document.getElementById("mySidenav").style.width = "250px";
            // }

            // function closeNav() {
            //     document.getElementById("mySidenav").style.width = "0";
            // }

            $(document).ready(function() {




                var window_width = $(window).width();

                if (window_width < 768) {
                    $('.mobile-tab-nav-toggle').on('click', function(){
                       // console.log('clicked');
                        $(this).next('.list-group').slideToggle();

                    });
                };    

                $('.faq-tab-nav .list-group-item').on('click', function(e){

                    e.preventDefault();

                    var window_width = $(window).width();

                    if (window_width < 768) {

                        $(this).closest('.list-group').slideUp();

                        var active_item_text = $(this).text();

                        $('.faq-tab-nav .list-group-item').removeClass('active');
                        $(this).addClass('active');

                    //console.log(active_item_text);

                    $(this).closest('.faq-tab-nav').find('.mobile-tab-nav-toggle').html(active_item_text);

                    var index = $(this).index();
                    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
                    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
                }
                else {
                    $(this).siblings('a.active').removeClass("active");
                    $(this).addClass("active");
                    var index = $(this).index();
                    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
                    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");    
                }
            })

            /*
            $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
                e.preventDefault();
                
            });
            */
            
        });





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