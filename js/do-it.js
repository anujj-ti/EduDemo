// --- DOM References ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Do It page loaded.");

    const titleElement = document.getElementById('do-it-question-title');
    const instructionElement = document.getElementById('do-it-instruction');
    const canvasContainer = document.getElementById('canvas-container');
    const checkArea = document.getElementById('embedded-check-area');
    const feedbackArea = document.getElementById('feedback-area');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const audioButton = document.getElementById('footer-audio-button');
    const lessonCounterElement = document.getElementById('do-it-step-counter');
    
    // New intro elements
    const introSection = document.getElementById('do-it-intro-section');
    const startButton = document.getElementById('start-do-it-button');
    const doItContent = document.getElementById('do-it-content');
    const professorImage = document.getElementById('professor-image'); // Added in HTML

    let narrationAudio = new Audio();
    let currentAudioFilename = null;
    let p5Instance = null;
    
    // --- State Variables ---
    let currentProblemIndex = 0;
    let currentP5Instance = null;
    let currentAudio = null;
    let lastInstructionAudio = null; 

    // Color definitions (Adjusted based on target image)
    const bgColor = '#FFFFFF'; // Used for clear() essentially
    const clockFaceColor = '#FDF8E1'; // Creamy yellow background
    const clockRimColor = '#0077CC'; // Blue rim
    const numberColor = '#005999'; // Dark Blue for numbers
    const centerDotColor = '#FFA500'; // Orange/Yellow center
    const hourHandColor = '#0077CC'; // Blue hour hand (matching rim)
    const minuteHandColor = '#E63946'; // Red minute hand
    const tickColor = '#005999'; // Dark Blue for ticks
    const highlightColor = '#FDB813'; // Yellow for hover/highlight
    const correctColor = '#5CB85C'; // Green
    const incorrectColor = '#E63946'; // Red (match minute hand)

    // Dimension constants (Adjusted based on target image)
    const hourHandLength = 0.30; // Slightly longer hour hand
    const minuteHandLength = 0.42; // Slightly longer minute hand
    const hourHandWidth = 11; // Slightly thicker hour hand
    const minuteHandWidth = 7; // Slightly thinner minute hand
    const centerDotSize = 0.06; // Smaller center dot
    const numberSizeMultiplier = 0.10; // Slightly larger numbers
    const numberRadiusMultiplier = 0.38; // Numbers closer to center

    // --- Problem Set Definition (Based on Lesson1_MeetTheClock.md Section 2.4 - 8 Examples) ---
    const problems = [
        { // Problem 1 (MCQ) - MD Example 1
            type: 'mcq',
            questionText: "Which is the Hour Hand?",
            audio: 'which_is_the_hour_hand.mp3', 
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 3, m: 0 }, animateHands: false },
            options: ['Short hand', 'Long hand'],
            correctAnswer: 'Short hand',
            feedbackCorrect: "That's right! The hour hand is the shorter hand.",
            feedbackIncorrect: "Not quite. Remember, the hour hand is the *shorter* one.",
            audioCorrect: 'correct.mp3', 
            audioIncorrect: 'try_again.mp3' 
        },
        { // Problem 2 (Click/Tap Hand) - MD Example 2
            type: 'clickTapHand',
            questionText: "Click the Minute Hand.",
            audio: 'click_the_minute_hand.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 3, m: 15 }, animateHands: false },
            correctAnswer: 'minute',
            feedbackCorrect: "Correct! The minute hand is the longer hand.",
            feedbackIncorrect: "Oops! That's the shorter hour hand. Click the *longer* hand.",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 3 (Click/Tap Hand) - MD Example 3
            type: 'clickTapHand',
            questionText: "Click the Hour Hand.",
            audio: 'click_the_hour_hand.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 9, m: 0 }, animateHands: false },
            correctAnswer: 'hour',
            feedbackCorrect: "Yes! The hour hand is the shorter one.",
            feedbackIncorrect: "Careful, that's the longer minute hand. The hour hand is *shorter*.",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 4 (True/False) - MD Example 4
            type: 'trueFalse',
            // Changed wording slightly from MD to be more direct T/F
            questionText: "True or False: The longer hand is the Minute Hand.", 
            audio: 'the_red_hand_is_the_minute.mp3', // Reverted to original audio filename
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 5, m: 30 }, animateHands: false },
            options: ['True', 'False'], 
            correctAnswer: 'True',
            feedbackCorrect: "You got it! The longer hand always shows the minutes.",
            feedbackIncorrect: "Actually, that statement is true. The longer hand *is* the minute hand.",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 5 (Click/Tap Hand) - MD Example 5
            type: 'clickTapHand',
            questionText: "Click the Hour Hand.",
            audio: 'click_the_hour_hand.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 1, m: 30 }, animateHands: false },
            correctAnswer: 'hour',
            feedbackCorrect: "Correct! You found the short hour hand.",
            feedbackIncorrect: "Try again! Click the *shorter* hand.",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 6 (Click/Tap Hand) - MD Example 6
            type: 'clickTapHand',
            questionText: "Click the Minute Hand.",
            audio: 'click_the_minute_hand.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 7, m: 0 }, animateHands: false },
            correctAnswer: 'minute',
            feedbackCorrect: "Yes, that's the long minute hand!",
            feedbackIncorrect: "Remember, the minute hand is the *longer* one. Click it!",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 7 (Yes/No - Animation) - MD Example 7
            type: 'yesNo',
            questionText: "Are these hands moving Clockwise?",
            audio: 'are_these_hands_moving_clockwise.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 12, m: 0 }, animateHands: true }, // Animation starts
            options: ['Yes', 'No'],
            correctAnswer: 'Yes',
            feedbackCorrect: "Correct! They are moving clockwise, following 1, 2, 3...",
            feedbackIncorrect: "Look again! They are moving past 1, 2, 3... That *is* clockwise.",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        },
        { // Problem 8 (Click/Tap Direction) - MD Example 8
            type: 'clickTapDirection',
            questionText: "Click the arrow that shows Clockwise.",
            audio: 'click_the_arrow_that_shows_clockwise.mp3',
            p5config: { 
                showNumbers: true,    
                showHands: true,    
                initialTime: { h: 7, m: 0 }, // Set time to 7:00
                animateHands: false, 
                showDirectionArrows: true 
            }, 
            correctAnswer: 'clockwise',
            feedbackCorrect: "Perfect! That's the clockwise direction.",
            feedbackIncorrect: "Not quite. Clockwise follows the numbers 1, 2, 3... like the arrow on the right (↻).",
            audioCorrect: 'correct.mp3',
            audioIncorrect: 'try_again.mp3'
        }
    ];
    
    // --- Helper Functions ---
    function playAudio(filename, onEndedCallback = null) {
        if (!filename) {
            if (typeof onEndedCallback === 'function') {
                onEndedCallback();
            }
            return;
        }
        
        const audioPath = `voice/${filename}`;
        console.log(`Playing audio: ${audioPath}`);
        
        // Stop any playing audio
        if (narrationAudio && !narrationAudio.paused) {
            narrationAudio.pause();
            narrationAudio.currentTime = 0;
        }
        
        // Clear existing listeners
        narrationAudio.onended = null;
        narrationAudio.onerror = null;
        
        // Set up new listeners
        narrationAudio.onended = () => {
            console.log("Audio ended:", filename);
            if (typeof onEndedCallback === 'function') {
                onEndedCallback();
            }
        };
        
        narrationAudio.onerror = (e) => {
            console.error("Audio error:", filename, e);
        };
        
        // Set source and play
        narrationAudio.src = audioPath;
        narrationAudio.currentTime = 0;
        
        const playPromise = narrationAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Audio play failed:", e);
            });
        }
    }

    // Function to create clock sketch
    function createClockSketch(p5config) {
        // Create a new P5 instance for the clock
        if (currentP5Instance) {
            currentP5Instance.remove();
        }

        currentP5Instance = new p5((p) => {
            let clockDiameter;
            let currentHour = p5config.initialTime ? p5config.initialTime.h : 3;
            let currentMinute = p5config.initialTime ? p5config.initialTime.m : 0;
            let hoveredHand = null;
            let localHighlightTarget = null;
            let interactionEnabled = true;
            let clickFeedback = null;
            let animationStartTime = Date.now();
            let handAngleOffset = 0;
            let hoveredArrow = null;
            let animating = p5config.animateHands || false;

            p.setup = function() {
                // Create a responsive canvas that fits the container
                const canvas = p.createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight || 300);
                canvas.parent(canvasContainer);
                
                // Set angle mode to degrees for easier rotation math
                p.angleMode(p.DEGREES);
                
                // Set text alignment
                p.textAlign(p.CENTER, p.CENTER);
                
                // Calculate clock size based on canvas size
                clockDiameter = Math.min(p.width, p.height) * 0.85;
                
                // Set stroke cap for round ends on hands
                p.strokeCap(p.ROUND);
            };

            p.draw = function() {
                p.clear(); // With this line for transparent canvas
                
                // Translate to the center
                p.translate(p.width / 2, p.height / 2);
                
                // Draw clock face with numbers
                drawClockFace();
                
                // Draw hands if enabled
                if (p5config.showHands) {
                    let hAngle, mAngle;
                    
                    if (animating) {
                        // Regular animation for clockwise motion
                        const speed = 0.25; // Reduced speed for better visualization
                        handAngleOffset += speed;
                        mAngle = (handAngleOffset % 360) * 6 - 90;
                        hAngle = ((handAngleOffset / 12) % 360) * 30 - 90;
                    } else {
                        // Static display - convert hours/minutes to angles
                        mAngle = p.map(currentMinute % 60, 0, 60, 0, 360) - 90;
                        hAngle = p.map((currentHour % 12) + (currentMinute / 60), 0, 12, 0, 360) - 90;
                    }
                    
                    // Draw hour hand first (so minute hand is on top)
                    drawHand('hour', hAngle, hourHandColor, hourHandLength, hourHandWidth);
                    drawHand('minute', mAngle, minuteHandColor, minuteHandLength, minuteHandWidth);
                }
                
                // Draw direction arrows if needed
                if (p5config.showDirectionArrows) {
                    drawDirectionArrows();
                }
                
                // Draw center dot over the hands
                drawCenterDot();
            };

            // Draw the clock face
            function drawClockFace() {
                // Outer rim of the clock
                p.noFill();
                p.strokeWeight(clockDiameter * 0.04); // Rim thickness relative to size
                p.stroke(clockRimColor);
                p.ellipse(0, 0, clockDiameter);
                
                // Fill the clock face (this provides the non-transparent part)
                p.fill(clockFaceColor); 
                p.noStroke();
                p.ellipse(0, 0, clockDiameter - (clockDiameter * 0.04)); // Inner face slightly smaller than rim

                // --- Draw Tick Marks --- 
                const tickRadius = clockDiameter * 0.45; // Ticks outside numbers
                p.stroke(tickColor);
                
                for (let i = 0; i < 60; i++) {
                    const angle = p.map(i, 0, 60, -90, 270); // Map 0-60 minutes to 0-360 degrees (-90 offset)
                    const isHourMark = (i % 5 === 0);
                    
                    // Calculate tick length and weight
                    const tickStartRadius = tickRadius * (isHourMark ? 0.92 : 0.96); // Hour ticks start slightly further in
                    const tickEndRadius = tickRadius;
                    const tickWeight = isHourMark ? 3 : 1;
                    
                    // Calculate coordinates
                    const x1 = p.cos(angle) * tickStartRadius;
                    const y1 = p.sin(angle) * tickStartRadius;
                    const x2 = p.cos(angle) * tickEndRadius;
                    const y2 = p.sin(angle) * tickEndRadius;
                    
                    // Draw the tick
                    p.strokeWeight(tickWeight);
                    p.line(x1, y1, x2, y2);
                }
                // --- End Tick Marks ---

                // Draw numbers if needed
                if (p5config.showNumbers) {
                    drawHourNumbers();
                }
            }
            
            // Draw clock center dot
            function drawCenterDot() {
                p.fill(centerDotColor);
                p.noStroke();
                p.ellipse(0, 0, clockDiameter * centerDotSize); // Use new size constant
            }
            
            // Draw clock hands
            function drawHand(handType, angle, color, lengthMultiplier, weight) {
                let isHovered = handType === hoveredHand;
                let isClickFeedback = clickFeedback && clickFeedback.type === handType;
                let isCorrect = isClickFeedback && clickFeedback.correct;
                
                const handLength = clockDiameter * lengthMultiplier;
                
                // Calculate hand coordinates
                const endX = Math.cos(p.radians(angle)) * handLength;
                const endY = Math.sin(p.radians(angle)) * handLength;
                
                // Determine the correct color for the hand based on state
                let currentHandColor;
                if (isClickFeedback) {
                    currentHandColor = isCorrect ? correctColor : incorrectColor;
                } else if (isHovered) {
                    currentHandColor = highlightColor;
                } else {
                    currentHandColor = color; // Use the default passed color
                }

                // Draw the hand line
                p.strokeWeight(isHovered ? weight + 2 : weight);
                p.stroke(currentHandColor); // Use the determined color
                p.line(0, 0, endX, endY);
                
                // Add small circle at the end of the hand for better grabbing
                p.fill(currentHandColor); // Use the determined color for fill
                p.noStroke(); // No outline for the small circle
                p.ellipse(endX, endY, weight); // Draw the circle
                
                // Check for hover on the hands
                if (interactionEnabled && p5config.showHands) {
                    const mouseDist = distPointLine(p.mouseX - p.width/2, p.mouseY - p.height/2, 0, 0, endX, endY);
                    const isClose = mouseDist < 15;
                    
                    if (isClose && !hoveredHand) {
                        hoveredHand = handType;
                        p.cursor(p.HAND);
                    } else if (hoveredHand === handType && !isClose) {
                        hoveredHand = null;
                        p.cursor(p.ARROW);
                    }
                }
            }
            
            // Draw hour numbers
            function drawHourNumbers() {
                const numberRadius = clockDiameter * numberRadiusMultiplier; // Use new radius multiplier
                p.textSize(clockDiameter * numberSizeMultiplier); // Use new size multiplier
                p.textAlign(p.CENTER, p.CENTER);
                p.textStyle(p.BOLD);
                p.fill(numberColor);
                p.noStroke(); // Ensure numbers are not stroked
                
                for (let i = 1; i <= 12; i++) {
                    const angle = (i * 30) - 90; 
                    const x = p.cos(angle) * numberRadius;
                    const y = p.sin(angle) * numberRadius;
                    p.text(i, x, y);
                }
            }
            
            // Draw direction arrows for clockwise/counterclockwise
            function drawDirectionArrows() {
                const offset = clockDiameter * 0.20; // Reduced offset multiplier (was 0.30)
                const arrowSize = clockDiameter * 0.12;
                
                // Draw counterclockwise arrow (left)
                // Pass 'counterclockwise' for the direction logic
                drawArrow(-offset, 0, arrowSize, 'counterclockwise');
                
                // Draw clockwise arrow (right)
                // Pass 'clockwise' for the direction logic
                drawArrow(offset, 0, arrowSize, 'clockwise');
            }
            
            // Draw individual arrow
            function drawArrow(x, y, size, direction) {
                const isHovered = hoveredArrow === direction;
                const isClickFeedback = clickFeedback && clickFeedback.type === direction;
                const isCorrect = isClickFeedback && clickFeedback.correct;
                
                p.push(); // Save global state
                p.translate(x, y); // Move to arrow position

                // Determine arrow color based on state
                let currentArrowColor;
                if (isClickFeedback) {
                    currentArrowColor = isCorrect ? correctColor : incorrectColor;
                } else if (isHovered) {
                    currentArrowColor = highlightColor;
                } else {
                    // Keep blue for clockwise concept, red for counter-clockwise concept
                    currentArrowColor = (direction === 'clockwise') ? numberColor : minuteHandColor; 
                }

                // Apply mirroring for counter-clockwise arrow *before* drawing
                if (direction === 'counterclockwise') {
                    p.scale(-1, 1); // Flip horizontally
                }

                // --- Draw the standard Clockwise Arc Shape (↻) --- 
                p.stroke(currentArrowColor);
                p.strokeWeight(size * 0.15); // Thickness of the arc
                p.strokeCap(p.ROUND);
                p.noFill(); // Arc is just a line

                const arcRadius = size * 0.7; // Radius of the curved part
                const arcStartAngle = -45; // Standard start angle (top-right)
                const arcEndAngle = 225;   // Standard end angle (bottom-left)
                p.arc(0, 0, arcRadius, arcRadius, arcStartAngle, arcEndAngle);

                // --- Draw Arrowhead at the end of the standard arc --- 
                const arrowTipAngle = arcEndAngle;
                const arrowTipX = p.cos(arrowTipAngle) * (arcRadius / 2);
                const arrowTipY = p.sin(arrowTipAngle) * (arcRadius / 2);
                
                p.push(); // Save state before rotating arrowhead
                p.translate(arrowTipX, arrowTipY);
                // Rotate to align with the tangent at the end of the arc, pointing outwards
                p.rotate(arrowTipAngle + 90); 
                p.fill(currentArrowColor); // Fill the arrowhead
                p.noStroke();
                const arrowHeadSize = size * 0.3;
                // Draw triangle pointing outwards
                p.triangle(0, -arrowHeadSize * 0.6, -arrowHeadSize * 0.5, arrowHeadSize * 0.4, arrowHeadSize * 0.5, arrowHeadSize * 0.4);
                p.pop(); // Restore state after drawing arrowhead

                p.pop(); // Restore global state (including potential flip and translation)
                
                // Hover check remains the same (uses original x, y)
                if (interactionEnabled && p5config.showDirectionArrows) {
                    const d = p.dist(p.mouseX - p.width/2, p.mouseY - p.height/2, x, y);
                    if (d < size) { 
                        if (!hoveredArrow) {
                            hoveredArrow = direction;
                            p.cursor(p.HAND);
                        }
                    } else if (hoveredArrow === direction) {
                        hoveredArrow = null;
                        p.cursor(p.ARROW);
                    }
                }
            }
            
            // Helper to calculate distance from point to line
            function distPointLine(px, py, x1, y1, x2, y2) {
                const d = p.dist(x1, y1, x2, y2);
                if (d === 0) return p.dist(px, py, x1, y1);
                
                const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (d * d);
                if (t < 0) return p.dist(px, py, x1, y1);
                if (t > 1) return p.dist(px, py, x2, y2);
                
                const projx = x1 + t * (x2 - x1);
                const projy = y1 + t * (y2 - y1);
                return p.dist(px, py, projx, projy);
            }
            
            // Mouse clicked event
            p.mouseClicked = function() {
                console.log("p.mouseClicked fired!"); // Log that the function is called

                // Check if interaction is enabled and click is within canvas bounds (approx)
                if (!interactionEnabled || p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
                    console.log("Interaction disabled or click outside canvas.");
                    return; 
                }
                
                const currentProblem = problems[currentProblemIndex];
                console.log("Current hovered hand:", hoveredHand); // Log the value of hoveredHand
                
                if (p5config.showHands && hoveredHand) {
                    console.log("Processing click on hovered hand:", hoveredHand);
                    if (currentProblem.type === 'clickTapHand') {
                        console.log("Problem type is clickTapHand. Correct answer should be:", currentProblem.correctAnswer);
                        const isCorrect = hoveredHand === currentProblem.correctAnswer;
                        console.log("Click is correct:", isCorrect);
                        clickFeedback = { type: hoveredHand, correct: isCorrect };
                        handleAnswer(isCorrect);
                    } else {
                        console.log("Problem type is NOT clickTapHand.");
                    }
                } else if (p5config.showDirectionArrows && hoveredArrow) {
                    console.log("Processing click on hovered arrow:", hoveredArrow);
                    if (currentProblem.type === 'clickTapDirection') {
                        // ... (arrow logic) ...
                        const isCorrect = hoveredArrow === currentProblem.correctAnswer;
                        clickFeedback = { type: hoveredArrow, correct: isCorrect };
                        handleAnswer(isCorrect);
                    } else {
                        console.log("Problem type is NOT clickTapDirection.");
                    }
                } else {
                    console.log("No interactable element hovered.");
                }
            };
        });
        
        return currentP5Instance;
    }

    // --- Button Creation Functions ---
    function createMCQButtons(options) {
        checkArea.innerHTML = '';
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mcq-button-container';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-button';
            button.addEventListener('click', () => handleMCQAnswer(index));
            buttonContainer.appendChild(button);
        });
        
        checkArea.appendChild(buttonContainer);
    }
    
    function createTrueFalseButtons() {
        return createMCQButtons(['True', 'False']);
    }
    
    function createYesNoButtons() {
        return createMCQButtons(['Yes', 'No']);
    }
    
    // --- Answer Handlers ---
    function handleMCQAnswer(selectedIndex) {
        const currentProblem = problems[currentProblemIndex];
        const selectedOption = currentProblem.options[selectedIndex];
        const isCorrect = selectedOption === currentProblem.correctAnswer;
        
        // Apply visual feedback to the button
        const buttons = checkArea.querySelectorAll('.option-button');
        buttons.forEach((button, index) => {
            if (index === selectedIndex) {
                button.classList.add(isCorrect ? 'correct-answer-highlight' : 'incorrect-answer-flash');
            }
        });
        
        handleAnswer(isCorrect);
    }
    
    function handleAnswer(isCorrect) {
        const currentProblem = problems[currentProblemIndex];
        
        // Display feedback
        feedbackArea.textContent = isCorrect ? currentProblem.feedbackCorrect : currentProblem.feedbackIncorrect;
        feedbackArea.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        
        // Play feedback audio
        playAudio(isCorrect ? currentProblem.audioCorrect : currentProblem.audioIncorrect);
        
        // If correct, enable next button after a delay
        if (isCorrect) {
            setTimeout(() => {
                nextButton.disabled = false;
            }, 1000);
        }
    }
    
    // --- Problem Loading ---
    function loadProblem(index, playInstructionAudio = true) {
        if (index < 0 || index >= problems.length) return;
        
        currentProblemIndex = index;
        const problem = problems[index];
        
        // Update counter
        if (lessonCounterElement) {
            lessonCounterElement.textContent = `Problem ${index + 1} of ${problems.length}`;
        }

        // Update title
        if (titleElement) {
            titleElement.textContent = `Question ${index + 1}`;
        }
        
        // Update instruction
        if (instructionElement) {
            instructionElement.textContent = problem.questionText;
        }
        
        // Clear feedback area
        if (feedbackArea) {
            feedbackArea.textContent = '';
            feedbackArea.className = 'feedback';
        }
        
        // Disable next button until correct answer
        if (nextButton) {
            nextButton.disabled = true;
        }

        // Enable/disable previous button
        if (prevButton) {
            prevButton.disabled = (index === 0); 
        }
        
        // Create relevant buttons or clear area
        if (checkArea) {
            checkArea.innerHTML = ''; // Clear previous buttons
            switch (problem.type) {
                case 'mcq':
                    createMCQButtons(problem.options);
                    break;
                case 'trueFalse':
                    createTrueFalseButtons();
                    break;
                case 'yesNo':
                    createYesNoButtons();
                    break;
                // No buttons needed for click/tap types
            }
        }
        
        // Create/update p5 instance
        if (problem.p5config) {
            p5Instance = createClockSketch(problem.p5config);
        }
        
        // Play audio instruction if requested
        if (playInstructionAudio && problem.audio) {
            playAudio(problem.audio);
            currentAudioFilename = problem.audio; // Store for replaying
        }
    }
    
    // --- Event Listeners ---

    // Start Button Listener
    if (startButton && introSection && doItContent && professorImage && prevButton && nextButton) {
        startButton.addEventListener('click', () => {
            console.log('Start Practice button clicked');
            introSection.classList.add('hidden');
            if (professorImage) professorImage.classList.add('hidden'); // Hide professor in header
            doItContent.classList.remove('hidden');
            
            // Hide start button, show real nav buttons
            startButton.style.display = 'none';
            prevButton.style.display = 'inline-flex';
            nextButton.style.display = 'inline-flex';
            prevButton.disabled = true; // Prev should be disabled initially
            nextButton.disabled = true; // Next is disabled until first answer
            
            // Load the first problem and play its audio
            loadProblem(0, true); 
        });
    } else {
        console.error('Missing intro elements, nav buttons or start button.');
    }

    // Navigation Button Listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked. Current index:', currentProblemIndex);
            if (currentProblemIndex < problems.length - 1) {
                loadProblem(currentProblemIndex + 1);
            } else {
                // Last problem - Redirect to 'Show It' section
                console.log('Last problem completed. Redirecting to show-it.html');
                // alert('Congratulations! You have completed all the practice problems.'); // Removed alert
                window.location.href = 'show-it.html'; // Redirect to next page
            }
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentProblemIndex > 0) {
                loadProblem(currentProblemIndex - 1);
            }
        });
    }
    
    // Audio Button Listener
    if (audioButton) {
        audioButton.addEventListener('click', () => {
            const icon = audioButton.querySelector('i');
            if (narrationAudio.paused) {
                // Resume audio if there's a current track
                if (currentAudioFilename) {
                    playAudio(currentAudioFilename);
                }
                icon.className = 'fas fa-volume-up';
            } else {
                // Pause audio
                narrationAudio.pause();
                icon.className = 'fas fa-volume-mute';
            }
        });
    }

    // Initial setup - don't load problem here, wait for start button
    // loadProblem(0); 

    console.log("Do It page initialization complete.");
});