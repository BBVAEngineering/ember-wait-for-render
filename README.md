# ember-wait-for-render [![Build Status](https://travis-ci.org/BBVAEngineering/ember-wait-for-render.svg?branch=master)](https://travis-ci.org/BBVAEngineering/ember-wait-for-render) [![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fember-wait-for-render.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fember-wait-for-render) [![Dependency Status](https://david-dm.org/BBVAEngineering/ember-wait-for-render.svg)](https://david-dm.org/BBVAEngineering/ember-wait-for-render)

Component + Mixin to prevent rendering content before route is fully rendered.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-wait-for-render`
* `npm install` or `yarn`
* `bower install`

## Usage

* Add the `wait-for-render` Mixin to your route.

```javascript
// pods/index/route.js
import WaitForRenderMixin from 'ember-wait-for-render/mixins/wait-for-render';

export default Route.extend(WaitForRenderMixin, {
  // ...
}
```

* Use the component in your template

```html
{{!-- pods/index/template.hbs --}}

{{my-component}}

{{!-- this block will be rendered after my-component is fully drawed --}}
{{#wait-for-render}}
  {{my-delayed-component}}
{{/wait-for-render}}
```

## `for` attribute

The `for` attribute is necessary when you have global components (in `application.hbs`) that doesn't has to be rendered before the user reaches certain page.

A typical example is an application menu that is hidden until the user has logged.

* Add the `wait-for-render` Mixin to your route.

* Use the component in your application template

```html
{{!-- pods/application/template.hbs --}}

{{my-login-stuff}}

{{!-- this block will be rendered after user reaches 'dashboard' route --}}
{{#wait-for-render for="dashboard"}}
  {{my-menu}}
{{/wait-for-render}}
```

## Integration with `liquid-fire`

* Reopen the `wait-for-render` component and change the layout.

```javascript
import Ember from 'ember';
import WaitForRenderComponent from 'ember-wait-for-render/components/wait-for-render';

WaitForRenderComponent.reopen({

	layout: Ember.computed(function() {
		const layoutName = this.get('layoutName');
		const layout = this.templateForName(layoutName, 'layout');

		Ember.assert(`You specified the layoutName ${layoutName} for ${this}, but it did not exist.`, !layoutName || !!layout);

		return layout || this.get('defaultLayout');
	}),

	layoutName: 'wait-for-render'

});
```

* Write your custom template.

```handlebars
{{!-- wait-for-render/template.hbs --}}
{{#liquid-if _rendered class="wait-for-render"}}
	{{yield}}
{{/liquid-if}}
```

* Define the transition.

```javascript
// app/transitions.js
this.transition(
  this.hasClass('wait-for-render'),
  this.toValue(true),
  this.use('crossFade', { duration: 400 }),
  this.reverse('crossFade', { duration: 400 })
);
```

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
