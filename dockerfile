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
WORKDIR /opt/coias_electron
COPY . .

RUN yarn install
ENTRYPOINT [ "yarn", "react-start" ]