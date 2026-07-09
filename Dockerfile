FROM node:22-alpine

WORKDIR /app

# Copy package definitions
COPY package.json package-lock.json ./

# Install dependencies but ignore automatic post-install build scripts
RUN npm ci --ignore-scripts

# Copy the rest of your source code (including tsconfig.json and src/)
COPY . .

# Run the build command manually now that the source code is available
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/server.js"]
