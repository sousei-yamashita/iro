import { BASE_COLORS, LIGHTNESS_STEP, changeLightness, moveToward } from "./color.js";

const copy = color => ({ ...color });

export function createInitialState(baseId = "blue") {
  return { currentColor: copy(BASE_COLORS[baseId].color), undoStack: [], selectedBase: baseId };
}

export function selectBase(state, baseId) {
  if (!BASE_COLORS[baseId]) return state;
  return { currentColor: copy(BASE_COLORS[baseId].color), undoStack: [], selectedBase: baseId };
}

function update(state, nextColor) {
  return { ...state, currentColor: nextColor, undoStack: [...state.undoStack, copy(state.currentColor)] };
}

export function adjustLightness(state, direction) {
  return update(state, changeLightness(state.currentColor, direction === "lighter" ? LIGHTNESS_STEP : -LIGHTNESS_STEP));
}

export function tintToward(state, baseId) {
  if (!BASE_COLORS[baseId]) return state;
  return update(state, moveToward(state.currentColor, BASE_COLORS[baseId].color));
}

export function undo(state) {
  if (state.undoStack.length === 0) return state;
  return {
    ...state,
    currentColor: copy(state.undoStack.at(-1)),
    undoStack: state.undoStack.slice(0, -1)
  };
}
