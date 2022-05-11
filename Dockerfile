FROM node:14.17.4
WORKDIR /usr/src/smartbrain-api
COPY ./ ./
RUN npm i
CMD ["/bin/bash"]