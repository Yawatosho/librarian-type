# あなたはどの図書館員タイプ？

12個の二択質問から、16種類の「図書館員タイプ」のどれかを表示する
YAWATOSHO GAMESのミニゲームです。

## GitHub Pagesで公開する

GitHub Pagesで公開する完成版は、リポジトリ直下の `index.html`、`assets/`、
`result/` に配置されています。GitHub側でのビルドは行いません。

1. ローカルの変更をコミットする
2. `main` ブランチをGitHubへPublishまたはPushする
3. 初回のみ、リポジトリの Settings → Pages → Build and deployment で
   Source を GitHub Actions にする
4. Actions の Deploy GitHub Pages が完了すると公開される

公開処理は [.github/workflows/pages.yml](.github/workflows/pages.yml) に定義されています。
この処理は、コミット済みの完成版をそのままPagesへ送信します。

## ローカルで確認する

プロジェクトのルートでローカルサーバーを起動します。

    python3 -m http.server 8000

## データと画像の差し替え

- 質問・16結果・おすすめゲーム：[app/data.ts](app/data.ts)
- 結果イラスト：public/assets/result-illustrations/
- 結果別OGP画像：public/assets/result-ogp/
- GitHub Pages用テンプレート：static/
- 静的ページ生成：scripts/build-github-pages.mjs

質問・結果・デザインを変更した場合は、コミット前に次の生成処理を実行します。

    SITE_URL=https://yawatosho.github.io/librarian-type node --experimental-strip-types scripts/build-github-pages.mjs

結果画像は app/data.ts に定義済みのファイル名で配置すると反映されます。
OGP画像は1200×630pxを想定しています。
