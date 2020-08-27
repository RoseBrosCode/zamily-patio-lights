FROM node:12.18.3-buster-slim

# Setup variables
ENV CLIENT_DIRECTORY=/client

# Navigate to client directory
WORKDIR ${CLIENT_DIRECTORY}

# Install client dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install

# Run development server
CMD ["npm", "start"]
