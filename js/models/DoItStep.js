import LessonStep from './LessonStep.js';

/**
 * Represents a do-it (practice) step in the lesson
 */
class DoItStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the do-it step
   */
  constructor(config) {
    super(config);
    this.format = config.format;
    this.problems = config.problems || [];
    this.variety = config.variety;
    this.instructions = config.instructions;
    this.completion = config.completion;
    this.currentProblemIndex = 0;
    this.score = 0;
    this.answers = new Array(this.problems.length).fill(null);
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "do-it";
  }
  
  /**
   * Get the current problem
   * @returns {Object} The current problem
   */
  getCurrentProblem() {
    return this.problems[this.currentProblemIndex];
  }
  
  /**
   * Get the current problem ID
   * @returns {string} The current problem ID
   */
  getCurrentProblemId() {
    const problem = this.getCurrentProblem();
    return problem.id;
  }
  
  /**
   * Move to the next problem
   * @returns {boolean} Whether there was a next problem
   */
  nextProblem() {
    if (this.currentProblemIndex < this.problems.length - 1) {
      this.currentProblemIndex++;
      return true;
    }
    return false;
  }
  
  /**
   * Move to the previous problem
   * @returns {boolean} Whether there was a previous problem
   */
  previousProblem() {
    if (this.currentProblemIndex > 0) {
      this.currentProblemIndex--;
      return true;
    }
    return false;
  }
  
  /**
   * Check if this is the first problem
   * @returns {boolean} Whether this is the first problem
   */
  isFirstProblem() {
    return this.currentProblemIndex === 0;
  }
  
  /**
   * Check if this is the last problem
   * @returns {boolean} Whether this is the last problem
   */
  isLastProblem() {
    return this.currentProblemIndex === this.problems.length - 1;
  }
  
  /**
   * Record an answer
   * @param {*} answer - The user's answer
   * @returns {boolean} Whether the answer was correct
   */
  recordAnswer(answer) {
    const problem = this.getCurrentProblem();
    const isCorrect = answer === problem.correctAnswer;
    
    this.answers[this.currentProblemIndex] = answer;
    
    if (isCorrect) {
      this.score++;
    }
    
    return isCorrect;
  }
  
  /**
   * Get feedback for the current problem based on answer
   * @param {*} answer - The user's answer
   * @returns {string} The feedback text
   */
  getFeedback(answer) {
    const problem = this.getCurrentProblem();
    const isCorrect = answer === problem.correctAnswer;
    
    if (problem.feedback) {
      return isCorrect ? problem.feedback.correct : problem.feedback.incorrect;
    }
    
    return isCorrect ? "Correct!" : "Try again!";
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    if (!this.problems || this.problems.length === 0) {
      throw new Error('DoItStep must have at least one problem');
    }
    return true;
  }
}

export default DoItStep; 