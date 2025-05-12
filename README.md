# Phaser Uptime Clock

A sophisticated uptime clock built with Phaser 3 and TypeScript. This project displays a running clock that shows how long the application has been running, with a modern and responsive design.

## 🌟 Features

- Real-time uptime display with precise timing
- Responsive design that scales to fit different screen sizes
- Built with Phaser 3 and TypeScript for type safety
- Modern, clean UI with a dark theme
- Automatic window resizing and centering
- Smooth animations and transitions
- Cross-browser compatibility
- Mobile-friendly interface

## 🛠️ Technical Stack

- **Phaser 3** - HTML5 game framework for rendering and game logic
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Next-generation frontend tooling
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting

## 📋 Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Modern web browser with JavaScript enabled
- Git for version control

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/deliteser112/phaser-uptime-ts.git
cd phaser-uptime-ts
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or your configured port).

## ⚙️ Configuration

The game configuration can be modified in `src/index.ts`. Here are the available options:

```typescript
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,        // Automatically choose WebGL or Canvas
  width: 800,               // Game width
  height: 600,              // Game height
  backgroundColor: '#1d1d1d', // Background color
  scene: [MainScene],       // Game scenes
  scale: {
    mode: Phaser.Scale.FIT, // Scale mode
    autoCenter: Phaser.Scale.CENTER_BOTH // Center the game
  },
  title: 'Uptime Clock',    // Game title
  parent: 'game'            // DOM element ID
}
```

## 🏗️ Project Structure

```
phaser-uptime-ts/
├── src/
│   ├── scenes/
│   │   └── MainScene.ts    # Main game scene with clock logic
│   └── index.ts            # Entry point and game configuration
├── public/                 # Static assets
│   └── assets/            # Game assets (images, sounds, etc.)
├── dist/                   # Production build output
├── index.html             # HTML entry point
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 🎮 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Git Workflow**
   - Create feature branches from `main`
   - Write descriptive commit messages
   - Keep commits atomic and focused
   - Submit PRs for review

## 🏭 Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory. You can preview the production build using:

```bash
npm run preview
# or
yarn preview
```

## 🔧 Troubleshooting

Common issues and solutions:

1. **Game not loading**
   - Check browser console for errors
   - Verify all dependencies are installed
   - Ensure correct port is available

2. **Performance issues**
   - Check browser performance tools
   - Verify asset sizes
   - Monitor memory usage

3. **Scaling issues**
   - Check viewport meta tags
   - Verify scale configuration
   - Test on different devices

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your code:
- Passes all tests
- Follows the existing code style
- Includes appropriate documentation
- Has no linting errors

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Phaser team for the amazing game framework
- TypeScript team for the type system
- Vite team for the build tooling
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the [documentation](docs/)
- Join our [Discord community](https://discord.gg/your-server)

## 🔄 Updates

Stay updated with the latest changes:

- Watch the repository
- Follow our [Twitter](https://twitter.com/your-handle)
- Join our [newsletter](https://your-newsletter.com)

---

Made with ❤️ by [Your Name] 