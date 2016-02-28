#
# Тhis Dockerfile allows you to build an image of latest version of the app which
# you can then run with the docker command.
#
# To build, use this command:
#
#     docker build -t cs-app https://github.com/CaregiverSense/caregiver.git
#
# There are a number of environment variables that are needed to run it.
# These variables will be provided in a file that can be saved as .cs.env, which
# you can then include at runtime as follows:
#
#     docker run --name memtag-app -p 7001:7000 $(cat ~/.cs.env) -d cs-app
#

# Pull base image.
FROM node

ENV PORT=7000 \
	COOKIE_SECRET=x \
	OAUTH_GMAIL_USER=x \
	OAUTH_GMAIL_CLIENT_ID=x \
	OAUTH_GMAIL_CLIENT_SECRET=x \
	OAUTH_GMAIL_REFRESH_TOKEN=x \
	DB_HOST= \
	DB_POOL_SIZE= \
	DB_NAME= \
	DB_USER= \
	DB_PASSWORD=

# Install Bower & Gulp
RUN npm install -g bower gulp

# Define working directory.

ADD . /data/app

WORKDIR /data/app
RUN npm install

WORKDIR public
RUN bower install --allow-root

# Define default command.
WORKDIR ..
CMD ["node", "--debug=5858", "bin/www" ]

# 5858 is the debug port and 7000 is the main HTTP port
EXPOSE 5858 7000