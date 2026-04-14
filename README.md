# Priority

A minimalist, priority-focused task management desktop application built with Tauri and React.

## Overview

Priority is a clean, distraction-free productivity app that helps you organize tasks across custom workspaces. Inspired by minimalist design principles, it focuses on what matters most: getting things done without clutter or complexity.

Unlike traditional todo apps that come with predefined categories, Priority starts completely blank. You create your own workspaces from scratch, giving you total freedom to organize your tasks exactly the way you think. Whether you're managing projects, tracking personal goals, or organizing daily tasks, Priority adapts to your workflow—not the other way around.

## Features

### Workspaces
- **Start Fresh**: No default categories—create only the workspaces you actually need
- **100+ Custom Icons**: Choose from over 100 icons across 20+ categories (Business, Lifestyle, Technology, Nature, Animals, Weather, and more) to visually distinguish workspaces
- **Easy Management**: Rename workspaces with a double-click, delete when no longer needed
- **Smart Task Migration**: When deleting a workspace, tasks automatically move to another workspace

### Task Management
- **Quick Creation**: Add tasks instantly with keyboard shortcuts (Ctrl+K to focus input)
- **Visual Progress**: Each workspace shows active/total task ratios at a glance
- **Archive System**: Move completed tasks to archive with one click, restore them anytime
- **Search**: Find any task instantly with real-time search
- **Completion Tracking**: Satisfying animations when marking tasks complete

### Archive
- **One-Click Archive**: Archive all completed tasks in a workspace from the hover menu
- **Archive Browser**: View all archived tasks in a dedicated archive section
- **Restore Tasks**: Bring archived tasks back to their original workspace
- **Permanent Delete**: Remove tasks from archive forever when no longer needed
- **Archive Count**: Badge indicator shows number of archived tasks at a glance

### Design & Experience
- **Minimalist Interface**: Clean, modern design with zero distractions
- **Full-Width Layout**: Task blocks expand to fill available screen width for better readability on large displays
- **Dark/Light/System Themes**: Choose light, dark, or automatically follow your system preference
- **Collapsible Sidebar**: Maximize focus by hiding the sidebar when not needed
- **Smooth Animations**: Polished transitions and micro-interactions throughout

### Privacy & Control
- **100% Local**: All data stored locally on your device—no cloud, no accounts
- **Export Anytime**: Backup your tasks and workspaces to JSON format
- **Complete Control**: Clear all data with one click when you want a fresh start
- **No Tracking**: Zero analytics, zero telemetry, zero compromises on privacy

## Tech Stack

- **Tauri** - Lightweight, secure desktop application framework
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Tailwind CSS** - Utility-first styling for rapid UI development
- **Lucide React** - Beautiful, consistent icon set (200+ icons available)
- **Vite** - Lightning-fast build tool and development server

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run Tauri commands
npm run tauri
```

## Usage Guide

### First Steps
1. **Create Your First Workspace**: Click the "+" button next to "Workspaces" in the sidebar
2. **Name It**: Give your workspace a meaningful name (e.g., "Work", "Personal", "Shopping")
3. **Choose an Icon**: Click the icon while editing to cycle through 100+ available options
4. **Add Tasks**: Start adding tasks to your new workspace

### Daily Workflow
- **Quick Add**: Press `Ctrl+K` to instantly focus the task input field
- **Organize**: Create separate workspaces for different areas of your life
- **Track Progress**: Monitor your task completion ratios in the sidebar
- **Archive Completed**: Hover over workspace and click archive icon to move completed tasks to archive
- **Browse Archive**: Click "Archive" in sidebar to view and manage archived tasks
- **Search**: Use the search box to quickly find specific tasks
- **Switch Themes**: Choose between Light, Dark, or System mode in Settings (System mode automatically adapts to your OS theme)

### Power Tips
- Double-click workspace names to rename them
- Hover over workspaces to reveal edit/archive/delete buttons
- Collapse the sidebar for maximum focus on your tasks
- Export your data regularly as a backup
- Use descriptive workspace names for better organization
- Archive completed tasks regularly to keep workspaces clean
- Restore archived tasks if you need to reference them again

## Philosophy

Priority is built on these core principles:

- **Simplicity**: No unnecessary features, notifications, or complexity
- **Focus**: Distraction-free interface helps you concentrate on what matters
- **Flexibility**: Organize tasks your way with completely customizable workspaces
- **Privacy**: Your data stays on your device—always
- **Speed**: Fast, responsive interactions with zero lag
- **Blank Slate**: Start with nothing, build exactly what you need

## Why Priority?

Most productivity apps overwhelm you with features you don't need. They come with predefined categories, complex project hierarchies, collaboration tools, and endless settings. Priority takes a different approach:

- **No Learning Curve**: If you can write a list, you can use Priority
- **No Bloat**: Every feature serves a purpose; nothing is decorative
- **No Lock-in**: Export your data anytime in standard JSON format
- **No Compromises**: Beautiful design doesn't mean sacrificing functionality

## License

MIT
