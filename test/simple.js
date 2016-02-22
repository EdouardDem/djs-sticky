/**
 * Log function
 *
 * @param {String} text
 */
displayLog = function (text) {
	$('.results').append('<div>' + text + '</div>');
	console.log(text);
};
/**
 * Clear log
 */
clearLog = function () {
	$('.results').html('');
	console.clear();
};
/**
 * Toggle stickies
 */
stickies = [];
toggle = function() {
	if (stickies[0].on) {
		for(var i=0; i<stickies.length; i++)
			stickies[i].unbind();
		$('#toggle').text('Activate');
	} else {
		for(var i=0; i<stickies.length; i++)
			stickies[i].bind();
		$('#toggle').text('Deactivate');
	}
};
/**
 * On init
 */
$(document).ready(function () {

	//--------------------
	// Init resize
	djs.resize.init();

	//--------------------
	// First in left col
	stickies.push(new djs.Sticky($('#sticky-cnt-1 .sticky'), {
		top: 20
	}));

	//--------------------
	// Second in left col
	stickies.push(new djs.Sticky($('#sticky-cnt-2 .sticky'), {
		top: 20,
		bottom: 60
	}));

	//--------------------
	// First outside
	stickies.push(new djs.Sticky($('#sticky-cnt-3 .sticky'), {
		top: 20,
		bottom: 0,
		box: $('#right-col'),
		width: 40
	}));

	//--------------------
	// Second outside
	stickies.push(new djs.Sticky($('#sticky-cnt-4 .sticky'), {
		top: 20,
		bottom: 0,
		box: $('#bottom-block'),
		width: $('#sticky-cnt-4').parent()
	}));


	//--------------------
	// Callbacks
	for(var i=0; i<stickies.length; i++) {

		// Bind bind callback
		stickies[i].didBind = function() {
			displayLog('Sticky "' + this.id + '" has been activated');
		}.bind(stickies[i]);

		// Bind start callback
		stickies[i].didStart = function(position) {
			displayLog('Sticky "' + this.id + '" did start from ' + position);
		}.bind(stickies[i]);

		// Bind end callback
		stickies[i].didStop = function(position) {
			displayLog('Sticky "' + this.id + '" did reach ' + position);
		}.bind(stickies[i]);

		// Bind unbind callback
		stickies[i].willUnbind = function() {
			displayLog('Sticky "' + this.id + '" will be deactivated');
		}.bind(stickies[i]);
	}


	//--------------------
	// Bind all
	for(var i=0; i<stickies.length; i++) {
		stickies[i].bind();
	}

});