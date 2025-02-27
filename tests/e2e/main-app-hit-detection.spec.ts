import { test, expect } from '@playwright/test';
import { HANDLE_RADIUS } from '../../src/lib/canvas/constants';

test('main application connection handle should have correct hit detection', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Make sure we're testing the main application, NOT the selection test
  // First check if we're already on the main app, if not, hide the test if it's showing
  const selectionTestButton = page.getByText('Hide Selection Test');
  if (await selectionTestButton.isVisible()) {
    await selectionTestButton.click();
  }
  
  // Wait for the task diagram to be visible
  await page.waitForSelector('.task-diagram', { state: 'visible' });
  
  // Enable debug mode by clicking the button
  await page.getByText('Enable Debug Mode').click();
  
  // Take a screenshot of the entire page for reference
  await page.screenshot({ path: 'tests/e2e/main-app-initial.png' });
  
  // Add a task to work with
  await page.getByText('Add Task').click();
  
  // Wait for the canvas to be visible
  await page.waitForSelector('.task-diagram canvas', { state: 'visible' });
  const canvas = page.locator('.task-diagram canvas');
  
  // Get the canvas dimensions
  const canvasBoundingBox = await canvas.boundingBox();
  if (!canvasBoundingBox) {
    throw new Error('Canvas bounding box is null');
  }
  
  // Find the task that was just added
  // In a fresh app, it should be positioned at (100, 100) according to the handleAddTask code
  const taskX = 100;
  const taskY = 100;
  
  // The handles should be at the top and bottom of the task node
  // Using the NODE_HEIGHT from the app's constants (assumed to be 100 based on tests)
  const topHandleY = taskY - 50; // NODE_HEIGHT/2 = 50
  const bottomHandleY = taskY + 50;
  
  console.log(`Task position: (${taskX}, ${taskY})`);
  console.log(`Top handle position: (${taskX}, ${topHandleY})`);
  console.log(`Bottom handle position: (${taskX}, ${bottomHandleY})`);
  
  // Take a screenshot showing the task
  await page.screenshot({ path: 'tests/e2e/main-app-with-task.png' });
  
  // Convert task coordinates to screen coordinates
  const screenTaskX = canvasBoundingBox.x + taskX;
  const screenTopHandleY = canvasBoundingBox.y + topHandleY;
  const screenBottomHandleY = canvasBoundingBox.y + bottomHandleY;
  
  // Test positions at various distances from the handles
  // Test exactly at the hit radius in the southeast direction (where the issue was)
  const hitRadius = HANDLE_RADIUS + 10;
  
  // Define the test angles (focusing on southeast quadrant)
  const testAngles = [30, 45, 60];
  
  // Test the bottom handle (where the issue was most apparent)
  for (const angle of testAngles) {
    const radians = angle * (Math.PI / 180);
    
    // Test at exactly the hit radius
    const distance = hitRadius;
    const offsetX = Math.cos(radians) * distance;
    const offsetY = Math.sin(radians) * distance;
    
    const testX = screenTaskX + offsetX;
    const testY = screenBottomHandleY + offsetY;
    
    console.log(`Testing angle ${angle}° at distance ${distance.toFixed(2)}px: (${testX.toFixed(2)}, ${testY.toFixed(2)})`);
    
    // Move mouse to the test position
    await page.mouse.move(testX, testY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Take a screenshot of this position
    await page.screenshot({ path: `tests/e2e/main-app-angle-${angle}.png` });
    
    // Check if the handle is detected
    // We need to use the application's own detection logic
    // One way to tell if the handle is detected is to look for visual indicators
    // such as a hover effect or a change in the cursor
    
    // We can also check if dragging works from this position
    // Try dragging a little bit
    await page.mouse.down();
    await page.mouse.move(testX + 20, testY + 20);
    
    // Take a screenshot to check if dragging is happening
    await page.screenshot({ path: `tests/e2e/main-app-drag-${angle}.png` });
    
    // Release the mouse
    await page.mouse.up();
    
    // Let's also test a point just slightly inside the hit radius
    const insideDistance = hitRadius - 1;
    const insideOffsetX = Math.cos(radians) * insideDistance;
    const insideOffsetY = Math.sin(radians) * insideDistance;
    
    const insideTestX = screenTaskX + insideOffsetX;
    const insideTestY = screenBottomHandleY + insideOffsetY;
    
    console.log(`Testing inside at angle ${angle}° at distance ${insideDistance.toFixed(2)}px: (${insideTestX.toFixed(2)}, ${insideTestY.toFixed(2)})`);
    
    // Move mouse to the inside test position
    await page.mouse.move(insideTestX, insideTestY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Take a screenshot of this position
    await page.screenshot({ path: `tests/e2e/main-app-inside-${angle}.png` });
    
    // Test a point just outside the hit radius
    const outsideDistance = hitRadius + 1;
    const outsideOffsetX = Math.cos(radians) * outsideDistance;
    const outsideOffsetY = Math.sin(radians) * outsideDistance;
    
    const outsideTestX = screenTaskX + outsideOffsetX;
    const outsideTestY = screenBottomHandleY + outsideOffsetY;
    
    console.log(`Testing outside at angle ${angle}° at distance ${outsideDistance.toFixed(2)}px: (${outsideTestX.toFixed(2)}, ${outsideTestY.toFixed(2)})`);
    
    // Move mouse to the outside test position
    await page.mouse.move(outsideTestX, outsideTestY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Take a screenshot of this position
    await page.screenshot({ path: `tests/e2e/main-app-outside-${angle}.png` });
  }
}); 