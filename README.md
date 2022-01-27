# 開発環境構築

COIAS_front_sample 開発環境の構築方法。

## codeのclone

githubよりソースをおとす。

```
git clone https://github.com/aizulab/coias_electron.git
cd COIAS_front_sample
```

## branchの変更

```
git checkout menubar
```

## nodeのインストール

パッケージ管理ツールのnpmをインストール。nodeに付属している。
node.jsが必要なければ インストールの種類 > カスタム > node.ｊｓ のチェックを外す。

[ダウンロード | Node.js](https://nodejs.org/ja/download/)

## npmの確認

npmがインストールされ、pathが通っているかを確認する。

```
npm -v
```

npmがインストールされている場合の表示例

'7.24.0'

### 必要ライブラリのインストール

```
npm install
```

### アプリの構築

```
npm start
```
