import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveTotalReflection } from '../src/lib/physics/optics/total-internal-reflection.ts';
import { reflectionEquations } from '../src/lib/calculators/total-reflection.ts';
import { totalReflectionScene } from '../src/lib/visualization/total-reflection.ts';
import { parseQuantityInUnit, changeQuantityUnit, quantityLatex } from '../src/lib/calculators/quantities.ts';
import { totalReflectionModel } from '../src/lib/content/optics.ts';
import { topics, childrenOf, models } from '../src/lib/content/topics.ts';
import { publishedPaths, pageMetadata } from '../src/lib/seo.ts';
const close = (a, b, tolerance = 1e-12) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), `${a} != ${b}`);
const success = input => { const result = solveTotalReflection(input); assert.equal(result.status, 'success'); return result; };
test('critical angle and refraction agree with independent glass-to-air references', () => {
  const partial = success({ n1: 1.5, n2: 1 });
  close(partial.criticalAngle * 180 / Math.PI, 41.810314895778596);
  assert.equal(partial.incidence, null);
  const refracted = success({ n1: 1.5, n2: 1, angle: Math.PI / 6 });
  assert.equal(refracted.incidence.regime, 'refraction');
  close(refracted.incidence.transmittedAngle * 180 / Math.PI, 48.590377890729144);
  close(refracted.incidence.reflectedAngle, Math.PI / 6);
  close(refracted.n1 * Math.sin(refracted.incidence.angle), refracted.n2 * Math.sin(refracted.incidence.transmittedAngle));
  const reflected = success({ n1: 1.5, n2: 1, angle: Math.PI / 4 });
  assert.equal(reflected.incidence.regime, 'total-reflection');
  assert.equal(reflected.incidence.transmittedAngle, null);
});
test('critical boundary is distinct from total reflection, including degree roundoff', () => {
  const n1 = Math.SQRT2, n2 = 1;
  const critical = success({ n1, n2 }).criticalAngle;
  const exact = success({ n1, n2, angle: parseQuantityInUnit('45', 'angle', '°').value });
  assert.equal(exact.incidence.regime, 'critical');
  close(exact.incidence.transmittedAngle, Math.PI / 2);
  assert.equal(success({ n1, n2, angle: critical - 1e-9 }).incidence.regime, 'refraction');
  assert.equal(success({ n1, n2, angle: critical + 1e-9 }).incidence.regime, 'total-reflection');
  assert.equal(success({ n1: 1e20, n2: 1, angle: 2e-20 }).incidence.regime, 'total-reflection');
});
test('normal incidence, reverse direction and matched indices have no spurious critical angle', () => {
  const normal = success({ n1: 1.5, n2: 1, angle: 0 });
  close(normal.incidence.transmittedAngle, 0);
  const reverse = success({ n1: 1, n2: 1.5, angle: Math.PI / 4 });
  assert.equal(reverse.criticalAngle, null);
  assert.equal(reverse.incidence.regime, 'refraction');
  close(reverse.incidence.transmittedAngle * 180 / Math.PI, 28.125505702055705);
  const matched = success({ n1: 1.5, n2: 1.5, angle: .8 });
  assert.equal(matched.criticalAngle, null);
  assert.equal(matched.incidence.transmittedAngle, .8);
  assert.equal(totalReflectionScene(matched).reflected, null);
});
test('missing, invalid, grazing and nonrepresentable states discard prior results', () => {
  assert.equal(solveTotalReflection({ n1: 1.5 }).status, 'incomplete');
  for (const field of ['n1', 'n2']) for (const value of [0, -1, NaN, Infinity]) {
    assert.equal(solveTotalReflection({ n1: 1.5, n2: 1, angle: .5, [field]: value }).status, 'invalid');
  }
  for (const angle of [-1, Math.PI / 2, Math.PI, NaN, Infinity]) assert.equal(solveTotalReflection({ n1: 1.5, n2: 1, angle }).status, 'invalid');
  assert.equal(solveTotalReflection({ n1: 1e308, n2: 1e-308 }).status, 'invalid');
  assert.equal(solveTotalReflection({ n1: 1e-308, n2: 1e308, angle: .5 }).status, 'invalid');
});
test('angle conversion and all regime equations render without prefixing dimensionless indices', () => {
  const angle = parseQuantityInUnit('30', 'angle', '°').value;
  close(angle, Math.PI / 6);
  close(Number(changeQuantityUnit('30', 'angle', '°', 'rad')), Math.PI / 6);
  assert.equal(parseQuantityInUnit('1500m', 'dimensionless', '1').value, 1.5);
  assert.equal(quantityLatex(1.5, '', false), '1.50');
  for (const result of [success({ n1: 1.5, n2: 1 }), success({ n1: 1.5, n2: 1, angle }), success({ n1: Math.SQRT2, n2: 1, angle: Math.PI / 4 }), success({ n1: 1.5, n2: 1, angle: 1 }), success({ n1: 1, n2: 1.5, angle: .5 })]) {
    const equations = reflectionEquations(result, '°');
    for (const expression of [...equations.conversions, equations.critical, equations.reflected, equations.transmitted].filter(Boolean)) katex.renderToString(expression, { throwOnError: true });
    if (result.incidence?.regime === 'total-reflection') assert.equal(equations.transmitted, '');
  }
  for (const formula of totalReflectionModel.formulas) katex.renderToString(formula.expression, { throwOnError: true });
});
test('ray geometry uses solver angles and suppresses transmitted rays during total reflection', () => {
  const refracted = success({ n1: 1.5, n2: 1, angle: .5 });
  const scene = totalReflectionScene(refracted);
  assert.equal(scene.schematic, false);
  assert.ok(scene.incident.x < scene.origin.x && scene.incident.y > scene.origin.y);
  assert.ok(scene.reflected.x > scene.origin.x && scene.reflected.y > scene.origin.y);
  assert.ok(scene.transmitted.x > scene.origin.x && scene.transmitted.y < scene.origin.y);
  close(Math.atan2(scene.transmitted.x - scene.origin.x, scene.origin.y - scene.transmitted.y), refracted.incidence.transmittedAngle);
  const tir = totalReflectionScene(success({ n1: 1.5, n2: 1, angle: 1 }));
  assert.equal(tir.transmitted, null);
  assert.deepEqual(tir.transmissionArc, []);
  const critical = totalReflectionScene(success({ n1: Math.SQRT2, n2: 1, angle: Math.PI / 4 }));
  close(critical.transmitted.y, critical.origin.y);
  assert.equal(totalReflectionScene(null).schematic, true);
  assert.equal(totalReflectionScene(success({ n1: 1.5, n2: 1 })).schematic, true);
});
test('Optics is an overview with a published total-reflection subtopic', () => {
  assert.ok(topics.find(topic => topic.id === 'optics').published);
  assert.ok(childrenOf('optics').some(topic => topic.id === 'total-internal-reflection' && topic.published));
  assert.ok(models.some(model => model.topicId === 'total-internal-reflection'));
  assert.ok(!models.some(model => model.topicId === 'optics'));
  const path = '/optics/total-internal-reflection';
  assert.ok(publishedPaths().includes(path));
  assert.equal(pageMetadata(path).canonical, `https://calcphysics.com${path}`);
});
