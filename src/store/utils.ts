import { Dependency, TaskState } from './types';

/**
 * Check if a dependency already exists in the state
 * @param state - Current state
 * @param from - Source task ID
 * @param to - Target task ID
 * @returns True if the dependency exists, false otherwise
 */
export function dependencyExists(state: TaskState, from: string, to: string): boolean {
  return state.dependencies.some(dep => dep.from === from && dep.to === to);
}

/**
 * Create a state updater function that merges partial updates with existing state
 * This preserves TypeScript typing while allowing partial updates
 * @param updates - Partial updates to apply to the state
 * @returns The updated state
 */
export function updateState<T>(state: T, updates: Partial<T>): T {
  return {
    ...state,
    ...updates
  };
}

/**
 * Add an item to an array in state
 * @param state - Current state
 * @param arrayKey - Key of the array in state
 * @param item - Item to add to the array
 * @returns Updated state with the item added to the array
 */
export function addToStateArray<T, K extends keyof T, I>(
  state: T,
  arrayKey: K,
  item: I
): T {
  // We need to ensure the property is actually an array
  if (!Array.isArray(state[arrayKey])) {
    throw new Error(`Property ${String(arrayKey)} is not an array`);
  }

  // Get the current array
  const currentArray = state[arrayKey] as unknown as I[];
  
  // Create the update object with the new array
  const update = {
    [arrayKey]: [...currentArray, item]
  } as Partial<T>;
  
  // Return the updated state
  return updateState(state, update);
} 