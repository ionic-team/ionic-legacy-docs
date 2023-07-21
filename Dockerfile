FROM ruby:2.5.1-alpine
WORKDIR /
COPY . .
RUN apk update && apk upgrade
RUN apk add \
  nodejs=8.9.3-r1 \
  python make gcc g++
RUN gem install bundler -v 1.16.1
RUN bundle install
RUN npm install
RUN npm run heroku-postbuild