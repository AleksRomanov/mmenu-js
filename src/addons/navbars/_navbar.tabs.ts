Mmenu.addons.navbars.tabs = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {

	var $tabs = $navbar.children( 'a' );

	$navbar
		.addClass( 'mm-navbar_tabs' )
		.parent()
		.addClass( 'mm-navbars_has-tabs' );

	$tabs
		.on( 'click.mm-navbars', ( evnt ) => {
			evnt.preventDefault();

			var $tab = Mmenu.$(evnt.currentTarget);
			if ( $tab.hasClass( 'mm-navbar__tab_selected' ) )
			{
				evnt.stopImmediatePropagation();
				return;
			}

			try
			{
				this.openPanel( Mmenu.$( $tab[ 0 ].getAttribute( 'href' ) ), false );
				evnt.stopImmediatePropagation();
			}
			catch( err ) {}
		});

	function selectTab( 
		this	: Mmenu,
		$panel	: JQuery
	) {
		$tabs.removeClass( 'mm-navbar__tab_selected' );

		var $tab = $tabs.filter( '[href="#' + $panel[ 0 ].id + '"]' );
		if ( $tab.length )
		{
			$tab.addClass( 'mm-navbar__tab_selected' );
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
};
