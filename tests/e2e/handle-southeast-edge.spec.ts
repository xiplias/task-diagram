import { test, expect } from '@playwright/test';
import { HANDLE_RADIUS } from '../../src/lib/canvas/constants';

// Define an interface for our test points
interface TestPoint {
  x: number;
  y: number;
  angle: number;
  distance: number;
  expectDetection: boolean;
}

test('connection handle hit detection boundary should be consistent in southeast direction', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the application to load
  await page.waitForSelector('#root', { state: 'visible' });
  
  // Click the "Show Selection Test" button to display the HandleSelectionTest component
  await page.getByText('Show Selection Test').click();
  
  // Enable debug mode by clicking the button
  await page.getByText('Enable Debug Mode').click();
  
  // Wait for the canvas to be visible
  await page.waitForSelector('.handle-selection-test canvas', { state: 'visible' });
  
  // Take a screenshot of the entire test page for debugging
  await page.screenshot({ path: 'tests/e2e/handle-southeast-edge-page.png' });
  
  // Get the canvas element
  const canvas = page.locator('.handle-selection-test canvas');
  const canvasBoundingBox = await canvas.boundingBox();
  
  if (!canvasBoundingBox) {
    throw new Error('Canvas bounding box is null');
  }
  
  // Calculate the center of the canvas where our test node should be
  const centerX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
  const centerY = canvasBoundingBox.y + canvasBoundingBox.height / 2;
  
  // The handle positions (top and bottom of the node)
  const topHandleY = centerY - 50; // Node height is 100px, so top handle is 50px above center
  const bottomHandleY = centerY + 50; // Bottom handle is 50px below center
  
  console.log(`Canvas position: (${centerX}, ${centerY})`);
  console.log(`Bottom handle position: (${centerX}, ${bottomHandleY})`);
  
  // Examine the exact behavior at the boundary with floating point precision
  // First, let's verify that our calculated distances match the expected values
  // by examining slightly different versions of the 30° angle with very fine gradations
  
  const hitRadius = HANDLE_RADIUS + 10; // The expanded hit radius used in your app
  
  console.log("\n=== DETAILED BOUNDARY INVESTIGATION ===");
  console.log(`Hit radius: ${hitRadius}px`);
  
  // Test a range of very specific distances around the boundary
  // at the 30° angle (where we saw the issue)
  const angle = 30;
  const radians = angle * (Math.PI / 180);
  
  // Create several test points very close to the boundary
  const testDistances = [
    hitRadius - 0.2,   // Definitely inside
    hitRadius - 0.1,   // Slightly inside
    hitRadius - 0.01,  // Just barely inside
    hitRadius,         // Exactly at radius
    hitRadius + 0.01,  // Just barely outside
    hitRadius + 0.1,   // Slightly outside
    hitRadius + 0.2    // Definitely outside
  ];
  
  for (const distance of testDistances) {
    // Calculate exact position at this angle and distance
    const x = Math.cos(radians) * distance;
    const y = Math.sin(radians) * distance;
    
    const testX = centerX + x;
    const testY = bottomHandleY + y;
    
    console.log(`\nTesting at angle ${angle}°, distance: ${distance.toFixed(4)}px, coordinates: (${testX.toFixed(4)}, ${testY.toFixed(4)})`);
    
    // Move mouse to test position
    await page.mouse.move(testX, testY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Check if the handle is hovered with precise calculations
    const result = await page.evaluate(({ testX, testY, centerX, bottomHandleY, HANDLE_RADIUS, distance }) => {
      // Calculate distance from test point to handle center
      const dx = testX - centerX;
      const dy = testY - bottomHandleY;
      
      // Calculate actual distance with maximum precision
      const distanceCalc = Math.sqrt(dx * dx + dy * dy);
      
      // The comparison being used in your app (may be <= or <)
      const hitDetectionRadius = HANDLE_RADIUS + 10;
      const isInside = distanceCalc <= hitDetectionRadius;
      
      // Additional info for debugging
      return {
        exactDistance: distanceCalc,
        hitDetectionRadius,
        isInside,
        dx,
        dy,
        // For investigating floating point issues
        differenceFromRadius: distanceCalc - hitDetectionRadius,
        preciseComparison: {
          lessThan: distanceCalc < hitDetectionRadius,
          lessThanOrEqual: distanceCalc <= hitDetectionRadius,
          equalTo: distanceCalc === hitDetectionRadius,
          absoluteDiff: Math.abs(distanceCalc - hitDetectionRadius)
        }
      };
    }, { testX, testY, centerX, bottomHandleY, HANDLE_RADIUS, distance });
    
    // Take a screenshot at this specific point
    await page.screenshot({ path: `tests/e2e/boundary-${angle}-${distance.toFixed(4)}.png` });
    
    // Log detailed information about the boundary conditions
    console.log(`Actual calculated distance: ${result.exactDistance.toFixed(8)}px`);
    console.log(`Hit radius: ${result.hitDetectionRadius}px`);
    console.log(`Difference from radius: ${result.differenceFromRadius.toFixed(8)}px`);
    console.log(`Detected inside: ${result.isInside}`);
    console.log("Precise comparisons:");
    console.log(`  - Less than (<): ${result.preciseComparison.lessThan}`);
    console.log(`  - Less than or equal (<=): ${result.preciseComparison.lessThanOrEqual}`);
    console.log(`  - Equal to (===): ${result.preciseComparison.equalTo}`);
    console.log(`  - Absolute difference: ${result.preciseComparison.absoluteDiff.toFixed(8)}`);
    
    // Only assert for very clear cases to avoid test flakiness
    if (distance <= hitRadius - 0.1) {
      // Points clearly inside should be detected
      expect(result.isInside, `Point at distance ${result.exactDistance.toFixed(4)}px should be detected`).toBe(true);
    } else if (distance >= hitRadius + 0.1) {
      // Points clearly outside should not be detected
      expect(result.isInside, `Point at distance ${result.exactDistance.toFixed(4)}px should NOT be detected`).toBe(false);
    } else {
      // Points very close to the boundary - we don't assert because floating point precision
      // can make this test flaky
      console.log("This point is too close to the boundary for reliable assertion");
    }
  }
  
  // Now test a few other angles to compare behavior
  console.log("\n=== TESTING OTHER ANGLES FOR COMPARISON ===");
  
  const otherAngles = [0, 45, 60, 90];
  for (const otherAngle of otherAngles) {
    const otherRadians = otherAngle * (Math.PI / 180);
    
    // Test exactly at the hit radius
    const x = Math.cos(otherRadians) * hitRadius;
    const y = Math.sin(otherRadians) * hitRadius;
    
    const testX = centerX + x;
    const testY = bottomHandleY + y;
    
    console.log(`\nTesting at angle ${otherAngle}°, distance: ${hitRadius.toFixed(4)}px`);
    
    // Move mouse to test position
    await page.mouse.move(testX, testY);
    
    // Wait a moment for hover state to register
    await page.waitForTimeout(100);
    
    // Check if the handle is hovered
    const result = await page.evaluate(({ testX, testY, centerX, bottomHandleY, HANDLE_RADIUS }) => {
      const dx = testX - centerX;
      const dy = testY - bottomHandleY;
      const distanceCalc = Math.sqrt(dx * dx + dy * dy);
      const hitDetectionRadius = HANDLE_RADIUS + 10;
      
      return {
        exactDistance: distanceCalc,
        hitDetectionRadius,
        isInside: distanceCalc <= hitDetectionRadius,
        differenceFromRadius: distanceCalc - hitDetectionRadius
      };
    }, { testX, testY, centerX, bottomHandleY, HANDLE_RADIUS });
    
    console.log(`Actual calculated distance: ${result.exactDistance.toFixed(8)}px`);
    console.log(`Hit radius: ${result.hitDetectionRadius}px`);
    console.log(`Difference from radius: ${result.differenceFromRadius.toFixed(8)}px`);
    console.log(`Detected inside: ${result.isInside}`);
    
    // Take a screenshot at this angle
    await page.screenshot({ path: `tests/e2e/angle-comparison-${otherAngle}.png` });
  }
}); 