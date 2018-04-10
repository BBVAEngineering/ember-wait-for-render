import Ember from 'ember';
import WaitForRenderMixin from 'ember-wait-for-render/mixins/wait-for-render';
import { EVENT_NAME } from 'ember-wait-for-render/mixins/wait-for-render';
import { module, test } from 'qunit';

const { subscribe } = Ember.Instrumentation;

module('Unit | Mixin | wait for render');

test('it works in a Route object', (assert) => {
	const WaitForRenderObject = Ember.Route.extend(WaitForRenderMixin);
	const subject = WaitForRenderObject.create();

	assert.ok(subject);
});

test('it does not works if object is not a Route', (assert) => {
	const WaitForRenderObject = Ember.Controller.extend(WaitForRenderMixin);
	const subject = WaitForRenderObject.create();

	try {
		subject.send('didTransition');
	} catch (e) {
		assert.ok(e);
	}
});

test('it toggles \'_rendered\' property', (assert) => {
	const done = assert.async();
	const routeName = 'foo';
	const WaitForRenderObject = Ember.Route.extend(WaitForRenderMixin);
	const subject = WaitForRenderObject.create({
		routeName
	});

	subscribe(`${EVENT_NAME}.${routeName}`, {
		before: () => {
			assert.notOk(subject.get('_rendered'));
		},
		after: () => {
			assert.ok(subject.get('_rendered'));
			done();
		}
	});

	Ember.run(() => {
		subject.send('didTransition');
	});
});
