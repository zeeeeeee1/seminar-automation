# AIセラ セミナー自動化プロジェクト

このプロジェクトは以下を自動で行います：
1. Googleカレンダーから直近1ヶ月のセミナー候補日を取得
2. `reference/` フォルダの資料を参照してセミナー案を提案
3. PPTXスライドを生成（CTA + QRスライド付き）

---

## ワークフロー（自動タスク / 手動実行 共通）

### STEP 1 — カレンダー確認
- Googleカレンダーから直近1ヶ月のイベントを取得する
- **除外**: タイトルに「作業会」「グルコン」「グループコンサル」「予定入れない」「面談」「定例」「本業」を含むもの
- **対象**: 「セミナー」「講義」「勉強会」「セッション」を含むイベント、またはイベント内容から判断してセミナー性があるもの
- 対象イベントの一覧（タイトル・日時・ID）を整理する

### STEP 2 — 参照資料の確認
- `reference/` フォルダ内のファイルをすべて読み込む
- 過去のセミナーテーマ、ターゲット像、訴求ポイントを把握する
- `config/cta_config.json` のCTA設定を読み込む

### STEP 3 — セミナー案の提案
- 各イベントのタイトルからセミナー内容を判断
- 内容が不明なセミナーはreferenceを参照して最適なスライド構成を提案
- スライド構成（各スライドのタイトルと概要）を提示してOKを得る
  - **自動実行時はOK待ちせず、参照資料から最善の判断で進める**

### STEP 4 — スライド生成
- **推奨**: `/generate-slide` コマンドを使用する（`.claude/commands/generate-slide.md` 参照）
- スペックJSONを `specs/` に作成し `node scripts/generate_from_spec.js --spec specs/<file>.json` で生成
- 利用可能なスライドタイプは `scripts/slide_components.js` を参照（stat・quote・timeline・two_column など9種類）
- 必ず `scripts/cta_qr_slides.js` のCTA+QRスライドを末尾に追加する（スペックに含めなくても自動追加）
- `config/cta_config.json` のQR URLとCTA内容を使用すること
- 出力先: `output/` フォルダ（ファイル名: `YYYYMMDD_セミナータイトル.pptx`）

### STEP 5 — QA
- LibreOfficeでPDFに変換 → pdftoppmで画像化 → 全スライドを目視確認
- 文字崩れ・はみ出し・重なりがあれば修正して再生成

### STEP 6 — カレンダーへのリンク登録
- 各イベントの説明欄にスライドファイルのパスを追記する
- カレンダー書き込み権限がない場合はイベント編集リンクを提示する

---

## 絶対ルール（必ず守ること）

- **CTA + QRスライドは必ず末尾に追加する** — `scripts/cta_qr_slides.js` を使用
- QRコードURLは `config/cta_config.json` の `qr_url` を参照する
- スライドのテーマカラーはセミナーごとに変える（同じ配色を繰り返さない）
- 文字サイズは本文14pt以上、タイトル24pt以上を維持する
- テキストボックスは余裕を持ったサイズにする（はみ出し厳禁）

---

## ファイル構成

```
seminar-project/
├── CLAUDE.md           ← このファイル（プロジェクト定義）
├── config/
│   ├── cta_config.json     ← CTA・QR設定（QRのURLなど）
│   └── seminar_themes.json ← スライドカラーテーマ一覧
├── scripts/
│   ├── cta_qr_slides.js    ← CTA+QRスライド生成モジュール（必須）
│   └── generate_seminar.js ← スライド生成サンプルスクリプト
├── reference/              ← 参照資料置き場（自由に追加OK）
│   └── README.md
└── output/                 ← 生成ファイルの出力先（用途別ディレクトリ構成）
    ├── セミナー/               ← セミナー用スライド
    │   └── YYYYMMDD_タイトル.pptx
    └── 個別面談/               ← 個別面談用スライド
        └── コース名/
            ├── スライド.pptx
            ├── preview.html
            ├── slide_screenshots/
            └── まとめ/         ← コース説明・特典まとめPDF
                ├── course_summary.html
                └── course_summary.pdf
```

### output ディレクトリルール（必ず守ること）

| 用途 | 保存先 |
|------|--------|
| セミナースライド | `output/セミナー/YYYYMMDD_タイトル.pptx` |
| 個別面談スライド | `output/個別面談/コース名/` |
| 個別面談まとめPDF | `output/個別面談/コース名/まとめ/` |
| 台本・原稿 | `output/個別面談/コース名/台本/` or `output/セミナー/台本/` |

---

## 環境セットアップ（初回のみ）

```bash
cd scripts
npm init -y
npm install pptxgenjs qrcode
```

---

## 参照資料について（`reference/` フォルダ）

以下のファイルを置くとスライド内容の質が上がります：
- 過去セミナーのPDFやPPTX
- ターゲット層の説明文
- 実績・受講生の声
- セミナーで使いたいキーワード・訴求文
- 自己紹介文

ファイル形式は `.md`, `.txt`, `.pdf`, `.pptx` いずれでも可。

---

## カレンダー除外キーワード（`config/cta_config.json` で変更可）

```
作業会, グルコン, グループコンサル, 予定入れない, オンライン面談, 本業定例, X定例, AI大学雑談会
```
