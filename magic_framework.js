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
	
	this.all_views		    = [];
	this.view_stack    = [];
	this.view_forward_stack = [];
	this.title_stack        = [];
	this.back_button_stack  = [];
	
	this.splash_hide_delay = 500;
}

MagicFramework.prototype.version = '0.02';

/**
 * If detect is true we'll try to detect if the user is using the mobile device or safari.
 * If mobile we'll use only touch events. If desktop we'll use clicks.
 * You'll want to set this to false if you're in a production environment on the device.
 */
MagicFramework.prototype.detect 				= true;
MagicFramework.prototype.enable_self_destruct 	= true;

MagicFramework.prototype.Init = function(){
	LogIt( 'MagicFramework.Init()' );
	this.SetupBrowser();
	this.SetupSplash();
	this.SetupHeader();
	this.SetupViews();
	
	document.getElementById( 'viewport' ).innerHTML = '';

	
	
	//this.AddViewToDom( this.all_views[0] );
	//alert( document.getElementById( this.all_views[0].id ) );// = 'block';		
	//var vs = document.getElementById( this.all_views[0].id ).style;
		
	//vs.display 			= 'block';
	//vs.webkitTransform 	= 'translate( 0px, 0 )';
	
		
	this.HideSplash();
		
	//setTimeout( "document.getElementById( 'view_1' ).style.webkitTransform = 'translate( 0, 0 )'", 0 );	
}

