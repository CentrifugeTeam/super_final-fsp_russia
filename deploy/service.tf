
data "yandex_compute_image" "coi" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance" "coi-1" {
  name = "service-coi"
  platform_id = "standard-v2"
  boot_disk {
    mode = "READ_WRITE"
    initialize_params {
      image_id = data.yandex_compute_image.coi.id
      size = 30
    }
  }


  network_interface {
    subnet_id = yandex_vpc_subnet.subnet-1.id
    nat       = true
  }

  resources {
    cores  = 8
    memory = 8
  }

  metadata = {
    docker-compose = file("${path.module}/../docker-compose.deploy.yml")
    ssh-keys = "ubuntu:${file("~/.ssh/id_rsa.pub")}"
  }

}


