/**
 * Base class for all lesson steps
 * Provides common structure and functionality
 */
class LessonStep {
  /**
   * @param {Object} config - Configuration for the step
   */
  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.goal = config.goal;
    this.characterPrompt = config.characterPrompt || '';
    this.transition = config.transition || '';
    this.vocabulary = config.vocabulary || [];
    
    // Validate required fields
    if (!this.id) throw new Error('Step must have an ID');
    if (!this.title) throw new Error('Step must have a title');
  }

  /**
   * Returns the type of this step
   * @returns {string} The step type
   */
  getType() {
    return "base";
  }
  
  /**
   * Validates that the step has all required properties
   * @returns {boolean} True if the step is valid
   * @throws {Error} If the step is invalid
   */
  validate() {
    return true;
  }
}

export default LessonStep; 