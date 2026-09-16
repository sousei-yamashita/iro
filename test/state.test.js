import test from "node:test";
import assert from "node:assert/strict";
import { BASE_COLORS, toHex } from "../src/color.js";
import { adjustLightness, createInitialState, selectBase, tintToward, undo } from "../src/state.js";

test("基本色を選ぶと定義色になり履歴が空になる", () => {
  const changed = adjustLightness(createInitialState(), "lighter");
  const state = selectBase(changed, "red");
  assert.deepEqual(state.currentColor, BASE_COLORS.red.color);
  assert.deepEqual(state.undoStack, []);
});

test("反復操作、Undo、再現性が1操作単位で働く", () => {
  const run = () => {
    let state = createInitialState("yellow");
    state = adjustLightness(state, "darker");
    const beforeTint = state.currentColor;
    state = tintToward(state, "blue");
    state = tintToward(state, "blue");
    assert.equal(state.undoStack.length, 3);
    state = undo(state);
    state = undo(state);
    assert.deepEqual(state.currentColor, beforeTint);
    return state;
  };
  assert.deepEqual(run(), run());
});

test("表示HEXは現在色と対応する", () => {
  const state = tintToward(adjustLightness(createInitialState("pink"), "lighter"), "green");
  assert.match(toHex(state.currentColor), /^#[0-9A-F]{6}$/);
});
