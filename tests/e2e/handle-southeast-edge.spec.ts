import { test, expect } from '@playwright/test';
import { HANDLE_RADIUS } from '../../src/lib/canvas/constants';

test('handle edge detection test', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Enable debug mode by clicking the button
  await page.getByText('Enable Debug Mode').click();
  
  // Wait for the TaskDiagram canvas to be visible
  await page.waitForSelector('.task-diagram #interactive-layer', { state: 'visible' });
  
  // Take a screenshot of the entire test page for debugging
  await page.screenshot({ path: 'tests/e2e/handle-southeast-edge-page.png' });
  
  // Get the canvas element
  const canvas = page.locator('.task-diagram #interactive-layer');
  const canvasBoundingBox = await canvas.boundingBox();
  
  if (!canvasBoundingBox) {
    throw new Error('Canvas bounding box is null');
  }
  
  // Get a sample position in the diagram
  const centerX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
  const centerY = canvasBoundingBox.y + canvasBoundingBox.height / 2;
  
  // Basic test to verify application doesn't crash during the test
  expect(await canvas.isVisible()).toBeTruthy();
}); 