MagicFramework.prototype.HideSplash = function(){
	if( this.splash ){
		var self = this;
		setTimeout( function(){ this.splash.style.opacity = 0; setTimeout( function(){ this.splash.style.display = 'none'; }, 500 ) }, self.splash_hide_delay );
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

MagicFramework.prototype.SetupViews = function( views ){
	LogIt( 'MagicFramework.SetupViews()' );
	
	if( !views ){
		var views = document.getElementsByClassName( 'view' );
	}
	
	var browser_width = this.browser.offsetWidth;
	var header_height = this.header.offsetHeight;
	
	LogIt( views.length + ' views' );
	
	for( var i in views ){		
		LogIt( 'i:' + i );
		
		if( views[i].id ){
			LogIt( 'pushing view( ' + views[i].id + ' )' );
			this.all_views[views[i].id] = new MagicView( { 'html': views[i].innerHTML, 'id': views[i].id, 'rendered': false } );
		}else{
			LogIt( 'skipped: ' + views[i].id );
		}
		
		/*
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
		*/
	}
	
	for( var i in views ){		
		if( views[i].id ){
			$( views[i].id ).remove();
			//this.viewport.removeChild( document.getElementById( views[i].id ) );
		}
	}
		
	for( var x in this.all_views ){
		LogIt( x + 'id: ' + this.all_views[x].id );//+ ' html:' + this.all_views[x].html );
	}
	return;
}

/** 
 * If goingBack is true then we put the translation to the left side instead of the right
 */
MagicFramework.prototype.AddViewToDom = function( view, goingBack ){
	if( 'string' == typeof( view ) ){
		LogIt( 'Looking for view to add to dom: ' + view );
		for( var i in this.all_views ){
			
			if( this.all_views[i].id == view ){
				LogIt( 'found a match' );
				view = this.all_views[i];
				break;
			}else{
				LogIt( 'Not a match |' + this.all_views[i].id + '| != |' + view + '|');
			}
		}
	} 
		
	if( 'object' != typeof( view ) ){
		LogIt( 'View not an object or view not found. Returning' );
		return;
	}
	
	var code = '<div class="view" id="' + view.id + '" style="display: none;">' + view.html + '</div>';
	$( this.viewport ).append( code );
	this.all_views[view.id].rendered = true;
	
	var browser_width = this.browser.offsetWidth;
	var header_height = this.header.offsetHeight;
	
	vs = document.getElementById( view.id ).style;
	if( goingBack ){
		vs.webkitTransform 					= 'translate( ' + ( browser_width * -1 ) + 'px, 0 )';
	}else{
		vs.webkitTransform 					= 'translate( ' + browser_width + 'px, 0 )';
	}
	vs.webkitTransitionProperty 		= '-webkit-transform';
	vs.webkitTransitionDuration 		= '.35s';
	vs.webkitTransitionTimingFunction 	= 'ease-in-out';
	vs.position							= 'absolute';
	vs.top								= header_height + 'px';
	vs.width							= ( browser_width - 10 ) + 'px';
	vs.padding						    = '5px';
	vs.display							= 'none';
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
	//console.profile( 'GoForward()' );
	
	LogIt( 'GoForward(' + viewName + ')');
	this.PreventEvents();
	
	window.scroll( 0, 0 );
	
	if( !this.all_views[viewName].rendered ){
		this.AddViewToDom( viewName );
	}
	
	this.all_views[viewName].CancelAutoDestructSequence();
	
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
			new_back_button.innerHTML = this.current_title.innerHTML;
			
			var nbbs = new_back_button.style;
			nbbs.opacity = 0;
			nbbs.webkitTransform = 'translate( ' + Math.floor( header_width / 2 ) + 'px, 0px )';
			nbbs.webkitTransitionProperty 			= '-webkit-transform, opacity';
			nbbs.webkitTransitionDuration 			= '.35s';
			nbbs.webkitTransitionTimingFunction 	= 'ease-in-out';
			nbbs.zIndex								= 10 + this.back_button_stack.length;
		
			this.header.appendChild( new_back_button );
			
			var the_interface = this;
			
			if( MagicFramework.prototype.detect && !WebKitDetect.isMobile() ){
				$( new_back_button ).bind( 'click', function( e ){
					this.style.webkitBorderImage = 'url(back_button_clicked.png) 0 5 0 16 / 1px 5px 1px 16px stretch stretch';
					var self = this;
					setTimeout( function(){
						self.style.webkitBorderImage = 'url(back_button.png) 0 5 0 16 / 1px 5px 1px 16px stretch stretch';
						setTimeout( function(){ the_interface.GoBackward(); }, 10 );
					}, 150 );
				}, false);
			}else{
				$( new_back_button ).bind( 'touchstart', function( e ){
					this.style.webkitBorderImage = 'url(back_button_clicked.png) 0 5 0 16 / 1px 5px 1px 16px stretch stretch';
					var self = this;
					setTimeout( function(){
						self.style.webkitBorderImage = 'url(back_button.png) 0 5 0 16 / 1px 5px 1px 16px stretch stretch';
						setTimeout( function(){ the_interface.GoBackward(); }, 10 );
					}, 150 );
				}, false);			
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
		if( current_view && current_view.id != new_view.id ){
			this.all_views[current_view.id].StartAutoDestructSequence();
		}
		
		this.current_view = new_view;
		this.view_stack.push( new_view );
		
		document.getElementById( new_view.id ).style.display = 'block';
		setTimeout( "document.getElementById( '" + new_view.id + "' ).style.webkitTransform = 'translate( 0px, 0px )'", 0 );
	}
	
	var self = this;
	setTimeout( function(){ self.AllowEvents(); }, 500 );
	
	if( typeof( this.after_transition ) == 'function' ){
		this.after_transition( new_view );
	}
	
	//console.profileEnd();
}

MagicFramework.prototype.GoBackward = function(){
	LogIt( 'GoBackward()' );
	
	this.PreventEvents();
	
	window.scroll( 0, 0 ); 
	
	var current_view = this.view_stack.pop();
	var new_view = this.view_stack.length > 0 ? this.view_stack[this.view_stack.length - 1] : null;
	
	if( this.all_views[new_view.id].rendered == false ){
		this.AddViewToDom( new_view.id, true );
	}
	
	this.all_views[new_view.id].CancelAutoDestructSequence();
	
	
	var browser_width = this.browser.offsetWidth;
	
	if( typeof( this.before_transition ) == 'function' ){
		this.before_transition( new_view );
	}
	
	//View
	//current_view.addEventListener( 'webkitTransitionEnd', function( event ) { alert( "Finished transition current!" ); }, false );	
	current_view.addEventListener( 'webkitTransitionEnd', function hide_view( event ) { current_view.style.display = 'none'; current_view.removeEventListener( 'webkitTransitionEnd', hide_view ); }, false );	
	
	setTimeout( "document.getElementById( '" + current_view.id + "' ).style.webkitTransform = 'translate( " + browser_width + "px, 0 )'", 0 );
		
	if( new_view && new_view.id != current_view.id ){
		this.all_views[current_view.id].StartAutoDestructSequence();
		
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
	setTimeout( function(){ self.AllowEvents(); }, 500 );
	
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

MagicFramework.prototype.Buttonize = function( el ){
	
	var el_id = null;
	
	if( 'object' == typeof( el ) ){
		el_id = el.id;
	}else{
		el_id = el;
	}
	
	if( el_id == null ){
		alert( 'Buttonize el_id is null' );
		return;
	}
	
	var proxy = document.getElementById( el_id ).onclick;
	document.getElementById( el_id ).onclick = null;
	if( proxy ){
		$( '#' + el_id ).bind( 'click', proxy );
	}
	
	
	if( MagicFramework.prototype.detect && !WebKitDetect.isMobile() ){
		var event = 'mousedown';
	}else{
		var event = 'touchstart';
	}
	
	$( '#' + el_id ).bind( 'touchstart', el_id, function( e ){
		this.style.opacity = '.2';
		var self = this;
		setTimeout( function(){ self.style.opacity = '1'; }, 150 );
	} );
}

var MagicView = function( params ){
	LogIt( 'MagicView Constructor (' + params.id + ')' );
	
	//Store arbitrary params
	for( var i in params ){
        this[i] = params[i];
    }

	if( !this.auto_destruct_timer_length ){
		this.auto_destruct_timer_length = 5000;
	}
}

/**
 * Computer, I confirm auto-destruct sequence authorization Riker alpha one gamma twelve
 */
MagicView.prototype.SelfDestruct = function(){
	LogIt( 'SelfDestruct (' + this.id + ')' );
	
	if( this.rendered ){
		$( '#' + this.id ).remove();
		this.rendered = false;
	}
}

MagicView.prototype.CancelAutoDestructSequence = function(){
	LogIt( 'CancelAutoDestructSequence (' + this.id + ')' );
	
	if( this.auto_destruct_timer ){
		clearTimeout( this.auto_destruct_timer );
		this.auto_destruct_timer = null;
	}
}

MagicView.prototype.StartAutoDestructSequence = function(){
	if( !MagicFramework.prototype.enable_self_destruct ){
		return;
	}
	
	LogIt( 'StartAutoDestructSequence (' + this.id + ', ' + this.auto_destruct_timer_length + ')' );
	
	//Cancel any outstanding timers before resetting.
	this.CancelAutoDestructSequence();
	var self = this;
	
	this.auto_destruct_timer = setTimeout( function(){ self.SelfDestruct(); }, this.auto_destruct_timer_length );
}

MagicFramework.prototype.MakeMagicButton = function( el, func ){
	LogIt( 'Make Magic Button' );
	if( typeof( el ) == 'string' ){
		this.element = document.getElementById( el );
	}else{
    	this.element = el;
	}
	
	if( !this.element ){
		LogIt( 'No element. Returning' );
		return false;
	}
	
	if( $(this.element).hasClass( 'magic_button' ) ){
		LogIt( 'Element already is a magic_button' );
		return false;
	}else{
		return new MagicButton( this.element, func );
	}
}


var MagicButton = function( el, func ){
	LogIt( 'MagicButton( ' + el + ',' + func + ')' );
	
    var self = this;

	if( typeof( el ) == 'string' ){
		this.element = document.getElementById( el );
	}else{
    	this.element = el;
	}
	
	if( !this.element ){
		return;
	}
	
    this.func    	 = func;
    this.position 	 = '0,0';
    this.el_height   = $( this.element ).height();
    this.active 	 = false;
	this.touched 	 = false;
	
	if( MagicFramework.prototype.detect && !WebKitDetect.isMobile() ){
		//We always remove all bound events first, so that if someone calls this
		//multiple times on the same element it won't fire that function x times.
		$( this.element ).unbind();
		var self = this;
		$( this.element ).bind( 'mousedown', function(e){ $( this ).addClass( 'active' ); } );
		$( this.element ).bind( 'mouseup',   function(e){ $( this ).removeClass( 'active' ); self.func(); } );
		//this.element.addEventListener( 'click', this.func );
	}else{
		//$( this.element ).bind( 'touchstart', function( e ){ return self.onTouchStart(e); } );
		this.element.addEventListener( 'touchstart', function(e) { return self.onTouchStart(e) }, false);
	}
	
	$( this.element ).addClass( 'magic_button' );
}

MagicButton.prototype.onTouchStart = function(e)
{
    // Start tracking when the first finger comes down in this element
    if (e.targetTouches.length != 1){
        return false;
    }

    this.startX = e.targetTouches[0].clientX;
    this.startY = e.targetTouches[0].clientY;

    var self = this;
    this.active = true;

	if( !this.touched ){
    	this.element.addEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
    	this.element.addEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
	}
	
	this.touched = true;
	$( this.element ).addClass( 'active' );

    return false;
}

MagicButton.prototype.onTouchMove = function(e){// Prevent the browser from doing its default thing (scroll, zoom)
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
        $( this.element ).removeClass( 'active' );
        this.active = false;
        //this.element.removeEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
        //this.element.removeEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
    }

    //this.position = newLeft + ',' + newTop;

    //this.startX = e.targetTouches[0].clientX;
    //this.startY = e.targetTouches[0].clientY;

    return false;
}

MagicButton.prototype.onTouchEnd = function( e ){
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

	this.element.removeEventListener( 'touchstart', function(e) { return self.onTouchStart(e) }, false);
    this.element.removeEventListener('touchmove', function(e) { return self.onTouchMove(e) }, false);
    this.element.removeEventListener('touchend', function(e) { return self.onTouchEnd(e) }, false);
    $( this.element ).removeClass( 'active' );
    
    if( this.active ){
        this.func();
        this.active = false;
    }

    return false;
}

function LogIt( msg ){
	console.log( msg );
}