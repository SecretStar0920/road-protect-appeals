FROM node:12

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:prod

EXPOSE 3000

ENTRYPOINT ["npm"]

CMD [ "run", "start:prod" ]
