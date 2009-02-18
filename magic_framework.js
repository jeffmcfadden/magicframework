/**
 * For use with MagicFramework
 * http://www.jeffmcfadden.com/magicframework
 * This work by Jeff McFadden is licensed under a Creative Commons Attribution 3.0 United States License.
 * 
 */

var MagicFramework = function( params ){
	//Store arbitrary params
	for( var i in params ){
        this[i] = params[i];
    }

	this.splash		    = document.getElementById( 'splash' );
	this.browser 		= document.getElementById( 'browser' );
	this.header  		= document.getElementById( 'header' );
	this.current_title 	= document.getElementById( 'current_title' );
	this.back_button    = document.getElementById( 'back_button' );
	this.viewport		= document.getElementById( 'viewport' );
	
	this.current_view   = null;
	this.next_view      = null;
	
	this.view_stack        = [];
	this.title_stack       = [];
	this.back_button_stack = [];
}

MagicFramework.prototype.version = '0.01';

/**
 * If detect is true we'll try to detect if the user is using the mobile device or safari.
 * If mobile we'll use only touch events. If desktop we'll use clicks.
 * You'll want to set this to false if you're in a production environment on the device.
 */
MagicFramework.prototype.detect = true;

MagicFramework.prototype.Init = function(){
	this.SetupBrowser();
	this.SetupSplash();
	this.SetupHeader();
	this.SetupViews();
	
		
	//setTimeout( "document.getElementById( 'view_1' ).style.webkitTransform = 'translate( 0, 0 )'", 0 );
	
	
}

MagicFramework.prototype.HideSplash = function(){
	if( this.splash ){
		setTimeout( function(){ this.splash.style.opacity = 0; setTimeout( function(){ this.splash.style.display = 'none'; }, 500 ) }, 500 );
	}
}

MagicFramework.prototype.SetupBrowser = function(){
	var bs = this.browser.style;
	
	bs.width     = '320px';
	bs.minHeight = '460px';
	//bs.border = '1px solid orange'; 
}

MagicFramework.prototype.SetupSplash = function(){
	if( this.splash ){
		var ss = this.splash.style;
		var bs = this.browser.style;
		
		ss.position = 'absolute';
		ss.top		= '0px;'
		ss.left		= '0px;'
		ss.width    = bs.width;
		ss.height   = bs.height;
		ss.webkitTransitionProperty = '-webkit-transform, opacity';
		ss.webkitTransitionDuration 		= '.35s';
		
	}
}

MagicFramework.prototype.SetupHeader = function(){
	var hs = this.header.style;
	
	hs.top = this.header.offsetHeight
	
	//hs.height = '44px';
	//hs.background = 'url( header.png )';
	
	this.SetupTitle();
	this.SetupBackButton();
}

MagicFramework.prototype.SetupTitle = function(){
	var hs = this.header.style;
	var ts = this.current_title.style;
	
	ts.top   = Math.floor( ( this.header.offsetHeight - this.current_title.offsetHeight ) / 2 ) + 'px';
	ts.width = this.header.offsetWidth + 'px';
	ts.webkitTransitionProperty = '-webkit-transform, opacity';
	ts.webkitTransitionDuration 		= '.35s';
	ts.webkitTransitionTimingFunction 	= 'ease-in-out';
}

MagicFramework.prototype.SetupBackButton = function(){
	var bbs = this.back_button.style;
	
	bbs.top     = Math.floor( ( this.header.offsetHeight - this.back_button.offsetHeight ) / 2 ) + 'px';
	bbs.opacity = 0;
}

MagicFramework.prototype.SetupViews = function(){
	var views = document.getElementsByClassName( 'view' );
	var browser_width = this.browser.offsetWidth;
	var header_height = this.header.offsetHeight;
	
	for( var i in views ){
		var vs = views[i].style;
		
		if( vs ){
			vs.webkitTransform 					= 'translate( ' + browser_width + 'px, 0 )';
			vs.webkitTransitionProperty 		= '-webkit-transform';
			vs.webkitTransitionDuration 		= '.35s';
			vs.webkitTransitionTimingFunction 	= 'ease-in-out';
			vs.position							= 'absolute';
			vs.top								= header_height + 'px';
			vs.width							= ( browser_width - 10 ) + 'px';
			vs.padding						    = '5px';
			vs.display							= 'none';
		}
		
	}
}

