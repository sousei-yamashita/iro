# DESIGN — 色のやつ v1.1

## Mobile one-screen composition
縦持ちスマートフォンでは画面を5領域へ再構成する。

1. Compact header: IRO TOOL / 色のやつ をコンパクト化し、説明コピーは省略。
2. Result card: swatchを約96–112pxへ圧縮し、同じカード内にHEX、Copy、Undoを集約。
3. Step 1: 8色を4列×2段のcompact chips。選択中基本色はaria-pressedとborderで示す。
4. Step 2: 暗く / 明るくの2ボタンを横並び。1操作ごとにstatus更新。
5. Step 3: 8色を1列の横スクロールstrip。右端に次chipが一部見える構成とし、tintはタップ時だけpressed feedbackを与える。

Statusは最下部に固定高さ1行で置き、文言変化でレイアウトを動かさない。

## Height budget
幅360–430pxかつ高さ740px以上のスマートフォン縦持ちを主要1画面ターゲットとする。
main padding 12–16px、header 28–36px、result 140–160px、Step 1 145–165px、Step 2 80–90px、Step 3 105–120pxを目安にする。
100dvhを利用し、主要ターゲットではdocument縦overflowを発生させない。高さ不足端末では操作を切らずページ縦スクロールへ自然にfallbackする。固定positionで操作を隠さない。

## Desktop
600px以上では中央配置し過度に引き伸ばさない。desktopで1画面固定は要求しない。

## Accessibility / behavior
- focus-visibleを維持。
- base selectionのみaria-pressed。
- tintは反復操作なのでaria-pressedを使わない。
- statusはrole=status / aria-live=politeを維持。
- Undo disabled状態を維持。
- 色だけでなく色名を残す。
