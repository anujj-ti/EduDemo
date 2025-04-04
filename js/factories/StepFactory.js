import WarmUpStep from '../models/WarmUpStep.js';
import LearnItStep from '../models/LearnItStep.js';
import TryItStep from '../models/TryItStep.js';
import DoItStep from '../models/DoItStep.js';
import ShowItStep from '../models/ShowItStep.js';
import ExtensionStep from '../models/ExtensionStep.js';

import { 
  ClockFaceScreen, 
  ClockWithHandsScreen, 
  AnimatedClockScreen,
  ImageGalleryScreen 
} from '../models/Screen.js';

import {
  TextInputInteraction,
  ClickTapInteraction,
  DragDropInteraction,
  BinaryChoiceInteraction,
  MCQInteraction
} from '../models/Interaction.js';

/**
 * Factory class for creating step instances and their components
 */
class StepFactory {
  /**
   * Creates a step based on its type
   * @param {Object} config - The step configuration
   * @returns {Object} The created step instance
   */
  static createStep(config) {
    // Process the screen configuration
    if (config.screen) {
      config.screen = this.createScreen(config.screen);
    }
    
    // Process the interaction configuration
    if (config.interaction) {
      config.interaction = this.createInteraction(config.interaction);
    }
    
    // Process sequences if present
    if (config.sequence) {
      config.sequence = config.sequence.map(item => {
        if (item.embeddedCheck && item.embeddedCheck.interaction) {
          item.embeddedCheck.interaction = this.createInteraction(item.embeddedCheck.interaction);
        }
        return item;
      });
    }
    
    // Process multi-screen configurations
    if (config.screens) {
      config.screens = config.screens.map(screen => {
        if (screen.config) {
          screen.config = this.createScreen(screen.config);
        }
        if (screen.interaction) {
          screen.interaction = this.createInteraction(screen.interaction);
        }
        return screen;
      });
    }
    
    // Create the appropriate step type
    switch (config.stepType) {
      case 'warm-up':
        return new WarmUpStep(config);
      case 'learn-it':
        return new LearnItStep(config);
      case 'try-it':
        return new TryItStep(config);
      case 'do-it':
        return new DoItStep(config);
      case 'show-it':
        return new ShowItStep(config);
      case 'extension':
        return new ExtensionStep(config);
      default:
        throw new Error(`Unknown step type: ${config.stepType}`);
    }
  }
  
  /**
   * Creates a screen based on its type
   * @param {Object} config - The screen configuration
   * @returns {Object} The created screen instance
   */
  static createScreen(config) {
    switch (config.type) {
      case 'clock-face':
        return new ClockFaceScreen(config);
      case 'clock-with-hands':
        return new ClockWithHandsScreen(config);
      case 'animated-clock':
        return new AnimatedClockScreen(config);
      case 'image-gallery':
        return new ImageGalleryScreen(config);
      default:
        // Return the config as-is if no specific type handler
        return config;
    }
  }
  
  /**
   * Creates an interaction based on its type
   * @param {Object} config - The interaction configuration
   * @returns {Object} The created interaction instance
   */
  static createInteraction(config) {
    switch (config.type) {
      case 'text-input':
        return new TextInputInteraction(config);
      case 'click-tap':
        return new ClickTapInteraction(config);
      case 'drag-drop':
        return new DragDropInteraction(config);
      case 'binary-choice':
        return new BinaryChoiceInteraction(config);
      case 'mcq':
        return new MCQInteraction(config);
      default:
        // Return the config as-is if no specific type handler
        return config;
    }
  }
}

export default StepFactory; 