Mmenu.addons.toggles = function()
{
	this.bind( 'initPanels:after', ( 
		$panels	: JQuery
	) => {

		//	Refactor toggle classes
		Mmenu.refactorClass( $panels.find( 'input' ), this.conf.classNames.toggles.toggle , 'mm-toggle' );
		Mmenu.refactorClass( $panels.find( 'input' ), this.conf.classNames.toggles.check  , 'mm-check'  );


		//	Add markup
		$panels
			.find( 'input.mm-toggle, input.mm-check' )
			.each((
				i 	 : number,
				elem : HTMLElement
			) => {
				var $inpt = Mmenu.$(elem),
					$prnt = $inpt.closest( 'li' ),
					cl = $inpt.hasClass( 'mm-toggle' ) ? 'toggle' : 'check',
					id = $inpt[ 0 ].id || Mmenu.getUniqueId();

				if ( !$prnt.children( 'label[for="' + id + '"]' ).length )
				{
					$inpt[ 0 ].id = id;
					$prnt.prepend( $inpt );

					Mmenu.$('<label for="' + id + '" class="mm-' + cl + '"></label>')
						.insertAfter( $prnt.children( '.mm-listitem__text' ).last() );
				}
			});
	});
};


//	Default options and configuration.
Mmenu.configs.classNames.toggles = {
	toggle	: 'Toggle',
	check	: 'Check'
};
