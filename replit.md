# AI 3D Model Generator

## Overview

This is a full-stack web application for browsing and viewing 3D models in an interactive gallery. The application features a modern React-based frontend with Three.js integration for 3D model rendering, backed by an Express.js REST API. Users can search, filter by category, and view 3D models with an immersive WebGL-powered viewer.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, Vite build system, and Three.js for 3D rendering.

**UI Framework**: The application uses Radix UI primitives with shadcn/ui components styled with Tailwind CSS. This provides an accessible, customizable component library with consistent theming support (light/dark modes).

**3D Rendering**: Three.js integration through React Three Fiber (`@react-three/fiber`) and React Three Drei (`@react-three/drei`) for declarative 3D scenes. The `ModelViewer` component handles:
- Automatic model scaling and centering based on bounding boxes
- Camera controls via OrbitControls
- Lighting and shadow rendering
- Support for GLTF/GLB model formats
- Post-processing effects via `@react-three/postprocessing`

**State Management**: 
- Zustand stores for game state (`useGame`) and audio controls (`useAudio`)
- TanStack Query for server state management and API caching
- Local state via React hooks for component-level concerns

**Routing & Code Splitting**: Single-page application structure with client-side routing. Static assets (3D models, audio files) are configured for proper loading via Vite.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful endpoints following convention:
- `GET /api/models` - Fetch all models or filter by category via query parameter
- `GET /api/categories` - Retrieve available model categories
- `POST /api/models/search` - Perform keyword-based search with ranking algorithm

**Search Implementation**: The search endpoint implements a weighted scoring system:
- Model name matches: 10 points
- Category matches: 5 points
- Keyword matches: 3 points
- Description matches: 1 point

Results are ranked by score and returned in descending order.

**Data Storage Strategy**: Currently uses in-memory storage (`MemStorage` class) for development. The storage interface (`IStorage`) is abstracted to allow easy migration to database-backed storage without changing route handlers.

### Data Layer

**ORM**: Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless` driver. Schema definitions use type-safe builders with Zod validation.

**Database Schema**: Currently defines a `users` table with:
- Primary key: auto-incrementing serial ID
- Username: unique, non-null text field
- Password: non-null text field (should be hashed in production)

**Migration Strategy**: Drizzle Kit handles schema migrations with output to `./migrations` directory. The `db:push` script synchronizes schema changes to the database.

**Rationale**: Drizzle was chosen for its TypeScript-first approach and minimal runtime overhead. The serverless Neon driver enables connection pooling for serverless deployments.

### Development Workflow

**Build System**: Vite for frontend bundling with HMR (Hot Module Replacement) during development. The build process:
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` with ESM format

**Development Server**: Custom Vite middleware integration allows the Express server to serve the development build with HMR. Production mode serves static files from the build output.

**Error Handling**: Runtime error overlay plugin (`@replit/vite-plugin-runtime-error-modal`) for better DX during development. Server-side errors are caught by Express error middleware and returned as JSON responses.

### External Dependencies

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`). Connection URL configured via `DATABASE_URL` environment variable.

**3D Asset Format**: GLTF/GLB models stored in `/public/models/` directory, organized by category. Vite is configured to handle `.gltf`, `.glb`, `.mp3`, `.ogg`, and `.wav` files as static assets.

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component implementations built on Radix
- Tailwind CSS for utility-first styling with CSS custom properties for theming

**Font Loading**: Inter font loaded via `@fontsource/inter` for consistent typography.

**Additional Integrations**:
- GLSL shader support via `vite-plugin-glsl` for custom WebGL shaders
- Session management scaffold with `connect-pg-simple` (not currently active)
- Date utilities via `date-fns`
- Class name utilities via `clsx` and `tailwind-merge`

**Model Data**: Static model catalog defined in `shared/models.ts` with TypeScript types. Each model includes metadata (name, category, keywords, description) for search and filtering.