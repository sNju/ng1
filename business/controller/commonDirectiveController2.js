var app = angular.module('commonDirective.module');
app.directive("gpAccordion",function(){
  return {
    scope:false,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){
      $scope.$on("searchvalue",function(event,value){
        console.log("searchvalue=",value);
        $scope.search=value;
      })
      // GP Accordion // 
      function gpAccordion() {
        $('body').on('click', '.has-sub-content .data-link', function(){
         
            //e.preventDefault();
            
            var nav_parent = $(this).data('parent');
            //$(nav_parent).addClass('has-focus');

            // console.log("hello accordian");
            $(nav_parent).addClass('has-focus');
            $(this).parent().siblings().removeClass('active');

            if ( $(this).next().length > 0 ) {
              //$('.main-menu a').parent().removeClass('active');
              

              if ( $(nav_parent).hasClass('has-focus') ) {
                //$(this).parent().siblings().removeClass('active');  
                $(this).parent().toggleClass('active');

                if ( $(this).parent().hasClass('active') ) {
                  $(this).closest(nav_parent).children().siblings('.has-sub-content').children('.sub-content').slideUp(300);
                  $(this).next('.sub-content').slideDown();     

                  
                }
                else {
                  //$(this).closest(nav_parent).children().siblings('.has-sub-content').children('.sub-content').slideUp(300);
                  $(this).next('.sub-content').slideUp();   
                }
              }
              else {
                $(this).parent().toggleClass('active');
                $(this).next('.sub-content').slideToggle();   
                //console.log('slideToggle');
              }
            }
            else {
              if ( $(nav_parent).find('.has-sub-content').length > 0 ) {
                $(this).closest(nav_parent).children().siblings('.has-sub-content').children('.sub-content').slideUp(300);
                $(this).parent().toggleClass('active');
                $(this).next().slideDown();
              }
              else {
                $(this).parent().toggleClass('active'); 
              }
            } 
          }); 
      }


      gpAccordion(); /* Primary Navigation Initialization ( Main Sidebar Of GPBA ) */   
      $scope.$on("$destroy",function(){
        $("body").off("click");
      });

      
      
    }
  }
});

app.directive("hasSearchFilterWidget",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      // GP Search Filter Toggle // 
      function searchFilterToggle() {
        $('body').on('click', '.search-filter-toggle', function(){
            //e.preventDefault();

            $(this).toggleClass('close-search');

            $(this).next('.view-specific-search').toggleClass('search-activated');

            $(this).next('.view-specific-search').find('.gp-search-control').focus();

        }); 

        $('body').on('click', '.search-filter-widget .close', function(){
          $(this).closest('.page-header').removeClass('search-activated');

          var data_blur = $(this).data('blur');
          $(data_blur).blur();

          $(this).closest('.page-header').find('.gp-search-filter-control').blur();
        });

      }

      searchFilterToggle(); /* GP Search Filter Toggle for Secondary Navigation Sub Tabs */   
      

    }
  }
});


// Filters Form Toggle
app.directive("hasFilterToggle",function($mdMedia,$mdDialog){
  return{
    restrict:'EA',
    replace:true,
    scope:true,
    link:function($scope,element,attr,controller,transclude){
        
        $('.filters-toggle-btn').on('click', function(){
          console.log('clicked');
          $(this).next().slideToggle();  
        });
      
    }
  }
});


// GP Tabs //
app.directive("gpTabs",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      // Media Player Pagination // 
      function mediaPlayerPagination() {
        $('.gp-media-player-pager, #select-deal .edit-deal-action').on('click', function(e){
          e.preventDefault();
          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var pager_reference_id = $(this).attr('href');
          var gp_media_player_body = $(this).closest('.gp-media-player-header').next('.gp-media-player-body');        

          gp_media_player_body.children().removeClass('open in');
          gp_media_player_body.children(pager_reference_id).addClass('open in');
        });                                     
      }

      mediaPlayerPagination(); // Media Player Pagination Initialization



    }
  }
});

// GP CheckBox //
app.directive("hasGpCheckbox",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      // GP Checkbox Form Control 
      $('body').on('click', '.gp-checkbox-control', function(){
        var gp_checkbox = $(this).children('.gp-checkbox');
        var gp_checkbox_state = gp_checkbox.prop('checked');

        if ( gp_checkbox_state == true ) {
          $(this).addClass('checked');
        }
        else {
          $(this).removeClass('checked');
        }
      });
    }
  }
});


// Bootstrap Tooltip Directive //
app.directive("hasBsTooltip",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      // Tooltip Initialization 
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
        placement: 'auto bottom',
        trigger: 'hover'  
      });


      $('.instant-create-btn').tooltip({
        container: 'body',
        placement:'left',
        trigger: 'hover'  
      })
    }
  }
});


app.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){
            $element.addClass("ng-hide-remove");
            $element.on('load', function() {
                $element.addClass("ng-hide-add");
            });
        }
    };
})



/*
 *  Custom Scrollbar Directive
 */

// Horizontal Scrollbar
app.directive("hasCustomHorizontalScrollbar",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      $(document).ready(function(){
          $(".has-horizontal-scrollbar").mCustomScrollbar({
            axis:"x",
            autoHideScrollbar:true,
            advanced:{
              autoExpandHorizontalScroll:true
            }
          });
      });

    }
  }
});

// Vertical Scrollbar 
app.directive("hasCustomVerticalScrollbar",function(){
  return {
    scope:true,
    replace:true,
    restirct:'EA',
    link:function($scope,element,attr,controller,transclude){

      $(document).ready(function(){
          $(".has-vertical-scrollbar").mCustomScrollbar({
            axis:"y",
            theme:"dark",
            autoHideScrollbar:true,
            //autoExpandScrollbar:true,
            advanced:{
              autoExpandHorizontalScroll:true
            }
          });
      });

    }
  }
}); 



  app.factory("calculateRemainTime",function(){
    var obj=new Object();
    obj.calculate_remainingtime=function(timestamp)
    {


      var timestring="";
      var  party_date=parseInt(timestamp);
      var  current_timestamp= new Date().getTime();
      var day=party_date-current_timestamp;
      var hour=(day/(60*60*1000))%24;
      day=day/(24*60*60*1000);
      if(day>=1||day<=-1)
      {
        day=Math.floor(day);
        timestring=day.toString();
        if(day<=-1)
          timestring+="D";
        return timestring;
      }
      else
      {
        return Math.floor(hour);
      }

    }

    obj.calculateDays_string=function(timestamp)
    {
      var timestring;

  //var date=new Date(d_day *1000);
 
  var  party_date=parseInt(timestamp);

  var  current_timestamp= new Date().getTime();
  var day=party_date-current_timestamp;
  //var diff = (date2-date1) / 3600000;
  day=Math.floor(day/(24*60*60*1000));
  
  //console.log("day=",day);
  if(day==0)
  {
    timestring="Hour Left";
  }

  else if(day==1)
  {
    timestring="Day Left";
  }
  else if(day>1)
  {
    timestring="Days Left";
  }
  else
  {
    timestring="Gone"
  }

  return timestring;  
}
return obj;
});
