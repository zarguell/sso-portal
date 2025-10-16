# SSO Portal

A custom-branded, single-page application launcher for customer-facing (CIAM) scenarios.

## Overview

This project provides a white-labeled application portal that integrates with Microsoft Entra External ID for authentication. It's designed to be a fully customizable alternative to the standard Microsoft MyApps portal.

## MVP

The current focus is on the MVP scope outlined in `SPEC.md`. This includes:
- Mock authentication and entitlements
- A static application catalog
- A React-based frontend
- AWS serverless infrastructure managed by Terraform

## Getting Started

### Prerequisites

- AWS Account
- Node.js 20+
- Terraform
- Configured Entra External ID tenant

### Installation

1.  Clone the repository.
2.  Copy `.env.example` to `.env` and fill in the required values.
3.  Run `./scripts/deploy-all.sh` to deploy the entire stack.

### Usage

-   **Portal URL**: `https://<CLOUDFRONT_DOMAIN>`
-   **API URL**: `https://<API_DOMAIN>`

See `SPEC.md` for detailed information on the architecture, API, and data structures.