MagicFramework.prototype.PreventEvents = function(){
	var preventer = document.getElementById( 'event_prevention' );
	var ps = preventer.style;
	var browser_width  = this.browser.offsetWidth;
	var browser_height = this.browser.offsetHeight;
	
	ps.width  = browser_width + 'px';
	ps.height = browser_height + 'px';
	ps.zIndex = '100';
}

MagicFramework.prototype.AllowEvents = function(){
	var preventer = document.getElementById( 'event_prevention' );
	var ps = preventer.style;

	ps.zIndex = '-100';
}

MagicFramework.prototype.GoForward = function( viewName, newTitle, reverse, hideBackButton ){
	this.PreventEvents();
	
	window.scroll( 0, 0 ); 
	
	var current_view = this.current_view;
	var new_view     = document.getElementById( viewName );
	var browser_width = this.browser.offsetWidth;
	var header_width  = this.header.offsetWidth;
	var header_height = this.header.offsetHeight;
	
	if( typeof( this.before_transition ) == 'function' ){
		this.before_transition( new_view );
	}
	
		if( current_view ){
			var new_back_button = document.createElement( 'div' );
			new_back_button.id = 'proxy_back_button_' + Math.random();
		
			new_back_button.className = 'back_button';
			new_back_button.onTouchStart = 'GoBackward()';
			new_back_button.innerHTML = this.current_title.innerHTML;
			
			var nbbs = new_back_button.style;
			nbbs.opacity = 0;
			nbbs.webkitTransform = 'translate( ' + Math.floor( header_width / 2 ) + 'px, 0px )';
			nbbs.webkitTransitionProperty 			= '-webkit-transform, opacity';
			nbbs.webkitTransitionDuration 			= '.35s';
			nbbs.webkitTransitionTimingFunction 	= 'ease-in-out';
			nbbs.zIndex								= 10 + this.back_button_stack.length;
		
			this.header.appendChild( new_back_button );
			
			var self = this;
			
			if( MagicFramework.prototype.detect && !WebKitDetect.isMobile() ){
				new_back_button.addEventListener('click', function(){ self.GoBackward(); }, false);
			}else{
				new_back_button.addEventListener('touchstart', function(){ self.GoBackward(); }, false);
			}
			
			
			if( !hideBackButton ){
				setTimeout( "document.getElementById( '" + new_back_button.id +  "').style.webkitTransform = 'translate( 0, 0 )';document.getElementById( '" + new_back_button.id +  "').style.opacity = 1;", 0 );
			}
			
			if( this.back_button ){
				setTimeout( "document.getElementById( '" + this.back_button.id +  "').style.webkitTransform = 'translate( " + ( ( browser_width * -1 ) / 2 ) + "px, 0 )';document.getElementById( '" + this.back_button.id +  "').style.opacity = 0;", 0 );
			}
			
			if( !hideBackButton ){
				this.back_button = new_back_button;
				this.back_button_stack.push( new_back_button );
			}
			
		}

	
	if( 1 ){
		var proxy_title = document.createElement( 'div' );
		proxy_title.id = 'proxy_title_' + Math.random();
		proxy_title.className = 'header_title';
		proxy_title.innerHTML = newTitle;
		
		var pts = proxy_title.style;
		pts.top   = Math.floor( ( this.header.offsetHeight - this.current_title.offsetHeight ) / 2 ) + 'px';
		pts.width = this.header.offsetWidth + 'px';
		pts.opacity = 0;
		pts.position = 'absolute';
		pts.webkitTransform = 'translate( ' + Math.floor( header_width / 2 ) + 'px, 0px )';
		pts.webkitTransitionProperty 			= '-webkit-transform, opacity';
		pts.webkitTransitionDuration 			= '.35s';
		pts.webkitTransitionTimingFunction 	= 'ease-in-out';
	
		this.header.appendChild( proxy_title );
		setTimeout( "document.getElementById( '" + proxy_title.id +  "').style.webkitTransform = 'translate( 0, 0 )';document.getElementById( '" + proxy_title.id +  "').style.opacity = 1;", 0 );
		
		setTimeout( "document.getElementById( '" + this.current_title.id +  "').style.webkitTransform = 'translate( " + ( browser_width * -1 ) + "px, 0 )';document.getElementById( '" + this.current_title.id +  "').style.opacity = 0;", 0 );
		
		this.title_stack.push( proxy_title );
		this.current_title = proxy_title;
		//delete old_title;
	}
	
	//Possible on start that we don't have a current view
	if( current_view ){
		//current_view.addEventListener( 'webkitTransitionEnd', function(){ alert( 'hi' ); current_view.style.display = 'none'; delete this; } );
		
		setTimeout( "document.getElementById( '" + current_view.id + "' ).style.webkitTransform = 'translate( " + ( browser_width * -1 ) + "px, 0px )'", 0 );
		
		current_view.addEventListener( 'webkitTransitionEnd', function hide_view( event ) { current_view.style.display = 'none'; current_view.removeEventListener( 'webkitTransitionEnd', hide_view ); }, false );	
		
		
		//setTimeout( "document.getElementById( '" + current_view.id + "' ).style.display = 'none'", 400 );
	}
	
	if( new_view ){
		this.current_view = new_view;
		this.view_stack.push( new_view );
		
		document.getElementById( new_view.id ).style.display = 'block';
		setTimeout( "document.getElementById( '" + new_view.id + "' ).style.webkitTransform = 'translate( 0px, 0px )'", 0 );
	}
	
	var self = this;
	setTimeout( function(){ self.AllowEvents(); }, .5 );
	
	if( typeof( this.after_transition ) == 'function' ){
		this.after_transition( new_view );
	}
}

