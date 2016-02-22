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

	//--------------------
	// Init resize
	djs.resize.init();

	//--------------------
	// First in left col
	stickies.push((new djs.Sticky($('#sticky-cnt-1 .sticky'), {
		top: 20
	})).bind());

	//--------------------
	// Second in left col
	stickies.push((new djs.Sticky($('#sticky-cnt-2 .sticky'), {
		top: 20,
		bottom: 60
	})).bind());

	//--------------------
	// First outside
	stickies.push((new djs.Sticky($('#sticky-cnt-3 .sticky'), {
		top: 20,
		bottom: 0,
		box: $('#right-col'),
		width: 40
	})).bind());

	//--------------------
	// Seocond outside
	stickies.push((new djs.Sticky($('#sticky-cnt-4 .sticky'), {
		top: 20,
		bottom: 0,
		box: $('#bottom-block'),
		width: $('#sticky-cnt-4').parent()
	})).bind());

});