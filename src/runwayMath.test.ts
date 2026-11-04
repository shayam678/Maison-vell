import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wrap,
  clamp,
  computeModelState,
  computeCardPosition,
  stepPosition,
  LOOKS,
  Y0,
  Y1,
} from './runwayMath';

test('wrap handles positive and negative values modulo n', () => {
  assert.equal(wrap(0, 6), 0);
  assert.equal(wrap(6, 6), 0);
  assert.equal(wrap(-1, 6), 5);
  assert.equal(wrap(-0.2, 6), 5.8);
});

test('computeModelState matches depth table stops at p = 0', () => {
  const r0 = (LOOKS[0][1] - LOOKS[0][0]) / (Y1 - Y0);
  const m0 = computeModelState(0, 0, 1000, 800, r0);
  assert.equal(m0.d, 0);
  assert.equal(m0.s.toFixed(4), (0.832 / 1.2).toFixed(4));
  assert.equal(m0.filter, 'none');
  assert.equal(m0.opacity, '1.000');
  assert.equal(m0.zIndex, 100);

  // Model 5 at p = 0.5 has wrap(5 - 0.5, 6) = 4.5 (still <= 5), whereas at p = 0.2 model 0 has wrap(0 - 0.2, 6) = 5.8 -> d = -0.2
  const mLeaving = computeModelState(0, 0.2, 1000, 800, r0);
  assert.ok(Math.abs(mLeaving.d - -0.2) < 1e-6);
  assert.equal(mLeaving.zIndex, 102);
});

test('computeCardPosition wraps 12 cards and shifts top slot properly', () => {
  const cardS = 250;
  assert.equal(computeCardPosition(0, 0, cardS), 0);
  assert.equal(computeCardPosition(1, 0, cardS), 250);
  assert.equal(computeCardPosition(2, 1, cardS), 0);
  assert.equal(computeCardPosition(3, 1, cardS), 250);
});

test('stepPosition eases toward target and snaps within 0.0004', () => {
  const next = stepPosition(0, 1, 16, false);
  assert.ok(next > 0 && next < 1);
  assert.equal(stepPosition(0.9997, 1, 16, false), 1);
  assert.equal(stepPosition(0, 3, 16, true), 3);
});
