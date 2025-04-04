/**
 * Configuration data for the first lesson: "Time - Lesson 1: Meet the Clock!"
 * This data will be processed by StepFactory to create step instances
 */
const lesson1Data = [
  {
    id: 1,
    stepType: "warm-up",
    title: "Clock Number Check",
    goal: "Quickly activate number recognition 1-12 and their key positions on a clock face.",
    screen: {
      type: "clock-face",
      config: {
        missingNumbers: [2, 5, 11],
        anchors: [12, 3, 6, 9]
      }
    },
    characterPrompt: "Welcome, time explorers! Let's quickly check this clock. A few numbers are missing! Can you type the correct number in each empty box?",
    interaction: {
      type: "text-input",
      description: "Student clicks an empty box; a simple number keypad appears. Student types the correct number for that position.",
      correctAnswers: {
        "2": "2",
        "5": "5", 
        "11": "11"
      }
    },
    feedback: {
      correct: "Correct entry fills the box permanently with a brief green check.",
      incorrect: "Incorrect entry flashes red, clears input, prompts \"Try again!\"",
      completion: "Completion triggers a quick \"Perfect!\" animation/sound."
    },
    transition: "Great! All numbers accounted for. Now let's learn about the parts of the clock!"
  },
  {
    id: 2,
    stepType: "learn-it",
    title: "Clock Parts Explorer",
    goal: "Introduce clock parts including face, numbers, hands, and clockwise movement.",
    chunks: [
      {
        id: "2.1",
        title: "The Face & Numbers",
        goal: "Introduce the clock face and the sequence of numbers 1-12.",
        screen: {
          type: "clock-face",
          config: {
            highlightNumbers: true
          }
        },
        characterPrompt: "This is a **clock face**! It helps us tell time. Look at the numbers. They go in order all the way around, starting from 1, then 2, 3... up to 12 at the very top.",
        vocabulary: ["Clock Face"],
        interaction: {
          type: "click-tap",
          description: "Quick check! The numbers go in order. Click the number that comes **right after** the number 8.",
          correctAnswer: "9"
        },
        feedback: {
          correct: "Correct!",
          incorrect: "Think about counting! What number comes after 8? Find it on the clock face and click it."
        }
      },
      {
        id: "2.2",
        title: "The Hands",
        goal: "Introduce and differentiate hour and minute hands.",
        screen: {
          type: "clock-face",
          config: {
            time: "3:00",
            hourHandColor: "blue",
            minuteHandColor: "red"
          }
        },
        characterPrompt: "See these pointers? They are called hands! This short, blue hand is the **Hour Hand**. It tells us the hour.",
        followUpPrompt: "This long, red hand is the **Minute Hand**. It tells us the minutes.",
        hint: "Easy way to remember: Hour hand is short, Minute hand is long!",
        vocabulary: ["Hour Hand", "Minute Hand"],
        interaction: [
          {
            type: "click-tap",
            description: "Click on the **Hour Hand** (the short one).",
            correctAnswer: "hour-hand",
            feedback: {
              correct: "You got it! That's the short hour hand.",
              incorrect: "Oops! Remember, the hour hand is the *short* one. Click the short hand."
            }
          },
          {
            type: "click-tap",
            description: "Now, click on the **Minute Hand** (the long one).",
            correctAnswer: "minute-hand",
            feedback: {
              correct: "Perfect! That's the long minute hand.",
              incorrect: "Careful! The minute hand is the *long* one. Click the long hand."
            }
          }
        ]
      },
      {
        id: "2.3",
        title: "Clockwise Direction",
        goal: "Introduce clockwise movement.",
        screen: {
          type: "clock-face",
          config: {
            animated: true,
            clockwise: true
          }
        },
        characterPrompt: "Watch how the hands move! They always go around in the same direction, past 1, 2, 3... This special direction is called **Clockwise**.",
        vocabulary: ["Clockwise"],
        interaction: {
          type: "click-tap",
          description: "Which arrow shows the clockwise direction?",
          options: [
            { id: "clockwise", display: "↻" },
            { id: "counter-clockwise", display: "↺" }
          ],
          correctAnswer: "clockwise"
        },
        feedback: {
          correct: "Correct!",
          incorrect: "Clockwise follows the numbers 1, 2, 3... Try again!"
        }
      }
    ]
  },
  {
    id: 3,
    stepType: "try-it",
    title: "Guided Hand Spotting",
    goal: "Guided practice identifying hands and direction.",
    screens: [
      {
        id: "3.1",
        title: "Hour Hand Identification",
        config: { time: "6:00" },
        prompt: "Find the **Hour Hand**. Remember, it's the short one. Click it!",
        interaction: {
          type: "click-tap",
          correctAnswer: "hour-hand"
        },
        feedback: {
          correct: "You got it! That's the short hour hand.",
          incorrect: "Hmm, that's the long hand. The hour hand is the *shorter* one. Click the short hand."
        }
      },
      {
        id: "3.2",
        title: "Minute Hand Identification",
        config: { time: "9:00" },
        prompt: "Now, find the **Minute Hand**. It's the long one. Click it!",
        interaction: {
          type: "click-tap",
          correctAnswer: "minute-hand"
        },
        feedback: {
          correct: "Great job! That's the long minute hand.",
          incorrect: "That's not right. The minute hand is the *longer* one. Click the long hand."
        }
      },
      {
        id: "3.3",
        title: "Clockwise Direction Verification",
        config: { animated: true, clockwise: true },
        prompt: "Are they moving **Clockwise**? Click Yes or No.",
        interaction: {
          type: "yes-no",
          correctAnswer: "yes"
        },
        feedback: {
          correct: "Correct! They are moving clockwise.",
          incorrect: "Look closely! They are following the numbers 1, 2, 3... That *is* clockwise."
        }
      },
      {
        id: "3.4",
        title: "Clockwise Direction Practice",
        config: { static: true },
        prompt: "Which way is clockwise? Drag the arrow around the clock in the clockwise direction.",
        interaction: {
          type: "drag-drop",
          element: "arrow",
          correctDirection: "clockwise"
        },
        feedback: {
          correct: "Perfect! That's clockwise!",
          incorrect: "Not quite. Remember, clockwise follows the numbers around..."
        }
      }
    ]
  },
  {
    id: 4,
    stepType: "do-it",
    title: "Clock Detective Practice",
    goal: "Independent practice identifying hands and direction with variety.",
    instructions: "Let's see if you can identify the parts of a clock and understand clockwise movement. Answer each question carefully.",
    problems: [
      {
        id: "4.1",
        type: "multiple-choice",
        config: { time: "2:30" },
        prompt: "Which is the Hour Hand?",
        options: ["Short hand", "Long hand"],
        correctAnswer: "Short hand",
        feedback: {
          correct: "That's right! The hour hand is the shorter hand.",
          incorrect: "Not quite. Remember, the hour hand is the shorter of the two hands."
        }
      },
      {
        id: "4.2",
        type: "click-tap",
        config: { time: "8:15" },
        prompt: "Click the Minute Hand.",
        correctAnswer: "minute-hand",
        feedback: {
          correct: "Excellent! You correctly identified the minute hand.",
          incorrect: "That's not the minute hand. The minute hand is the longer hand."
        }
      },
      {
        id: "4.3",
        type: "click-tap",
        config: { time: "10:50" },
        prompt: "Click the Hour Hand.",
        correctAnswer: "hour-hand",
        feedback: {
          correct: "Well done! You found the hour hand.",
          incorrect: "Look carefully. The hour hand is the shorter hand."
        }
      },
      {
        id: "4.4",
        type: "true-false",
        config: { time: "4:45" },
        prompt: "The red hand [or longer hand] is the Minute Hand.",
        correctAnswer: true,
        feedback: {
          correct: "Yes! The longer, red hand is indeed the minute hand.",
          incorrect: "That's not correct. The longer hand (often shown in red) is the minute hand."
        }
      },
      {
        id: "4.5",
        type: "click-tap",
        config: { time: "1:20" },
        prompt: "Click the Hour Hand.",
        correctAnswer: "hour-hand",
        feedback: {
          correct: "Perfect! You identified the hour hand correctly.",
          incorrect: "That's the minute hand. The hour hand is shorter."
        }
      },
      {
        id: "4.6",
        type: "click-tap",
        config: { time: "7:05" },
        prompt: "Click the Minute Hand.",
        correctAnswer: "minute-hand",
        feedback: {
          correct: "Great job! You found the minute hand.",
          incorrect: "That's not the minute hand. The minute hand is longer."
        }
      },
      {
        id: "4.7",
        type: "yes-no",
        config: { animated: true, clockwise: true },
        prompt: "Are these hands moving Clockwise?",
        correctAnswer: "yes",
        feedback: {
          correct: "Yes, that's right! The hands are moving clockwise.",
          incorrect: "Actually, they are moving clockwise - following the order of numbers 1, 2, 3..."
        }
      },
      {
        id: "4.8",
        type: "click-tap",
        config: { 
          arrows: [
            { id: "clockwise", display: "↻" },
            { id: "counter-clockwise", display: "↺" }
          ]
        },
        prompt: "Click the arrow that shows Clockwise.",
        correctAnswer: "clockwise",
        feedback: {
          correct: "Correct! This arrow (↻) shows the clockwise direction.",
          incorrect: "That's not the clockwise direction. Clockwise follows the sequence of numbers on the clock."
        }
      }
    ],
    completion: {
      message: "Great work! You're becoming a clock detective!",
      reward: "star"
    }
  },
  {
    id: 5,
    stepType: "show-it",
    title: "Clock Expert Check",
    goal: "Assess mastery of objectives without hints.",
    introduction: "Now it's time to show what you've learned about clocks!",
    questions: [
      {
        id: "5.1",
        type: "click-tap",
        config: { time: "5:00" },
        prompt: "Click the Hour Hand.",
        correctAnswer: "hour-hand",
        feedback: {
          correct: "Correct",
          incorrect: "Incorrect"
        }
      },
      {
        id: "5.2",
        type: "click-tap",
        config: { time: "8:00" },
        prompt: "Click the Minute Hand.",
        correctAnswer: "minute-hand",
        feedback: {
          correct: "Correct",
          incorrect: "Incorrect"
        }
      },
      {
        id: "5.3",
        type: "multiple-choice",
        config: { time: "12:00" },
        prompt: "Which hand is LONGER?",
        options: ["Hour Hand", "Minute Hand"],
        correctAnswer: "Minute Hand",
        feedback: {
          correct: "Correct",
          incorrect: "Incorrect"
        }
      },
      {
        id: "5.4",
        type: "yes-no",
        config: { animated: true, clockwise: true },
        prompt: "Is this Clockwise?",
        correctAnswer: "yes",
        feedback: {
          correct: "Correct",
          incorrect: "Incorrect"
        }
      }
    ],
    feedback: {
      completion: "Overall score/status at end.",
      remediation: "If < 3 correct, offer targeted review (Learn It chunks or Try It) based on errors. If >= 3 correct, proceed."
    }
  },
  {
    id: 6,
    stepType: "extension",
    title: "Clocks Around Us",
    goal: "Connect learning to the real world.",
    screen: {
      type: "image-gallery",
      config: {
        images: [
          { src: "wall-clock.jpg", alt: "Wall Clock" },
          { src: "wrist-watch.jpg", alt: "Wrist Watch" }
        ]
      }
    },
    characterPrompt: "Wow, you're becoming a clock expert! Clocks are everywhere. Can you spot the hour and minute hands on these? Maybe you can find a clock in your home or classroom later!",
    transition: "Next time, we'll start learning what these hands actually tell us about the time!"
  }
];

export default lesson1Data; 