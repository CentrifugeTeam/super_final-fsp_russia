

resource "yandex_vpc_network" "network-1" {
  name = "centrifugo_network"
}

resource "yandex_vpc_subnet" "subnet-1" {
  network_id     = yandex_vpc_network.network-1.id
  v4_cidr_blocks = ["192.168.10.0/24"]

}
