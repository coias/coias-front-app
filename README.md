# coias-front-app

coias フロントアプリ

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

**Docker**
dockerfile が保存。
実行用と開発用、開発セットアップスクリプトが保存されている。

**.env**
backend への URI が保存されている。
この URI を読み出し、データを送信している。

**src**
ソースが保存されている。

## ---src 配下の説明---

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
- style -->　 scss が保存
- App.jsx --> Router の割り当て
- index.jsx -->　 App の呼び出し

## ---component 配下の説明---

```
├── component
    ├──functional
    ├──general
    ├──model
    ├──ui
```

- functional --> page ではない 1 つ component に import され、画面に表示されないもの。(基本的には return 文がないもの。)
- general --> 2 つ以上の component に import されるもの。
- model --> 1 つの page に直接関連するもので、関係のある page 名のディレクトリに収納。ただし、MeasurementCommon は COIAS と ManualMeasurement の両方でのみ使われる component を収納。
- ui -->page ではない 1 つ component に import され、画面に表示されるもの。
