import LessonStep from './LessonStep.js';

/**
 * Represents a show-it (assessment) step in the lesson
 */
class ShowItStep extends LessonStep {
  /**
   * @param {Object} config - Configuration for the show-it step
   */
  constructor(config) {
    super(config);
    this.format = config.format;
    this.questions = config.questions || [];
    this.feedback = config.feedback;
    this.remediation = config.remediation;
    this.introduction = config.introduction;
    this.currentQuestionIndex = 0;
    this.answers = new Array(this.questions.length).fill(null);
    this.score = 0;
  }

  /**
   * @inheritdoc
   */
  getType() {
    return "show-it";
  }
  
  /**
   * Get the current question
   * @returns {Object} The current question
   */
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }
  
  /**
   * Get the current question ID
   * @returns {string} The current question ID
   */
  getCurrentQuestionId() {
    const question = this.getCurrentQuestion();
    return question.id;
  }
  
  /**
   * Move to the next question (also known as nextProblem for consistency)
   * @returns {boolean} Whether there was a next question
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }
  
  /**
   * Alias for nextQuestion to maintain consistency with DoItStep
   */
  nextProblem() {
    return this.nextQuestion();
  }
  
  /**
   * Move to the previous question (also known as previousProblem for consistency)
   * @returns {boolean} Whether there was a previous question
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }
  
  /**
   * Alias for previousQuestion to maintain consistency with DoItStep
   */
  previousProblem() {
    return this.previousQuestion();
  }
  
  /**
   * Check if this is the first question
   * @returns {boolean} Whether this is the first question
   */
  isFirstQuestion() {
    return this.currentQuestionIndex === 0;
  }
  
  /**
   * Check if this is the last question
   * @returns {boolean} Whether this is the last question
   */
  isLastQuestion() {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
  
  /**
   * Record an answer
   * @param {*} answer - The user's answer
   * @returns {boolean} Whether the answer was correct
   */
  recordAnswer(answer) {
    const question = this.getCurrentQuestion();
    const isCorrect = answer === question.correctAnswer;
    
    this.answers[this.currentQuestionIndex] = answer;
    
    if (isCorrect) {
      this.score++;
    }
    
    return isCorrect;
  }
  
  /**
   * Get feedback for the current question based on answer
   * @param {*} answer - The user's answer
   * @returns {string} The feedback text
   */
  getFeedback(answer) {
    const question = this.getCurrentQuestion();
    const isCorrect = answer === question.correctAnswer;
    
    if (question.feedback) {
      return isCorrect ? question.feedback.correct : question.feedback.incorrect;
    }
    
    return isCorrect ? "Correct" : "Incorrect";
  }
  
  /**
   * Check if remediation is needed
   * @returns {boolean} Whether remediation is needed
   */
  needsRemediation() {
    // As per lesson plan: "If < 3 correct, offer targeted review"
    return this.score < 3;
  }
  
  /**
   * @inheritdoc
   */
  validate() {
    super.validate();
    if (!this.questions || this.questions.length === 0) {
      throw new Error('ShowItStep must have at least one question');
    }
    return true;
  }
}

export default ShowItStep; 