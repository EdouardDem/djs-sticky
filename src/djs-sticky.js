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
 * @todo introduce min bottom space
 *
 * @param {Object} $element				Sticky element
 * @param {Object} options				Additional options
 */
djs.Sticky = function($element, options) {

	//Only first element
	$element = $element.first();

	// jQuery elements
	this.$window = $(window);
	var $parent = $element.parent();

	// Default options
	var defaultOptions = {
		scroll: this.$window,
		width: $parent,
		box: $parent,
		top: 0,
		bottom: 0
	};
	options = $.extend({}, defaultOptions, options);

	// Other jQuery elements
	this.$element = $element;
	this.$box = options.box;
	this.$scroll = options.scroll;
	this.$placeholder = null;

	// Properties
	this.width = options.width;
	this.top = options.top;
	this.bottom = options.bottom;
	this.position = 'top';
	this.on = false;

	// Unique id
	this.id = 'sticky_'+__DJS_STICKY_COUNTER;
	__DJS_STICKY_COUNTER++;

};
/**
 * Bind events, create placeholder and activate element
 *
 * @callback didBind
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

	// Callback
	this.didBind();

	// Update display
	this._update();

	return this;
};
/**
 * Deactivate element, remove placeholder and unbind events
 *
 * @callback willUnbind
 * @return {Object}
 */
djs.Sticky.prototype.unbind = function() {

	// Callback
	this.willUnbind();

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

	// Position
	this.position = 'top';

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
 * @callback didStart
 * @callback didStop
 * @private
 */
djs.Sticky.prototype._update = function() {

	// Check if active
	if (!this.on) return;

	// Get actual values
	var scrollTop = this.$scroll.scrollTop();
	var eleH = this.$element.outerHeight();
	var boxH = this.$box.outerHeight();
	var winH = this.$window.height();
	var boxOffset = this.$box.offset();
	var position = null;

	// If actual scroll is lower than box' top + top offset
	if (scrollTop > boxOffset.top - this.top &&
		scrollTop + winH >= boxOffset.top + eleH + this.bottom) {

		var css = {};
		css.position = 'fixed';

		// If the element is smaller than the window
		if (this.top + eleH <= winH) {

			// End of scrolling, put element at the bottom of box
			if (scrollTop - boxOffset.top >= boxH - eleH - this.top - this.bottom) {

				css.bottom = (scrollTop + winH - (boxOffset.top + boxH - this.bottom)) + 'px';
				css.top = '';
				position = 'bottom';
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
				position = 'bottom';
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
		position = 'top';

		// Hide placeholder
		this.$placeholder.hide();
	}

	// Callback
	if (position != this.position) {
		// Did reach a stop
		if (position != null) {
			this.didStop(position);
		}
		// Did start
		else {
			this.didStart(this.position);
		}
		//Save position
		this.position = position;
	}

};

//==================================
// Callbacks
/**
 * Called when the element has been activated
 */
djs.Sticky.prototype.didBind = function() {};
/**
 * Called when the element will be deactivated
 */
djs.Sticky.prototype.willUnbind = function() {};
/**
 * Called when the element starts to stick
 *
 * @param {String} previous		The previous position (top or bottom)
 */
djs.Sticky.prototype.didStart = function(previous) {};
/**
 * Called when the element reach stop
 *
 * @param {String} position		The stop position (top or bottom)
 */
djs.Sticky.prototype.didStop = function(position) {};