import { test, expect } from '@playwright/test';

test('mouse pointer coordinates should differ from cursor position', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Create an element where we'll track cursor and mouse positions
  await page.evaluate(() => {
    const trackingDiv = document.createElement('div');
    trackingDiv.id = 'tracking-container';
    trackingDiv.style.cssText = 'width: 400px; height: 300px; border: 1px solid black; position: relative; margin: 50px;';
    
    const cursorDisplay = document.createElement('div');
    cursorDisplay.id = 'cursor-position';
    cursorDisplay.style.cssText = 'position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px;';
    
    const mouseDisplay = document.createElement('div');
    mouseDisplay.id = 'mouse-position';
    mouseDisplay.style.cssText = 'position: absolute; top: 40px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px;';
    
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    cursor.style.cssText = 'position: absolute; width: 10px; height: 10px; background: red; border-radius: 50%; transform: translate(-50%, -50%);';
    
    trackingDiv.appendChild(cursorDisplay);
    trackingDiv.appendChild(mouseDisplay);
    trackingDiv.appendChild(cursor);
    
    document.body.appendChild(trackingDiv);
    
    // Track mouse movement
    trackingDiv.addEventListener('mousemove', (e) => {
      const rect = trackingDiv.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      mouseDisplay.textContent = `Mouse: ${Math.round(mouseX)}, ${Math.round(mouseY)}`;
      
      // Set cursor position with an offset to simulate the issue
      const cursorX = mouseX + 10;
      const cursorY = mouseY + 10;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      cursorDisplay.textContent = `Cursor: ${Math.round(cursorX)}, ${Math.round(cursorY)}`;
    });
  });
  
  // Move the mouse to the tracking container
  const trackingContainer = page.locator('#tracking-container');
  await trackingContainer.hover({ position: { x: 100, y: 100 } });
  
  // Wait a moment for the display to update
  await page.waitForTimeout(500);
  
  // Get the displayed positions
  const mousePosition = await page.locator('#mouse-position').textContent();
  const cursorPosition = await page.locator('#cursor-position').textContent();
  
  console.log(`Mouse position: ${mousePosition}`);
  console.log(`Cursor position: ${cursorPosition}`);
  
  // Expect them to be different
  expect(mousePosition).not.toEqual(cursorPosition);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'tests/e2e/mouse-vs-cursor.png' });
  
  // Get exact coordinates and verify the difference
  const mouseCoords = await page.evaluate(() => {
    const mouseText = document.querySelector('#mouse-position')?.textContent || '';
    const match = mouseText.match(/Mouse: (\d+), (\d+)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
  });
  
  const cursorCoords = await page.evaluate(() => {
    const cursorText = document.querySelector('#cursor-position')?.textContent || '';
    const match = cursorText.match(/Cursor: (\d+), (\d+)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
  });
  
  console.log('Mouse coordinates:', mouseCoords);
  console.log('Cursor coordinates:', cursorCoords);
  
  // Verify the coordinates are different
  expect(mouseCoords).not.toEqual(cursorCoords);
  expect(mouseCoords?.x).not.toEqual(cursorCoords?.x);
  expect(mouseCoords?.y).not.toEqual(cursorCoords?.y);
}); 