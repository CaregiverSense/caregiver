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
		apt-get install -y nodejs-legacy npm
		npm install -g bower
	END

	config.vm.provision "shell", privileged:false, inline: <<-END
		cd /vagrant/public
		bower install
	END

end


#	   # Run Ansible from the Vagrant VM
#		config.vm.provision "ansible_local" do |ansible|
#			ansible.provisioning_path = "/vagrant/ansible"
#			ansible.playbook 		  = "playbook.yml"
#			ansible.install  		  = true
#		end
