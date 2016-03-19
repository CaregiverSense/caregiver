Vagrant.configure("2") do |config|

	config.vm.box = "memtag/cs-devbox-base"
	config.vm.network "forwarded_port", guest: 5858, host: 5858
	config.vm.network "forwarded_port", guest: 7000, host: 80
	config.vm.provider :virtualbox do |vb|
	  vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
	end

	# Update
	config.vm.provision "shell", inline: <<-END
		apt-get update
	END


	config.vm.provision "shell", privileged:false, inline: <<-END
		cd /vagrant
		npm install
		cd /vagrant/public
		bower install
	END

	config.vm.provision "docker" do |docker|
		docker.pull_images "memtag/cs-app-dev"
	end

	config.vm.provision "shell" do |shell|

		token=ENV['VAULT_TOKEN']
		if token.nil?
			puts "You must set the VAULT_TOKEN environment variable"
			exit 1
		end

		shell.path = "vagrant/cs-shell.sh"
		shell.env = { "VAULT_TOKEN" => token }
	end

end