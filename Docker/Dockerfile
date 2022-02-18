FROM ubuntu:20.04

LABEL maintainer="usuki"

SHELL ["/bin/bash", "-c"]

RUN apt update && apt install -y\
    npm\
    nodejs

RUN npm install -y yarn

# copy app
WORKDIR /opt/coias_electron
COPY . .

RUN yarn install
ENTRYPOINT [ "yarn", "react-start" ]