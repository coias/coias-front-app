#!/bin/bash -eu

# Dockerfile.devの実行後、コンテナ起動直後に実行される（bind後に処理を行うため）
# 設定は.devcontainer/devcontainer.jsonに記載

cd /opt/coias-front-app
yarn
