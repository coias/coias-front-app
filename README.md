# coias-front-app

coiasフロントアプリ

## ディレクトリの解説

```
.
├── Docker
├── docs
├── node_modules
├── public
├── src
├── .env

```

__Docker__　　
dockerfileが保存。
実行用と開発用、開発セットアップスクリプトが保存されている。

__.env__　　
backendへのURIが保存されている。
このURIを読み出し、データを送信している。

__src__　　
ソースが保存されている。

## ---src配下の説明---

```
├── src
    ├── component
    ├── page
    ├── style
    ├── App.jsx
    ├── index.jsx
```
- component --> コンポーネントが保存
- page -->　探索準備、探索/再測定、レポートの三つのページが保存
- style -->　scssが保存
- App.jsx --> Routerの割り当て
- index.jsx -->　Appの呼び出し
