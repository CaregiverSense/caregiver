Vagrant.configure("2") do |config|

	config.vm.box = "cs-2016-03-13"
	config.vm.network "forwarded_port", guest: 5858, host: 5858
	config.vm.network "forwarded_port", guest: 7000, host: 80

	# Update
	config.vm.provision "shell", inline: <<-END
		apt-get update
		apt-get install -y nodejs-legacy npm git jq
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