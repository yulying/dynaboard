FROM node:20-alpine as development

ENV VITE_BACKEND_BASE_URL = 'https://localhost:8000'

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD [ "npm", "start" ]

FROM development as build
RUN npm run build

FROM nginx:latest
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]