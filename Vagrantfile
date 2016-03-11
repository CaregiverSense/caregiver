# Tasks
# 		apt-get update
#		download from git
#		npm install
#		bower install
#
#		Install docker
#   	install docker-machine
#

Vagrant.configure("2") do |config|

	config.vm.box = "ubuntu/trusty64"
	config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

	config.vm.provider "virtualbox" do |vb|
		["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
	end

	config.vm.provision "shell", inline: <<-END
		apt-get update
		apt-get install -y nodejs-legacy npm git
		npm install -g bower
	END

	config.vm.provision "shell", privileged:false, inline: <<-END
		cd /vagrant/public
		bower install
	END

	# TODO run the container with environment variables (obtained from Vault?)
	config.vm.provision "docker" do |docker|
		docker.pull_images "memtag/cs-app-dev"
	end

	config.vm.provision "shell", inline: <<-END
		curl -L -s https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && \
    	chmod +x /usr/local/bin/docker-machine
    	echo "docker-machine is now installed"

    	curl -L -s https://releases.hashicorp.com/vault/0.5.1/vault_0.5.1_linux_amd64.zip | gunzip -c > /usr/local/bin/vault
    	chmod +x /usr/local/bin/vault
    	echo "vault is now installed"
	END

end


#	   # Run Ansible from the Vagrant VM
#		config.vm.provision "ansible_local" do |ansible|
#			ansible.provisioning_path = "/vagrant/ansible"
#			ansible.playbook 		  = "playbook.yml"
#			ansible.install  		  = true
#		end
