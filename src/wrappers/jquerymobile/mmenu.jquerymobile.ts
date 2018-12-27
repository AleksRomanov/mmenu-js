Mmenu.wrappers.jqueryMobile = function(
	this : Mmenu
) {

	this.opts.onClick.close = false;
	this.conf.offCanvas.page.selector = 'div.ui-page-active';

	//	When changing pages
	Mmenu.$('body').on(
		'pagecontainerchange',
		( e, args ) => {
			if ( this.opts.offCanvas )
			{
				if ( typeof this.close == 'function' )
				{
					this.close();
				}
				if ( typeof this.close == 'function' )
				{
					this.setPage( args.toPage );
				}
			}
		}
	);

	//	Change pages
	this.bind( 'initAnchors:after',
		function(
			this : Mmenu
		) {
			Mmenu.$('body').on(
				'click',
				'.mm-listview a',
				( e ) => {
					if ( !e.isDefaultPrevented() )
					{
						e.preventDefault();
						Mmenu.$( 'body' )[ 'pagecontainer' ]( 'change', e.currentTarget.getAttribute( 'href' ) );
					}
				}
			);
		}
	);
};
