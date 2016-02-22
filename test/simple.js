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
 * On init
 */
$(document).ready(function () {

	djs.resize.init();

	//--------------------
	// First in left col
	var sticky = new djs.Sticky($('#sticky-cnt-1 .sticky'), {
		top: 20
	});
	sticky.bind();

	//--------------------
	// Second in left col
	var sticky = new djs.Sticky($('#sticky-cnt-2 .sticky'), {
		top: 20,
		bottom: 60
	});
	sticky.bind();

	//--------------------
	// Outside
	var sticky = new djs.Sticky($('#sticky-cnt-3 .sticky'), {
		top: 20,
		bottom: 0,
		box: $('#right-col'),
		width: 40
	});
	sticky.bind();

});