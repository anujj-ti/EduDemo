import StepFactory from '../factories/StepFactory.js';

/**
 * Manages the overall lesson flow, step navigation, and state
 */
class LessonManager {
  /**
   * @param {Array} stepConfigs - Array of step configurations
   * @param {Object} options - Options for the lesson manager
   */
  constructor(stepConfigs, options = {}) {
    this.stepConfigs = stepConfigs;
    this.steps = [];
    this.currentStepIndex = 0;
    this.callbacks = {
      onStepChange: options.onStepChange || (() => {}),
      onStepComplete: options.onStepComplete || (() => {}),
      onLessonComplete: options.onLessonComplete || (() => {})
    };
    this.initialized = false;
  }
  
  /**
   * Initializes the lesson by creating step instances
   */
  initialize() {
    try {
      // Create step instances using factory
      this.steps = this.stepConfigs.map(config => StepFactory.createStep(config));
      
      // Set initial step
      this.currentStepIndex = 0;
      this.initialized = true;
      
      // Notify of initial step
      this.notifyStepChange();
      
      console.log(`Lesson initialized with ${this.steps.length} steps`);
      return true;
    } catch (error) {
      console.error('Failed to initialize lesson:', error);
      return false;
    }
  }
  
  /**
   * Gets the current step
   * @returns {Object} The current step instance
   */
  getCurrentStep() {
    if (!this.initialized || this.steps.length === 0) {
      throw new Error('Lesson not initialized or no steps available');
    }
    return this.steps[this.currentStepIndex];
  }
  
  /**
   * Advances to the next step
   * @returns {boolean} Whether there was a next step to move to
   */
  nextStep() {
    if (!this.initialized) return false;
    
    const currentStep = this.getCurrentStep();
    
    // Handle different step types
    if (currentStep.getType() === 'learn-it' && 
        typeof currentStep.nextChunk === 'function' && 
        currentStep.nextChunk()) {
      // If the learn-it step has more chunks, move to next chunk
      this.notifyStepChange();
      return true;
    } else if (currentStep.getType() === 'try-it' && 
        typeof currentStep.nextScreen === 'function' && 
        currentStep.nextScreen()) {
      // If the try-it step has more screens, move to next screen
      this.notifyStepChange();
      return true;
    } else if ((currentStep.getType() === 'do-it' || currentStep.getType() === 'show-it') && 
              typeof currentStep.nextProblem === 'function' && 
              currentStep.nextProblem()) {
      // If the do-it or show-it step has more problems, move to next problem
      this.notifyStepChange();
      return true;
    } else if (this.currentStepIndex < this.steps.length - 1) {
      // Otherwise move to the next main step
      this.currentStepIndex++;
      this.notifyStepChange();
      return true;
    } else {
      // Lesson complete
      this.callbacks.onLessonComplete();
      return false;
    }
  }
  
  /**
   * Goes back to the previous step
   * @returns {boolean} Whether there was a previous step to move to
   */
  previousStep() {
    if (!this.initialized) return false;
    
    const currentStep = this.getCurrentStep();
    
    // Handle different step types
    if (currentStep.getType() === 'learn-it' && 
        typeof currentStep.previousChunk === 'function' && 
        currentStep.previousChunk()) {
      // If the learn-it step has previous chunks, move to previous chunk
      this.notifyStepChange();
      return true;
    } else if (currentStep.getType() === 'try-it' && 
        typeof currentStep.previousScreen === 'function' && 
        currentStep.previousScreen()) {
      // If the try-it step has previous screens, move to previous screen
      this.notifyStepChange();
      return true;
    } else if ((currentStep.getType() === 'do-it' || currentStep.getType() === 'show-it') && 
              typeof currentStep.previousProblem === 'function' && 
              currentStep.previousProblem()) {
      // If the do-it or show-it step has previous problems, move to previous problem
      this.notifyStepChange();
      return true;
    } else if (this.currentStepIndex > 0) {
      // Otherwise move to the previous main step
      this.currentStepIndex--;
      
      const prevStep = this.getCurrentStep();
      
      // Reset multi-content steps to their last content
      if (prevStep.getType() === 'learn-it' && prevStep.chunks && prevStep.chunks.length > 0) {
        prevStep.currentChunkIndex = prevStep.chunks.length - 1;
        prevStep.currentChunk = prevStep.chunks[prevStep.currentChunkIndex];
        prevStep.screen = prevStep.currentChunk.screen;
        prevStep.vocabulary = prevStep.currentChunk.vocabulary;
        prevStep.interaction = prevStep.currentChunk.interaction;
        prevStep.feedback = prevStep.currentChunk.feedback;
        prevStep.characterPrompt = prevStep.currentChunk.characterPrompt;
      } else if (prevStep.getType() === 'try-it' && prevStep.screens && prevStep.screens.length > 0) {
        prevStep.currentScreenIndex = prevStep.screens.length - 1;
      } else if ((prevStep.getType() === 'do-it' || prevStep.getType() === 'show-it') && 
                prevStep.problems && prevStep.problems.length > 0) {
        prevStep.currentProblemIndex = prevStep.problems.length - 1;
      }
      
      this.notifyStepChange();
      return true;
    } else {
      // At the beginning
      return false;
    }
  }
  
  /**
   * Checks if we're at the first step
   * @returns {boolean} Whether we're at the beginning
   */
  isFirstStep() {
    if (!this.initialized) return true;
    
    const currentStep = this.getCurrentStep();
    
    if (this.currentStepIndex === 0) {
      if (currentStep.getType() === 'learn-it' && !currentStep.isFirstChunk()) {
        return false;
      } else if (currentStep.getType() === 'try-it' && currentStep.currentScreenIndex > 0) {
        return false;
      } else if ((currentStep.getType() === 'do-it' || currentStep.getType() === 'show-it') && 
                currentStep.currentProblemIndex > 0) {
        return false;
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Checks if we're at the last step
   * @returns {boolean} Whether we're at the end
   */
  isLastStep() {
    if (!this.initialized) return false;
    
    const currentStep = this.getCurrentStep();
    const lastStepIndex = this.steps.length - 1;
    
    if (this.currentStepIndex === lastStepIndex) {
      if (currentStep.getType() === 'learn-it' && !currentStep.isLastChunk()) {
        return false;
      } else if (currentStep.getType() === 'try-it' && 
          currentStep.currentScreenIndex < currentStep.screens.length - 1) {
        return false;
      } else if ((currentStep.getType() === 'do-it' || currentStep.getType() === 'show-it') && 
                currentStep.currentProblemIndex < currentStep.problems.length - 1) {
        return false;
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Notifies listeners that the step has changed
   */
  notifyStepChange() {
    if (!this.initialized) return;
    
    const currentStep = this.getCurrentStep();
    this.callbacks.onStepChange(currentStep);
  }
}

export default LessonManager; 