import test from "node:test";
import assert from "node:assert/strict";
import { BASE_COLORS, changeLightness, mapToSrgbGamut, moveToward, toHex } from "../src/color.js";

test("明るさを0〜1の範囲で段階的に変える", () => {
  assert.equal(changeLightness({ l: .5, c: .1, h: 20 }, .05).l, .55);
  assert.equal(changeLightness({ l: .02, c: .1, h: 20 }, -.05).l, 0);
  assert.equal(changeLightness({ l: .98, c: .1, h: 20 }, .05).l, 1);
});

test("色味はLを保ち、Cとhの最短方向へ15%ずつ近づく", () => {
  const first = moveToward({ l: .5, c: .1, h: 350 }, { l: .8, c: .2, h: 10 });
  const second = moveToward(first, { l: .8, c: .2, h: 10 });
  assert.equal(first.l, .5);
  assert.ok(first.c > .1 && second.c > first.c);
  assert.equal(first.h, 353);
  assert.ok(second.h > first.h);
});

test("全基本色とgamut外候補を有効なHEXへ決定論的に変換する", () => {
  for (const { color } of Object.values(BASE_COLORS)) assert.match(toHex(color), /^#[0-9A-F]{6}$/);
  const extreme = { l: .7, c: 2, h: -900 };
  assert.equal(toHex(extreme), toHex(extreme));
  const mapped = mapToSrgbGamut(extreme);
  assert.equal(mapped.l, .7);
  assert.equal(mapped.h, 180);
  assert.ok(mapped.c < 2 && mapped.c >= 0);
  assert.match(toHex({ l: Infinity, c: NaN, h: NaN }), /^#[0-9A-F]{6}$/);
});
