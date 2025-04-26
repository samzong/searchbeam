# Contributing Guide

Thank you for considering contributing to the yt-search-api project! Here are some guidelines to help you get involved in the project.

## Contribution Process

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make code changes
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Added some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a Pull Request

## Code Style

- Write all code in TypeScript
- Follow the ESLint and Prettier rules in the project
- Write tests for all new features
- Keep code comments clear and concise

## Pull Request Guidelines

- Each PR should focus on one feature or fix
- Include a clear description explaining what problem this PR solves
- If the change is related to an existing issue, reference the issue number in the PR description
- All PRs must pass CI tests before they can be merged

## Adding Support for New Platforms

If you want to add support for a new video platform, follow these steps:

1. Create a new file in the `/src/api` directory, for example `newplatform.ts`
2. Implement search functionality that conforms to the unified interface
3. Add platform-specific type definitions
4. Register the new platform in `/services/searchService.ts`
5. Add appropriate tests
6. Update documentation

## Issue Reporting

If you find an issue or have a suggestion for improvement, please create a new issue and provide as much of the following as possible:

- A clear and concise description of the issue
- Steps to reproduce
- Expected vs actual results
- System environment information (Node.js version, etc.)

## License

By contributing code, you agree that your contributions will be provided under the MIT license.
