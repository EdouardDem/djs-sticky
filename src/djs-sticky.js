var __STICKY_COUNTER = 0;
/**
 * Cette classe gère les sticky
 *
 * @requires resize
 *
 * @param {Object} $element				L'élément à fixer
 * @param {Object} $box					L'élément limitant le déplacementent
 * @param {Object} $widthReferrer		L'élément servant de référence pour la largeur
 * @param {Integer} topOffset			L'offset par rapport au bas de la page
 * @param {Integer} bottomOffset		L'offset par rapport au bas de la page
 */
function Sticky($element, $box, $widthReferrer, topOffset, bottomOffset) {

	//Paramétrage
	this.$window = $(window);
	this.$scroll = this.$window;

	this.windowIsScroll = this.$scroll.is(this.$window);

	this.$element = $element;
	this.$box = $box;
	this.$widthReferrer = $widthReferrer;
	this.$placeholder = null;

	this.topOffset = topOffset != null ? topOffset : 0;
	this.bottomOffset = bottomOffset != null ? bottomOffset : 0;

	this.on = false;

	this.id = 'sticky_'+__STICKY_COUNTER;
	__STICKY_COUNTER++;

}
/**
 * Active l'élément
 */
Sticky.prototype.bind = function() {
	this.on = true;
	this.$scroll.bind('scroll.'+this.id, function(){ this.update(); }.bind(this));
	resize.bind(this.id, function(){
		//Vérifie si on est actif
		if (!this.on) return;
		//Met à jour la largeur
		this.$element.width(this.$widthReferrer.width());
		//Met à jour le placeholder
		this.$placeholder.width(this.$element.outerWidth());
		this.$placeholder.height(this.$element.outerHeight());

		this.update();
	}.bind(this), resize.stacks.last);

	//Récupère la largeur
	this.$element.width(this.$widthReferrer.width());

	//Créer le placeholder
	this.$placeholder = $('<div class="sticky-placeholder"></div>');
	this.$placeholder.hide();
	this.$placeholder.width(this.$element.outerWidth());
	this.$placeholder.height(this.$element.outerHeight());
	this.$element.after(this.$placeholder);

	//Met à jour
	this.update();
	return this;
};
/**
 * Désactive l'élement et remet toutes les valeurs au valeurs initiales
 */
Sticky.prototype.unbind = function() {
	this.on = false;
	this.$scroll.unbind('scroll.'+this.id);
	resize.unbind(this.id, resize.stacks.last);
	this.$element.css({
		position: '',
		bottom: '',
		top: '',
		width: ''
	});
	//Supprime le placeholder
	this.$placeholder.remove();
	this.$placeholder = null;

	return this;
};
/**
 * Rafraichi les valeurs
 */
Sticky.prototype.refresh = function() {
	this.unbind();
	this.bind();
	return this;
};
/**
 * Fonction de scrolling
 */
Sticky.prototype.update = function() {

	if (!this.on) return this;

	var scrollTop = this.$scroll.scrollTop();
	var eleH = this.$element.height();
	var boxH = this.$box.height();
	var winH = this.$window.height();
	var boxOffset = this.$box.offset();
	if (!this.windowIsScroll) {
		boxOffset.top = boxOffset.top + scrollTop;
	}
	if (scrollTop > boxOffset.top - this.topOffset &&
		scrollTop + winH >= boxOffset.top + eleH + this.bottomOffset
		) {

		//Element trop petit ?
		if (boxOffset.top + eleH <= winH) {
			//Scroll en bas
			if (scrollTop - boxOffset.top >= boxH - eleH - this.bottomOffset) {
				var bottom = scrollTop + winH - (boxOffset.top + this.topOffset + boxH - this.bottomOffset);
				this.$element.css({
					position: 'fixed',
					bottom: bottom+'px',
					top: '',
				});
			}
			//Scroll au milieu
			else {
				this.$element.css({
					position: 'fixed',
					bottom: '',
					top: this.topOffset+'px',
				});
			}
		}
		//Element suffisement grand
		else {
			//Scroll en bas
			if (scrollTop + winH >= boxOffset.top + boxH) {
				var bottom = scrollTop + winH - (boxOffset.top + boxH - this.bottomOffset);
				this.$element.css({
					position: 'fixed',
					bottom: bottom+'px',
					top: '',
				});
			}
			//Scroll au milieu
			else {
				this.$element.css({
					position: 'fixed',
					bottom: this.bottomOffset + 'px',
					top: '',
				});
			}
		}

		//Fixed => affiche le placeholder
		this.$placeholder.show();
	}
	//Scroll en haut
	else {
		this.$element.css({
			position: '',
			bottom: '',
			top: '',
		});

		//Static => cache le placeholder
		this.$placeholder.hide();
	}

	return this;
};
