# Pull base image.
FROM node

# Install Bower & Gulp
RUN npm install -g bower gulp

# Define working directory.
WORKDIR /data

ADD . /data/app

# Define default command.
CMD ["bash"]