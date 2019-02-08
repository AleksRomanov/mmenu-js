Mmenu.wrappers.bootstrap4 = function(
	this : Mmenu
) {

	//	Create the menu
	if ( this.node.menu.matches( '.navbar-collapse' ) )
	{

		//	No need for cloning the menu...
		this.conf.clone = false;


		//	... We'll create a new menu
		var nav 	= Mmenu.DOM.create( 'nav' ),
			panel 	= Mmenu.DOM.create( 'div' );

		nav.append( panel );

		Mmenu.DOM.children( this.node.menu )
			.forEach(( child ) => {
				switch( true )
				{
					case child.matches( '.navbar-nav' ):
						panel.append( cloneNav( child ) );
						break;

					case child.matches( '.dropdown-menu' ):
						panel.append( cloneDropdown( child ) );
						break;

					case child.matches( '.form-inline' ):
						this.conf.searchfield.form = {
							action	: child.getAttribute( 'action' ) 	|| null,
							method	: child.getAttribute( 'method' ) 	|| null
						};
						this.conf.searchfield.input = {
							name	: child.querySelector( 'input' ).getAttribute( 'name' ) || null
						};
						this.conf.searchfield.clear 	= false;
						this.conf.searchfield.submit	= true;
						break;

					default:
						panel.append( child.cloneNode( true ) );
						break;
				}
			});

		//	Set the menu
		this.bind( 'initMenu:before', () => {
			document.body.prepend( nav );
			this.node.menu = nav;
		});

		//	Hijack the toggler.
		var toggler = this.node.menu.parentElement.querySelector( '.navbar-toggler' );
			toggler.removeAttribute( 'data-target' );
			toggler.removeAttribute( 'aria-controls' );

			//	Remove all bound events.
		toggler.outerHTML = toggler.outerHTML;

		toggler.addEventListener( 'click', ( evnt ) => {
			evnt.preventDefault();
			evnt.stopImmediatePropagation();
			this[ this.vars.opened ? 'close' : 'open' ]();
		});
	}


	function cloneLink( 
		anchor : HTMLElement
	) {
		var link = Mmenu.DOM.create( 'a' );

		//	Copy attributes
		var attr = ['href', 'title', 'target'];
		for ( var a = 0; a < attr.length; a++ )
		{
			if ( typeof anchor.getAttribute( attr[ a ] ) != 'undefined' )
			{
				link.setAttribute(  attr[ a ], anchor.getAttribute(  attr[ a ] ) );
			}
		}

		//	Copy contents
		link.innerHTML = anchor.innerHTML;

		//	Remove Screen reader text.
		Mmenu.DOM.find( link, '.sr-only' )
			.forEach(( sro ) => {
				sro.remove();	
			})

		return link;
	}
	function cloneDropdown( 
		dropdown : HTMLElement
	) {
		var list = Mmenu.DOM.create( 'ul' );
		Mmenu.DOM.children( dropdown )
			.forEach(( anchor ) => {
				var item = Mmenu.DOM.create( 'li' );

				if ( anchor.matches( '.dropdown-divider' ) )
				{
					item.classList.add( 'Divider' );
				}
				else if ( anchor.matches( '.dropdown-item' ) )
				{
					item.append( cloneLink( anchor ) );
				}
				list.append( item );
			}
		);
		return list;
	}
	function cloneNav( 
		nav : HTMLElement
	) {
		var list = Mmenu.DOM.create( 'ul' );

		Mmenu.DOM.find( nav, '.nav-item' )
			.forEach(( anchor ) => {
				var item = Mmenu.DOM.create( 'li' );

				if ( anchor.matches( '.active' ) )
				{
					item.classList.add( 'Selected' );
				}
				if ( !anchor.matches( '.nav-link' ) )
				{
					let dropdown = Mmenu.DOM.children( anchor, '.dropdown-menu' )[ 0 ];
					if ( dropdown )
					{
						item.append( cloneDropdown( dropdown ) );
					}
					anchor = Mmenu.DOM.children( anchor, '.nav-link' )[ 0 ];
				}
				item.prepend( cloneLink( anchor ) );

				list.append( item );
			}
		);
		return list;
	}
};