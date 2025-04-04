import LessonStep from './LessonStep.js';

/**
 * Represents a learn-it step in the lesson
 */
class LearnItStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the learn-it step
   */
  constructor(config) {
    super(config);
    this.chunks = config.chunks || [];
    this.currentChunkIndex = 0;
    
    // Set initial properties from the first chunk
    if (this.chunks.length > 0) {
      this.currentChunk = this.chunks[0];
      this.screen = this.currentChunk.screen;
      this.vocabulary = this.currentChunk.vocabulary;
      this.interaction = this.currentChunk.interaction;
      this.feedback = this.currentChunk.feedback;
      this.characterPrompt = this.currentChunk.characterPrompt;
    } else {
      throw new Error('LearnItStep must have at least one chunk');
    }
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "learn-it";
  }
  
  /**
   * Returns the subtype of the learn-it step
   * @returns {string} The subtype
   */
  getSubType() {
    return this.currentChunk.id;
  }
  
  /**
   * Returns the current chunk
   * @returns {Object} The current chunk
   */
  getCurrentChunk() {
    return this.currentChunk;
  }
  
  /**
   * Gets the current chunk title
   * @returns {string} The current chunk title
   */
  getCurrentTitle() {
    return this.currentChunk.title;
  }
  
  /**
   * Moves to the next chunk
   * @returns {boolean} Whether there was a next chunk to move to
   */
  nextChunk() {
    if (this.currentChunkIndex < this.chunks.length - 1) {
      this.currentChunkIndex++;
      this.currentChunk = this.chunks[this.currentChunkIndex];
      this.screen = this.currentChunk.screen;
      this.vocabulary = this.currentChunk.vocabulary;
      this.interaction = this.currentChunk.interaction;
      this.feedback = this.currentChunk.feedback;
      this.characterPrompt = this.currentChunk.characterPrompt;
      return true;
    }
    return false;
  }
  
  /**
   * Moves to the previous chunk
   * @returns {boolean} Whether there was a previous chunk to move to
   */
  previousChunk() {
    if (this.currentChunkIndex > 0) {
      this.currentChunkIndex--;
      this.currentChunk = this.chunks[this.currentChunkIndex];
      this.screen = this.currentChunk.screen;
      this.vocabulary = this.currentChunk.vocabulary;
      this.interaction = this.currentChunk.interaction;
      this.feedback = this.currentChunk.feedback;
      this.characterPrompt = this.currentChunk.characterPrompt;
      return true;
    }
    return false;
  }
  
  /**
   * Checks if we're at the first chunk
   * @returns {boolean} Whether we're at the first chunk
   */
  isFirstChunk() {
    return this.currentChunkIndex === 0;
  }
  
  /**
   * Checks if we're at the last chunk
   * @returns {boolean} Whether we're at the last chunk
   */
  isLastChunk() {
    return this.currentChunkIndex === this.chunks.length - 1;
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    
    if (this.chunks.length === 0) {
      throw new Error('LearnItStep must have at least one chunk');
    }
    
    if (!this.chunks[0].screen) {
      throw new Error('First chunk in LearnItStep must have a screen configuration');
    }
    
    return true;
  }
}

export default LearnItStep; 