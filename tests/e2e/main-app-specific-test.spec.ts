import { test, expect } from '@playwright/test';
import { HANDLE_RADIUS } from '../../src/lib/canvas/constants';

test('main application hit detection should work correctly in southeast quadrant', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Make sure we're using the main application, not the test harness
  const selectionTestButton = page.getByText('Hide Selection Test');
  if (await selectionTestButton.isVisible()) {
    await selectionTestButton.click();
  }
  
  // Open browser console to view debug logs
  page.on('console', msg => {
    if (msg.text().includes('HANDLE HIT DETECTION DEBUG')) {
      console.log(`[Browser Log] ${msg.text()}`);
    }
  });
  
  // Wait for the task diagram to be visible and add a task
  await page.waitForSelector('.task-diagram', { state: 'visible' });
  
  // Enable debug mode
  await page.getByText('Enable Debug Mode').click();
  
  // Add a task to test with
  await page.getByText('Add Task').click();
  
  // Take a screenshot to see the initial state
  await page.screenshot({ path: 'tests/e2e/southeast-main-app-initial.png' });
  
  // Get the canvas element
  const canvas = page.locator('.task-diagram canvas').first();
  const canvasBoundingBox = await canvas.boundingBox();
  
  if (!canvasBoundingBox) {
    throw new Error('Canvas bounding box is null');
  }
  
  // In the main app, the first task is positioned at (100, 100)
  const taskX = 100;
  const taskY = 100;
  
  // The handles should be at the top and bottom of the task node (assuming 100px height)
  const topHandleY = taskY - 50; 
  const bottomHandleY = taskY + 50;
  
  // Convert to screen coordinates
  const screenTaskX = canvasBoundingBox.x + taskX;
  const screenBottomHandleY = canvasBoundingBox.y + bottomHandleY;
  
  console.log(`Canvas bounds: (${canvasBoundingBox.x}, ${canvasBoundingBox.y}), size: ${canvasBoundingBox.width}x${canvasBoundingBox.height}`);
  console.log(`Task position: (${taskX}, ${taskY})`);
  console.log(`Bottom handle screen position: (${screenTaskX}, ${screenBottomHandleY})`);
  
  // Hit detection radius (HANDLE_RADIUS + 10)
  const hitRadius = HANDLE_RADIUS + 10;
  console.log(`Hit radius: ${hitRadius}px (HANDLE_RADIUS=${HANDLE_RADIUS})`);
  
  // Define test points very precisely at the boundary in the southeast quadrant
  // This is where floating point issues might cause problems
  const testAngles = [30]; // Focus on the 30° angle where issues were observed
  
  // For each angle, test points exactly at, just inside, and just outside the hit radius
  for (const angle of testAngles) {
    const radians = angle * (Math.PI / 180);
    console.log(`\n--- Testing at angle ${angle}° ---`);
    
    // Test a range of distances around the hit boundary
    const testDistances = [
      { name: "well-inside", distance: hitRadius - 0.5 },
      { name: "just-inside", distance: hitRadius - 0.05 },
      { name: "exactly-at", distance: hitRadius },
      { name: "just-outside", distance: hitRadius + 0.05 },
      { name: "well-outside", distance: hitRadius + 0.5 }
    ];
    
    for (const { name, distance } of testDistances) {
      // Calculate exact position for this test point
      const offsetX = Math.cos(radians) * distance;
      const offsetY = Math.sin(radians) * distance;
      
      const testX = screenTaskX + offsetX;
      const testY = screenBottomHandleY + offsetY;
      
      console.log(`Testing ${name} point at distance ${distance.toFixed(5)}px: (${testX.toFixed(2)}, ${testY.toFixed(2)})`);
      
      // Move mouse to the test position very precisely
      await page.mouse.move(testX, testY);
      
      // Wait for hover state to register and debug logs to be printed
      await page.waitForTimeout(300);
      
      // Take a screenshot to show the mouse position and any hover indicators
      await page.screenshot({ path: `tests/e2e/southeast-main-app-${angle}-${name}.png` });
      
      // Try clicking to see if the handle is detected for dragging
      await page.mouse.down();
      await page.waitForTimeout(100);
      
      // Move slightly to see if dragging occurs
      await page.mouse.move(testX + 10, testY + 10);
      await page.waitForTimeout(100);
      
      // Take a screenshot to see if dragging is happening
      await page.screenshot({ path: `tests/e2e/southeast-main-app-${angle}-${name}-drag.png` });
      
      // Release mouse
      await page.mouse.up();
      await page.waitForTimeout(100);
    }
  }
  
  // Run JavaScript in the browser to print relevant debug information
  await page.evaluate(() => {
    console.log('Browser-side debug info:');
    console.log('Window dimensions:', window.innerWidth, window.innerHeight);
    console.log('Canvas elements:', document.querySelectorAll('canvas').length);
    console.log('Canvas scales:', Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height, 
      styleWidth: c.style.width,
      styleHeight: c.style.height,
      clientWidth: c.clientWidth,
      clientHeight: c.clientHeight
    })));
  });
}); 