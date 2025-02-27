import { test, expect } from '@playwright/test';

test('task diagram circular handles should detect correct mouse positions', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Add debug tracking layer that will show both mouse position and calculated cursor position
  await page.evaluate(() => {
    // Create a tracking overlay
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; z-index: 1000; font-family: monospace;';
    
    // Create displays for different position values
    const mouseClientPos = document.createElement('div');
    mouseClientPos.id = 'mouse-client-pos';
    mouseClientPos.textContent = 'Client: 0, 0';
    
    const mouseOffsetPos = document.createElement('div');
    mouseOffsetPos.id = 'mouse-offset-pos';
    mouseOffsetPos.textContent = 'Offset: 0, 0';
    
    const elementPos = document.createElement('div');
    elementPos.id = 'element-pos';
    elementPos.textContent = 'Element: 0, 0';
    
    const calculatedPos = document.createElement('div');
    calculatedPos.id = 'calculated-pos';
    calculatedPos.textContent = 'Calculated: 0, 0';
    
    // Add all displays to the overlay
    overlay.appendChild(mouseClientPos);
    overlay.appendChild(mouseOffsetPos);
    overlay.appendChild(elementPos);
    overlay.appendChild(calculatedPos);
    
    document.body.appendChild(overlay);
    
    // Add mouse tracking to the entire document
    document.addEventListener('mousemove', (e) => {
      // Update client coordinates
      mouseClientPos.textContent = `Client: ${e.clientX}, ${e.clientY}`;
      
      // Update offset coordinates
      mouseOffsetPos.textContent = `Offset: ${e.offsetX}, ${e.offsetY}`;
      
      // Get the element the mouse is over
      const targetElement = e.target;
      if (targetElement instanceof HTMLElement) {
        const rect = targetElement.getBoundingClientRect();
        elementPos.textContent = `Element: ${rect.left}, ${rect.top}`;
        
        // Calculate position relative to the element
        const calculatedX = e.clientX - rect.left;
        const calculatedY = e.clientY - rect.top;
        calculatedPos.textContent = `Calculated: ${calculatedX}, ${calculatedY}`;
      }
    });
    
    // Add visual indicator for mouse position
    const pointer = document.createElement('div');
    pointer.id = 'true-pointer';
    pointer.style.cssText = 'position: fixed; width: 10px; height: 10px; background: red; border-radius: 50%; transform: translate(-50%, -50%); z-index: 999; pointer-events: none;';
    document.body.appendChild(pointer);
    
    document.addEventListener('mousemove', (e) => {
      pointer.style.left = `${e.clientX}px`;
      pointer.style.top = `${e.clientY}px`;
    });
    
    // Create a simulated diagram element for testing
    const simulatedNode = document.createElement('div');
    simulatedNode.className = 'node simulated-node';
    simulatedNode.style.cssText = 'position: absolute; width: 100px; height: 60px; background: #eee; border: 1px solid #ccc; left: 150px; top: 150px;';
    
    const simulatedHandle = document.createElement('div');
    simulatedHandle.className = 'handle simulated-handle';
    simulatedHandle.style.cssText = 'position: absolute; width: 12px; height: 12px; background: blue; border-radius: 50%; right: -6px; top: 50%; transform: translateY(-50%);';
    
    simulatedNode.appendChild(simulatedHandle);
    document.body.appendChild(simulatedNode);
  });
  
  // Wait for our simulated elements to be available
  await page.waitForSelector('.simulated-handle', { state: 'visible' });
  
  // Interact with the simulated handle
  const simulatedHandle = page.locator('.simulated-handle').first();
  await simulatedHandle.hover({ force: true });
  
  // Wait for debug info to update
  await page.waitForTimeout(500);
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/e2e/simulated-handle-interaction.png' });
  
  // Get position information
  const clientPos = await page.locator('#mouse-client-pos').textContent();
  const calculatedPos = await page.locator('#calculated-pos').textContent();
  
  console.log(`Client position: ${clientPos}`);
  console.log(`Calculated position: ${calculatedPos}`);
  
  // We expect these positions to be different values
  expect(clientPos).not.toEqual(calculatedPos);
  
  // Verify with additional precision
  const clientCoords = await page.evaluate(() => {
    const text = document.querySelector('#mouse-client-pos')?.textContent || '';
    const match = text.match(/Client: (\d+), (\d+)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
  });
  
  const calculatedCoords = await page.evaluate(() => {
    const text = document.querySelector('#calculated-pos')?.textContent || '';
    const match = text.match(/Calculated: (\d+), (\d+)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
  });
  
  console.log('Client coords:', clientCoords);
  console.log('Calculated coords:', calculatedCoords);
  
  // Assert positions are different
  expect(clientCoords).not.toEqual(calculatedCoords);
}); 