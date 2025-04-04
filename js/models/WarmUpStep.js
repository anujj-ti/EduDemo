import LessonStep from './LessonStep.js';

/**
 * Represents a warm-up step in the lesson
 */
class WarmUpStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the warm-up step
   */
  constructor(config) {
    super(config);
    this.screen = config.screen;
    this.interaction = config.interaction;
    this.feedback = config.feedback;
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "warm-up";
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    if (!this.screen) throw new Error('WarmUpStep must have a screen configuration');
    if (!this.interaction) throw new Error('WarmUpStep must have an interaction');
    return true;
  }
}

export default WarmUpStep; 