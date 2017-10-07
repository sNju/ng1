$(document).ready(function(){

    // Mobile Sidebar Toggle // 
    $('.sidebar-toggle-btn').on('click', function(){
        $(this).toggleClass('close');
        $('body').toggleClass('has-mask has-mask-below-header');
        $('.primary-navigation').toggleClass('open');

        if( $('.primary-navigation').hasClass('open') || $('body').hasClass('has-mask-below-header') ) {
           //$('#site-header').css({ 'left':'260px' });
            $('body').append('<div class="mask"></div>');
        }
        else {
            //$('#site-header').css({ 'left':'0' });
            $('body').removeClass('has-mask has-mask-below-header');
            $('.mask').remove();    
        }

        $('.has-mask .mask, .primary-navigation .main-menu a').on('click', function(){
            $('.sidebar-toggle-btn').trigger('click');
        });

        /*
        if(window_width < 1024) {
            $('#primary-navigation').css({ 'height': (window_height - user_mobile_nav_height) });
        }
        */
    });

});