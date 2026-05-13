セミナースライドをJSONスペックから自動生成します。

## 手順

### STEP 1 — 入力確認
- `$ARGUMENTS` にセミナータイトル・テーマ・日付などの指示があれば優先して使う
- なければ直近のカレンダーイベントまたは会話コンテキストから判断する

### STEP 2 — 参照資料の読み込み
- `reference/` フォルダ内のファイルをすべて確認する
- `config/cta_config.json` のCTA設定・ブランドカラーを確認する
- `config/seminar_themes.json` からセミナーに合ったテーマを選ぶ（直近と被らないよう選択）

### STEP 3 — AIマーケティング戦略の適用
グローバルの「AIマーケティングスキル」ガイドラインを参照し、以下を設計する：
- ターゲットペルソナの課題・悩みを起点にしたタイトルをつける
- 「Before → After」構造でスライドの流れを組む
- 数字・実績・引用を適切なスライドタイプ（stat/quote）に配置する
- CTAに向けて感情的なクライマックスが来るよう構成する

### STEP 4 — スペックJSONの作成
`specs/YYYYMMDD_<タイトル>.json` として以下の構成で作成する：

```json
{
  "title": "...",
  "subtitle": "...",
  "date": "...",
  "presenter": "AIセラ",
  "theme": "<テーマ名>",
  "slides": [
    { "type": "title" },
    { "type": "bio", ... },
    { "type": "agenda", "items": [...] },
    // セクション・コンテンツ・stat・quote・timeline・two_column を組み合わせる
    { "type": "summary", "takeaways": [...] },
    { "type": "cta" },
    { "type": "qr" }
  ]
}
```

利用可能なスライドタイプ（`scripts/slide_components.js` を参照）：
- `title` — タイトルスライド
- `bio` — プロフィールスライド
- `agenda` — アジェンダ
- `section` — セクション区切り（num, title, subtitle）
- `content` — 箇条書き（title, bullets[], note）
- `stat` — 実績・数字強調（title, stats[{value, label, sub}]）
- `quote` — 引用スライド（text, author, source）
- `timeline` — ステップ図（title, steps[{title, body}]、最大5）
- `two_column` — 左右比較（title, left{label,heading,bullets[]}, right{...}）
- `summary` — まとめ（title, takeaways[]、最大4）
- `cta` / `qr` — CTA・QRスライド（自動追加されるが明示してもよい）

### STEP 5 — スライド生成
```bash
cd scripts
node generate_from_spec.js --spec ../specs/<filename>.json
```

### STEP 6 — 完了報告
- 生成されたファイルパスを伝える
- スライド枚数・使用テーマを報告する
- PDFへの変換が必要な場合は以下を実行：
  ```bash
  libreoffice --headless --convert-to pdf output/<filename>.pptx --outdir output/
  ```
