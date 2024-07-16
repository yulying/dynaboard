FROm node:lts AS development
WORKDIR /app
ARG PORT=8000
COPY package*.json .
RUN npm install
COPY . .
CMD [ "npm", "start"]