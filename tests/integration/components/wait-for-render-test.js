import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { EVENT_NAME } from 'ember-wait-for-render/mixins/wait-for-render';

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

test('it renders the content when signal has been triggered', function(assert) {
  const content = 'foo';

  this.set('content', content);
  this.render(hbs`{{#wait-for-render}}{{content}}{{/wait-for-render}}`);

  Ember.run(() => {
    Ember.instrument(`${EVENT_NAME}.foo`, () => {
      assert.ok(1);
    });
  });

  assert.equal(this.$().text().trim(), content);
});
