# QA — 色のやつ v1.1

## Acceptance criteria
### AC1 — One-screen core flow
幅360–430px、高さ740px以上の縦持ちviewportで、初期表示時にページ縦スクロールなしでswatch、HEX、Copy、base 8色、darker/lighter、tint strip、Undo、statusへ到達できる。
確認viewport: 360x740, 390x844, 412x915, 430x932。

### AC2 — Not merely scaled down
主要button textは判読可能な通常サイズを維持し、操作領域は原則44px前後以上の高さを確保する。swatchを消さず、色名をアイコンだけへ置換しない。

### AC3 — Product behavior preserved
既存自動テストが全PASSし、base reset、L ± 0.05、tint 15%/L維持、1操作Undo、決定論的6桁HEXを維持する。

### AC4 — Feedback
base、lighter、darker、tint、Undo、Copyでstatusが更新される。tintは一時pressed feedbackのみで永続selected表示にならない。

### AC5 — Tint discoverability
360px幅でtint stripが横スクロールでき、初期状態で右側に続きがあることを示す次chipの一部または同等cueが見える。

### AC6 — Copy / Undo reachability
CopyとUndoはresult card内にあり、色を見ながら縦スクロールせず操作できる。Undo disabled/enabledは履歴有無と一致する。

### AC7 — Small-height fallback
高さ740px未満でも主要操作を固定要素で隠さず、必要ならdocument縦スクロールできる。

## Verification
- npm test
- node --check src/app.js
- static marker check
- browser/manual responsive verification at AC1 viewports before Human ADOPT
