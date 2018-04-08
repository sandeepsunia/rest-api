#!/usr/bin/env bash

if [ "$EUID" -ne 0 ] && [ "$(uname)" != "Darwin" ]
  then echo "Please run as root."
  exit
fi

NODE_ENV=development
docker-compose -f ./docker/dev-compose.yml up -d
