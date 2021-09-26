FROM node:14

#App directory
WORKDIR /bongmeomeo/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080 

CMD ["node","dist/main"]