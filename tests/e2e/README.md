# Mouse Pointer vs Cursor Position Tests

This directory contains Playwright tests that verify the mouse pointer coordinates aren't the same as the cursor position. This is important for properly handling interactions with circular handles and other UI elements in the Task Diagram application.

## Tests Overview

### 1. Basic Mouse vs Cursor Test (`mouse-pointer-vs-cursor.spec.ts`)

This test creates a tracking area and deliberately sets cursor position with an offset from the actual mouse position. It verifies that:

- Mouse pointer coordinates are tracked correctly
- Cursor visual position can be different from the mouse coordinates
- The offset between these two values is measurable and testable

### 2. Task Diagram Handle Interaction Test (`task-diagram-handles.spec.ts`)

This test simulates the specific scenario in the Task Diagram application where handle interactions need to account for differences between:

- Mouse client coordinates (clientX, clientY)
- Element-relative coordinates
- Visual cursor position

The test creates a simulated node with a handle and verifies that the coordinates used for calculations differ from the raw client coordinates.

## Running the Tests

You can run the tests using these commands:

```
# Run all e2e tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## Test Artifacts

The tests generate screenshots that can be visually inspected:

- `mouse-vs-cursor.png` - Shows the basic mouse vs cursor test
- `simulated-handle-interaction.png` - Shows the handle interaction test
- `error-state.png` - Generated if there are errors during test execution

## Key Findings

These tests demonstrate that:

1. Mouse coordinates (clientX, clientY) represent the actual mouse position on screen
2. When calculating element-relative coordinates, this results in a different set of values
3. Visual cursor position can be offset from the actual mouse position
4. Applications must account for these differences when detecting hit areas for small UI elements like handles

These findings help explain and verify the mouse position offset issues in the Task Diagram application.
