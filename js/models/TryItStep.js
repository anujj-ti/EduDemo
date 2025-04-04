import LessonStep from './LessonStep.js';

/**
 * Represents a try-it step in the lesson
 */
class TryItStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the try-it step
   */
  constructor(config) {
    super(config);
    this.screens = config.screens || [];
    this.currentScreenIndex = 0;
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "try-it";
  }
  
  /**
   * Get the current screen
   * @returns {Object} The current screen
   */
  getCurrentScreen() {
    return this.screens[this.currentScreenIndex];
  }
  
  /**
   * Get the current screen ID
   * @returns {string} The current screen ID
   */
  getCurrentScreenId() {
    const screen = this.getCurrentScreen();
    return screen.id;
  }
  
  /**
   * Get the current screen title
   * @returns {string} The current screen title
   */
  getCurrentScreenTitle() {
    const screen = this.getCurrentScreen();
    return screen.title;
  }
  
  /**
   * Move to the next screen
   * @returns {boolean} Whether there was a next screen
   */
  nextScreen() {
    if (this.currentScreenIndex < this.screens.length - 1) {
      this.currentScreenIndex++;
      return true;
    }
    return false;
  }
  
  /**
   * Move to the previous screen
   * @returns {boolean} Whether there was a previous screen
   */
  previousScreen() {
    if (this.currentScreenIndex > 0) {
      this.currentScreenIndex--;
      return true;
    }
    return false;
  }
  
  /**
   * Check if this is the first screen
   * @returns {boolean} Whether this is the first screen
   */
  isFirstScreen() {
    return this.currentScreenIndex === 0;
  }
  
  /**
   * Check if this is the last screen
   * @returns {boolean} Whether this is the last screen
   */
  isLastScreen() {
    return this.currentScreenIndex === this.screens.length - 1;
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    if (!this.screens || this.screens.length === 0) {
      throw new Error('TryItStep must have at least one screen');
    }
    return true;
  }
}

export default TryItStep; 