/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};
/**
 * This object attach a DOM element when scrolling.
 * This object is "chainable"
 */
/**
 * Counter for unique sticky id
 *
 * @type {number}
 * @private
 */
var __DJS_STICKY_COUNTER = 0;
/**
 * Constructor
 *
 * @requires resize
 *
 * @param {Object} $element				Sticky element
 * @param {Object} $box					Sticky container
 * @param {Object} options				Additional options
 */
djs.Sticky = function($element, $box, options) {

	// jQuery elements
	this.$window = $(window);

	// Default options
	var defaultOptions = {
		scroll: this.$window,
		width: $box,
		top: 0,
		bottom: 0
	};
	options = $.extend({}, defaultOptions, options);

	// Other jQuery elements
	this.$element = $element;
	this.$box = $box;
	this.$scroll = options.scroll;
	this.$placeholder = null;

	// Properties
	this.width = options.width;
	this.top = options.top;
	this.bottom = options.bottom;
	this.on = false;

	// Unique id
	this.id = 'sticky_'+__DJS_STICKY_COUNTER;
	__DJS_STICKY_COUNTER++;

};
/**
 * Bind events, create placeholder and activate element
 *
 * @return {Object}
 */
djs.Sticky.prototype.bind = function() {

	// Activate element
	this.on = true;

	// Update on scroll
	this.$scroll.bind('scroll.'+this.id, this._update.bind(this));

	// Bind the resize
	djs.resize.bind(this.id, this._resize.bind(this), djs.resize.stacks.last);

	// Create placeholder
	this.$placeholder = $('<div class="djs-sticky-placeholder"></div>');
	this.$placeholder.hide();
	this.$element.after(this.$placeholder);

	// Set element width
	this._setWidth();

	// Update display
	this._update();

	return this;
};
/**
 * Deactivate element, remove placeholder and unbind events
 *
 * @return {Object}
 */
djs.Sticky.prototype.unbind = function() {

	// Deactivate
	this.on = false;

	// Unbind scroll
	this.$scroll.unbind('scroll.'+this.id);

	// Unbind resize
	djs.resize.unbind(this.id, djs.resize.stacks.last);

	// Reset element CSS
	this.$element.css({
		position: '',
		bottom: '',
		top: '',
		width: ''
	});

	// Remove placeholder
	this.$placeholder.remove();
	this.$placeholder = null;

	return this;
};
/**
 * Rebind object
 *
 * @return {Object}
 */
djs.Sticky.prototype.rebind = function() {
	return this.unbind().bind();
};
/**
 * Force refresh display
 *
 * @return {Object}
 */

djs.Sticky.prototype.refresh = function() {
	this._resize();

	return this;
};




/**
 * Called on window resize
 *
 * @private
 */
djs.Sticky.prototype._resize = function() {

	// Check if active
	if (!this.on) return;

	// Update width
	this._setWidth();

	// Update display
	this._update();
};
/**
 * Set width of sticky element
 *
 * @private
 */
djs.Sticky.prototype._setWidth = function() {

	// width is jQuery object or not ?
	if (typeof this.width == "object") {
		this.$element.width(this.width.width());
	} else {
		this.$element.width(this.width);
	}

	// Update placeholder dimensions
	this.$placeholder.width(this.$element.outerWidth());
	this.$placeholder.height(this.$element.outerHeight());
};
/**
 * Called on scroll
 *
 * @private
 */
djs.Sticky.prototype._update = function() {

	// Check if active
	if (!this.on) return;

	// Get actual values
	var scrollTop = this.$scroll.scrollTop();
	var eleH = this.$element.height();
	var boxH = this.$box.height();
	var winH = this.$window.height();
	var boxOffset = this.$box.offset();

	// If actual scroll is lower than box' top + top offset
	if (scrollTop > boxOffset.top - this.top &&
		scrollTop + winH >= boxOffset.top + eleH + this.bottom) {

		var css = {};
		css.position = 'fixed';

		// If the element is smaller than the window
		if (boxOffset.top + eleH <= winH) {

			// End of scrolling, put element at the bottom of box
			if (scrollTop - boxOffset.top >= boxH - eleH - this.bottom) {

				css.bottom = (scrollTop + winH - (boxOffset.top + this.top + boxH - this.bottom)) + 'px';
				css.top = '';
			}
			// Is scrolling, put the element on top
			else {

				css.bottom = '';
				css.top = this.top + 'px';
			}
		}

		// If the element is higher than the window
		else {

			// End of scrolling
			if (scrollTop + winH >= boxOffset.top + boxH) {

				css.bottom = (scrollTop + winH - (boxOffset.top + boxH - this.bottom)) + 'px';
				css.top = '';
			}
			// While scrolling
			else {

				css.bottom = this.bottom + 'px';
				css.top = '';
			}
		}

		// Apply CSS
		this.$element.css(css);

		// Display placeholder
		this.$placeholder.show();
	}

	// Scroll on top, no CSS needed
	else {
		// Reset CSS
		this.$element.css({
			position: '',
			bottom: '',
			top: ''
		});

		// Hide placeholder
		this.$placeholder.hide();
	}

};
