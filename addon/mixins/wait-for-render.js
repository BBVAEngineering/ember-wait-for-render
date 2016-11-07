import Ember from 'ember';

const { instrument } = Ember.Instrumentation;

export const EVENT_NAME = 'wait-for-render';

export default Ember.Mixin.create({
	actions: {
		didTransition() {
			this._super(...arguments);

			// Skip this code if it's not a Ember.Route instance
			if (!Ember.Route.detectInstance(this)) {
				Ember.assert('\'wait-for-render\' mixin must be included in an Ember.Route class',
					Ember.Route.detectInstance(this));
			}

			// Wait for template rendered
			Ember.run.scheduleOnce('afterRender', () => {
				// Defer to the next cycle to allow a browser render
				Ember.run.next(this, () => {
					// Send a signal when template is fully rendered
					instrument(`${EVENT_NAME}.${this.routeName}`, () => {
						// Set a flag for debugging purposes
						this.set('_rendered', true);
					});
				});
			});
		}
	}
});
