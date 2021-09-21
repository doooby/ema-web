ARG STACK_NAME
FROM ${STACK_NAME}--app:base

COPY src .
COPY var/build tmp/build

RUN \
    tar -zxf tmp/build/node_modules.tar.gz node_modules && \
    tar -zxf tmp/build/nuxt.tar.gz .nuxt
