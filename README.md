# DEPRECATED

# ember-wait-for-render

[![Build Status](https://travis-ci.org/BBVAEngineering/ember-wait-for-render.svg?branch=master)](https://travis-ci.org/BBVAEngineering/ember-wait-for-render)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fember-wait-for-render.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fember-wait-for-render)
[![npm version](https://badge.fury.io/js/ember-wait-for-render.svg)](https://badge.fury.io/js/ember-wait-for-render)
[![Dependency Status](https://david-dm.org/BBVAEngineering/ember-wait-for-render.svg)](https://david-dm.org/BBVAEngineering/ember-wait-for-render)

Component + Mixin to prevent rendering content before route is fully rendered.

## Information

[![NPM](https://nodei.co/npm/ember-wait-for-render.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ember-wait-for-render/)

## Install in ember-cli application

In your application's directory:

    ember install ember-wait-for-render

## Usage

* Add the `wait-for-render` Mixin to your route.

```javascript
// pods/index/route.js
import WaitForRenderMixin from 'ember-wait-for-render/mixins/wait-for-render';

export default Route.extend(WaitForRenderMixin, {
  // ...
});
```

* Use the component in your template.

```html
{{!-- pods/index/template.hbs --}}

{{my-component}}

{{!-- this block will be rendered after my-component is fully drawed --}}
{{#wait-for-render}}
  {{my-delayed-component}}
{{/wait-for-render}}
```

## `for` attribute

The `for` attribute can be used to render global components (in `application.hbs`) that doesn't has to be drawed before the user reaches certain page.

A typical example is an application menu that is hidden until the user has logged.

* Add the `wait-for-render` Mixin to your route.

* Use the component in your application template.

```html
{{!-- pods/application/template.hbs --}}

{{my-login-stuff}}

{{!-- this block will be rendered after user reaches 'dashboard' route --}}
{{#wait-for-render for="dashboard"}}
  {{my-menu}}
{{/wait-for-render}}
```

## Promises with `for`

The `for` attribute also accepts **A+** promises (an object with a `then` method is required).

A little example:

```javascript
{{!-- controller.js --}}
Ember.Controller.extend({
  // Set any promise into the view context
  promise: new Ember.RSVP.Promise().resolve()
});
```

```html
{{!-- template.hbs --}}

{{#wait-for-render for=promise}}
  {{my-component}}
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

## Contribute

If you want to contribute to this addon, please read the [CONTRIBUTING.md](CONTRIBUTING.md).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/ember-wait-for-render/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/ember-wait-for-render/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
