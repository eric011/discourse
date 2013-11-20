/**
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://teamdf.com/jquery-plugins/license/
 *
 * @author Sam Sehnert
 * @desc A small plugin that checks whether elements are within
 *                 the user visible viewport of a web browser.
 *                 only accounts for vertical position, not horizontal.
 */
$.fn.onScreen = function(){
    var $t                   = $(this).eq(0),
        t                    = $t.get(0),
        $w                   = $(window),
        viewTop              = $w.scrollTop(),
        viewBottom           = viewTop + $w.height(),
        _top                 = $t.offset().top,
        _bottom              = _top + $t.height(),
        compareTop           = _bottom,
        compareBottom        = _top;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
};

Discourse.PostHolderView = Discourse.View.extend(Discourse.Scrolling, {
  classNames: ['post-holder'],
  attributeBindings: ['style'],

  init: function() {
    this._super();
    this.set('style', 'height: 200px;');
    Ember.run.next(this, 'scrolled');
  },

  showPost: function() {
    var containedView = this.get('containedView');
    if (!containedView) {
      this.setProperties({
        style: null,
        containedView: this.createChildView(Discourse.PostView, { content: this.get('content') })
      });

      this.rerender();
    }
  },

  hidePost: function() {
    var containedView = this.get('containedView');
    if (containedView) {
      this.setProperties({
        containedView: null,
        style: 'height: ' + this.$().height() + 'px;'
      });

      this.rerender();
      containedView.remove();
    }
  },

  render: function(buffer) {
    var containedView = this.get('containedView');
    if (containedView && containedView.get('state') !== 'inDOM') {
      containedView.renderToBuffer(buffer);
      containedView.transitionTo('inDOM');
      containedView.didInsertElement();
    }
  },

  scrolled: function() {
    if (!this.$().onScreen()) {
      this.hidePost();
    } else {
      this.showPost();
    }
  },

  didInsertElement: function() {
    this.bindScrolling();
  },

  willDestroyElement: function() {
    this.unbindScrolling();
  }

});
