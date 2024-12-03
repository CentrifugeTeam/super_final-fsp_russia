provider "yandex" {
  token     = "<token>"
  cloud_id  = local.cloud_id
  folder_id = local.folder_id
  zone      = local.zone
}

locals {
  registry_name = "centrifugo-registry"
  zone = "ru-central1-a"
  cloud_id  = "<id>"
  folder_id = "<id>"
}
