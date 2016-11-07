import Ember from 'ember';
import WaitForRenderMixin from 'ember-wait-for-render/mixins/wait-for-render';
import { EVENT_NAME } from 'ember-wait-for-render/mixins/wait-for-render';
import { module, test } from 'qunit';

const { subscribe } = Ember.Instrumentation;

module('Unit | Mixin | wait for render');

test('it works in a Route object', function(assert) {
  let WaitForRenderObject = Ember.Route.extend(WaitForRenderMixin);
  let subject = WaitForRenderObject.create();
  assert.ok(subject);
});

test('it does not works if object is not a Route', function(assert) {
  let WaitForRenderObject = Ember.Controller.extend(WaitForRenderMixin);
  let subject = WaitForRenderObject.create();

  try {
    subject.send('didTransition');
  } catch(e) {
    assert.ok(e);
  }
});

test('it does not works if object is not a Route', function(assert) {
  assert.expect(2);

  const done = assert.async();
  const routeName = 'foo';
  let WaitForRenderObject = Ember.Route.extend(WaitForRenderMixin);
  let subject = WaitForRenderObject.create({
    routeName
  });

  subscribe(`${EVENT_NAME}.${routeName}`, {
    before: () => assert.ok(1),
    after: () => {
      assert.ok(1);
      done();
    }
  });

  Ember.run(() => {
    subject.send('didTransition');
  });
});

test('it toggles \'_rendered\' property', function(assert) {
  const done = assert.async();
  const routeName = 'foo';
  let WaitForRenderObject = Ember.Route.extend(WaitForRenderMixin);
  let subject = WaitForRenderObject.create({
    routeName
  });

  subscribe(`${EVENT_NAME}.${routeName}`, {
    before: () => Ember.K,
    after: () => {
      assert.ok(subject.get('_rendered'));
      done();
    }
  });

  Ember.run(() => {
    subject.send('didTransition');
  });
});
