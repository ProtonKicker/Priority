# Windows Build Guide

## Prerequisites

- **Node.js** (v16+) — [nodejs.org](https://nodejs.org/)
- **Rust** with MSVC toolchain — [rust-lang.org](https://www.rust-lang.org/tools/install) (select MSVC during install)
- **WebView2 Runtime** — pre-installed on Windows 10/11; [manual download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if needed

## Quick Start

```bash
npm install                    # Install dependencies
npm run dev                    # Browser preview at http://localhost:1420
npm run tauri dev              # Native desktop window (dev mode)
```

## Build EXE

```bash
npm run tauri build            # Production build
npm run tauri build --debug    # Debug build (faster, larger)
```

### Output

```
src-tauri/target/release/bundle/
├── msi/Priority_0.1.0_x64_en-US.msi
└── nsis/Priority_0.1.0_x64-setup.exe
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `link.exe` not found | Install Visual Studio Build Tools with "Desktop development with C++" workload |
| Rust build errors | `rustup update && rustup default stable` |
| Port 1420 in use | Change port in `vite.config.ts` and `src-tauri/tauri.conf.json` |
| WebView2 missing | Install WebView2 Runtime (bootstrapper included in EXE handles this automatically) |
| Memory errors | Close other apps — Rust compilation is heavy |

### Code Signing (Optional)

Add to `src-tauri/tauri.conf.json` to avoid SmartScreen warnings:
```json
"tauri": {
  "bundle": {
    "windows": {
      "webviewInstallMode": { "type": "embedBootstrapper" },
      "certificateThumbprint": "YOUR_THUMBPRINT",
      "digestAlgorithm": "sha256"
    }
  }
}
```
