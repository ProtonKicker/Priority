# Priority ✅

Minimalist task management desktop app 🎯 Create custom workspaces, organize tasks your way.

**Features**: 📁 Custom workspaces, ⚡ quick task creation (Ctrl+K), 📦 archive, 🔍 search, 🔒 100% local storage, 🌗 dark/light themes

**Tools**: 🦀 Tauri, ⚛️ React, 🔷 TypeScript, 🎨 Tailwind CSS

1. 🏗️ Create workspace
2. ✍️ Add tasks
3. 🧘 Stay focused

---

## Project Structure

```
.
├── index.html                    # HTML entry point for Vite dev server
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for Node.js environment
├── vite.config.ts                # Vite bundler configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration for Tailwind
├── public/
│   └── app-icon.png              # Application icon (used in sidebar)
├── src/                          # React application source code
│   ├── main.tsx                  # React app entry point
│   ├── App.tsx                   # Main application component (1663 lines)
│   └── index.css                 # Global styles with Tailwind imports
├── src-tauri/                    # Tauri Rust backend
│   ├── main.rs                   # Tauri application entry point
│   ├── build.rs                  # Build script for Tauri
│   ├── Cargo.toml                # Rust dependencies
│   ├── Cargo.lock                # Rust dependency lock file
│   └── icons/                    # Application icons for all platforms
│       ├── icon.ico              # Windows icon
│       ├── icon.icns             # macOS icon
│       ├── icon.png              # Linux icon
│       └── [other sizes]         # Various platform-specific icon sizes
└── WEBVIEW-GUIDE-WINDOWS.md      # Windows-specific WebView setup guide
```

---

## File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| `index.html` | HTML template loaded by Vite dev server; contains the `<div id="root">` where React mounts |
| `package.json` | Defines npm scripts (`dev`, `build`, `preview`, `tauri`), dependencies, and project metadata |
| `vite.config.ts` | Configures Vite dev server (port 1420) and build output (`dist/` folder) |
| `tailwind.config.js` | Tailwind CSS configuration with custom theme settings |
| `postcss.config.js` | PostCSS configuration enabling Tailwind CSS processing |
| `tsconfig.json` | TypeScript compiler options for the React app |
| `tsconfig.node.json` | TypeScript options for Node.js build tools |

### Source Files (`src/`)

| File | Purpose |
|------|---------|
| `main.tsx` | React entry point; renders `<App />` into the DOM |
| `App.tsx` | Main application component containing all UI logic, state management, workspace/task CRUD, drag-and-drop, keyboard shortcuts, and settings |
| `index.css` | Global styles with Tailwind CSS imports (`@tailwind base`, `@tailwind components`, `@tailwind utilities`) |

### Tauri Files (`src-tauri/`)

| File | Purpose |
|------|---------|
| `main.rs` | Rust entry point; initializes Tauri builder and runs the application |
| `build.rs` | Build script that calls `tauri_build::build()` to generate Tauri context |
| `Cargo.toml` | Rust dependencies (`tauri`, `serde`, `serde_json`) and binary configuration |
| `Cargo.lock` | Lock file ensuring consistent dependency versions across builds |
| `icons/` | Directory containing all platform-specific application icons |

---

## Key Features

- **Custom Workspaces**: Create and organize tasks into multiple workspaces with custom icons
- **Drag & Drop**: Reorder workspaces and tasks by dragging
- **Archive System**: Archive completed tasks per workspace
- **Search**: Search across all workspaces with keyboard shortcuts
- **Theme Support**: Light, dark, or system theme with persistence
- **Local Storage**: All data stored in browser localStorage (100% offline)
- **Keyboard Shortcuts**: Fast workflow with shortcuts like Ctrl+K (search), Ctrl+L (add task)
- **Data Export/Import**: Backup and restore tasks as JSON

---

## Getting Started

See [WEBVIEW-GUIDE-WINDOWS.md](WEBVIEW-GUIDE-WINDOWS.md) for Windows-specific instructions.

```bash
# Install dependencies
npm install

# Run in development mode (browser)
npm run dev

# Run in Tauri window
npm run tauri dev

# Build for production
npm run build
npm run tauri build
```
