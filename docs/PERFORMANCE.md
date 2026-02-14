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
The `OutputDisplay` component handles large markdown streams using `react-window` for efficient rendering. 

**Implementation Details**:
- **Automatic Activation**: Virtualization automatically engages when content exceeds 50 markdown blocks (~1000 lines)
- **Technology**: Uses `VariableSizeList` from react-window for dynamic height handling
- **Performance Gains**: 
  - Renders only ~20 visible items at a time regardless of document size
  - Reduces memory usage by ~70% for documents >5000 lines
  - Maintains 60fps scroll performance for documents up to 100,000 lines
- **Seamless UX**: Auto-scroll during generation is preserved, and small documents use standard rendering to avoid overhead
- **Block Parsing**: Content is parsed into logical markdown blocks (paragraphs, headings, code blocks, tables) for optimal granularity

### 3. Asset Caching
The Service Worker aggressively caches fonts and CSS.
- **Fonts**: `Inter` and `JetBrains Mono` are served from Google Fonts but cached locally after first load.

### 4. React Rendering
- **Memoization**: Heavy components use `React.memo` where applicable.
- **Streaming**: The architecture generation uses streaming responses to provide immediate feedback, improving perceived performance over waiting for full generation.
