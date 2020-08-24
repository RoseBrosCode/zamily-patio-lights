FROM node:12.18.3-buster as server

###################################
# BUILD STAGE
###################################
# Setup server variables
ENV GUNICORN_DIRECTORY=/server/gunicorn \
    GUNICORN_WORKERS=3 \
    GUNICORN_WORKER_CLASS=gevent \
    GUNICORN_BACKLOG=2048 \
    GUNICORN_BIND=0.0.0.0:80 \
    SERVER_MODULE=main:app \
    SERVER_DIRECTORY=/server

# Setup gunicorn config
WORKDIR ${GUNICORN_DIRECTORY}
COPY server/gunicorn .

# Setup server
WORKDIR ${SERVER_DIRECTORY}

# Install server dependencies
RUN pip install pipenv
COPY server/Pipfile* ./
RUN pipenv install --python 3.8 --deploy

# Copy remaining server source
COPY server .

# Setup client variables
ENV CLIENT_DIRECTORY=/client

# Setup client
WORKDIR ${CLIENT_DIRECTORY}

# Install client dependencies
COPY client/package.json client/yarn.lock ./
RUN yarn install

# Copy remaining server source
COPY client .

###################################
# DEVELOPMENT STAGE
###################################
# Run both Flask server and node development server
FROM server as development

CMD ./run_development.sh

###################################
# PRODUCTION STAGE
###################################
# Run only Flask server with build app
FROM server as production

# Build app
RUN yarn run Build

# Run server
CMD pipenv run gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_MODULE} ${SERVER_DIRECTORY}
