import { BASE_COLORS, toHex } from "./color.js";
import { adjustLightness, createInitialState, selectBase, tintToward, undo } from "./state.js";

let state = createInitialState();
const swatch = document.querySelector("#swatch");
const hex = document.querySelector("#hex");
const undoButton = document.querySelector("#undo");
const copyButton = document.querySelector("#copy");
const status = document.querySelector("#status");

function render() {
  const value = toHex(state.currentColor);
  swatch.style.backgroundColor = value;
  hex.textContent = value;
  undoButton.disabled = state.undoStack.length === 0;
  document.querySelectorAll("[data-base]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.base === state.selectedBase));
  });
}

document.querySelector("#base-colors").innerHTML = Object.entries(BASE_COLORS).map(([id, base]) =>
  `<button class="color-chip" data-base="${id}" style="--chip:${toHex(base.color)}" aria-pressed="false"><span></span>${base.name}</button>`
).join("");

document.querySelector("#tint-colors").innerHTML = Object.entries(BASE_COLORS).map(([id, base]) =>
  `<button class="tint-chip" data-tint="${id}" style="--chip:${toHex(base.color)}"><span></span>${base.name}</button>`
).join("");

document.querySelector("#base-colors").addEventListener("click", event => {
  const button = event.target.closest("[data-base]");
  if (!button) return;
  state = selectBase(state, button.dataset.base);
  status.textContent = `${BASE_COLORS[button.dataset.base].name}から始めます`;
  render();
});

document.querySelector("#lighter").addEventListener("click", () => { state = adjustLightness(state, "lighter"); render(); });
document.querySelector("#darker").addEventListener("click", () => { state = adjustLightness(state, "darker"); render(); });
document.querySelector("#tint-colors").addEventListener("click", event => {
  const button = event.target.closest("[data-tint]");
  if (!button) return;
  state = tintToward(state, button.dataset.tint);
  status.textContent = `${BASE_COLORS[button.dataset.tint].name}に少し近づけました`;
  render();
});
undoButton.addEventListener("click", () => { state = undo(state); status.textContent = "ひとつ前に戻しました"; render(); });
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(hex.textContent);
    status.textContent = `${hex.textContent} をコピーしました`;
    copyButton.textContent = "コピー済み";
    setTimeout(() => { copyButton.textContent = "コピー"; }, 1400);
  } catch {
    status.textContent = "コピーできませんでした。HEXを長押ししてコピーしてください";
  }
});

render();
