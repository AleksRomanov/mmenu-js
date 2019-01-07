Mmenu.addons.iconbar = function(
	this : Mmenu
) {

	var opts = this.opts.iconbar;


	//	Extend shorthand options
	if ( opts instanceof Array )
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


	var $iconbar : JQuery = null;

	[ 'top', 'bottom' ].forEach(( poss, n ) => {

		var ctnt = opts[ poss ];

		//	Extend shorthand options
		//if ( !( ctnt instanceof Array ) )
		if ( Mmenu.typeof( ctnt ) != 'array' )
		{
			ctnt = [ ctnt ];
		}

		//	Create node
		var $ibar = Mmenu.$( '<div class="mm-iconbar__' + poss + '" />' );


		//	Add content
		for ( var c = 0, l = ctnt.length; c < l; c++ )
		{
			$ibar.append( ctnt[ c ] );
		}

		if ( $ibar.children().length )
		{
			if ( !$iconbar )
			{
				$iconbar = Mmenu.$('<div class="mm-iconbar" />');
			}
			$iconbar.append( $ibar );
		}
	});


	//	Add to menu
	if ( $iconbar )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_iconbar' );
			Mmenu.$(this.node.menu).prepend( $iconbar );
		});

		//	Tabs
		if ( opts.type == 'tabs' )
		{

			$iconbar.addClass( 'mm-iconbar_tabs' );

			$iconbar.on( 'click.mm-iconbar', 'a', ( evnt ) => {
				var $tab = Mmenu.$(evnt.currentTarget);
				if ( $tab.hasClass( 'mm-iconbar__tab_selected' ) )
				{
					evnt.stopImmediatePropagation();
					return;
				}

				try
				{
					var $target = Mmenu.$( evnt.currentTarget.getAttribute( 'href' ) );
					if ( $target.hasClass( 'mm-panel' ) )
					{
						evnt.preventDefault();
						evnt.stopImmediatePropagation();

						this.openPanel( $target, false );
					}
				}
				catch( err ) {}
			});

			function selectTab( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				var $tabs = $iconbar.find( 'a' );
				$tabs.removeClass( 'mm-iconbar__tab_selected' );

				var $tab = $tabs.filter( '[href="#' + $panel[ 0 ].id + '"]' );
				if ( $tab.length )
				{
					$tab.addClass( 'mm-iconbar__tab_selected' );
				}
				else
				{
					var $parent : JQuery = ($panel[ 0 ] as any).mmParent;
					if ( $parent && $parent.length )
					{
						selectTab.call( this, $parent.closest( '.mm-panel' ) );
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
