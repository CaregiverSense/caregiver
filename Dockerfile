#
# Тhis Dockerfile allows you to use your local code as a volume
#
# To build, use this command:
#
#     docker build -t memtag/cs-app-dev - < Dockerfile
#
# The environment variables expected are the following:
# 		FB_APP_ID					// The App ID from Facebook of a test or prod version of the app.
#		COOKIE_SECRET				// A value used to encrypt cookies
#		OAUTH_GMAIL_USER			// Gmail address used for new registrations
#		OAUTH_GMAIL_CLIENT_ID
#		OAUTH_GMAIL_CLIENT_SECRET
#		OAUTH_GMAIL_REFRESH_TOKEN
#		DB_HOST=172.19.0.2			// The IPv4 address of the server
#		DB_PORT=3306				// The port to use to connect to the database
#		DB_POOL_SIZE=10				// The number of connections held in the connection pool
#		DB_NAME=memtag				// The name of the database
#		DB_USER						// The user name for the db
# 		DB_PASSWORD					// The password for the db
#
# Since this container is part of a multi-container setup (app and db), the preferred
# approach is to launch it (from the same location as docker-compose.yml) in detached mode with:
#
#	docker-compose up -d
#

# Pull base image.
FROM node

# Install Bower & Gulp
RUN npm install -g bower gulp

# Define default command.
CMD ["node", "--debug=5858", "/data/bin/www" ]

# Map your project to this volume
VOLUME ["/data"]

# 5858 is the debug port and 7000 is the main HTTP port
EXPOSE 5858 7000