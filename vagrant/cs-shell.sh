#!/usr/bin/env bash

#curl -L -s https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && \
#chmod +x /usr/local/bin/docker-machine
#echo "docker-machine is now installed"

curl -L -s http://github.com/micha/resty/raw/master/resty > /usr/local/bin/resty
echo ". resty" > /etc/profile.d/startup.sh
chmod 755 /usr/local/bin/resty
echo "Installed resty"

# Load environment variables from the vault to ~/.cs.app.env
echo Using vault token $VAULT_TOKEN
echo "export VAULT_HEADER=\"X-Vault-Token: $VAULT_TOKEN\"" >> /etc/profile.d/startup.sh
# TODO Replace this IP with the domain name.
echo "resty http://vault.caregiversense.com:8200" >> /etc/profile.d/startup.sh

. /etc/profile.d/startup.sh

GET /v1/secret/app/env -H "$VAULT_HEADER" | jq ".data" | sed -e "s/^\s*\"\(.*\)\":\s\"\(.*\)\"[,]\{0,1\}$/\\1=\\2/" -e "/^[\}\{]$/d" > /home/vagrant/.cs.app.env
chgrp -f vagrant /home/vagrant/.cs.app.env /etc/profile.d/startup.sh
chmod 660 /home/vagrant/.cs.app.env
echo Wrote /home/vagrant/.cs.app.env
cat /home/vagrant/.cs.app.env
cat /etc/profile.d/startup.sh

chmod 755 /etc/profile.d/*
docker run -d -p 7000:7000 -p 5858:5858 -v /vagrant:/data --env-file=/home/vagrant/.cs.app.env memtag/cs-app-dev