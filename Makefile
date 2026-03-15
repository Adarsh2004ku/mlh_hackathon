.PHONY: help install run test clean docker-build docker-run

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pip install -r requirements.txt

run: ## Run the application
	python run.py

test: ## Run tests
	pytest tests/ -v

test-cov: ## Run tests with coverage
	pytest tests/ --cov=core --cov=routes --cov-report=html

clean: ## Clean up cache files
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	rm -rf .coverage htmlcov/

docker-build: ## Build Docker image
	docker-compose build

docker-run: ## Run with Docker Compose
	docker-compose up

docker-run-detached: ## Run with Docker Compose in background
	docker-compose up -d

docker-stop: ## Stop Docker Compose
	docker-compose down

lint: ## Run linting
	flake8 core routes run.py config.py --max-line-length=100

format: ## Format code with black
	black core routes run.py config.py --line-length=100