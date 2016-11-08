import Ember from 'ember';
import layout from '../templates/components/wait-for-render';
import { EVENT_NAME } from '../mixins/wait-for-render';

const { subscribe, unsubscribe } = Ember.Instrumentation;

function isPromise(obj) {
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Defer component render until route has been rendered.
 * Route must implement 'wait-for-render' mixin.
 *
 * @example
 * {{#wait-for-render}}
 *     {{component 'foo'}}
 * {{/wait-for-render}}
 *
 * @example
 * {{#wait-for-render for="index"}}
 *     {{component 'foo'}}
 * {{/wait-for-render}}
 *
 * @namespace Buzz
 * @class WaitForRenderComponent
 * @extends Ember.Component
 * @public
 */
export default Ember.Component.extend({

	/**
	 * Remove parent wrapper.
	 *
	 * @property tagName
	 * @type String
	 * @default ''
	 * @private
	 */
	tagName: '',

	/**
	 * Component template file.
	 *
	 * @property layout
	 * @type String
	 * @private
	 */
	layout,

	/**
	 * Toggle yield render.
	 *
	 * @property _rendered
	 * @type Boolean
	 * @default false
	 * @private
	 */
	_rendered: false,

	/**
	 * Destination route, it will wait to that route to be fully rendered.
	 * Must match with the route 'this.routeName' property.
	 *
	 * @property for
	 * @type String
	 * @default '*'
	 * @public
	 */
	for: '*',

	/**
	 * Component to show while loading (like a spinner).
	 *
	 * @property loading
	 * @type String
	 * @default null
	 * @public
	 */
	loading: null,

	/**
	 * Stores component instrumentation object.
	 *
	 * @property _subscriber
	 * @type Object
	 * @default null
	 * @public
	 */
	_subscriber: null,

	/**
	 * Subscribe to route events.
	 *
	 * @method didInsertElement
	 * @private
	 */
	didInsertElement() {
		this._super(...arguments);

		const forAttr = this.get('for');

		if (isPromise(forAttr)) {
			forAttr.then(() => this._render());
		} else {
			const subscriber = subscribe(`${EVENT_NAME}.${this.get('for')}`, {
				before: Ember.K,
				after: () => this._render()
			});

			this.set('_subscriber', subscriber);
		}
	},

	/**
	 * Enables component by setting '_rendered' to true.
	 *
	 * @method _render
	 * @private
	 */
	_render() {
		if (this.isDestroyed) {
			return;
		}

		this.set('_rendered', true);
		unsubscribe(this.get('_subscriber'));
	}

});
