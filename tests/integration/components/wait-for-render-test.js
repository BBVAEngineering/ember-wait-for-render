import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { EVENT_NAME } from 'ember-wait-for-render/mixins/wait-for-render';

const { instrument } = Ember.Instrumentation;

moduleForComponent('wait-for-render', 'Integration | Component | wait for render', {
  integration: true
});

test('it does not renders the content', function(assert) {
  const content = 'foo';

  this.set('content', content);
  this.render(hbs`{{#wait-for-render}}{{content}}{{/wait-for-render}}`);

  assert.notEqual(this.$().text().trim(), content);
  assert.equal(this.$().text().trim(), '');
});

test('it renders the content when route is ready', function(assert) {
  const content = 'foo';

  this.set('content', content);
  this.render(hbs`{{#wait-for-render}}{{content}}{{/wait-for-render}}`);

  Ember.run(() => {
    instrument(`${EVENT_NAME}.*`, Ember.K);
  });

  Ember.run(() => {
    assert.equal(this.$().text().trim(), content);
  });
});

test('it renders the content when specific route is ready', function(assert) {
  const content = 'foo';

  this.set('content', content);
  this.render(hbs`{{#wait-for-render for=content}}{{content}}{{/wait-for-render}}`);

  Ember.run(() => {
    instrument(`${EVENT_NAME}.${content}`, Ember.K);
  });

  Ember.run(() => {
    assert.equal(this.$().text().trim(), content);
  });
});

test('it renders the content when the promise is fullfilled', function(assert) {
  const done = assert.async();
  const content = 'foo';
  const timeout = 50;
  const promise = new Ember.RSVP.Promise((resolve) => {
    Ember.run.later(this, resolve, timeout);
  });

  this.set('content', content);
  this.set('promise', promise);
  this.render(hbs`{{#wait-for-render for=promise}}{{content}}{{/wait-for-render}}`);

  Ember.run(() => {
    instrument(`${EVENT_NAME}.${content}`, Ember.K);
  });

  Ember.run(() => {
    assert.notEqual(this.$().text().trim(), content);
  });

  Ember.run.later(this, () => {
    assert.equal(this.$().text().trim(), content);
    done();
  }, timeout);
});
