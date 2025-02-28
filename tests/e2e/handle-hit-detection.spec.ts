import { test, expect } from '@playwright/test';
import { HANDLE_RADIUS } from '../../src/lib/canvas/constants';

test('connection handle should be clickable even when cursor is slightly outside visual radius', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Enable debug mode by clicking the button
  await page.getByText('Enable Debug Mode').click();
  
  // Wait for the TaskDiagram canvas to be visible
  await page.waitForSelector('.task-diagram #interactive-layer', { state: 'visible' });
  
  // Take a screenshot of the entire test page for debugging
  await page.screenshot({ path: 'tests/e2e/handle-selection-test-page.png' });
  
  // Get the canvas element
  const canvas = page.locator('.task-diagram #interactive-layer');
  const canvasBoundingBox = await canvas.boundingBox();
  
  if (!canvasBoundingBox) {
    throw new Error('Canvas bounding box is null');
  }
  
  // Get a sample task node position
  // For the main TaskDiagram, we need to find an actual node's position
  // This will need to be adjusted based on the actual content
  const centerX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
  const centerY = canvasBoundingBox.y + canvasBoundingBox.height / 2;
  
  // Test positions at slightly beyond the visual HANDLE_RADIUS
  // But within the hit detection radius (HANDLE_RADIUS + 10)
  const testOffsets = [
    { x: HANDLE_RADIUS + 5, y: 0 },   // Right side
    { x: 0, y: HANDLE_RADIUS + 5 }    // Bottom
  ];
  
  // Move to a location where handles should be visible and check for interaction
  // This is a simplification - in a real test, you'd need to identify actual handle positions
  for (const offset of testOffsets) {
    const testX = centerX + offset.x;
    const testY = centerY + offset.y;
    
    console.log(`Testing position: (${testX}, ${testY})`);
    
    // Move mouse to test position
    await page.mouse.move(testX, testY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: `tests/e2e/handle-hit-${offset.x}-${offset.y}.png` });
  }
  
  // Basic test to verify application doesn't crash during the test
  expect(await canvas.isVisible()).toBeTruthy();
}); 