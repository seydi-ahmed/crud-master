Vagrant.configure("2") do |config|
    # Gateway VM
    config.vm.define "gateway-vm" do |gateway|
      gateway.vm.box = "ubuntu/focal64"
      gateway.vm.network "private_network", ip: "192.168.56.10"
      gateway.vm.provision "shell", path: "scripts/gateway-setup.sh"
    end
  
    # Inventory VM
    config.vm.define "inventory-vm" do |inventory|
      inventory.vm.box = "ubuntu/focal64"
      inventory.vm.network "private_network", ip: "192.168.56.20"
      inventory.vm.provision "shell", path: "scripts/inventory-setup.sh"
    end
  
    # Billing VM
    config.vm.define "billing-vm" do |billing|
      billing.vm.box = "ubuntu/focal64"
      billing.vm.network "private_network", ip: "192.168.56.30"
      billing.vm.provision "shell", path: "scripts/billing-setup.sh"
    end
  end