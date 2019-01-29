Mmenu.addons.iconbar = function(
	this : Mmenu
) {

	var opts = this.opts.iconbar;


	//	Extend shorthand options
	if ( Mmenu.typeof( opts ) == 'array' )
	{
		(opts as mmLooseObject) = {
			add: true,
			top: opts
		};
	}
	//	/Extend shorthand options


	if ( !opts.add )
	{
		return;
	}


	var iconbar : HTMLElement;

	[ 'top', 'bottom' ].forEach(( position, n ) => {

		var ctnt = opts[ position ];

		//	Extend shorthand options
		if ( Mmenu.typeof( ctnt ) != 'array' )
		{
			ctnt = [ ctnt ];
		}

		//	Create node
		var ibar = Mmenu.DOM.create( 'div.mm-iconbar__' + position );


		//	Add content
		for ( var c = 0, l = ctnt.length; c < l; c++ )
		{
			if ( typeof ctnt[ c ] == 'string' ) {
				ibar.innerHTML += ctnt[ c ];
			}
			else
			{
				ibar.append( ctnt[ c ] );
			}
		}

		if ( ibar.children.length )
		{
			if ( !iconbar )
			{
				iconbar = Mmenu.DOM.create( 'div.mm-iconbar' );
			}
			iconbar.append( ibar );
		}
	});


	//	Add to menu
	if ( iconbar )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_iconbar' );
			this.node.menu.prepend( iconbar );
		});

		//	Tabs
		if ( opts.type == 'tabs' )
		{

			iconbar.classList.add( 'mm-iconbar_tabs' );
			iconbar.addEventListener( 'click', ( evnt ) => {
				var anchor = (evnt.target as HTMLElement)

				if ( !anchor.matches( 'a' ) )
				{
					return;
				}

				if ( anchor.matches( '.mm-iconbar__tab_selected' ) )
				{
					evnt.stopImmediatePropagation();
					return;
				}

				try
				{
					var panel = this.node.menu.querySelector( anchor.getAttribute( 'href' ) )[ 0 ];

					if ( panel && panel.matches( '.mm-panel' ) )
					{
						evnt.preventDefault();
						evnt.stopImmediatePropagation();

						this.openPanel( panel, false );
					}
				}
				catch( err ) {}
			});

			function selectTab( 
				this	: Mmenu,
				panel	: HTMLElement
			) {
				Mmenu.DOM.find( iconbar, 'a' )
					.forEach(( anchor ) => {
						anchor.classList.remove( 'mm-iconbar__tab_selected' );
					});				

				var anchor = Mmenu.DOM.find( iconbar, '[href="#' + panel.id + '"]' )[ 0 ];
				if ( anchor )
				{
					anchor.classList.add( 'mm-iconbar__tab_selected' );
				}
				else
				{
					let parent : HTMLElement = panel[ 'mmParent' ];
					if ( parent )
					{
						selectTab.call( this, parent.closest( '.mm-panel' ) );
					}
				}
			}
			this.bind( 'openPanel:start', selectTab );
		}
	}
};


//	Default options and configuration.
Mmenu.options.iconbar = {
	add 	: false,
	top 	: [],
	bottom 	: [],
	type	: 'default'
};
