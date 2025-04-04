/**
 * Base class for all screen types
 */
class Screen {
  /**
   * @param {Object} config - Configuration for the screen
   */
  constructor(config) {
    this.type = config.type;
    this.config = config.config || {};
  }
  
  /**
   * Get the type of screen
   * @returns {string} The screen type
   */
  getType() {
    return this.type;
  }
}

/**
 * Represents a clock face screen (without hands)
 */
class ClockFaceScreen extends Screen {
  /**
   * @param {Object} config - Configuration for the clock face
   */
  constructor(config) {
    super({...config, type: 'clock-face'});
    this.missingNumbers = config.config?.missingNumbers || [];
    this.anchors = config.config?.anchors || [];
    this.showNumbers = config.config?.showNumbers !== false;
    this.sequentialHighlight = config.config?.sequentialHighlight || false;
  }
}

/**
 * Represents a clock with hands screen
 */
class ClockWithHandsScreen extends Screen {
  /**
   * @param {Object} config - Configuration for the clock with hands
   */
  constructor(config) {
    super({...config, type: 'clock-with-hands'});
    this.time = config.config?.time || '12:00';
    this.hourHand = config.config?.hourHand || { color: 'black', length: 'short' };
    this.minuteHand = config.config?.minuteHand || { color: 'black', length: 'long' };
  }
}

/**
 * Represents an animated clock screen
 */
class AnimatedClockScreen extends Screen {
  /**
   * @param {Object} config - Configuration for the animated clock
   */
  constructor(config) {
    super({...config, type: 'animated-clock'});
    this.animation = config.config?.animation || '';
    this.arrows = config.config?.arrows || [];
  }
}

/**
 * Represents an image gallery screen
 */
class ImageGalleryScreen extends Screen {
  /**
   * @param {Object} config - Configuration for the image gallery
   */
  constructor(config) {
    super({...config, type: 'image-gallery'});
    this.images = config.config?.images || [];
  }
}

export {
  Screen,
  ClockFaceScreen,
  ClockWithHandsScreen,
  AnimatedClockScreen,
  ImageGalleryScreen
}; 