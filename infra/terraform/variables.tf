variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
}

variable "droplet_name" {
  description = "Name of the DigitalOcean Droplet"
  type        = string
  default     = "stokei-droplet"
}

variable "region" {
  description = "DigitalOcean region to create the Droplet in"
  type        = string
  default     = "nyc3"
}

variable "size" {
  description = "DigitalOcean Droplet size"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "ssh_key_id" {
  description = "SSH key ID for DigitalOcean Droplet"
  type        = string
}
