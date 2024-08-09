## Droplet - Video Transcoder API

### Setup and Deploy

1. **Rename the `.env.example` file:**

   Rename `.env.example` to `.env`.

2. **Run Terraform:**

   Initialize and apply Terraform configurations:

   ```bash
   terraform init
   terraform apply
   ```

3. **Verify the Containers:**

   After Terraform has applied the configurations, follow these steps to verify that the containers are running:

   3.1. Connect to the Droplet via SSH:

   ```bash
   ssh root@$(cat droplet_ip.txt)
   ```

   3.2. Check if the containers are running:

   ```bash
   docker ps
   ```
