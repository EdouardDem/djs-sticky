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

	var sticky = new djs.Sticky($('#sticky'));
	sticky.bind();

});