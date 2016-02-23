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

	// Only first element
	$element = $element.first();
	var $parent = $element.parent();

	/**
	 * Window jQuery element
	 *
	 * @type {jQuery}
	 * @private
	 */
	this._$window = $(window);

	// Set default options
	var defaultOptions = {
		scroll: this._$window,
		width: $parent,
		box: $parent,
		top: 0,
		bottom: 0,
		boxBottom: 0
	};
	options = $.extend({}, defaultOptions, options);

	/**
	 * CSS classes
	 *
	 * @type {{top: string, middle: string, bottom: string}}
	 */
	this.classes = {
		top: 'djs-sticky-top',
		middle: 'djs-sticky-middle',
		bottom: 'djs-sticky-bottom'
	};

	/**
	 * The sticky element
	 *
	 * @type {Object}
	 * @private
	 */
	this._$element = $element;
	/**
	 * Box, limit container
	 *
	 * @type {jQuery}
	 * @private
	 */
	this._$box = options.box;
	/**
	 * Scroll referrer (basically, the window)
	 *
	 * @type {jQuery}
	 * @private
	 */
	this._$scroll = options.scroll;
	/**
	 * Placeholder use to replace element
	 *
	 * @type {jQuery}
	 * @private
	 */
	this._$placeholder = null;

	/**
	 * Width setting
	 *
	 * @type {jQuery|number}
	 * @private
	 */
	this._width = options.width;
	/**
	 * Top setting
	 *
	 * @type {number}
	 * @private
	 */
	this._top = options.top;
	/**
	 * Bottom setting
	 *
	 * @type {number}
	 * @private
	 */
	this._bottom = options.bottom;
	/**
	 * Box bottom setting
	 *
	 * @type {number}
	 * @private
	 */
	this._boxBottom = options.boxBottom;
	/**
	 * Current position
	 *
	 * @type {string}
	 * @private
	 */
	this._position = null;
	/**
	 * Active flag
	 *
	 * @type {boolean}
	 * @private
	 */
	this._on = false;
	/**
	 * Sticky's unique ID
	 * 
	 * @type {string}
	 * @private
	 */
	this._id = 'sticky_'+(__DJS_STICKY_COUNTER++);
	/**
	 * Element's top offset
	 *
	 * @type {number}
	 * @private
	 */
	this._eO = 0;
	/**
	 * Box's top offset
	 *
	 * @type {number}
	 * @private
	 */
	this._bO = 0;
	/**
	 * Window's height
	 *
	 * @type {number}
	 * @private
	 */
	this._wH = 0;
	/**
	 * Box's height
	 *
	 * @type {number}
	 * @private
	 */
	this._bH = 0;
	/**
	 * Element's height
	 *
	 * @type {number}
	 * @private
	 */
	this._eH = 0;

};
/**
 * Bind events, create placeholder and activate element
 *
 * @callback didBind
 * @return {Object}
 */
djs.Sticky.prototype.bind = function() {

	// Activate element
	this._on = true;

	// Update on scroll
	this._$scroll.bind('scroll.'+this._id, this._update.bind(this));

	// Bind the resize
	djs.resize.bind(this._id, this._resize.bind(this), djs.resize.stacks.last);

	// Create placeholder
	this._$placeholder = $('<div class="djs-sticky-placeholder"></div>');
	this._$placeholder.hide();
	this._$element.after(this._$placeholder);

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
	this._on = false;

	// Unbind scroll
	this._$scroll.unbind('scroll.'+this._id);

	// Unbind resize
	djs.resize.unbind(this._id, djs.resize.stacks.last);

	// Reset element CSS
	this._$element.css({
		position: '',
		bottom: '',
		top: '',
		width: ''
	});

	// Reset element classes
	$.each(this.classes, function(i,e) {
		this._$element.removeClass(e);
	}.bind(this));

	// Remove placeholder
	this._$placeholder.remove();
	this._$placeholder = null;

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
 * Get the id
 *
 * @return {number}
 */
djs.Sticky.prototype.id = function() {
	return this._id;
};
/**
 * Get if active
 *
 * @return {boolean}
 */
djs.Sticky.prototype.on = function() {
	return this._on;
};





/**
 * Called on window resize
 *
 * @private
 */
djs.Sticky.prototype._resize = function() {

	// Check if active
	if (!this._on) return;

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
	if (typeof this._width == "object") {
		this._$element.width(this._width.width());
	} else {
		this._$element.width(this._width);
	}

	// Update placeholder dimensions
	this._$placeholder.width(this._$element.outerWidth());
	this._$placeholder.height(this._$element.outerHeight());

	// Save top offsets for box and element
	this._eO = this._getTopOffset();
	this._bO = this._$box.offset().top;

	// Save element dimensions
	this._wH = this._$window.height();
	this._bH = this._$box.outerHeight();
	this._eH = this._$element.outerHeight();

};
/**
 * Define position (without callbacks)
 *
 * @private
 * @param {string} position
 */
djs.Sticky.prototype._setPosition = function(position) {

	// Remove old class
	if (this._position != null) {
		this._$element.removeClass(this.classes[this._position]);
	}

	// Add new class
	this._$element.addClass(this.classes[position]);

	//Save position
	this._position = position;
};
/**
 * Returns the top offset of the element
 *
 * @private
 * @return {number}
 */
djs.Sticky.prototype._getTopOffset = function() {

	if (this._$placeholder.is(':visible')) {
		return this._$placeholder.offset().top;
	} else {
		return this._$element.offset().top;
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
	if (!this._on) return;

	// Get actual values
	var scrollTop = this._$scroll.scrollTop();
	var position = "middle";

	// If actual scroll is lower than box' top + top offset
	if (scrollTop > this._eO - this._top &&
		scrollTop + this._wH >= this._eO + this._eH + this._bottom) {

		var css = {};
		css.position = 'fixed';

		// If the element is smaller than the window
		if (this._top + this._eH + this._bottom <= this._wH) {

			// End of scrolling, put element at the bottom of box
			if (scrollTop - this._bO >= this._bH - this._eH - this._top - this._boxBottom) {

				css.bottom = (scrollTop + this._wH - (this._bO + this._bH - this._boxBottom)) + 'px';
				css.top = '';
				position = 'bottom';
			}
			// Is scrolling, put the element on top
			else {

				css.bottom = '';
				css.top = this._top + 'px';
			}
		}

		// If the element is higher than the window
		else {

			// End of scrolling
			if (scrollTop + this._wH - this._bottom >= this._bO + this._bH - this._boxBottom) {

				css.bottom = (scrollTop + this._wH - (this._bO + this._bH - this._boxBottom)) + 'px';
				css.top = '';
				position = 'bottom';
			}
			// While scrolling
			else {

				css.bottom = this._bottom + 'px';
				css.top = '';
			}
		}

		// Apply CSS
		this._$element.css(css);

		// Display placeholder
		this._$placeholder.show();
	}

	// Scroll on top, no CSS needed
	else {
		// Reset CSS
		this._$element.css({
			position: '',
			bottom: '',
			top: ''
		});
		position = 'top';

		// Hide placeholder
		this._$placeholder.hide();
	}

	// Callback && CSS classes
	if (position != this._position) {
		// Did reach a stop
		if (position != 'middle') {
			this.didStop(position);
		}
		// Did start
		else {
			this.didStart(this._position);
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
