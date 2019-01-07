Mmenu.addons.drag = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}
	if ( typeof Hammer != 'function' || Hammer.VERSION < 2 )
	{
		return;
	}


	var opts = this.opts.drag,
		conf = this.conf.drag;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			menu 	: opts,
			panels 	: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	if ( typeof opts.menu == 'boolean' )
	{
		(opts as mmLooseObject) = {
			open 	: opts.menu
		};
	}
	if ( typeof opts.menu != 'object' )
	{
		(opts.menu as mmLooseObject) = {};
	}
	if ( typeof opts.panels == 'boolean' )
	{
		opts.panels = {
			close 	: opts.panels
		};
	}
	if ( typeof opts.panels != 'object' )
	{
		(opts.panels as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	//opts = this.opts.drag = jQuery.extend( true, {}, Mmenu.options.drag, opts );
	this.opts.drag = Mmenu.extend( opts, Mmenu.options.drag );


	function minMax( val, min, max )
	{
		if ( val < min )
		{
			val = min;
		}
		if ( val > max )
		{
			val = max;
		}
		return val;
	}


	//	Drag open the menu
	if ( opts.menu.open )
	{
		this.bind( 'setPage:after', () => {
			//	defaults for "left"
			var drag = {
				events 		: 'panleft panright',
				typeLower 	: 'x',
				typeUpper 	: 'X',
				open_dir 	: 'right',
				close_dir 	: 'left',
				negative	: false
			};
			var _dimension = 'width',
				_direction = drag.open_dir;

			var doPanstart = function( 
				this	: Mmenu,
				pos 	: number
			) {
				if ( pos <= opts.menu.maxStartPos )
				{
					_stage = 1;
				}
			};
			var getSlideNodes = function(
				this : Mmenu
			) {
				return Mmenu.$('.mm-slideout');
			};

			var _stage 			= 0,
				_distance 		= 0,
				_maxDistance 	= 0;

			var new_distance, drag_distance, css_value;


			//	Find menu position from Positioning extension
			var x = this.opts.extensions[ 'all' ];

			var position = ( typeof x == 'undefined' )
				? 'left'
				: ( x.indexOf( 'mm-menu_position-right' ) > -1 )
					? 'right'
					: ( x.indexOf( 'mm-menu_position-top' ) > -1 )
						? 'top'
						: ( x.indexOf( 'mm-menu_position-bottom' ) > -1 )
							? 'bottom'
							: 'left';

			var zposition = ( typeof x == 'undefined' )
				? 'back'
				: ( x.indexOf( 'mm-menu_position-top' 	 ) > -1 ) ||
				  ( x.indexOf( 'mm-menu_position-bottom' ) > -1 ) ||
				  ( x.indexOf( 'mm-menu_position-front'  ) > -1 )
					? 'front'
					: 'back';


			switch( position )
			{
				case 'top':
				case 'bottom':
					drag.events		= 'panup pandown';
					drag.typeLower	= 'y';
					drag.typeUpper	= 'Y';

					_dimension 		= 'height';
					break;
			}

			switch( position )
			{	
				case 'right':
				case 'bottom':
					drag.negative 	= true;
					doPanstart		= function( 
						this	: Mmenu,
						pos 	: number
					) {
						if ( pos >= Mmenu.$(window)[ _dimension ]() - opts.menu.maxStartPos )
						{
							_stage = 1;
						}
					};
					break;
			}

			switch( position )
			{
				case 'right':
					drag.open_dir 	= 'left';
					drag.close_dir 	= 'right';
					break;

				case 'top':
					drag.open_dir 	= 'down';
					drag.close_dir 	= 'up';
					break;

				case 'bottom':
					drag.open_dir 	= 'up';
					drag.close_dir 	= 'down';
					break;
			}

			switch ( zposition )
			{
				case 'front':
					getSlideNodes = function(
						this : Mmenu
					) {
						return Mmenu.$(this.node.menu);
					};
					break;
			}

			var $slideOutNodes 	: JQuery,
				$dragNode 		: JQuery = Mmenu.valueOrFn( Mmenu.$(this.node.menu), opts.menu.node, Mmenu.node.$page );

			if ( typeof $dragNode == 'string' )
			{
				$dragNode = Mmenu.$($dragNode);
			}


			//	Bind events
			var _hammer = new Hammer( $dragNode[ 0 ], this.opts.drag.vendors.hammer );

			_hammer
				.on( 'panstart', ( evnt ) => {
					doPanstart.call( this, evnt.center[ drag.typeLower ] );
					$slideOutNodes = getSlideNodes.call( this );
					_direction = drag.open_dir;
				});

			_hammer
				.on( drag.events + ' panend', ( evnt ) => {
					if ( _stage > 0 )
					{
						evnt.preventDefault();
					}
				});

			_hammer
				.on( drag.events, ( evnt ) => {
					new_distance = evnt[ 'delta' + drag.typeUpper ];
					if ( drag.negative )
					{
						new_distance = -new_distance;
					}

					if ( new_distance != _distance )
					{
						_direction = ( new_distance >= _distance ) ? drag.open_dir : drag.close_dir;
					}

					_distance = new_distance;

					if ( _distance > opts.menu.threshold )
					{
						if ( _stage == 1 )
						{
							if ( Mmenu.$('html').hasClass( 'mm-wrapper_opened' ) )
							{
								return;
							}
							_stage = 2;

							this._openSetup();
							this.trigger( 'open:start' );
							Mmenu.$('html').addClass( 'mm-wrapper_dragging' );

							_maxDistance = minMax( 
								Mmenu.$(window)[ _dimension ]() * conf.menu[ _dimension ].perc, 
								conf.menu[ _dimension ].min, 
								conf.menu[ _dimension ].max
							);
						}
					}
					if ( _stage == 2 )
					{
						drag_distance = minMax( _distance, 10, _maxDistance ) - ( zposition == 'front' ? _maxDistance : 0 );
						if ( drag.negative )
						{
							drag_distance = -drag_distance;
						}
						css_value = 'translate' + drag.typeUpper + '(' + drag_distance + 'px )';

						$slideOutNodes.css({
							'-webkit-transform': '-webkit-' + css_value,	
							'transform': css_value
						});
					}
				});

			_hammer
				.on( 'panend', ( evnt ) => {
					if ( _stage == 2 )
					{
						Mmenu.$('html').removeClass( 'mm-wrapper_dragging' );
						$slideOutNodes.css( 'transform', '' );
						this[ _direction == drag.open_dir ? '_openFinish' : 'close' ]();
					}
		        	_stage = 0;
			    });
		});
	}

	//	Drag close panels
	if ( opts.panels.close )
	{
		this.bind( 'initPanel:after', (
			$panel : JQuery
		) => {
			var $parent : JQuery = ($panel[ 0 ] as any).mmParent;

			if ( $parent )
			{
				$parent = $parent.closest( '.mm-panel' );

				var _hammer = new Hammer( $panel[ 0 ], this.opts.drag.vendors.hammer ),
					timeout = null;

				_hammer
					.on( 'panright',
						( e ) => {
							if ( timeout )
							{
								return;
							}
							this.openPanel( $parent );

							//	prevent dragging while panel still open.
							timeout = setTimeout(
								() => {
									clearTimeout( timeout );
									timeout = null;
								}, this.conf.openingInterval + this.conf.transitionDuration
							);
						}
					);
			}
		});
	}
};


//	Default options and configuration.
Mmenu.options.drag = {
	menu 	: {
		open 		: false,
		node		: null,
		maxStartPos	: 100,
		threshold	: 50
	},
	panels 	: {
		close 	: false
	},
	vendors	: {
		hammer	: {}
	}
};

Mmenu.configs.drag = {
	menu : {
		width	: {
			perc	: 0.8,
			min		: 140,
			max		: 440
		},
		height	: {
			perc	: 0.8,
			min		: 140,
			max		: 880
		}
	}
};
