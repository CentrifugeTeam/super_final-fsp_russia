
output "external_ip" {
  value = yandex_compute_instance.coi-1.network_interface[0].nat_ip_address
}