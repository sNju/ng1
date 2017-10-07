// slider
/* jssor_1_slider_init = function() {
            
            var jssor_1_options = {
              $AutoPlay: true,
              $ThumbnailNavigatorOptions: {
                $Class: $JssorThumbnailNavigator$,
                $Cols: 5,
                $Align: 200,
                $NoDrag: true
              }
            };
            
            var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
            
            //responsive code begin
            //you can remove responsive code if you don't want the slider scales while window resizing
            function ScaleSlider() {
                var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
                if (refSize) {
                    refSize = Math.min(refSize, 600);
                    jssor_1_slider.$ScaleWidth(refSize);
                }
                else {
                    window.setTimeout(ScaleSlider, 30);
                }
            }
            ScaleSlider();
            $Jssor$.$AddEvent(window, "load", ScaleSlider);
            $Jssor$.$AddEvent(window, "resize", ScaleSlider);
            $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
            //responsive code end
        };*/
        

/*$(document).ready(function(){

    

    // Mobile Sidebar Toggle // 
    $('.sidebar-toggle-btn').on('click', function(){
        $(this).toggleClass('close');
        $('body').toggleClass('has-mask has-mask-below-header');
        $('.primary-navigation').toggleClass('open');

        var site_header_height = $('#site-header').height();

        if( $('.primary-navigation').hasClass('open') || $('body').hasClass('has-mask-below-header') ) {
           //$('#site-header').css({ 'left':'260px' });
            $('body').append('<div class="mask"></div>');

            
            $('body').css({'padding-top': site_header_height });
        }
        else {
            //$('#site-header').css({ 'left':'0' });
            $('body').removeClass('has-mask has-mask-below-header');

            $('.primary-navigation').css({'top': site_header_height });
            //$('body').css({'padding-top': site_header_height });


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
  //  });

//});*/

