# DirectoryBlue

[![CI Pipeline](https://github.com/MahendraGodase/DirectoryBlue/actions/workflows/ci.yml/badge.svg)](https://github.com/MahendraGodase/DirectoryBlue/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/MahendraGodase/DirectoryBlue/actions/workflows/cd.yml/badge.svg)](https://github.com/MahendraGodase/DirectoryBlue/actions/workflows/cd.yml)

An Angular application with Azure SQL integration for managing provider information and outreach details.

## Features

- Angular 20.3.10 application
- Azure SQL Database integration
## CI/CD Pipeline

This project includes automated CI/CD pipelines using GitHub Actions:

### Continuous Integration (CI)
- **Automated Testing**: Runs on every push and pull request to `main` and `develop` branches
- **Multi-Node Testing**: Tests against Node.js versions 18.x and 20.x
- **Build Verification**: Ensures the application builds successfully
- **Code Quality Checks**: TypeScript compilation, formatting, and linting
- **Security Scanning**: npm audit for vulnerability detection

### Continuous Deployment (CD)
- **GitHub Pages**: Automatic deployment to GitHub Pages on push to `main` branch
- **Azure Support**: Ready for Azure Web App deployment (configure secrets to enable)
- **Automated Releases**: Creates GitHub releases with version tags
- **Manual Deployment**: Supports manual workflow dispatch

### Setup Instructions

#### For GitHub Pages Deployment:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The CD pipeline will automatically deploy on push to main

#### For Azure Deployment:
1. Enable Azure deployment by setting `if: false` to `if: true` in `.github/workflows/cd.yml`
2. Add the following secrets to your repository:
   - `AZURE_WEBAPP_NAME`: Your Azure Web App name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal

- Mock backend server for development
- Provider information management
- Outreach details tracking

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
