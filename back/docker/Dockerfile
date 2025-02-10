FROM python:3.9-alpine
RUN apk add --update nodejs npm
RUN apk add openjdk8
RUN apk add g++
# RUN adduser -D ubuntu
# RUN chown -R ubuntu:ubuntu /usr/src
# USER ubuntu
COPY input.sh /usr/src
WORKDIR /usr/src
VOLUME ["/app"]
CMD ["tail", "-f", "/dev/null"]