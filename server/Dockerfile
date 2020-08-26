FROM node:12.18.3-buster as setup

###################################
# BUILD STAGE
###################################
# Setup variables
ENV GUNICORN_DIRECTORY=/server/gunicorn \
    GUNICORN_WORKERS=3 \
    GUNICORN_WORKER_CLASS=gevent \
    GUNICORN_BACKLOG=2048 \
    GUNICORN_BIND=0.0.0.0:80 \
    SERVER_MODULE=main:app \
    SERVER_DIRECTORY=/server \
    CLIENT_DIRECTORY=/client

# Setup gunicorn config
WORKDIR ${GUNICORN_DIRECTORY}
COPY server/gunicorn .

# Setup pip
WORKDIR /
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py

# Navigate to client directory
WORKDIR ${CLIENT_DIRECTORY}

# Install client dependencies
COPY client/package.json client/yarn.lock ./
RUN yarn install

# Navigate to server directory
WORKDIR ${SERVER_DIRECTORY}

# Install server dependencies
RUN pip install pipenv
COPY server/Pipfile* ./
RUN pipenv install --python 3.7.3 --deploy

# Copy remaining server source
COPY server .

# Copy remaining client source
COPY client ${CLIENT_DIRECTORY}


###################################
# DEVELOPMENT STAGE
###################################
FROM setup as development

# Run server
CMD pipenv run gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_DIRECTORY} ${SERVER_MODULE}


###################################
# PRODUCTION STAGE
###################################
# Run only Flask server with build app
FROM setup as production

# Build app
WORKDIR ${CLIENT_DIRECTORY}
RUN yarn run build

# Navigate to server directory
WORKDIR ${SERVER_DIRECTORY}

# Run server
CMD pipenv run gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_DIRECTORY} ${SERVER_MODULE}
