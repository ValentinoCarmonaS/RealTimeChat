# Makefile

DOCKER_COMPOSE = docker compose
NPM = npm
NODE_ENV ?= development

.PHONY: help build up down test format

build: ## Builds the Docker image. (with Docker)
	@echo "Building Docker image..."
	$(DOCKER_COMPOSE) build

up: ## Starts the containers. (with Docker)
	@echo "Initializing containers..."
	$(DOCKER_COMPOSE) up -d

down: ## Stops and removes the containers. (with Docker)
	@echo "Stopping and removing containers..."
	$(DOCKER_COMPOSE) down

test: ## Runs the tests. (with Docker)
	@echo "Running tests..."
	NODE_ENV=test $(DOCKER_COMPOSE) run --rm \
		-v "$(PWD)/coverage:/usr/src/app/coverage" \
		-e NODE_ENV=test \
		api npm test

format: ## Formats the code using Prettier.
	@echo "Formatting code..."
	$(NPM) run format

dev: ## Start development server (without Docker)
	@echo "Starting development server..."
	$(NPM) run dev
