/**
 * Base class for all interactions
 */
class Interaction {
  /**
   * @param {Object} config - Configuration for the interaction
   */
  constructor(config) {
    this.type = config.type;
    this.description = config.description || '';
  }
  
  /**
   * Get the type of interaction
   * @returns {string} The interaction type
   */
  getType() {
    return this.type;
  }
  
  /**
   * Validates user input against the expected answer
   * @param {*} userInput - The user's input
   * @returns {boolean} Whether the input is correct
   */
  validateInput(userInput) {
    // To be overridden by subclasses
    return false;
  }
}

/**
 * Represents a text input interaction
 */
class TextInputInteraction extends Interaction {
  /**
   * @param {Object} config - Configuration for the text input
   */
  constructor(config) {
    super({...config, type: 'text-input'});
    this.correctAnswers = config.correctAnswers || {};
  }
  
  /**
   * @inheritdoc
   */
  validateInput(userInput) {
    const position = userInput.position;
    const value = userInput.value;
    
    if (!position || !value) return false;
    
    const expectedValue = this.correctAnswers[position];
    return value === expectedValue;
  }
}

/**
 * Represents a click/tap interaction
 */
class ClickTapInteraction extends Interaction {
  /**
   * @param {Object} config - Configuration for the click/tap
   */
  constructor(config) {
    super({...config, type: 'click-tap'});
    this.targetElement = config.targetElement;
    this.correctAnswer = config.correctAnswer;
  }
  
  /**
   * @inheritdoc
   */
  validateInput(userInput) {
    return userInput === this.correctAnswer;
  }
}

/**
 * Represents a drag and drop interaction
 */
class DragDropInteraction extends Interaction {
  /**
   * @param {Object} config - Configuration for the drag/drop
   */
  constructor(config) {
    super({...config, type: 'drag-drop'});
    this.object = config.object;
    this.targetDirection = config.targetDirection;
  }
  
  /**
   * @inheritdoc
   */
  validateInput(userInput) {
    return userInput === this.targetDirection;
  }
}

/**
 * Represents a binary choice (yes/no, true/false) interaction
 */
class BinaryChoiceInteraction extends Interaction {
  /**
   * @param {Object} config - Configuration for the binary choice
   */
  constructor(config) {
    super({...config, type: 'binary-choice'});
    this.options = config.options;
    this.correctAnswer = config.correctAnswer;
  }
  
  /**
   * @inheritdoc
   */
  validateInput(userInput) {
    return userInput === this.correctAnswer;
  }
}

/**
 * Represents a multiple choice question interaction
 */
class MCQInteraction extends Interaction {
  /**
   * @param {Object} config - Configuration for the MCQ
   */
  constructor(config) {
    super({...config, type: 'mcq'});
    this.options = config.options;
    this.correctAnswer = config.correctAnswer;
  }
  
  /**
   * @inheritdoc
   */
  validateInput(userInput) {
    return userInput === this.correctAnswer;
  }
}

export {
  Interaction,
  TextInputInteraction,
  ClickTapInteraction,
  DragDropInteraction,
  BinaryChoiceInteraction,
  MCQInteraction
}; 