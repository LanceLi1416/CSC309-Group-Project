# Deployment

## Django REST API Server

This section guide is tailored for deploying the API server on a Raspberry Pi. The API server is written in Python 3.11
and uses the Django framework. The API server is deployed using the Nginx web server and the gunicorn WSGI server.

### Setting Up the Raspberry Pi

#### Basic Setup

1. Install the Raspberry Pi OS Lite image on the Raspberry Pi.
2. Connect the Raspberry Pi to the internet.
3. Enable SSH on the Raspberry Pi.
4. Any additional configuration can be done at this point. It is recommended to create a new user for running the API
   server.

#### Installing Dependencies

1. Ensure that the Raspberry Pi is up-to-date.
    ```bash
    sudo apt-get update
    sudo apt-get upgrade
    ``` 
2. Install the dependencies.
    1. Python
       ```bash
       sudo apt-get install python3 python3-pip python3-venv
       ```   
    2. Django and Django REST Framework
       ```bash
       cd backend   
       python -m venv    
       source venv/bin/activate   
       pip install -r requirements.txt   
       ```    
    3. Node.js and npm
       ```bash
       sudo apt-get install nodejs npm
       ```
    4. Nginx
       ```bash
       sudo apt-get install nginx
       ```
    5. Gunicorn
       ```bash
       pip install gunicorn
       ```
    6. Node.js dependencies
       ```bash
       cd frontend
       npm install
       ```

Also install the required dependencies for transferring files to the Raspberry Pi. Then, transfer the project files to
the Raspberry Pi.

#### Update Django Settings

1. Update the `ALLOWED_HOSTS` setting in `backend/petpal/settings.py` to include the domain name of the server.
2. Update the `CORS_ALLOWED_ORIGINS` setting in `backend/petpal/settings.py` to include the domain name of the server.
3. Set the `DEBUG` setting in `backend/petpal/settings.py` to `False`.
4. Add the following to the bottom of `backend/petpal/settings.py`.
    ```python
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    ```
   where `BASE_DIR` is the path to the project directory.
5. Run the following commands to collect the static files.
    ```bash
    cd backend
    python manage.py collectstatic
    ```
6. Update the `SECRET_KEY` setting in `backend/petpal/settings.py` to a random string.

#### Setting Up the Server

1. Create a new service for the API server.
    ```bash
    sudo nano /etc/systemd/system/gunicorn.service
    ```

   Paste the following into the file.
   ```text
   [Unit]
   Description=gunicorn daemon
   After=network.target
   
   [Service]
   User=[username]
   Group=www-data
   WorkingDirectory=[path to project]
   ExecStart=[path to project]/venv/bin/gunicorn --workers 3 --bind unix:[path to project]/petpal.sock petpal.wsgi:application
   
   [Install]
   WantedBy=multi-user.target
   ```

   Replace `[username]` with the username of the user that will be running the API server. Replace `[path to project]`
   with the path to the project directory.

   After the service is created, start and enable the service.
   ```bash
    sudo systemctl start gunicorn
    sudo systemctl enable gunicorn
    ```

   Check the status of the service.
   ```bash
    sudo systemctl status gunicorn
    ```

   The output should look like this.
      ```text
        ● gunicorn.service - gunicorn daemon
             Loaded: loaded (/etc/systemd/system/gunicorn.service; enabled; vendor preset: enabled)
             Active: active (running) since ...
      ```
2. Create a new server block for Nginx.

   Create a new file for the server block.
   ```bash
   sudo nano /etc/nginx/sites-available/petpal
   ```

   Paste the following into the file.
   ```text
   server {
       listen 80;
       server_name [domain name];
   
       location = /favicon.ico { access_log off; log_not_found off; }
       location /static/ {
           alias [path to project]/staticfiles;
       }
       location /media/ {
             alias [path to project]/media;
       }
   
       location / {
           include proxy_params;
           proxy_pass http://unix:[path to project]/petpal.sock;
       }
   }
   ```

   Replace `[domain name]` with the domain name of the server. Replace `[path to project]` with the path to the project.

   After the server block is created, enable the server block and restart Nginx.

   ```bash
   sudo ln -s /etc/nginx/sites-available/petpal /etc/nginx/sites-enabled
   sudo nginx -t  # Check for errors
   sudo systemctl restart nginx
   ```

The API server should now be running on the Raspberry Pi. Additional setup, including port forwarding and DNS records
may be required to allow the API server to be accessed from the internet. Our API server is deployed on a Raspberry Pi
using a domain name from Cloudflare for DNS and SSL.

## React App

The React frontend is deployed on [Cloudflare Pages](https://developers.cloudflare.com/pages/), which is a static site
hosting service. The React app is built using the `npm run build` command and the resulting build folder is deployed to
Cloudflare Pages. The React app is configured to use the API server deployed on the Raspberry Pi.

### Development

#### Environment Setup

The React app can be run locally for development. The following dependencies are required.

- Node.js (LTS)
- npm (LTS)
- Cloudflare account

Before running the React app, the API server must be running. There is also an environment variable that must be set
before running the React app. Create a file named `.env` in the `frontend` directory and add the following line to the
file.

```text
REACT_APP_API_URL=[API URL]
```

where `[API URL]` is the URL of the API server.

#### Running the React App

To install the dependencies, run the following command in the `frontend` directory.

```bash
npm install
```

To run the development server, run the following command in the `frontend` directory.

```bash
npm start
```

To build the React app, run the following command in the `frontend` directory.

```bash
npm run build
```

### Deployment

The React app is deployed on Cloudflare Pages. The React app is automatically deployed when changes are pushed to
the `main` branch of the GitHub repository (read
[this documentation](https://developers.cloudflare.com/pages/get-started/guide/#connect-your-git-provider-to-pages)).

1. The following build settings are used.
    - Build command: `npm run build`
    - Build output directory: `build`
    - Root directory (advanced): `frontend`
2. Additionally, the following environment variable **must** be set for the production build.
    - `REACT_APP_API_URL`: URL of the API server

   For our deployment, we have the following environment variables set.
    - `REACT_APP_API_URL`: `https://petpalapi.lance1416.com/`
3. Add any custom domains to the Cloudflare Pages project.
