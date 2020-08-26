FROM node:12.18.3-buster

# Setup variables
ENV CLIENT_DIRECTORY=/app/client

# Navigate to client directory
WORKDIR ${CLIENT_DIRECTORY}

# Install client dependencies
COPY client/package.json client/yarn.lock ./
RUN yarn install

# Run development server
CMD ["yarn", "run", "start"]
