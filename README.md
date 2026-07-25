# applevenus (リニューアル版)

旧WordPressブログ（2005〜2016年、公開記事314件）を、Astroによる静的サイトへ移行したプロジェクトです。

## できていること

- 公開記事314件・下書き10件を Markdown 化し、`src/content/blog/` に配置済み
- 記事本文中の画像49点を `public/images/` にコピーし、パスを新サイト用に書き換え済み
- 承認済みのデザイン（モノスペース見出し × セリフ本文 × フロッピーラベル風カテゴリバッジ）を適用
- カテゴリ別ページ、ページネーション、旧サイトのコメント83件の静的表示に対応

## ローカルで確認する

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:4321` を開くと確認できます。

## 本番用にビルドする

```bash
npm run build
```

`dist/` フォルダに完成した静的サイトが出力されます。これをそのままホスティングサービスにアップロードすれば公開できます。

## 今後やるとよいこと（未着手の部分）

1. **ホスティングへのデプロイ**
   Cloudflare Pages か Vercel にこのプロジェクトのリポジトリを接続すれば、`npm run build` が自動実行され公開されます。

2. **microCMSへの接続**（今後、月1回など新しい記事を書きたい場合）
   現状は記事がMarkdownファイルのままなので、まずはこのままでも運用可能です。管理画面から記事を書きたくなったタイミングで、microCMSのAPIを`src/content/config.ts`に追加することで、新規記事だけmicroCMS経由にする、といった段階的な移行も可能です。

3. **giscus（コメント機能）の設置**
   GitHubリポジトリを用意し、[https://giscus.app](https://giscus.app) の手順に沿って設定すると、記事ページ下部に埋め込めます。過去のコメント83件は既に静的表示されているので、giscusは「これから増えるコメント」専用として使う想定です。

4. **`/about` ページの文章の差し替え**
   現在は仮の文章です。`src/pages/about.astro` を編集してください。

5. **旧URL（`?p=123` 形式）からのリダイレクト設定**
   旧WordPressのURLでブックマークしている人がいる場合、ホスティング側のリダイレクト設定（`_redirects`ファイルなど）で新URL（`/blog/p123`）へ転送すると親切です。`legacy_id`フィールドに旧ID(`123`)が入っているので対応表は作成可能です。

## ディレクトリ構成

```
src/
  content/blog/       … 324記事のMarkdown(frontmatter付き)
  data/comments.json  … 旧サイトのコメント(legacy_idをキーに保持)
  layouts/            … 共通レイアウト
  components/         … カテゴリバッジ等
  pages/              … 一覧・詳細・カテゴリ・about
  styles/global.css   … デザインのトークン(色・フォント)
public/images/         … 記事内画像(年/月フォルダ構成のまま)
```
