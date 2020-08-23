#!/bin/bash

# Run server
pipenv run gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_MODULE} ${SERVER_DIRECTORY} &

# Run development client
yarn start
