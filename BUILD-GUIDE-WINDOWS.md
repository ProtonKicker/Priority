# Windows EXE Build Guide for Priority

This guide explains how to build a standalone Windows executable (.exe) file for the Priority task management app.

## Prerequisites for Building

Before building the EXE, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Rust** (with MSVC toolchain for Windows) - [Download here](https://www.rust-lang.org/tools/install)
- **WebView2 Runtime** (usually pre-installed on Windows 10/11)

## Installing Rust with MSVC Toolchain

1. Install Rust from [rust-lang.org](https://www.rust-lang.org/tools/install)
2. During installation, ensure you select the "MSVC" toolchain (default on Windows)
3. After installation, verify:
   ```bash
   rustc --version
   cargo --version
   ```

## Building the EXE

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the React App

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 3: Build the Tauri App

```bash
npm run tauri build
```

This will:
- Compile the Rust backend
- Bundle the React frontend
- Create a Windows installer and standalone EXE

## Build Output Location

After the build completes, you'll find the output files in:

```
src-tauri/target/release/bundle/
├── msi/
│   └── Priority_0.1.0_x64_en-US.msi    # Windows Installer
└── nsis/
    ├── Priority_0.1.0_x64-setup.exe    # NSIS Installer
    └── Priority_0.1.0_x64.exe         # Standalone EXE
```

The standalone EXE file is located at:
```
src-tauri/target/release/bundle/nsis/Priority_0.1.0_x64.exe
```

## Build Options

### Build for Debugging (Faster, Larger File)

```bash
npm run tauri build --debug
```

Output location:
```
src-tauri/target/debug/bundle/
```

### Build with Custom Configuration

You can modify the build settings in `src-tauri/tauri.conf.json`:

```json
{
  "package": {
    "productName": "Priority",
    "version": "0.1.0"
  },
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "../dist",
    "distDir": "../dist"
  }
}
```

## Windows-Specific Considerations

### Code Signing (Optional)

For distribution, you may want to code-sign your EXE to avoid Windows SmartScreen warnings:

1. Obtain a code signing certificate from a trusted CA
2. Configure signing in `src-tauri/tauri.conf.json`:
   ```json
   "tauri": {
     "bundle": {
       "windows": {
         "webviewInstallMode": {
           "type": "embedBootstrapper"
         },
         "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT",
         "digestAlgorithm": "sha256"
       }
     }
   }
   ```

### WebView2 Runtime

The built EXE includes a bootstrapper that will automatically install WebView2 if not present on the target system.

## Troubleshooting

### Build Fails with "link.exe" not found

**Solution**: Install Visual Studio Build Tools with C++ workload:
1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
2. Install "Desktop development with C++" workload
3. Restart your terminal

### Build Fails with Rust Errors

**Solution**: Update Rust toolchain:
```bash
rustup update
rustup default stable
```

### "WebView2 not found" Error

**Solution**: Install WebView2 Runtime:
- Download from [Microsoft WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- Or use the bootstrapper (included by default in Tauri builds)

### Memory Errors During Build

**Solution**: Increase virtual memory or close other applications. Rust compilation can be memory-intensive.

## Distribution Tips

1. **Test the EXE**: Run the built EXE on a clean Windows machine to ensure it works
2. **Include WebView2**: The bootstrapper handles this, but consider including the runtime for offline installs
3. **File Size**: The standalone EXE will be ~15-20MB due to Rust runtime and WebView2 bootstrapper
4. **Antivirus**: Some antivirus software may flag unsigned EXEs - code signing helps with this

## Quick Build Command Summary

```bash
# Full production build
npm run build
npm run tauri build

# Or combined (Tauri will run the build command automatically)
npm run tauri build

# Debug build (faster)
npm run tauri build --debug
```

## Related Documentation

- [WebView Preview Guide](WEBVIEW-GUIDE-WINDOWS.md) - For development and testing
- [Main README](README.md) - Project overview and features
