FROM ubuntu:20.04

LABEL maintainer="usuki"

SHELL ["/bin/bash", "-c"]

ENV TZ=Asia/Tokyo\
    DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y\
    curl\
    gnupg &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt update &&\
    apt install -y yarn &&\
    yarn global add n &&\
    n lts

# copy app
WORKDIR /opt/coias-fornt-app
COPY . .

RUN yarn
ENTRYPOINT [ "yarn", "react-start" ]