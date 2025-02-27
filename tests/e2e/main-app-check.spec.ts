import { test, expect } from '@playwright/test';

test('main application should be accessible', async ({ page }) => {
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
  
  // Take a screenshot of the entire page for reference
  await page.screenshot({ path: 'tests/e2e/main-app-simple-test.png' });
  
  // Check if the "Add Task" button is visible
  const addTaskButton = page.getByText('Add Task');
  expect(await addTaskButton.isVisible()).toBe(true);
  
  // Click the Add Task button
  await addTaskButton.click();
  
  // Take another screenshot after adding a task
  await page.screenshot({ path: 'tests/e2e/main-app-with-task-simple.png' });
  
  // Success! We can access the main application
  console.log('Successfully accessed the main application and added a task');
}); 