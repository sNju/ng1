/*
 *	Global JS
 */

// GP File Inputs  //
$(document).on('change', '.btn-file :file', function() {
	var input = $(this),
	numFiles = input.get(0).files ? input.get(0).files.length : 1,
	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
});


$(document).ready(function(){

	// Tooltip Initialization 
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body',
		placement: 'auto bottom',
		trigger: 'hover'
	});

	// Global Scoped Variables //
	var window_width = $(window).width(); /* Browser/Device Screen Width */
	var window_height = $(window).height(); /* Browser/Device Screen Height */
	var user_mobile_nav_height = $('.user-mobile-nav').innerHeight(); /* User Navigation Height In Mobile Screens */
	var site_header_height = $('#site-header').innerHeight();
	var seconday_nav_header_height = $('#seconday-navigation').innerHeight();
	var page_header_height = $('.page-header').outerHeight();
	var booking_details_height = $('.booking-details').innerHeight();

	//alert(main_content_header_height);


	// Mobile Sidebar Toggle //	
	$('.sidebar-toggle-btn').on('click', function(){
		$(this).toggleClass('close');
		$('body').toggleClass('has-mask has-mask-below-header');
		$('.sidebar').toggleClass('open');

		if( $('.sidebar').hasClass('open') || $('body').hasClass('has-mask-below-header') )	{
			$('#site-header').css({ 'left':'260px' });
			$('body').append('<div class="mask"></div>');
		}
		else {
			$('#site-header').css({ 'left':'0' });
			$('body').removeClass('has-mask has-mask-below-header');
			$('.mask').remove();	
		}

		$('.has-mask .mask, .main-menu li:not(.has-sub-menu) a, .main-sub-menu a').on('click', function(){
			$('.sidebar-toggle-btn').trigger('click');
		});

		if(window_width < 1024) {
			$('#primary-navigation').css({ 'height': (window_height - user_mobile_nav_height) });
		}
	});

	
	// Instant Create Component //
	$('.instant-create-btn').on('click', function(){
		//e.preventDefault();
		$(this).toggleClass('active');
		$('body').toggleClass('has-mask');

		if( $(this).hasClass('active') || $('body').hasClass('has-mask') ) {
			$('body').append('<div class="mask"></div>');	
			$(this).next().addClass('open');
		}
		else {
			$('body').removeClass('has-mask');
			$('.mask').remove();	
			$(this).next().removeClass('open');
		}

    	$('.has-mask .mask, .instant-create-option').on('click', function(){
	    	$('.instant-create-btn').trigger('click');
		});                                  

	});


	// Primary Navigation // 
	function primaryNavigation() {

		/* Max Height of primary Nav for vertical scroll */
		//var primary_nav_top_offset = $('#primary-navigation').offset().top;
		//var primary_nav_max_height = window_height - primary_nav_top_offset;

		//$('#primary-navigation').css({ 'max-height': (primary_nav_max_height - 25) + 'px'});


		/* Main Menu */
		$('.main-menu a').on('click', function(){
			//e.preventDefault();
			var nav_parent = $(this).data('parent');
			
			$(nav_parent).addClass('has-focus');
			$(this).parent().siblings().removeClass('active');
			
			if ( $(this).next().length > 0 ) {
				//$('.main-menu a').parent().removeClass('active');
				$(this).parent().toggleClass('active');

				$(this).parent().siblings('.has-sub-menu').children('.main-sub-menu').slideUp(300);
				$(this).next('.main-sub-menu').slideToggle();		
			}
			else {
				if ( $(nav_parent).find('.has-sub-menu').length > 0 ) {
					$(this).parent().siblings('.has-sub-menu').children('.main-sub-menu').slideUp(300);
					$(this).parent().toggleClass('active');
					$(this).next().slideDown();
				}
				else {
					$(this).parent().toggleClass('active');	
				}
			}	

		});	
	}

	primaryNavigation(); /* Primary Navigation Accordion Initialization ( Main Sidebar Of GPBA ) */

	
	
	/* Secondary Navigation - Nav Sub Tabs  // Already Handled with Angular ng-class
	$('body').on('click', '.nav-sub-tabs > a', function(e){
		$('.nav-sub-tabs').removeClass('active');
		$(this).closest('.nav-sub-tabs').addClass('active');	
	});
	*/
	


    // GP Input Controls //
    $('body').on('focus','.gp-input-control', function(){
    	
    	if( $(this).closest('.gp-form-group').hasClass('date-range-picker') ) {
    		$(this).closest('.input-group').addClass('has-focus');                
    	}
    	else {
    		$(this).closest('.gp-form-group').addClass('has-focus');        
    	}
    }).on('blur','.gp-input-control', function(){
    	
    	if( $(this).closest('.gp-form-group').hasClass('date-range-picker') ) {
    		$(this).closest('.input-group').removeClass('has-focus');                
    	}
    	else {
    		$(this).closest('.gp-form-group').removeClass('has-focus');        
    	}
	});

	// GP File Input //
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
    	var input = $(this).parents('.gp-file-input-group').find(':text'),
    	log = numFiles > 1 ? numFiles + ' files selected' : label;

    	if( input.length ) {
    		input.val(log);
    	}
    	else {
    		if( log ) alert(log);
    	}
    });

   	// Create Form Textarea Expansion on Focus //
   	$('body').on('focus', 'textarea.gp-input-control',function(){
   		$(this).addClass('expanded');	
   	}).on('blur', 'textarea.gp-input-control', function(){
   		$(this).removeClass('expanded');	
   	});

   	
	/* Radio Toggle Button //
	var i = 0;
	var radioIndex = [i];

	$('.radio-toggle-wrap .radio').each(function ( [i], radioIndex, value){

	})
	*/


	$('body').on('click',".radio-toggle-wrap .radio", function(){
		$('.radio-toggle-wrap .radio').removeClass('active');
		$(this).addClass('active');    
	});


	// Adjusting Every 3rd List Item of GP Cards Wrapper for smaller Screen Devices //
	if( window_width > 767 && window_width < 1023 ) {
		var third_column_width = $('.threeColumnLayout > li:nth-child(3n)').width() - 10;
		var third_column_gp_card_width = (third_column_width) / 2;

		$('.threeColumnLayout > li:nth-child(3n) > .gp-card, .threeColumnLayout > li:nth-child(3n) > .upgrade-plan').css({ 'width': third_column_gp_card_width });
		$('.threeColumnLayout > li:nth-child(3n) > .gp-card').css({ 'margin-right':'10px' });    	
	};


    // Also Post On: Connect Toggle //
    $('.media-to-post-on .connect-btn').on('click', function(e){
    	e.preventDefault();
    	$(this).closest('.media-to-post-on').addClass('connected');	

    	if( $('.media-to-post-on').hasClass('connected') ) {
    		$(this).hide();
    	}
		//$('body').on('click', '.connected', function(){
		//	$(this).find('.connect-btn').show();	
		//});
	});

	

	/* GP Party Card Figure Hover //
    $(document).on('mouseenter', '.gp-profile-card .gp-party-details', function(){
		//alert('Hovered');
		$(this).addClass('expanded');
		$(this).prev('.gp-card-figure').addClass('get-collapsed');
	});
	
	$(document).on('mouseleave', '.gp-profile-card .gp-party-details', function(){
		$(this).removeClass('expanded');
		$(this).prev('.gp-card-figure').removeClass('get-collapsed');
	});
	*/


	
	// User Actions Toggle //
	$(document).on('click', '.user-actions-toggle', function(){
		$(this).toggleClass('close');
		$(this).closest('.gp-card, .launched-work, .payment-card').find('.user-actions').toggleClass('open');
		//$(this).closest('.gp-party-card-figure, figure').toggleClass('has-mask');
	});	

	





	
	/*$(window).resize(function(){
		var booking_chat_current_height = window_height - (site_header_height + seconday_nav_header_height + booking_details_height );
		alert(booking_chat_current_height);	
		$('.booking-chat').css({ 'height': booking_chat_current_height });
	}).trigger('resize');
	*/




	
    
}); /* End document on ready function */   



/* Max/Min Height for Vertical Scrollbar of Primary Navigation on Document Ready/Resize Event */
$(window).on('resize', function() {
	//alert('working on document ready');
	var window_height = $(window).height();
	var primary_nav_top_offset = $('#site-header').innerHeight() + 25;
	//console.log(primary_nav_top_offset);

	var primary_nav_max_height = ((window_height - primary_nav_top_offset) - 25 );

	$('#primary-navigation').css({ 'max-height': primary_nav_max_height });
	//console.log(primary_nav_max_height);
}).trigger('resize');















