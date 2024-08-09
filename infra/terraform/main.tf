resource "digitalocean_droplet" "video_transcoder_api" {
  image  = "ubuntu-22-04-x64"
  name   = var.droplet_name
  region = var.region
  size   = var.size
  ssh_keys = [
    var.ssh_key_id
  ]

  # Copiar o docker-compose.yml para o Droplet
  provisioner "file" {
    source      = "docker-compose.yml"
    destination = "/opt/stokei/docker-compose.yml"

    connection {
      type        = "ssh"
      user        = "root"
      private_key = file("~/.ssh/id_rsa")
      host        = self.ipv4_address
    }
  }

  # Copiar o .env para o Droplet
  provisioner "file" {
    source      = ".env"
    destination = "/opt/stokei/.env"

    connection {
      type        = "ssh"
      user        = "root"
      private_key = file("~/.ssh/id_rsa")
      host        = self.ipv4_address
    }
  }

  # Executar comandos remotos para configurar Docker e iniciar os contêineres
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "root"
      private_key = file("~/.ssh/id_rsa")
      host        = self.ipv4_address
    }

    inline = [
      # Instalar Docker e Docker Compose
      "apt-get update",
      "apt-get upgrade -y",
      "apt-get install -y docker.io docker-compose",

      # Iniciar os contêineres usando Docker Compose
      "cd /opt/stokei && docker-compose up -d"
    ]
  }

  provisioner "local-exec" {
    command = "echo ${self.ipv4_address} > droplet_ip.txt"
  }
}

output "droplet_ip" {
  value = digitalocean_droplet.video_transcoder_api.ipv4_address
}
