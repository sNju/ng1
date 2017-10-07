(function(){
      // Tool Tip
        $('[data-toggle="tooltip"]').tooltip(); 

       // Image Slider code
        $("#lightgallery").lightGallery(); 
       
       /*Facebook Plugin*/
       (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

       /*Facebook Panel Fixed
       function scroll_fixed(source,destination,stuckheight){
        var destinationtop=$('#'+destination).offset().top;
        var scrollTop=$(window).scrollTop();
        var sourceTop=$('#'+source).outerHeight()+$('#'+source).offset().top-scrollTop;

        console.log("destinationtop,stuckheight",destinationtop,stuckheight);

        if(sourceTop+scrollTop>=destinationtop&&destinationtop>=stuckheight){
            if(!$('#'+destination).hasClass("position-fixed")){
                $('#'+destination).addClass("position-fixed").css({'top':sourceTop});
                return 1;
            }
            return 0;
        }
        else{
            if($('#'+destination).hasClass("position-fixed")){
                $('#'+destination).removeClass("position-fixed");
            }
            return 0;
        }
    }
    var stuckheight1=$('#facebook-panel').offset().top;
    $(window).on('scroll', function(){

        if(scroll_fixed("site-header","facebook-panel",stuckheight1)==1){
        };

        scroll_fixed("header","facebook-panel",stuckheight1)
    });*/
    function scroll_fixed(source,destination,stuckheight){
        var destinationtop=$('#'+destination).offset().top;
        var scrollTop=$(window).scrollTop();
        var sourceTop=$('#'+source).outerHeight()+$('#'+source).offset().top-scrollTop;

        console.log("destinationtop,stuckheight",destinationtop,stuckheight);

        if(sourceTop+scrollTop>=destinationtop&&destinationtop>=stuckheight){
            if(!$('#'+destination).hasClass("position-fixed")){
                $('#'+destination).addClass("position-fixed").css({'top':sourceTop});
                return 1;
            }
            return 0;
        }
        else{
            if($('#'+destination).hasClass("position-fixed")){
                $('#'+destination).removeClass("position-fixed");
            }
            return 0;
        }
    }
    var stuckheight1=$('#facebook-panel').offset().top;

    var footerTop = $('#footer').offset().top;

    console.log('footerTop'+ footerTop);


    $(window).on('scroll', function(){

        if(scroll_fixed("site-header","facebook-panel",stuckheight1)==1){

        };

        scroll_fixed("header","facebook-panel",stuckheight1)
    });
    /*function scroll_fixed(source,destination,stuckheight,className){
            var destinationtop=$('#'+destination).offset().top;
            var scrollTop=$(window).scrollTop();
            var sourceTop=$('#'+source).outerHeight()+$('#'+source).offset().top-scrollTop;
            if(sourceTop+scrollTop>=destinationtop&&destinationtop>=stuckheight){
                if(!$('#'+destination).hasClass(className)){
                    $('#'+destination).addClass(className).css({'top':sourceTop});
                    return 1;
                }
                return 0;
            }
        else{
                if($('#'+destination).hasClass(className)){
                    $('#'+destination).removeClass(className);
                }
                return 0;
            }
    }
        var stuckheight1=$('#facebook-panel').offset().top;
        var stuckheight2=$('#fotter').offset().top;
        var classname="position-fixed";

    var stuckheight1=$('#facebook-panel').offset().top;
    $(window).on('scroll', function(){

        if(scroll_fixed("site-header","facebook-panel",stuckheight1,classname)==1){
          stuckheight2=$('#fotter').offset().top;
        };

        scroll_fixed("facebook-panel","fotter",stuckheight2,classname)
    });*/

})();