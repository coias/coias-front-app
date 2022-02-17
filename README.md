# dockerによる開発環境構築

COIAS_front_sample 開発環境の構築方法。
docker-composeを使用せず、「coias_electron」を単体で構築する手順。
特に理由がなければ、[aizulab/coias-docker-compose](https://github.com/aizulab/coias-docker-compose)を使用するとよい。

## dockerについて

dockerを使用することで、アプリ環境を自動でホストPCに増やせる。

[Docker](https://www.docker.com/)

### windows,macの場合

docker desktopを使用して環境を構築する。
docker desktopをインストール

[Get Docker | Docker Documentation](https://docs.docker.com/get-docker/)

### ubuntuの場合

ubuntuの場合は下記のスクリプトが使用できる。
dockerを使用する際に`sudo`が必要になる。

[Install Docker Engine on Ubuntu | Docker Documentation](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)

## codeのclone

githubよりソースをおとす。ディレクトリは任意。

```
git clone https://github.com/aizulab/coias_electron.git --depth 1
cd coias_electron
```

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

### アクセス

`locahost:3000`からアクセスできる。

## Electronを使用する場合

`// todo`