# Priority ✅

Minimalist task management desktop app — workspaces, drag-and-drop, archive, search, and dark mode.

**Tools**: 🦀 Tauri, ⚛️ React 18, 🔷 TypeScript, 🎨 Tailwind CSS 3, 🤝 react-dnd

---

## Project Structure

```
.
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript config (Node tooling)
├── vite.config.ts                 # Vite bundler config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── public/
│   └── app-icon.png               # App icon (used in sidebar)
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Main app component (~1300 lines)
│   ├── index.css                  # Global styles + Tailwind directives
│   ├── constants.ts               # Icon registry, storage keys, defaults
│   ├── components/
│   │   ├── DraggableTask.tsx       # Drag-and-drop wrapper for tasks
│   │   ├── DraggableArchivedTask.tsx
│   │   └── DraggableWorkspace.tsx  # Drag-and-drop wrapper for workspaces
│   └── utils/
│       └── storage.ts             # localStorage load/save helpers
├── src-tauri/
│   ├── main.rs                    # Tauri entry point
│   ├── build.rs                   # Tauri build script
│   ├── Cargo.toml                 # Rust dependencies
│   ├── Cargo.lock
│   ├── tauri.conf.json            # Tauri window / bundle config
│   └── icons/                     # Platform app icons
└── BUILD-GUIDE-WINDOWS.md         # Windows build & dev guide
```

---

## Key Features

- **Custom Workspaces** — Create and organize tasks into named workspaces with custom icons
- **Drag & Drop** — Reorder workspaces, active tasks, and archived tasks
- **Inline Editing** — Double-click workspace names to rename, cycle through icons
- **Archive** — Archive completed tasks per workspace with restore/delete
- **Search** — Real-time search across all workspaces (`Ctrl+K`)
- **Quick Task Entry** — Add tasks from the omnibox (`Ctrl+L`); multi-line with `Shift+Enter`
- **Themes** — Light, dark, or system-follow theme
- **100% Local** — All data persisted in localStorage; export/import as JSON
- **Collapsible Panels** — Sidebar and archive panel collapse for focused work

---

## Getting Started

```bash
npm install
npm run dev          # Browser dev mode (Vite)
npm run tauri dev    # Desktop dev mode (Tauri window)
npm run build        # Build web
npm run tauri build  # Build desktop executable
```

See [BUILD-GUIDE-WINDOWS.md](BUILD-GUIDE-WINDOWS.md) for Windows prerequisites.
