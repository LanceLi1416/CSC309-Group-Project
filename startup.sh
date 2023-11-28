#!/bin/bash

# Check if we're running on Ubuntu 20.04 LTS
check_os_and_version() {
    # Check if we're running on Linux
    if [ "$(uname)" != "Linux" ]; then
        echo "Non-linux environment \"$(uname)\" detected. This script may crash."
        return 1 # false
    fi

    # Check for /etc/os-release and source it
    if [ -f /etc/os-release ]; then
        . /etc/os-release
    else
        echo "Cannot determine the OS information."
        return 1 # false
    fi

    # Check for Ubuntu 20.04 LTS
    if [ "$NAME" != "Ubuntu" ]; then
        echo "This script is intended for the Ubuntu linux distribution. Detected \"$PRETTY_NAME\"."
        return 1 # false
        if [ "$VERSION_ID" != "20.04" ]; then
            echo "This script is intended for Ubuntu 20.04 LTS. Detected \"$PRETTY_NAME\"."
        fi
    fi

    return 0 # true
}

if check_os_and_version; then
  echo "Installing dependencies for Ubuntu 20.04 LTS..."

  # Install dependencies
  sudo apt update
  sudo apt install -y python3.9 python3.9-venv python3.9-dev python3-pip
else
    echo "This script is intended for Ubuntu 20.04 LTS. You may need to install the dependencies manually."
fi

# Check if python3 exists
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3."
    exit 1
fi

# Change directory to petpal
cd petpal

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python3 manage.py makemigrations accounts
python3 manage.py makemigrations pet_listings
python3 manage.py makemigrations applications
python3 manage.py makemigrations comments
python3 manage.py makemigrations notifications
python3 manage.py makemigrations moderation
python3 manage.py migrate

# Load sample data
python3 manage.py loaddata sample.json