PROJECT_ID ?= $(shell gcloud config get-value project 2>/dev/null)
REGION ?= us-central1
SERVICE_NAME ?= mcp-sequential-thinking
MCP_API_KEY ?= $(shell openssl rand -hex 32)

.PHONY: deploy build

deploy:
	@if [ -z "$(PROJECT_ID)" ]; then \
		echo "Error: PROJECT_ID is not set and no default GCP project is configured."; \
		exit 1; \
	fi
	@echo "Deploying to Cloud Run with MCP_API_KEY=$(MCP_API_KEY)"
	gcloud run deploy $(SERVICE_NAME) \
		--source . \
		--region $(REGION) \
		--allow-unauthenticated \
		--set-env-vars="MCP_API_KEY=$(MCP_API_KEY)" \
		--quiet
	@echo "==========================================="
	@echo "Deployment initiated/completed."
	@echo "To use this in your MCP client configuration:"
	@echo "  URL: <Cloud Run Service URL>/sse"
	@echo "  Authorization Header: Bearer $(MCP_API_KEY)"
	@echo "==========================================="

build:
	npm run build
