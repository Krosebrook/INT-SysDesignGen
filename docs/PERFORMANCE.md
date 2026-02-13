# Performance Standards

## Latency Budgets

| Metric | Target | Description |
|--------|--------|-------------|
| **FCP** (First Contentful Paint) | < 1.5s | Time to first visual feedback. |
| **TTI** (Time to Interactive) | < 2.0s | Time until app is clickable. |
| **Generation Latency** | < 500ms (TTFB) | Time to first token from Gemini. |

## Optimization Strategies

### 1. Code Splitting
The application uses dynamic imports (if configured in bundler) to split the `Architecture`, `Dashboard`, and `Settings` views into separate chunks.

### 2. Virtualization
The `OutputDisplay` component handles large markdown streams. For extremely large outputs, we recommend implementing `react-window` (roadmap item).

### 3. Asset Caching
The Service Worker aggressively caches fonts and CSS.
- **Fonts**: `Inter` and `JetBrains Mono` are served from Google Fonts but cached locally after first load.

### 4. React Rendering
- **Memoization**: Heavy components use `React.memo` where applicable.
- **Streaming**: The architecture generation uses streaming responses to provide immediate feedback, improving perceived performance over waiting for full generation.
