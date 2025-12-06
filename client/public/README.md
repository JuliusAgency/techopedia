# SVG Test Files

This directory contains test SVG files covering various edge cases for testing the SVG parser and canvas renderer.

## Test Files

### Basic Tests
- **test-basic.svg** - Single rectangle, basic functionality test
- **test-multiple.svg** - Multiple rectangles with different colors
- **test-small.svg** - Small SVG (50x50) with one rectangle
- **test-large.svg** - Large SVG (1000x800) with 16 rectangles

### Dimension Tests
- **test-viewbox.svg** - SVG with only viewBox attribute (no width/height)
- **test-mixed-units.svg** - SVG with mixed units (px and unitless)
- **test-edge-coordinates.svg** - Rectangles at exact edge coordinates (0,0 and boundaries)

### Group Tests
- **test-groups.svg** - Rectangles inside `<g>` groups
- **test-nested-groups.svg** - Nested groups with rectangles

### Fill Color Tests
- **test-style-fill.svg** - Rectangles with fill in style attribute
- **test-no-fill.svg** - Rectangles with fill="none" and fill="transparent"

### Issue Detection Tests
- **test-out-of-bounds.svg** - Multiple OUT_OF_BOUNDS scenarios:
  - Rectangle extending beyond right edge
  - Rectangle extending beyond bottom edge
  - Rectangle with negative x coordinate
  - Rectangle with negative y coordinate
- **test-partial-out-of-bounds.svg** - Rectangles partially out of bounds

### Coverage Tests
- **test-coverage.svg** - Nested rectangles for coverage ratio calculation

### Edge Cases
- **test-empty.svg** - Empty SVG with no rectangles (should trigger EMPTY issue)

## Usage

These files can be used to:
1. Test the SVG parser's ability to handle different formats
2. Verify OUT_OF_BOUNDS detection
3. Test coverage ratio calculations
4. Validate canvas rendering with various scenarios
5. Test error handling for edge cases

