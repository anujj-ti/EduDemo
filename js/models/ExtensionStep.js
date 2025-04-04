import LessonStep from './LessonStep.js';

/**
 * Represents an extension (optional additional content) step in the lesson
 */
class ExtensionStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the extension step
   */
  constructor(config) {
    super(config);
    this.screen = config.screen;
    this.interaction = config.interaction || "none";
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "extension";
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    if (!this.screen) throw new Error('ExtensionStep must have a screen configuration');
    return true;
  }
}

export default ExtensionStep; 