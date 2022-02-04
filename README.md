# 開発環境構築

COIAS_front_sample 開発環境の構築方法。

## codeのclone

githubよりソースをおとす。ディレクトリは任意。

```
git clone https://github.com/aizulab/coias_electron.git --depth 1
cd coias_electron
```

## docker

dockerを使用して環境を構築する。

### build

imageの作成とコンテナ作成コマンド

```
docker build -t coias_front .
docker run -it -p 80:3000 --name coias_web_app coias_front
```

### アクセス

ブラウザからアクセスする。

`localhost`

# 手動で環境を整える

## nodeのインストール

パッケージ管理ツールのnpmをインストール。nodeに付属している。

[ダウンロード | Node.js](https://nodejs.org/ja/download/)

その他、homebrewやaptといったパッケージ管理ツールでもインストールできるがバージョンが古いことがあるので注意。

## npmの確認

npmがインストールされ、pathが通っているかを確認する。

```
npm -v
```

npmがインストールされている場合の表示例

'7.24.0'

## yarnのインストール

```
npm install -g yarn
```

## codeのclone

githubよりソースをおとす。ディレクトリは任意。

```
git clone https://github.com/aizulab/coias_electron.git --depth 1
cd coias_electron
```

### 必要ライブラリのインストール

```
yarn install
```

### アプリの構築

webページからアクセスする場合

```
yarn react-start
```

Electronを使用する場合

//todo

### アクセス

`locahost:3000`からアクセスできる。