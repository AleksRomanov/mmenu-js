Mmenu.addons.navbars.title = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $title = Mmenu.$('<a class="mm-navbar__title" />')
		.appendTo( $navbar );


	//	Update to opened panel
	var _url, _txt;
	var $org : JQuery;

	this.bind( 'openPanel:start', ( 
		$panel : JQuery
	) => {
		if ( $panel.parent( '.mm-listitem_vertical' ).length )
		{
			return;
		}

		$org = $panel.find( '.' + this.conf.classNames.navbars.panelTitle );
		if ( !$org.length )
		{
			$org = $panel.children( '.mm-navbar' ).children( '.mm-navbar__title' );
		}

		_url = $org[ 0 ].getAttribute( 'href' );
		_txt = $org.html();

		if ( _url )
		{
			$title[ 0 ].setAttribute( 'href', _url );
		}
		else
		{
			$title[ 0 ].removeAttribute( 'href' );
		}

		$title[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
		$title.html( _txt );
	});


	//	Add screenreader / aria support
	var $prev;

	this.bind( 'openPanel:start:sr-aria', (
		$panel : JQuery
	) => {
		if ( this.opts.screenReader.text )
		{
			if ( !$prev )
			{
				$prev = Mmenu.$(this.node.menu)
					.children( '.mm-navbars_top, .mm-navbars_bottom' )
					.children( '.mm-navbar' )
					.children( '.mm-btn_prev' );
			}
			if ( $prev.length )
			{
				var hidden = true;
				if ( this.opts.navbar.titleLink == 'parent' )
				{
					hidden = !$prev.hasClass( 'mm-hidden' );
				}
				Mmenu.sr_aria( $title, 'hidden', hidden );
			}
		}
	});
};

Mmenu.configs.classNames.navbars.panelTitle = 'Title';
