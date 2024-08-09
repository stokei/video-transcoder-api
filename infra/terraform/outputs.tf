output "droplet_ip" {
  description = "The IP address of the Droplet"
  value       = digitalocean_droplet.video_transcoder_api.ipv4_address
}