MagicFramework.prototype.GoBackward = function(){
	this.PreventEvents();
	
	window.scroll( 0, 0 ); 
	
	var current_view = this.view_stack.pop();
	var new_view = this.view_stack.length > 0 ? this.view_stack[this.view_stack.length - 1] : null;
	var browser_width = this.browser.offsetWidth;
	
	if( typeof( this.before_transition ) == 'function' ){
		this.before_transition( new_view );
	}
	
	//View
	//current_view.addEventListener( 'webkitTransitionEnd', function( event ) { alert( "Finished transition current!" ); }, false );	
	current_view.addEventListener( 'webkitTransitionEnd', function hide_view( event ) { current_view.style.display = 'none'; current_view.removeEventListener( 'webkitTransitionEnd', hide_view ); }, false );	
	
	setTimeout( "document.getElementById( '" + current_view.id + "' ).style.webkitTransform = 'translate( " + browser_width + "px, 0 )'", 0 );
	if( new_view ){
		document.getElementById( new_view.id ).style.display = 'block';
		setTimeout( "document.getElementById( '" + new_view.id + "' ).style.webkitTransform = 'translate( 0px, 0px )'", 0 );
		this.current_view = new_view;
	}
	
	
	var current_title = this.title_stack.pop();
	var new_title     = this.title_stack[this.title_stack.length - 1];
	
	//Title
	setTimeout( "document.getElementById( '" + new_title.id +  "').style.webkitTransform = 'translate( 0, 0 )';document.getElementById( '" + new_title.id +  "').style.opacity = 1;", 0 );
	
	setTimeout( "document.getElementById( '" + current_title.id +  "').style.webkitTransform = 'translate( " + ( browser_width * 1 ) + "px, 0 )';document.getElementById( '" + current_title.id +  "').style.opacity = 0;", 0 );
	
	this.current_title = new_title;


	var current_back_button = this.back_button_stack.pop();
	var new_back_button     = this.back_button_stack.length > 0 ? this.back_button_stack[this.back_button_stack.length - 1] : null;
	
	setTimeout( "document.getElementById( '" + current_back_button.id +  "').style.webkitTransform = 'translate( " + ( ( browser_width * 1 ) / 2 ) + "px, 0 )';document.getElementById( '" + current_back_button.id +  "').style.opacity = 0;", 0 );
	
	if( new_back_button ){
		setTimeout( "document.getElementById( '" + new_back_button.id +  "').style.webkitTransform = 'translate( 0, 0 )';document.getElementById( '" + new_back_button.id +  "').style.opacity = 1;", 0 );
	}
	
	this.back_button = new_back_button;
	
	var self = this;
	setTimeout( function(){ self.AllowEvents(); }, .5 );
	
	if( typeof( this.after_transition ) == 'function' ){
		this.after_transition( new_view );
	}
}

