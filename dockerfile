FROM alpine:latest

LABEL maintainer="usuki"

RUN apk add --no-cache \
    coreutils \
    bash \
    tzdata \
    yarn \
    nodejs

# set timezone JST
RUN cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# copy app
COPY ../coias_electron /opt/coias_electron
WORKDIR /opt/coias_electron

RUN yarn install && yarn react-start