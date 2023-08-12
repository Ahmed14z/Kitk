# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Install Bootstrap
RUN npm install bootstrap

# Copy the entire frontend directory to the container
COPY . .

# Expose the frontend port
EXPOSE 3000

# Set the command to run the frontend server
CMD ["npm", "start"]
