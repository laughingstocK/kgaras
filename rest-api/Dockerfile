# Use the official Node.js Alpine image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npx prisma generate

# Run the ssh-keygen command
RUN apk add --no-cache openssh-client && \
    mkdir -p /root/.ssh && \
    ssh-keygen -t rsa -N '' -f /root/.ssh/id_rsa

# Expose the port that the application will run on
EXPOSE 3001

# Command to start the application
CMD ["node", "app.js"]
