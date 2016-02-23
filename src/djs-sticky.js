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
 * @requires djs.resize
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
		bottom: 0,
		boxBottom: 0
	};
	options = $.extend({}, defaultOptions, options);

	// CSS classes
	this.classes = {
		top: 'djs-sticky-top',
		middle: 'djs-sticky-middle',
		bottom: 'djs-sticky-bottom'
	};

	// Other jQuery elements
	this.$element = $element;
	this.$box = options.box;
	this.$scroll = options.scroll;
	this.$placeholder = null;
	this.offset = 0;
	this.boxOffset = 0;
	this.windowHeight = 0;
	this.boxHeight = 0;
	this.elementHeight = 0;

	// Properties
	this.width = options.width;
	this.top = options.top;
	this.bottom = options.bottom;
	this.boxBottom = options.boxBottom;
	this.position = null;
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
	this._setDimensions();

	// Position
	this._setPosition('top');

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

	// Reset element classes
	$.each(this.classes, function(i,e) {
		this.$element.removeClass(e);
	}.bind(this));

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

	// Update width & co
	this._setDimensions();

	// Update display
	this._update();
};
/**
 * Set width of sticky element and other values
 *
 * @private
 */
djs.Sticky.prototype._setDimensions = function() {

	// width is jQuery object or not ?
	if (typeof this.width == "object") {
		this.$element.width(this.width.width());
	} else {
		this.$element.width(this.width);
	}

	// Update placeholder dimensions
	this.$placeholder.width(this.$element.outerWidth());
	this.$placeholder.height(this.$element.outerHeight());

	// Save top offsets for box and element
	this.offset = this._getTopOffset();
	this.boxOffset = this.$box.offset().top;

	// Save element dimensions
	this.windowHeight = this.$window.height();
	this.boxHeight = this.$box.outerHeight();
	this.elementHeight = this.$element.outerHeight();

};
/**
 * Define position (without callbacks)
 *
 * @private
 * @param {string} position
 */
djs.Sticky.prototype._setPosition = function(position) {

	// Remove old class
	if (this.position != null) {
		this.$element.removeClass(this.classes[this.position]);
	}

	// Add new class
	this.$element.addClass(this.classes[position]);

	//Save position
	this.position = position;
};
/**
 * Returns the top offset of the element
 *
 * @private
 * @return {integer}
 */
djs.Sticky.prototype._getTopOffset = function() {

	if (this.$placeholder.is(':visible')) {
		return this.$placeholder.offset().top;
	} else {
		return this.$element.offset().top;
	}
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
	var position = "middle";

	// If actual scroll is lower than box' top + top offset
	if (scrollTop > this.offset - this.top &&
		scrollTop + this.windowHeight >= this.offset + this.elementHeight + this.bottom) {

		var css = {};
		css.position = 'fixed';

		// If the element is smaller than the window
		if (this.top + this.elementHeight + this.bottom <= this.windowHeight) {

			// End of scrolling, put element at the bottom of box
			if (scrollTop - this.boxOffset >= this.boxHeight - this.elementHeight - this.top - this.boxBottom) {

				css.bottom = (scrollTop + this.windowHeight - (this.boxOffset + this.boxHeight - this.boxBottom)) + 'px';
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
			if (scrollTop + this.windowHeight - this.bottom >= this.boxOffset + this.boxHeight - this.boxBottom) {

				css.bottom = (scrollTop + this.windowHeight - (this.boxOffset + this.boxHeight - this.boxBottom)) + 'px';
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

	// Callback && CSS classes
	if (position != this.position) {
		// Did reach a stop
		if (position != 'middle') {
			this.didStop(position);
		}
		// Did start
		else {
			this.didStart(this.position);
		}

		this._setPosition(position);
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
