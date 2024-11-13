# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Listen to all network interface
ENV HOST=0.0.0.0

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Generate prisma client
RUN npx prisma generate

# Build app, creates a "dist" folder with the production build
RUN npm run build

# Expose port
EXPOSE 3000

# Define entrypoint to automate deploying latest prisma migration
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

# Start the server using the production build
CMD [ "npm", "start" ]