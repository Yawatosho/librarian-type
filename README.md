# あなたはどの図書館員タイプ？

12個の二択質問から、16種類の「図書館員タイプ」のどれかを表示する
YAWATOSHO GAMESのミニゲームです。

## GitHub Pagesで公開する

このプロジェクトは、GitHub Pages向けの静的ファイルを自動生成します。
リポジトリ作成後、main ブランチへプッシュしてください。

1. GitHubで新しいリポジトリを作る
2. このフォルダをそのリポジトリへプッシュする
3. リポジトリの Settings → Pages → Build and deployment で
   Source を GitHub Actions にする
4. Actions の Deploy GitHub Pages が完了すると公開される

公開処理は [.github/workflows/pages.yml](.github/workflows/pages.yml) に定義されています。
リポジトリ名を含む公開URLはGitHub側から自動取得されるため、
ユーザーサイトとプロジェクトサイトのどちらでも動作します。

## ローカルで確認する

Node.js 22以上で次を実行します。

    npm install
    npm run dev

GitHub Pagesへ送る静的ファイルだけを確認する場合：

    SITE_URL=https://example.github.io/repository-name npm run build:pages

出力先は github-pages/ です。

## データと画像の差し替え

- 質問・16結果・おすすめゲーム：[app/data.ts](app/data.ts)
- 結果イラスト：public/assets/result-illustrations/
- 結果別OGP画像：public/assets/result-ogp/
- GitHub Pages用テンプレート：static/
- 静的ページ生成：scripts/build-github-pages.mjs

結果画像は app/data.ts に定義済みのファイル名で配置すると反映されます。
OGP画像は1200×630pxを想定しています。
