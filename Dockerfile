# Use the specified Node.js version as the base image
FROM node:23.6.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]