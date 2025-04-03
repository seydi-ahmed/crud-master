# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Charger les variables d'environnement depuis .env
  if File.exist?(".env")
    File.foreach(".env") do |line|
      next if line.strip.empty? || line.start_with?("#") # Ignorer les lignes vides et les commentaires
      key, value = line.strip.split("=", 2)
      config.vm.provision "shell", inline: "echo 'export #{key}=\"#{value}\"' >> /etc/profile.d/vagrant_env.sh"
    end
  end

  # ----------------------------
  # API Gateway VM
  # ----------------------------
  config.vm.define "gateway-vm" do |gateway|
    config.vm.box = "ubuntu/focal64"
    gateway.vm.hostname = "gateway-vm"
    gateway.vm.network "private_network", ip: "192.168.56.10"
    gateway.vm.provision "shell", path: "scripts/setup_gateway.sh"
  end

  # ----------------------------
  # Inventory VM
  # ----------------------------
  config.vm.define "inventory-vm" do |inventory|
    config.vm.box = "ubuntu/focal64"
    inventory.vm.hostname = "inventory-vm"
    inventory.vm.network "private_network", ip: "192.168.56.20"
    inventory.vm.provision "shell", path: "scripts/setup_inventory.sh"
  end

  # ----------------------------
  # Billing VM
  # ----------------------------
  config.vm.define "billing-vm" do |billing|
    config.vm.box = "ubuntu/focal64"
    billing.vm.hostname = "billing-vm"
    billing.vm.network "private_network", ip: "192.168.56.30"
    billing.vm.provision "shell", path: "scripts/setup_billing.sh"
  end
end
