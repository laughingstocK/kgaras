# Use the official Node.js image as the base image
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

# Define the command to start your app
CMD ["npm", "start"]