MagicFramework.prototype.BuildList = function( params ){
	//{ list: MagicListDef, el: 'help_content', append: true } );
	
	var list_el = 'magic_list_' + params.name;
	
	var code = '';
	code += '<ul class="list" id="' + list_el + '">';
		
	var n = 0;
	for( var i in params.list ){
		var this_el_id = 'magic_list_' + params.name + '_' + n;
		code += '<li id="' + this_el_id + '" class="list_item">';
		code += '<div class="list_label">' + params.list[i].label + '</div>';
		code += '<div class="list_value">' + params.list[i].value;
		
		if( params.list[i].arrow ){
			code += '<img class="list_arrow" src="list_arrow.png" />';
		}
		
		code += '</div>';
		code += '</li>';

		n++;
	}
	
	code += '</ul>';
	
	if( params.append ){
		document.getElementById( params.el ).innerHTML += code;
	}else{
		document.getElementById( params.el ).innerHTML = code;
	}
		
	var n = 0;
	for( var i in params.list ){
		var this_el_id = 'magic_list_' + params.name + '_' + n;
		//alert( this_el_id );
		var el = document.getElementById( this_el_id );
		new MagicListItem( el, params.list[i].func );
		n++;
		
	}
	
}



var MagicListItem = function( el, func ){
    var self = this;

    this.element = el;
    this.func    = func;
    this.position = '0,0';
    this.el_height   = $( this.element ).height();
    this.active = false;

	
	if( MagicFramework.prototype.detect && !WebKitDetect.isMobile() ){
		this.element.addEventListener( 'click', this.func );
	}else{
		this.element.addEventListener('touchstart', function(e) { return self.onTouchStart(e) }, false);
	}

}

MagicListItem.prototype.onTouchStart = function(e)
{
    // Start tracking when the first finger comes down in this element
    if (e.targetTouches.length != 1){
        return false;
    }

    this.startX = e.targetTouches[0].clientX;
    this.startY = e.targetTouches[0].clientY;

    var self = this;
    this.active = true;
    this.element.addEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
    this.element.addEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
    $( this.element ).addClass( 'active_list_item' );

    return false;
}

MagicListItem.prototype.onTouchMove = function(e){// Prevent the browser from doing its default thing (scroll, zoom)
    //e.preventDefault();

    // Don't track motion when multiple touches are down in this element (that's a gesture)
    if (e.targetTouches.length != 1){
        return false;
    }

    var leftDelta = e.targetTouches[0].clientX - this.startX;
    var topDelta = e.targetTouches[0].clientY - this.startY;

    //var newLeft = (this.x) + leftDelta;
    //var newTop = (this.y) + topDelta;
    
    if( this.active && (  Math.abs( topDelta ) > ( this.el_height / 2 ) ) ){
        $( this.element ).removeClass( 'active_list_item' );
        this.active = false;
        //this.element.removeEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
        //this.element.removeEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
    }

    //this.position = newLeft + ',' + newTop;

    //this.startX = e.targetTouches[0].clientX;
    //this.startY = e.targetTouches[0].clientY;

    return false;
}

MagicListItem.prototype.onTouchEnd = function( e ){
    // Prevent the browser from doing its default thing (scroll, zoom)
    e.preventDefault();

    // Stop tracking when the last finger is removed from this element
    if (e.targetTouches.length > 0){
        return false;
    }
    
    //var pos = $( this.element ).position();
    /*
    if( this.startY < pos.top ||
        this.startY > pos.top + $( this.element ).height() ||
        this.startX < pos.left ||
        this.startX > pos.left + $( this.element ).width()
    ){
        //alert( 'Outside' );
    }
    */
    //alert( 'TouchEnded! ' + this.startY + ':' + this.startX + ':' + pos.top + ':' + pos.left );

    this.element.removeEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
    this.element.removeEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
    $( this.element ).removeClass( 'active_list_item' );
    
    if( this.active ){
        this.func();
        this.active = false;
    }

    return false;
}
