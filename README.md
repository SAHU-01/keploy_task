# Keploy Documentation Portal

A high-performance documentation and interactive tutorial platform built with Next.js 15, MDX, and Zustand. This portal is designed to provide a seamless onboarding experience through reactive content synchronization and integrated code exploration.

## Core Architecture

### Content Engine
The portal utilizes a custom MDX engine located in `src/lib/mdx/engine.ts`. Content is structured within `src/content/QUICKSTART`, enabling a modular approach to multi-language and multi-environment documentation. The engine parses frontmatter and raw MDX content, providing a type-safe interface for the application.

### State Management
Global application state is managed via Zustand in `src/features/keploy-tutorial/store/useTutorialStore.ts`. This store synchronizes the current progress through tutorials, active code snippets, and global UI states (sidebar, theme, search queries).

### Reactive Tutorials
The tutorial system implements an intersection-observer-based progression model. As users scroll through a guide, the `Step` component updates the global state, which in turn:
- Synchronizes the `CodePane` to show the relevant file and line ranges.
- Updates the progressive timeline (circles and connecting lines).
- Manages the active section highlighting.

## Key Features

### Dynamic Search
A custom-built, full-text search implementation integrated into the `Navbar`. It features:
- Real-time indexing of the active page content.
- Visual highlighting of matching sections using a reactive pulse effect.
- Keyboard shortcut integration (Command + K).

### Multi-File Code Explorer
The `CodePane` component provides a high-fidelity code viewing experience with:
- Support for multiple files and syntax highlighting.
- Integration with MDX `CodeTrigger` components for direct line highlighting.
- Diff visualization for configuration changes.

### Progressive Progress Tracking
A visual timeline that marks progress through tutorials:
- Automated state updates based on scroll position.
- Persistent completion markers for visited sections.
- Integrated feedback loop ("Up Next" and section-level feedback).

## Development

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Setup
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

## Technical Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Content: MDX (next-mdx-remote)
- State: Zustand
- Icons: Lucide React
