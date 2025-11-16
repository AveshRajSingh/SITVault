/**
 * Retry helper for MongoDB WriteConflict errors (code 112)
 * This is a transient error that should be retried
 * 
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 5)
 * @param {number} delayMs - Delay between retries in milliseconds (default: 100)
 * @returns {Promise} - Result of the operation
 */
const retryOnWriteConflict = async (operation, maxRetries = 5, delayMs = 100) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Execute the operation
      return await operation();
    } catch (error) {
      // Check if it's a WriteConflict error
      if (error.code === 112 || error.codeName === 'WriteConflict') {
        attempt++;
        console.warn(`WriteConflict detected. Retrying... (Attempt ${attempt}/${maxRetries})`);
        
        if (attempt >= maxRetries) {
          throw new Error(`Failed after ${maxRetries} retries due to WriteConflict`);
        }
        
        // Optional: exponential backoff
        const delay = delayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // For non-WriteConflict errors, throw immediately
        throw error;
      }
    }
  }
};

export default retryOnWriteConflict;
