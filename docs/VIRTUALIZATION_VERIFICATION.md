# Virtualization Feature Verification Guide

## Overview
This guide provides step-by-step instructions for verifying the react-window virtualization implementation in the OutputDisplay component.

## Prerequisites
- Node.js v18+
- Google Gemini API key configured
- Browser with DevTools (Chrome/Edge recommended)

## Manual Verification Steps

### 1. Start Development Server
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`

### 2. Test Small Document (Non-Virtualized)
**Objective**: Verify standard rendering for small documents

1. Log in to the application
2. Navigate to the Architecture view
3. Enter a simple task (e.g., "Design a basic REST API")
4. Generate architecture
5. Open Browser DevTools → Elements tab
6. Inspect the output container
7. **Expected**: Should see standard `<div class="prose">` with all content rendered
8. **Expected**: Should NOT see react-window's virtualized list wrapper

### 3. Test Large Document (Virtualized)
**Objective**: Verify virtualization activates for large documents

1. Enter a complex task that generates large output:
   ```
   Design a complete microservices architecture for an e-commerce platform 
   with 15 services including: user management, product catalog, inventory, 
   order processing, payment gateway, shipping, notifications, analytics, 
   search, recommendations, reviews, wishlist, cart, authentication, and admin.
   Include detailed API contracts, database schemas, message queues, caching 
   strategy, security considerations, deployment architecture, monitoring, 
   and disaster recovery plan.
   ```
2. Wait for generation to complete (~50+ blocks)
3. Open Browser DevTools → Elements tab
4. Inspect the output container
5. **Expected**: Should see react-window's `<div style="...">` wrapper elements
6. **Expected**: Only ~20-30 child elements rendered (visible rows + overscan)

### 4. Test Scroll Performance
**Objective**: Verify smooth 60fps scrolling

1. With large document generated, open DevTools → Performance tab
2. Start recording
3. Scroll rapidly through the document for 5-10 seconds
4. Stop recording
5. **Expected**: Frame rate should stay near 60fps (no red bars)
6. **Expected**: No long tasks or jank during scrolling

### 5. Test Auto-Scroll During Generation
**Objective**: Verify scroll behavior during streaming

1. Start generating a large document
2. Observe the output panel during generation
3. **Expected**: Panel should auto-scroll to bottom as new content streams in
4. **Expected**: No visual jumps or stuttering during scroll

### 6. Test Memory Usage
**Objective**: Verify memory optimization

**Small Document Test**:
1. Open DevTools → Performance Monitor
2. Generate small document (~20 blocks)
3. Note "JS heap size"

**Large Document Test**:
1. Clear previous output
2. Generate very large document (100+ blocks)
3. Note "JS heap size"
4. **Expected**: Memory increase should be proportional to visible content, not total content
5. **Expected**: ~70% less memory than rendering entire document in DOM

### 7. Test Content Preservation
**Objective**: Verify all features still work

1. With virtualized document loaded:
   - Click "Copy" button → verify content copies correctly
   - Click "Download" button → verify markdown downloads
   - Click "Flag" button → verify moderation flagging works
   - Test all interactive elements (code block scrolling, table rendering)
2. **Expected**: All features function identically to non-virtualized mode

### 8. Test Code Block Preservation
**Objective**: Verify code blocks with blank lines render correctly

1. Create a task that generates code with blank lines:
   ```
   Show me Python code for a REST API with proper spacing
   ```
2. Verify generated code blocks:
   - Check for multi-line code examples
   - Ensure blank lines within code blocks are preserved
   - **Expected**: Code blocks render as single units, not split
   - **Expected**: Syntax highlighting and language badges work

### 9. Test Threshold Behavior
**Objective**: Verify 50-block threshold

1. Generate documents of varying sizes:
   - Small: ~20 blocks (should NOT virtualize)
   - Medium: ~45 blocks (should NOT virtualize)  
   - Large: ~55 blocks (SHOULD virtualize)
2. **Expected**: Virtualization activates exactly at 50+ blocks
3. **Expected**: No visual difference in appearance between modes

### 10. Test Responsive Behavior
**Objective**: Verify mobile compatibility

1. Open DevTools → Toggle device toolbar
2. Test on various viewport sizes:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080
3. Generate large document on each size
4. **Expected**: Virtualization works on all viewport sizes
5. **Expected**: Container height adjusts correctly

## Expected Performance Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Scroll FPS** | 60fps | DevTools Performance → FPS meter during scroll |
| **Initial Render** | <200ms | DevTools Performance → Time to first paint |
| **Memory (5000 lines)** | <50MB heap | DevTools Performance Monitor → JS heap size |
| **Virtualized Items** | ~20-30 | DevTools Elements → Count rendered child divs |

## Troubleshooting

### Virtualization Not Activating
- Check block count: Open console, log `blocks.length` from component
- Ensure content has >50 blocks (double newline separated)
- Verify react-window is installed: `npm list react-window`

### Performance Issues
- Check block parsing: May be creating too many small blocks
- Verify height estimation: Blocks with incorrect heights cause reflow
- Check browser: Some older browsers have poor virtual scroll support

### Auto-Scroll Not Working
- Verify `isGenerating` prop is true during generation
- Check `listRef.current` is defined
- Ensure block count updates trigger effect

## Success Criteria

✅ Small documents (<50 blocks) render without virtualization overhead  
✅ Large documents (>50 blocks) automatically switch to virtualized rendering  
✅ Scroll performance maintains 60fps for documents up to 100,000 lines  
✅ Memory usage reduced by ~70% for large documents  
✅ Auto-scroll during generation works in both modes  
✅ All interactive features (copy, download, flag) function correctly  
✅ Code blocks with blank lines render as single units  
✅ No visual differences between virtualized and non-virtualized modes  
✅ Responsive behavior works on mobile/tablet/desktop viewports  
✅ No security vulnerabilities introduced  

## Reporting Issues

If you find any issues during verification:
1. Document the exact steps to reproduce
2. Include browser version and OS
3. Capture screenshots/recordings if visual issues
4. Check browser console for errors
5. Note performance metrics if performance-related
