# seminar-automation

AI セラ セミナー用スライドの自動生成パイプライン。Google カレンダーから対象イベントを取得し、`pptxgenjs` で日本語スライド + CTA + QR コードを生成する。

## 機能

- Google カレンダー連動 — 直近 1 ヶ月のセミナーイベントを抽出（除外/含めるキーワード設定可）
- スライド自動生成 — `pptxgenjs` でテーマ別レイアウト
- **CTA + QR スライド自動付加** — `cta_qr_slides.js` がデッキ末尾に LINE QR + CTA カードを差し込む
- ブランドカラー統一（クリーム × ブラック × ゴールド）
- リファレンス資料参照（`reference/`）でテーマに合った構成を提案

## 構成

```
seminar-automation/
├── CLAUDE.md                    # 自動化ワークフロー定義（6 STEP）
├── config/
│   ├── cta_config.json         # CTA テキスト / QR URL / ブランドカラー
│   └── seminar_themes.json     # テーマプリセット
├── reference/                  # 過去セミナー資料（READMEに概要）
├── scripts/
│   ├── generate_seminar.js     # メインエントリ（pptxgenjs ベース）
│   ├── cta_qr_slides.js        # CTA + QR 末尾スライド差し込み
│   └── package.json
└── output/                     # 生成された .pptx 出力先（gitignore）
```

## クイックスタート

```bash
cd scripts
npm install              # pptxgenjs + qrcode

# スライド生成
node generate_seminar.js
# → ../output/YYYYMMDD_セミナータイトル.pptx
```

## ワークフロー（CLAUDE.md より）

1. **カレンダー確認** — Google カレンダーから対象セミナーイベント抽出
2. **参照資料の確認** — `reference/` を読み込み訴求点を把握
3. **セミナー案の提案** — タイトル + 構成（スライドリスト）を提示
4. **スライド生成** — `output/YYYYMMDD_<title>.pptx` に出力（必ず CTA + QR 末尾に追加）
5. **QA** — LibreOffice で PDF → 画像化 → 目視確認 → 必要に応じ再生成
6. **カレンダーへのリンク登録** — イベント description にスライドパスを追記

## カレンダーフィルタ

`config/cta_config.json` で対象を制御:

```json
{
  "calendar_include_keywords": ["セミナー", "講義", "勉強会", "セッション", "ウェビナー", "ワークショップ"],
  "calendar_exclude_keywords": ["作業会", "グルコン", "予定入れない", "面談", "定例", "雑談"]
}
```

## CTA / QR のカスタマイズ

`config/cta_config.json` を編集すると、すべての生成スライドの CTA / QR が連動して変わる:

```json
{
  "qr_url": "https://lin.ee/yhhurWq",
  "qr_display_text": "lin.ee/yhhurWq",
  "cta_slide": {
    "tag": "REALITY CHECK",
    "title_black": "答えは、",
    "title_gold": "いいえ。",
    "cards": [...]
  }
}
```

## 依存

- Node.js 18+
- `pptxgenjs ^3.12.0`
- `qrcode ^1.5.3`
- LibreOffice（QA フェーズで PDF 変換用、任意）
- `pdftoppm`（poppler-utils、任意）

## 関連プロジェクト

このリポは [zeeeeeee1/agents-automation] エコシステムの一部:

- [threads-poster](https://github.com/zeeeeeee1/threads-poster) — Threads Graph API + MCP server
- [agent-orchestration](https://github.com/zeeeeeee1/agent-orchestration) — IronClaw 常駐 + routine 集
- [seminor-product](https://github.com/zeeeeeee1/seminor-product) — セミナー構成 YAML → Markdown

## License

MIT
