FROM node:12

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .

EXPOSE 4200

ENTRYPOINT [ "ng" ]

CMD [ "serve", "--host", "0.0.0.0"]

RUN npm install -g @angular/cli@latest
