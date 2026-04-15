# WebView Preview Guide for Windows

This guide explains how to run a WebView preview of the Priority app on Windows.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Rust** (for Tauri) - [Download here](https://www.rust-lang.org/tools/install)

## Quick Start

### Option 1: WebView in Browser (Development Mode)

This runs the React app in a regular web browser:

```bash
npm run dev
```

The app will be available at `http://localhost:1420`

### Option 2: Native WebView (Tauri Dev Mode)

This runs the app in a native Tauri window:

```bash
npm run tauri dev
```

This will open a native desktop window with the WebView containing your app.

## Detailed Steps

### Step 1: Install Dependencies

If you haven't installed dependencies yet:

```bash
npm install
```

### Step 2: Choose Your Preview Method

#### Method A: Web Browser Preview
- Run: `npm run dev`
- Opens: Your default browser at `http://localhost:1420`
- Use for: Quick UI development and testing

#### Method B: Native Tauri WebView
- Run: `npm run tauri dev`
- Opens: A native desktop window with WebView
- Use for: Testing Tauri-specific features and native integrations

## Troubleshooting

### Port Already in Use
If port 1420 is already in use, you can either:
1. Stop the process using port 1420
2. Change the port in `vite.config.ts` and `src-tauri/tauri.conf.json`

### Tauri Build Errors
Ensure Rust is properly installed:
```bash
rustc --version
cargo --version
```

If needed, reinstall Rust from the official website.

## Configuration

- **Dev Server Port**: 1420 (configured in `vite.config.ts`)
- **Dev Path**: http://localhost:1420 (configured in `src-tauri/tauri.conf.json`)
- **App Window Size**: 1000x600 pixels
