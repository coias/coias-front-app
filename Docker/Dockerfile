FROM ubuntu:20.04

LABEL maintainer="usuki"

SHELL ["/bin/bash", "-c"]

ENV TZ=Asia/Tokyo\
    DEBIAN_FRONTEND=noninteractive

#optを作業ディレクトリとする
WORKDIR /opt

RUN apt update && apt install -y\
    curl\
    gnupg\
    git &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt update &&\
    apt install -y yarn &&\
    yarn global add n &&\
    n lts &&\
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/aizulab/coias-front-app.git --depth 1
WORKDIR /opt/coias-front-app

# RUN yarn --production
RUN yarn
ENTRYPOINT [ "bash", "/opt/coias-front-app/startup.sh" ]
