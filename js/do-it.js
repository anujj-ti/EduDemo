// --- DOM References ---
document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('do-it-question-title');
    const instructionElement = document.getElementById('do-it-instruction');
    const canvasContainer = document.getElementById('canvas-container');
    const checkArea = document.getElementById('embedded-check-area');
    const feedbackArea = document.getElementById('feedback-area');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const audioButton = document.getElementById('footer-audio-button');
    const lessonCounterElement = document.getElementById('do-it-step-counter');
    
    let narrationAudio = new Audio();
    let currentAudioFilename = null;
    let p5Instance = null;
    
    // --- State Variables ---
    let currentProblemIndex = 0;
    let currentP5Instance = null;
    let currentAudio = null;
    let lastInstructionAudio = null; 

    // --- Problem Set Definition (Based on Lesson1_MeetTheClock.md Section 2.4 - 8 Examples) ---
    const problems = [
        { // Problem 1 (MCQ) - MD Example 1
            type: 'mcq',
            questionText: "Which is the Hour Hand?",
            audio: 'which_is_the_hour_hand.mp3', 
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 2, m: 30 }, animateHands: false },
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
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 8, m: 15 }, animateHands: false },
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
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 10, m: 50 }, animateHands: false },
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
            audio: 'the_red_hand_is_the_minute.mp3',
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 4, m: 45 }, animateHands: false },
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
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 1, m: 20 }, animateHands: false },
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
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 7, m: 5 }, animateHands: false },
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
            p5config: { showNumbers: true, showHands: true, initialTime: { h: 1, m: 0 }, animateHands: true }, // Animation starts
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
            p5config: { showNumbers: false, showHands: false, animateHands: false, showDirectionArrows: true }, // Only show arrows
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

        // Common clock variables
        const clockColor = '#f0f6ff'; // Light blue background
        const hourHandColor = '#2271b3'; // Blue for the hour hand
        const minuteHandColor = '#d64933'; // Red for the minute hand
        const hourHandLength = 0.4; // Shorter hand
        const minuteHandLength = 0.7; // Longer hand
        const hourHandWidth = 8; // Thicker for hour
        const minuteHandWidth = 6; // Thinner for minute

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
                const canvas = p.createCanvas(canvasContainer.offsetWidth, 300);
                canvas.parent(canvasContainer);
                
                // Set angle mode to degrees for easier rotation math
                p.angleMode(p.DEGREES);
                
                // Set text alignment
                p.textAlign(p.CENTER, p.CENTER);
                
                // Calculate clock size based on canvas size
                clockDiameter = Math.min(p.width, p.height) * 0.8;
                
                // Set stroke cap for round ends on hands
                p.strokeCap(p.ROUND);
            };

            p.draw = function() {
                p.background(clockColor);
                
                // Translate to the center
                p.translate(p.width / 2, p.height / 2);
                
                // Draw clock face with numbers
                drawClockFace();
                
                // Draw hands if enabled
                if (p5config.showHands) {
                    let hAngle, mAngle;
                    
                    if (animating) {
                        // Regular animation for clockwise motion
                        const speed = 0.5; // Reduced speed for better visualization
                        handAngleOffset += speed;
                        mAngle = (handAngleOffset % 360) * 6 - 90;
                        hAngle = ((handAngleOffset / 12) % 360) * 30 - 90;
                    } else {
                        // Static display
                        mAngle = p.map(currentMinute, 0, 60, 0, 360) - 90;
                        hAngle = p.map(currentHour % 12 + currentMinute / 60, 0, 12, 0, 360) - 90;
                    }
                    
                    // Draw minute hand on top of hour hand
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

            function drawClockFace() {
                // Draw clock outline
                p.noFill();
                p.stroke(0);
                p.strokeWeight(2);
                p.ellipse(0, 0, clockDiameter, clockDiameter);
                
                // Draw hour markers and numbers
                if (p5config.showNumbers) {
                    for (let i = 1; i <= 12; i++) {
                        const angle = p.map(i, 0, 12, 0, 360) - 90;
                        const x = p.cos(angle) * (clockDiameter * 0.4);
                        const y = p.sin(angle) * (clockDiameter * 0.4);
                        
                        // Draw number
                        p.noStroke();
                        p.fill(0);
                        p.textSize(clockDiameter * 0.08);
                        p.text(i, x, y);
                        
                        // Draw hour tick
                        p.stroke(0);
                        p.strokeWeight(2);
                        const tickOuterX = p.cos(angle) * (clockDiameter / 2 - 5);
                        const tickOuterY = p.sin(angle) * (clockDiameter / 2 - 5);
                        const tickInnerX = p.cos(angle) * (clockDiameter / 2 - 15);
                        const tickInnerY = p.sin(angle) * (clockDiameter / 2 - 15);
                        p.line(tickInnerX, tickInnerY, tickOuterX, tickOuterY);
                    }
                }
            }

            function drawHand(type, angle, color, length, width) {
                p.push();
                p.rotate(angle);
                
                const handEnd = clockDiameter * length;
                const isHovered = hoveredHand === type;
                const isHighlighted = localHighlightTarget && localHighlightTarget.type === 'hand' && localHighlightTarget.value === type;
                
                if (clickFeedback && clickFeedback.type === 'hand' && clickFeedback.value === type) {
                    // Show feedback color
                    p.stroke(clickFeedback.correct ? '#28cc71' : '#ff5c5c');
                } else if (isHighlighted || isHovered) {
                    // Highlight color
                    p.stroke(isHighlighted ? '#ffce54' : color);
                    p.strokeWeight(width + 2); // Make it slightly thicker for emphasis
                } else {
                    // Normal color
                    p.stroke(color);
                }
                
                p.strokeWeight(width);
                p.line(0, 0, handEnd, 0);
                p.pop();
            }

            function drawCenterDot() {
                p.fill(0);
                p.noStroke();
                p.ellipse(0, 0, clockDiameter * 0.05, clockDiameter * 0.05);
            }

            function drawDirectionArrows() {
                // Draw clockwise and counterclockwise arrows
                const arrowRadius = clockDiameter * 0.3;
                const arrowSize = clockDiameter * 0.06;
                
                // Draw clockwise arrow (right)
                drawArrow(arrowRadius, 0, arrowSize, 'clockwise');
                
                // Draw counterclockwise arrow (left)
                drawArrow(-arrowRadius, 0, arrowSize, 'counterclockwise');
            }

            function drawArrow(x, y, size, direction) {
                const isHovered = hoveredArrow === direction;
                const isHighlighted = localHighlightTarget && localHighlightTarget.type === 'direction' && localHighlightTarget.value === direction;
                const isFeedback = clickFeedback && clickFeedback.type === 'direction' && clickFeedback.value === direction;
                
                p.push();
                p.translate(x, y);
                
                if (isFeedback) {
                    // Show feedback color
                    p.fill(clickFeedback.correct ? '#28cc71' : '#ff5c5c');
                    p.stroke(clickFeedback.correct ? '#28cc71' : '#ff5c5c');
                } else if (isHovered || isHighlighted) {
                    // Highlight color
                    p.fill('#ffce54');
                    p.stroke('#ffce54');
                } else {
                    // Normal color
                    p.fill(0);
                    p.stroke(0);
                }
                
                p.strokeWeight(2);
                
                // Draw circle
                p.ellipse(0, 0, size * 2, size * 2);
                
                // Draw arrow head
                p.push();
                if (direction === 'clockwise') {
                    // Arrow points clockwise
                    p.rotate(45);
                    p.triangle(size * 0.8, 0, size * 0.3, -size * 0.3, size * 0.3, size * 0.3);
                } else {
                    // Arrow points counterclockwise
                    p.rotate(225);
                    p.triangle(size * 0.8, 0, size * 0.3, -size * 0.3, size * 0.3, size * 0.3);
                }
                p.pop();
                
                p.pop();
            }

            // Handle mouse interactions
            p.mouseMoved = function() {
                if (!interactionEnabled) return;
                
                // Check for hand hover
                if (p5config.showHands) {
                    const mouseVec = p.createVector(p.mouseX - p.width/2, p.mouseY - p.height/2);
                    const mouseDistFromCenter = mouseVec.mag();
                    
                    // Hour hand detection
                    const hourHandVec = p5.Vector.fromAngle(p.radians(p.map(currentHour % 12 + currentMinute / 60, 0, 12, 0, 360) - 90), clockDiameter * hourHandLength);
                    const distToHourHand = distToLine(mouseVec, p.createVector(0, 0), hourHandVec);
                    
                    // Minute hand detection
                    const minuteHandVec = p5.Vector.fromAngle(p.radians(p.map(currentMinute, 0, 60, 0, 360) - 90), clockDiameter * minuteHandLength);
                    const distToMinuteHand = distToLine(mouseVec, p.createVector(0, 0), minuteHandVec);
                    
                    // Reset hover state
                    hoveredHand = null;
                    
                    // Check minute hand first (longer, visually on top)
                    if (distToMinuteHand < 10 && mouseDistFromCenter < clockDiameter * minuteHandLength) {
                        hoveredHand = 'minute';
                    } else if (distToHourHand < 10 && mouseDistFromCenter < clockDiameter * hourHandLength) {
                        hoveredHand = 'hour';
                    }
                }
                
                // Check for direction arrow hover
                if (p5config.showDirectionArrows) {
                    hoveredArrow = null;
                    const mouseVec = p.createVector(p.mouseX - p.width/2, p.mouseY - p.height/2);
                    const arrowRadius = clockDiameter * 0.3;
                    const arrowSize = clockDiameter * 0.06;
                    
                    // Clockwise arrow (right)
                    const clockwisePos = p.createVector(arrowRadius, 0);
                    if (p5.Vector.dist(mouseVec, clockwisePos) < arrowSize) {
                        hoveredArrow = 'clockwise';
                    }
                    
                    // Counterclockwise arrow (left)
                    const counterClockwisePos = p.createVector(-arrowRadius, 0);
                    if (p5.Vector.dist(mouseVec, counterClockwisePos) < arrowSize) {
                        hoveredArrow = 'counterclockwise';
                    }
                }
            };

            p.mouseClicked = function() {
                if (!interactionEnabled) return;
                
                const problem = problems[currentProblemIndex];
                
                // Handle hand clicks for clickTapHand problems
                if (problem.type === 'clickTapHand' && hoveredHand) {
                    handleHandClick(hoveredHand);
                }
                
                // Handle direction arrow clicks for clickTapDirection problems
                if (problem.type === 'clickTapDirection' && hoveredArrow) {
                    handleDirectionClick(hoveredArrow);
                }
            };

            function handleHandClick(hand) {
                const problem = problems[currentProblemIndex];
                if (problem.type !== 'clickTapHand') return;
                
                const isCorrect = hand === problem.correctAnswer;
                
                // Show visual feedback on the clock
                clickFeedback = {
                    type: 'hand',
                    value: hand,
                    correct: isCorrect
                };
                
                // Update feedback area
                feedbackArea.textContent = isCorrect ? problem.feedbackCorrect : problem.feedbackIncorrect;
                feedbackArea.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
                
                // Play feedback audio
                playAudio(isCorrect ? problem.audioCorrect : problem.audioIncorrect);
                
                // Enable/disable next button
                nextButton.disabled = !isCorrect;
                
                // Reset feedback after a delay
                setTimeout(() => {
                    clickFeedback = null;
                }, 1500);
            }

            function handleDirectionClick(direction) {
                const problem = problems[currentProblemIndex];
                if (problem.type !== 'clickTapDirection') return;
                
                const isCorrect = direction === problem.correctAnswer;
                
                // Show visual feedback on the clock
                clickFeedback = {
                    type: 'direction',
                    value: direction,
                    correct: isCorrect
                };
                
                // Update feedback area
                feedbackArea.textContent = isCorrect ? problem.feedbackCorrect : problem.feedbackIncorrect;
                feedbackArea.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
                
                // Play feedback audio
                playAudio(isCorrect ? problem.audioCorrect : problem.audioIncorrect);
                
                // Enable/disable next button
                nextButton.disabled = !isCorrect;
                
                // Reset feedback after a delay
                setTimeout(() => {
                    clickFeedback = null;
                }, 1500);
            }

            // Helper function to calculate distance from point to line
            function distToLine(p, v, w) {
                // Return minimum distance between line segment vw and point p
                const l2 = p5.Vector.sub(v, w).magSq();  // i.e. |w-v|^2 - avoid sqrt
                if (l2 === 0) return p.dist(v);   // v == w case
                // Consider the line extending the segment, parameterized as v + t (w - v).
                // We find projection of point p onto the line. 
                // It falls where t = [(p-v) . (w-v)] / |w-v|^2
                // We clamp t from [0,1] to handle points outside the segment vw.
                const t = Math.max(0, Math.min(1, p5.Vector.sub(p, v).dot(p5.Vector.sub(w, v)) / l2));
                const projection = p5.Vector.add(v, p5.Vector.mult(p5.Vector.sub(w, v), t));
                return p.dist(projection);
            }

            // Custom helper to calculate distance to a line from point to origin
            function distToLine(p, start, end) {
                const d = p5.Vector.dist(start, end);
                if (d === 0) return p.mag(); // Start and end are the same point
                
                // Calculate the normalized dot product
                const t = p5.Vector.dot(p, end) / (d * d);
                
                if (t < 0) {
                    // Closest to start point
                    return p.dist(start);
                } else if (t > 1) {
                    // Closest to end point
                    return p.dist(end);
                } else {
                    // Closest to some point on the line
                    const projection = p5.Vector.add(p5.Vector.mult(start, 1 - t), p5.Vector.mult(end, t));
                    return p.dist(projection);
                }
            }
        });

        return currentP5Instance;
    }

    // Create option buttons for multiple choice questions
    function createOptionButtons(problem) {
        checkArea.innerHTML = '';
        
        problem.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => {
                handleOptionClick(option, problem);
            });
            checkArea.appendChild(button);
        });
    }

    function handleOptionClick(selectedOption, problem) {
        const isCorrect = selectedOption === problem.correctAnswer;
        
        // Update feedback area
        feedbackArea.textContent = isCorrect ? problem.feedbackCorrect : problem.feedbackIncorrect;
        feedbackArea.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
        
        // Highlight the selected button
        const buttons = checkArea.querySelectorAll('.option-button');
        buttons.forEach(button => {
            if (button.textContent === selectedOption) {
                button.className = isCorrect ? 'option-button correct-answer-highlight' : 'option-button incorrect-answer-flash';
            }
        });
        
        // Play feedback audio
        playAudio(isCorrect ? problem.audioCorrect : problem.audioIncorrect);
        
        // Enable/disable next button
        nextButton.disabled = !isCorrect;
    }
    
    // --- Initial Load Function ---
    function loadProblem(index) {
        const problem = problems[index];
        
        // Clear previous content
        checkArea.innerHTML = '';
        feedbackArea.textContent = '';
        feedbackArea.className = 'feedback';
        
        // Update UI elements
        titleElement.textContent = `Question ${index + 1}`;
        instructionElement.innerHTML = problem.questionText;
        lessonCounterElement.textContent = `Do It - Problem ${index + 1} of ${problems.length}`;
        
        // Create p5.js sketch for clock
        createClockSketch(problem.p5config);
        
        // Create option buttons for MCQ, True/False, or Yes/No questions
        if (problem.type === 'mcq' || problem.type === 'trueFalse' || problem.type === 'yesNo') {
            createOptionButtons(problem);
        }
        
        // By default, disable the next button until correct answer
        nextButton.disabled = true;
        
        // Play instruction audio
        currentAudioFilename = problem.audio;
        playAudio(problem.audio);
    }
    
    // --- Event Listeners ---
    // Audio button
    if (audioButton) {
        audioButton.addEventListener('click', () => {
            playAudio(currentAudioFilename);
        });
    }
    
    // Navigation
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentProblemIndex < problems.length - 1) {
                currentProblemIndex++;
                loadProblem(currentProblemIndex);
            } else {
                // Navigate to Show It page
                window.location.href = 'show-it.html';
            }
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentProblemIndex > 0) {
                currentProblemIndex--;
                loadProblem(currentProblemIndex);
            } else {
                // Navigate to Try It page
                window.location.href = 'try-it.html';
            }
        });
    }
    
    // Add CSS for option buttons
    const style = document.createElement('style');
    style.textContent = `
        .option-button {
            background-color: #f0f6ff;
            border: 2px solid #2271b3;
            border-radius: 10px;
            color: #333;
            cursor: pointer;
            font-size: 16px;
            margin: 8px;
            padding: 10px 20px;
            transition: all 0.3s;
        }
        .option-button:hover {
            background-color: #e0e6ff;
        }
        .correct-answer-highlight {
            background-color: #28cc71 !important;
            color: white;
            border-color: #28cc71;
        }
        .incorrect-answer-flash {
            background-color: #ff5c5c !important;
            color: white;
            border-color: #ff5c5c;
            animation: flashRed 0.5s;
        }
        @keyframes flashRed {
            0% { background-color: #ff5c5c; }
            50% { background-color: #ffaaaa; }
            100% { background-color: #ff5c5c; }
        }
    `;
    document.head.appendChild(style);
    
    // Start with first problem
    loadProblem(0);
});
