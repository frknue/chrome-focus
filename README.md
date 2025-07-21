# Chromium Focus - Domain Blocker Extension

A Chrome extension that allows you to easily block domains with a simple, user-friendly interface.

## Features

- 🚫 Block domains with a single click
- 🔄 Toggle blocking on/off instantly
- 💾 Persistent storage of blocked domains
- 🎨 Clean, modern UI
- ⚡ Efficient blocking using Chrome's declarativeNetRequest API

## Project Structure

```
chromium-focus/
├── src/                    # Source files
│   ├── manifest.json      # Extension manifest
│   ├── popup/             # Popup UI files
│   │   ├── popup.html
│   │   └── popup.js
│   ├── background/        # Background service worker
│   │   └── background.js
│   ├── styles/            # CSS styles
│   │   └── styles.css
│   └── assets/            # Icons and images
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── dist/                  # Built extension (gitignored)
├── package.json          # Project configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
└── README.md

```

## Setup & Development

### Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn
- Google Chrome browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chromium-focus
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

### Development Scripts

- `npm run build` - Build the extension to dist/
- `npm run dev` - Build and watch for changes
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist/` folder from this project

## Usage

1. Click the extension icon in Chrome's toolbar
2. Add domains to block (e.g., "example.com")
3. Toggle the master switch to enable/disable blocking
4. Remove domains by clicking the "Remove" button

## Code Quality

This project uses:
- **ESLint** for code linting with browser extension specific rules
- **Prettier** for consistent code formatting
- Modern JavaScript (ES2021+)

## How It Works

The extension uses Chrome's `declarativeNetRequest` API to efficiently block domains at the network level. This approach:
- Provides better performance than webRequest API
- Respects user privacy (no access to request contents)
- Works reliably across all websites

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run linting and formatting before committing
4. Submit a pull request

## License

MIT