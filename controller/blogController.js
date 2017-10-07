var app=angular.module("blog.module",[]);
app.controller('blogController', ['$scope', function($scope){
	$scope.$emit("TitlePage","Blog - GoParties | Your Party App");
	
	//tolltip-controler

	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip(); 
	});

	//Facebook Panel Stop
	
	//console.log(fbscroll_offset);

	/*function fbpanel_fixed(){
		var fbpanel_offset = $('#facebook-panel').offset().top;
		var window_scroll_top = $(window).scrollTop();
		var header_height = $('#site-header').outerHeight();

		if(window_scroll_top > (fbpanel_offset - header_height) ){
			$('#facebook-panel').addClass('position-fixed').css({'top':header_height});
		}
		else{
			$('#facebook-panel').removeClass('position-fixed');
		}
	}
	
	$(window).on('load scroll', function(){
		fbpanel_fixed();
	})*/

	function scroll_fixed(source,destination,stuckheight){
		var destinationtop=$('#'+destination).offset().top;
		var scrollTop=$(window).scrollTop();
		var sourceTop=$('#'+source).outerHeight()+$('#'+source).offset().top-scrollTop;
		
		//console.log("destinationtop,stuckheight",destinationtop,stuckheight);
		
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
	});


}])