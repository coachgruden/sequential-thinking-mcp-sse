FROM node:22-alpine

WORKDIR /app

# 1. Copy ALL files (including tsconfig.json and source code) first
COPY . .

# 2. Install dependencies (which will now successfully trigger the tsc build)
RUN npm install
RUN npm install express

# 3. Expose the port Cloud Run expects
EXPOSE 8080

# 4. Start the SSE wrapper
CMD ["node", "dist/server.js"]