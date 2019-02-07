Mmenu.addons.keyboardNavigation = function(
	this : Mmenu
) {
	//	Keyboard navigation on touchscreens opens the virtual keyboard :/
	//	Lets prevent that.
	if ( Mmenu.support.touch )
	{
		return;
	}


	var opts = this.opts.keyboardNavigation;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' || typeof opts == 'string' )
	{
		(opts as mmLooseObject) = {
			enable: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	this.opts.keyboardNavigation = Mmenu.extend( opts, Mmenu.options.keyboardNavigation );


	//	Enable keyboard navigation
	if ( opts.enable )
	{

		let menuStart 	= Mmenu.DOM.create( 'button.mm-tabstart' ),
			menuEnd   	= Mmenu.DOM.create( 'button.mm-tabend' ),
			blockerEnd 	= Mmenu.DOM.create( 'button.mm-tabend' );

		this.bind( 'initMenu:after', () => {
			if ( opts.enhance )
			{
				this.node.menu.classList.add( 'mm-menu_keyboardfocus' );
			}

			this._initWindow_keyboardNavigation( opts.enhance );
		});
		this.bind( 'initOpened:before', () => {
			this.node.menu.prepend( menuStart );
			this.node.menu.append( menuEnd );
			Mmenu.DOM.children( this.node.menu, '.mm-navbars-top, .mm-navbars-bottom' )
				.forEach(( navbars ) => {
					navbars.querySelectorAll( '.mm-navbar__title' )
						.forEach(( title ) => {
							title.setAttribute( 'tabindex', '-1' );
						});
				});
		});
		this.bind( 'initBlocker:after', () => {
			Mmenu.node.blck.append( blockerEnd );
			Mmenu.DOM.children( Mmenu.node.blck, 'a' )[ 0 ]
				.classList.add( 'mm-tabstart' );
		});


		var focusable = 'input, select, textarea, button, label, a[href]';
		function setFocus( 
			this 	 : Mmenu,
			panel	?: HTMLElement
		) {
			panel = panel || Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];

			var focus : HTMLElement = null;

			//	Focus already is on an element in a navbar in this menu.
			var navbar = document.activeElement.closest( '.mm-navbar' );
			if ( navbar )
			{
				if ( navbar.closest( '.mm-menu' ) == this.node.menu )
				{
					return;
				}
			}

			//	Set the focus to the first focusable element by default.
			if ( opts.enable == 'default' )
			{
				//	First visible anchor in a listview in the current panel.
				focus = Mmenu.DOM.find( panel, '.mm-listview a[href]:not(.mm-hidden)' )[ 0 ];
				
				//	First focusable and visible element in the current panel.
				if ( !focus )
				{
					focus = Mmenu.DOM.find( panel, focusable + ':not(.mm-hidden)' )[ 0 ];
				}

				//	First focusable and visible element in a navbar.
				if ( !focus )
				{
					let elements :HTMLElement[] = [];
					Mmenu.DOM.children( this.node.menu, '.mm-navbars_top, .mm-navbars_bottom' )
						.forEach(( navbar ) => {
							elements.push( ...Mmenu.DOM.find( navbar, focusable + ':not(.mm-hidden)' ) )
						});
					focus = elements[ 0 ];
				}
			}

			//	Default.
			if ( !focus )
			{
				focus = Mmenu.DOM.children( this.node.menu, '.mm-tabstart' )[ 0 ];
			}

			if ( focus )
			{
				focus.focus();
			}
		}
		this.bind( 'open:finish'		, setFocus );
		this.bind( 'openPanel:finish'	, setFocus );


		//	Add screenreader / aria support.
		this.bind( 'initOpened:after:sr-aria', () => {
			[ this.node.menu, Mmenu.node.blck ].forEach(( element ) => {
				Mmenu.DOM.children( element, '.mm-tabstart, .mm-tabend' )
					.forEach(( tabber ) => {
						Mmenu.sr_aria( tabber, 'hidden', true );
						Mmenu.sr_role( tabber, 'presentation' );
					});
			});
		});
	}
};

//	Default options and configuration.
Mmenu.options.keyboardNavigation = {
	enable 	: false,
	enhance	: false
};


/**
 * Initialize the window.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
Mmenu.prototype._initWindow_keyboardNavigation = function( 
	this	: Mmenu,
	enhance	: boolean
) {

	if ( Mmenu.evnt.keydownOffCanvas )
	{
		//	Re-enable tabbing in general
		window.removeEventListener( 'keydown', Mmenu.evnt.keydownOffCanvas );
	}


	if ( !Mmenu.evnt.focusinKeyboardNavigation )
	{
		Mmenu.evnt.focusinKeyboardNavigation = ( evnt: KeyboardEvent ) => {
			if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
			{
				let target = (evnt.target as any); // Typecast to any because somehow, TypeScript thinks event.target is the window.

				if ( target.matches( '.mm-tabend' ) )
				{
					let next;

					//	Jump from menu to blocker.
					if ( target.parentElement.matches( '.mm-menu' ) )
					{
						if ( Mmenu.node.blck )
						{
							next = Mmenu.node.blck;
						}
					}

					//	Jump to opened menu.
					if ( target.parentElement.matches( '.mm-wrapper__blocker' ) )
					{
						next = Mmenu.DOM.find( document.body, '.mm-menu_offcanvas.mm-menu_opened' )[ 0 ];
					}

					//	If no available element found, stay in current element.
					if ( !next )
					{
						next = target.parentElement;
					}

					if ( next )
					{
						Mmenu.DOM.children( next, '.mm-tabstart' )[ 0 ].focus();
					}
				}
			}
		};
		window.addEventListener( 'focusin', Mmenu.evnt.focusinKeyboardNavigation );
	}

	if ( !Mmenu.evnt.keydownKeyboardNavigation )
	{
		Mmenu.evnt.keydownKeyboardNavigation = ( evnt: KeyboardEvent ) => {
			var target 	= (evnt.target as any);
			var menu	= target.closest( '.mm-menu' );

			if ( menu )
			{
				let api : mmApi = menu[ 'mmenu' ];

				//	special case for input and textarea
				if ( target.matches( 'input, textarea' ) )
				{
				}
				else
				{
					switch( evnt.keyCode )
					{
						//	press enter to toggle and check
						case 13: 
							if ( target.matches( '.mm-toggle' ) || 
								 target.matches( '.mm-check' )
							) {
								target.dispatchEvent( new Event( 'click' ) );
							}
							break;

						//	prevent spacebar or arrows from scrolling the page
						case 32: 	//	space
						case 37: 	//	left
						case 38: 	//	top
						case 39: 	//	right
						case 40: 	//	bottom
							evnt.preventDefault();
							break;
					}
				}

				if ( enhance )
				{
					//	special case for input and textarea
					if ( target.matches( 'input' ) )
					{
						switch( evnt.keyCode )
						{
							//	empty searchfield with esc
							case 27:
								target.value = '';
								break;
						}
					}
					else
					{
						let api : mmApi = menu[ 'mmenu' ];

						switch( evnt.keyCode )
						{
							//	close submenu with backspace
							case 8: 
								let parent : HTMLElement = Mmenu.DOM.find( menu, '.mm-panel_opened' )[ 0 ][ 'mmParent' ];
								if ( parent )
								{
									api.openPanel( parent.closest( '.mm-panel' ) );
								}
								break;

							//	close menu with esc
							case 27:
								if ( menu.matches( '.mm-menu_offcanvas' ) )
								{
									api.close();
								}
								break;
						}
					}
				}
			}
		};
		window.addEventListener( 'keydown', Mmenu.evnt.keydownKeyboardNavigation );
	}
};

