FROM node:carbon-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

# Due to nomnom deprecated issue, add -g artillery --unsafe-perm=true --allow-root 
# refer to https://github.com/artilleryio/artillery/issues/671
# RUN npm install -g artillery --unsafe-perm=true --allow-root
RUN npm install 
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]