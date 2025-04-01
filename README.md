# Next.js Game Development Boilerplate

A modern, opinionated Next.js boilerplate configured for game development projects with built-in code quality tools and optimizations.

## Features

- ⚡️ [Next.js 15](https://nextjs.org/) with App Router and Server Components
- 🎮 Optimized for game development
- 💅 [Tailwind CSS](https://tailwindcss.com/) with custom theme configuration
- 🔍 [ESLint](https://eslint.org/) with Next.js configuration
- ✨ [Prettier](https://prettier.io/) for code formatting
- 🐶 [Husky](https://typicode.github.io/husky/) for Git hooks
- 📝 [Commitlint](https://commitlint.js.org/) for conventional commits
- 🎨 SVG support with [@svgr/webpack](https://react-svgr.com/)
- 🔄 Hot reload with Turbopack
- 📱 Responsive design ready
- 🌗 Light/Dark mode support
- 🎯 TypeScript strict mode enabled

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn

## Project Structure

```
├── src/
│   ├── app/              # App router pages
│   ├── components/       # React components
│   │   ├── ui/           # ShadCN-generated components
│   │   ├── layouts/      # Layout components
│   ├── lib/              # Utility functions
│   ├── hooks/            # Custom hooks
│   ├── styles/           # Global styles
├── public/               # Static assets
└── ...config files       # Next.js and project config files (next.config.js, tsconfig.json, etc.)
```

## Code Quality Tools

### Prettier

- Automatic code formatting on save
- Customizable through `.prettierrc`
- Ignores specified files via `.prettierignore`

### ESLint

- Next.js and TypeScript specific rules
- Integrated with Prettier
- Customizable through `eslint.config.mjs`

### Husky & Commitlint

- Pre-commit hooks for code quality
- Conventional commit message enforcement
- Lint-staged for optimized linting

## Development Workflow

1. Make your changes
2. Checkout to main: `git checkout -b feat/branch`
3. Stage your changes: `git add .`
4. Commit using conventional commits: `git commit -m "feat: add new feature"`
5. Push to your repository: `git push`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the GitHub repository.
