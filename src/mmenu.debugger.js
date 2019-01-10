/*	
 * Debugger for mmenu
 * Include this file after including the jquery.mmenu plugin to debug your menu.
 */


(function( $ ) {

return;

	var _cns = Mmenu.console || console || { info: function() {}, log: function() {}, warn: function() {} };

	function debug( msg )
	{
		_cns.warn( 'MMENU: ' + msg );
	}
	function deprc( depr, repl, vers )
	{
		var msg = 'MMENU: ' + depr + ' is deprecated';

		if ( vers )
		{
			msg += ' as of version ' + vers;
		}
		if ( repl )
		{
			msg += ', use ' + repl + ' instead';
		}
		msg += '.';

		_cns.warn( msg );
	}


	Mmenu.prototype._deprecated = function()
	{
		//	Lets rethink this whole thing :)
	};



	Mmenu.prototype._debug = function()
	{
		//	Lets rethink this whole thing :)
	};


})( jQuery );