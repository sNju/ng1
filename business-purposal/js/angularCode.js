var app=angular.module('mainModule', []);
app.controller('mainCtrl', ['$scope', 
    function($scope){


}]);

app.directive("scrollPage",function(){
    return{
        restrict:'EA',
        scope:false,
        link:function($scope,$attr,$element){
$(document).ready(function() {

$(window).scroll(function(event) {
        Scroll();
    });

$('.navbar-collapse ul li a').on('click', function() {  
        $('html, body').animate({scrollTop: $(this.hash).offset().top - 68}, 1000);
        return false;
    });

function Scroll() {
        var contentTop  =   [];
        var winTop      =   $(window).scrollTop();
       $('.navbar-collapse').find('.navLinks a').each(function(){

            if($(window).width() <= 768){
            contentTop.push( $( $(this).attr('href') ).offset().top - 370);
            }
            else{
            contentTop.push( $( $(this).attr('href') ).offset().top - 70);
            }
        })

        $.each( contentTop, function(i){
            if ( winTop > contentTop[i]){
                $('.navbar-collapse li.navLinks')
                .removeClass('activate')
                .eq(i).addClass('activate');          
            }
        })
};

$('li.navLinks a.topLink').click(function(){
$('#myNavbar').removeClass('in');
})

  });
        }
    }
});
