#
### STAGE 1: BUILD ###
#
FROM node:23.6.1-alpine AS build

# Set working directory
WORKDIR /src

# Copy necessary files
COPY package*.json tsconfig.json ./
COPY . .

# Install dependencies
RUN npm ci

# Run the build command
RUN npm run build

#
### STAGE 2: PRODUCTION ###
#
FROM node:23.6.1-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy production artifacts
COPY --from=build /src/dist ./dist

# Copy package.json so npm can run
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
