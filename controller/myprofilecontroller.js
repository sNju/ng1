var app=angular.module("myprofile.module",[]);
app.controller("myprofileController",["$scope",function($scope){
	$scope.$emit("TitlePage","Profile - GoParties | Your Party App");

}]);

app.directive("profileTabs",function(){
	return  {
		link:function($scope,element,attr){
			
			/*Function for Toggle Tab*/
			function myProfileMobileTabs() {
				var window_width = $(window).width();

				if (window_width < 768) {
					$('.profile-tabs-toggle').on('click', function(){
						$(this).toggleClass('active');
						$('.my-profile-tabs').slideToggle();
					});
				

					$('.my-profile-tabs [data-toggle="tab"]').on('click', function(e){
						e.preventDefault();
						var linkText = $(this).text();
						$('.profile-tabs-toggle').html(linkText);
						//$(this).closest('.my-profile-tabs').prev().html(linkText);
						
						//console.log(linkText); 

						$('.profile-tabs-toggle').trigger('click');
					})
				};
			};

			//CALL FUNCTION
			myProfileMobileTabs();
			
			
			/* function for stop div on scroll
			function scroll_idea(){
				var top_offset = $('.profile-tabs-toggle').offset().top;		
				var header_height = $('#site-header').outerHeight();	

				var top_offset_after_header = top_offset - header_height;
				console.log(top_offset_after_header); 

				var scroll_top = $(window).scrollTop();
			 	
				console.log(scroll_top_after_header);

				if(scroll_top > top_offset_after_header) {
					$('.profile-tabs-toggle').css({'position':'fixed', 'top':header_height, 'left':'0', 'width':'100%', 'z-index':'100'});
				}
				else{
					$('.profile-tabs-toggle').css({'position':'static'});
				}
			}*/


			//$(window).on('load', scroll_idea);
			 
			//$(window).on('scroll', scroll_idea);

			
			//$(window).on('resize', myProfileMobileTabs);	
			/*angular.getTestability(element).whenStable(function() {
					function scroll_fixed(source,destination,stuckheight,className){
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
        
        var stuckheight1=$('#profile-tabs-toggle').offset().top;
        var stuckheight2=$('#tab-list-content').offset().top;
        
        var classname="fixed-content";
        $(window).on('scroll', function(){            
            if(scroll_fixed("site-header","profile-tabs-toggle",stuckheight1,classname)==1){
                stuckheight2=$('#tab-list-content').offset().top;
            };
            
            scroll_fixed("profile-tabs-toggle","tab-list-content",stuckheight2,classname)
				});*/

		

			
            
            
        });		
		}	
	}
});
