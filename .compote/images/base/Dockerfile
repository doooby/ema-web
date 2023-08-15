FROM node:18

WORKDIR /app

RUN \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    \
    apt-get -qq update && \
    apt-get -qq -y install yarn
