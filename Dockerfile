FROM node:alpine

WORKDIR /usr/src/node-server

# COPY ./ ./
ADD /usr/src/node-server

RUN npm install
RUN npm install pm2

# CMD ["/bin/bash"]
CMD ["pm2-dev", "index.js"]