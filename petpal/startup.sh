virtualenv -p /usr/bin/python3.9 venv
source venv/bin/activate
pip install -r packages.txt
python3 manage.py makemigrations accounts
python3 manage.py migrate
