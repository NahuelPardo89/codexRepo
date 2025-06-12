# Makefile

# Variables
PYTHON = python
MANAGEPY = $(PYTHON) apiRest/manage.py
FRONTPATH = Frontend/Prana

# Default target
all: migrate

# Target to run migrations
migrate:
	$(MANAGEPY) makemigrations
	$(MANAGEPY) migrate

# Target to create a superuser
superuser:
	$(MANAGEPY) createsuperuser

# Target to run tests
test:
	$(MANAGEPY) test

# Target to clean up compiled Python files
clean:
	find . -name "*.pyc" -delete

# Target to clean up migrations (USE WITH CAUTION!)
cleanmigrations:
	del /s /q .\api\migrations\*.py
	del /s /q .\api\migrations\*.pyc

# Target to start a backend development server
runbe:
	$(MANAGEPY) runserver

# Target to start a frontend development server
runfe:
	cd $(FRONTPATH) && ng serve
	
# Terminar
app:
#	mkdir -p apiRest/apps/$(APP_NAME)
	cd apiRest/apps/
	mkdir $(APP_NAME)
#	$(MANAGEPY) startapp $(APP_NAME) apiRest/apps/$(APP_NAME)

# Target to install project dependencies
reqinstall:
	pip install -r requirements.txt

# Target to install front dependencies
feinstall:
	cd $(FRONTPATH) && npm install

# Target to upgrade project dependencies
upgrade:
	pip install --upgrade -r requirements.txt

# Virtual environment activation
venv:
# Set your own path here
# D:\Workspace\prana_api\env\Scripts\activate.bat
	cmd /c D:\Workspace\prana_api\env\Scripts\activate

.PHONY: all migrate createsuperuser test clean cleanmigrations runserver install upgrade
