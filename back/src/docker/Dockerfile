FROM python:3.9-alpine
RUN apk add --update nodejs npm
RUN apk add openjdk11
RUN apk add g++
COPY input.sh /usr/src
WORKDIR /usr/src
VOLUME ["/app"]
CMD ["tail", "-f", "/dev/null"]