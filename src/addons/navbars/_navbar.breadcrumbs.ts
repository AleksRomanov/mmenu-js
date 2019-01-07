Mmenu.addons.navbars.breadcrumbs = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $crumbs = Mmenu.$('<span class="mm-navbar__breadcrumbs" />').appendTo( $navbar );

	this.bind( 'initNavbar:after', (
		$panel	: JQuery
	) => {
		if ( $panel.children( '.mm-navbar' ).children( '.mm-navbar__breadcrumbs' ).length )
		{
			return;
		}

		$panel.removeClass( 'mm-panel_has-navbar' );
			
		var crumbs = [],
			$bcrb = Mmenu.$( '<span class="mm-navbar__breadcrumbs"></span>' ),
			$crnt = $panel,
			first = true;

		while ( $crnt && $crnt.length )
		{
			if ( !$crnt.is( '.mm-panel' ) )
			{
				$crnt = $crnt.closest( '.mm-panel' );
			}

			if ( !$crnt.parent( '.mm-listitem_vertical' ).length )
			{
				var text = $crnt.children( '.mm-navbar' ).children( '.mm-navbar__title' ).text();
				if ( text.length )
				{
					crumbs.unshift( first ? '<span>' + text + '</span>' : '<a href="#' + $crnt[ 0 ].id + '">' + text + '</a>' );
				}

				first = false;
			}
			$crnt = ($crnt[ 0 ] as any).mmParent;
		}
		if ( this.conf.navbars.breadcrumbs.removeFirst )
		{
			crumbs.shift();
		}

		$bcrb
			.append( crumbs.join( '<span class="mm-separator">' + this.conf.navbars.breadcrumbs.separator + '</span>' ) )
			.appendTo( $panel.children( '.mm-navbar' ) );

	});

	//	Update for to opened panel
	this.bind( 'openPanel:start', (
		$panel : JQuery
	) => {
		var $bcrb = $panel.find( '.mm-navbar__breadcrumbs' );
		if ( $bcrb.length )
		{
			$crumbs.html( $bcrb.html() || '' );
		}
	});


	//	Add screenreader / aria support
	this.bind( 'initNavbar:after:sr-aria', ( 
		$panel : JQuery
	) => {
		$panel
			.children( '.mm-navbar' )
			.children( '.mm-breadcrumbs' )
			.children( 'a' )
			.each(
				( i, elem ) => {
					Mmenu.sr_aria( Mmenu.$(elem), 'owns', elem.getAttribute( 'href' ).slice( 1 ) );
				}
			);
	});
};
