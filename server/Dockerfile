###################################
# STAGE 1 - Install Server
###################################
FROM python:3.8-slim-buster as server
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

# Navigate to server directory
WORKDIR ${SERVER_DIRECTORY}

# Install server dependencies
RUN pip install pipenv
COPY server/Pipfile* ./
RUN pipenv install --system --deploy

# Copy remaining server source
COPY server .


###################################
# STAGE 2 - Development
###################################
FROM server as development

# Run server
CMD gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_DIRECTORY} ${SERVER_MODULE}


######################################
# STAGE 3a - Production (Build Client)
######################################
FROM node:12.18.3-buster-slim as build-client
# Setup variables
ENV CLIENT_DIRECTORY=/client

# Navigate to client directory
WORKDIR ${CLIENT_DIRECTORY}

# Install client dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install

# Copy client source
COPY client ${CLIENT_DIRECTORY}

# Build client app
RUN npm run build


######################################
# STAGE 4b - Production (Deploy)
######################################
# Run only Flask server with built app
FROM server as production

# Navigate to server directory
WORKDIR ${SERVER_DIRECTORY}

# Copy built client app
COPY --from=build-client ${CLIENT_DIRECTORY}/build ${CLIENT_DIRECTORY}/build

# Run server
CMD gunicorn --config ${GUNICORN_DIRECTORY}/gunicorn.conf.py --log-config ${GUNICORN_DIRECTORY}/logging.conf \
    --chdir ${SERVER_DIRECTORY} ${SERVER_MODULE}
