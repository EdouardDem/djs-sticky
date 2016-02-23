# djs-sticky

This is a javascript library to stick elements on the screen while scrolling.

## Installation

```
bower install djs-sticky
```

## Dependencies

This package requires [jQuery](http://jquery.com/) and [djs-resize](https://github.com/EdouardDem/djs-resize).

If you install it with Bower, the dependencies will be included.

## Usage

When attached to the screen, the element is set as `position: fixed`.
The element refers to a container to define its stop. The element will be fixed to the screen until it reaches its container's bottom.

To prevent width change when passing from `position: static` to `position: fixed`, the sticky element refers to a size (value or jQuery object).
If this is a jQuery object, the width will be refreshed when resizing the window.

When changing the element `position` to `fixed`, it adds a placeholder, having the same dimensions of the sticky element. So the parent's element doesn't collapse.

Don't forget to init the dependency `djs.resize` before using this library.

```javascript
djs.resize.init();
```

### Basic usage

By default, the container and the width referrer are the parent of the DOM element.
To simply attach an element to the screen when scrolling, write this:

```javascript
var sticky = new djs.Sticky($('#sticky'));
sticky.bind();
```

This will stick the DOM element `#sticky` when the screen touches its top border.

### Advanced usage

You can manually define the following options :

- `width`: integer or jQuery object. Set the sticky element width. By default, the parent element.
- `box`: the sticky element's container. It is used to detect the stop of the element. By default, the parent element.
- `top`: the space between the top of the screen and the sticky element. By default, 0.
- `bottom`: the min space between bottom of the screen and the sticky. This case occur when the sticky is higher than the screen. By default, 0.
- `boxBottom`: the min space between sticky's bottom and the container's bottom. By default, 0.

```javascript
// Init the sticky
var sticky = new djs.Sticky($('#sticky-cnt .sticky'), {
    top: 40,
    bottom: 20,
    boxBottom: 100,
    box: $('#content'),
    width: $('#sticky-cnt').parent()        // It could also be 300 for "300px"
}));
// Start the sticky
sticky.bind();
```

### HTML Structure

As an example, this is a possible HTML structure to use the sticky library:

```html
<div class="left" id="sticky-cnt">
    <div class="widget">
        <p>This won't move.</p>
    </div>
    <div class="sticky">
        <p>This will stick.</p>
    </div>
</div>
<div class="right" id="content">
    <p>Lorem ipsum...</p>
</div>
```

With CSS:

```css
.left {
    width: 30%;
    float: left;
}
.right {
    width: 65%;
    float: right;
}
```

This can be used like this:

```javascript
// Init the sticky
var sticky = new djs.Sticky($('#sticky-cnt .sticky'), {
    top: 40,
    bottom: 20,
    boxBottom: 100,
    box: $('#content'),
    width: $('#sticky-cnt')
}));
// Start the sticky
sticky.bind();
```

### CSS classes

It adds CSS classes when the element reaches a stop (top or bottom) or when it starts being sticky.
The classes are `djs-sticky-top`, `djs-sticky-middle` and `djs-sticky-bottom`.

### Callbacks

Like CSS classes, it also triggers callbacks. Those callbacks are:

- `didBind` when the sticky is activated
- `willUnbind` when the sticky will be deactivated
- `didStart` when the element starts to stick. The old position (top or bottom) is passed as an argument.
- `didStop` when the element reaches a stop. The reached position (top or bottom) is passed as an argument.

### Other methods

You can retrieve the identifier or the object by calling the function `id`.
You can also get the status (active or not) of an element by calling the `on` function.

## Example

Here is a full example, using [djs-breakpoints](https://github.com/EdouardDem/djs-breakpoints).

```javascript
//--------------------
// Init resize
djs.resize.init();

//--------------------
// Init the sticky
var sticky = new djs.Sticky($('.sticky'), {
    top: 20,
    bottom: 20,
    box: $('#content'),
    width: $('#left-col')
});

//--------------------
// Callbacks
// Activation
sticky.didBind(function(){
    console.log('Activated');
});
// Deactivation
sticky.willUnbind(function(){
    console.log('Deactivated');
});
// Start
sticky.didStart(function(position){
    console.log('Did start from '+position);
});
// Stop
sticky.didStop(function(position){
    console.log('Did stop to '+position);
});


//--------------------
// Breakpoints
// Only active if size < medium
djs.breakpoints
    .up('md', function () {
        sticky.bind();
    })
    .down('md', function () {
        sticky.unbind();
    });

// On init, should bind sticky ?
if (djs.breakpoints.min('md')) {
    sticky.bind();
} else {
    sticky.unbind();
}
```

***
See more examples in the `test` folder.

