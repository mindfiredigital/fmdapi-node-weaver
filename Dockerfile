FROM node:18

# Create app directory
WORKDIR /data-api

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the app
CMD [ "node", "index.js" ]

