import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Module3() {
  const navigate = useNavigate();

  const questions = [
    {
      question: "What should you do when you receive a new task?",
      options: [
        "Ignore it",
        "Check the task details and begin the assigned work",
        "Wait for someone else to do it",
        "Leave the workplace",
      ],
      answer: 1,
    },
    {
      question: "What should you do if you don't understand a task?",
      options: [
        "Guess and continue",
        "Ignore the task",
        "Ask the appropriate supervisor or team member",
        "Go home",
      ],
      answer: 2,
    },
    {
      question: "Why is following the correct workflow important?",
      options: [
        "It helps work stay organized and reduces mistakes",
        "It makes the day longer",
        "It avoids learning the process",
        "It means you don't need instructions",
      ],
      answer: 0,
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);

  const selectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const submitQuiz = () => {
    let score = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score++;
      }
    });

    setResult(score);
  };

  const completeModule = () => {
    localStorage.setItem("module3Completed", "true");
    navigate("/");
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  return (
    <div className="app">

      <header className="navbar">
        <h2>Onboard</h2>
        <span>Store Picker</span>
      </header>

      <main className="module-page">

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="module-header">

          <p className="label">
            MODULE 3
          </p>

          <h1>
            Learn Your First Task
          </h1>

          <p>
            Learn the basic workflow and test your understanding
            before completing this module.
          </p>

        </div>

        {/* Training */}
        <div className="video-container">

          <div className="video-placeholder">

            <div className="play-button">
              ▶
            </div>

            <p>
              Training Video
            </p>

            <span>
              Your first task walkthrough
            </span>

          </div>

        </div>

        {/* Lesson */}
        <div className="lesson">

          <h2>
            Before taking the quiz
          </h2>

          <ul>

            <li>
              Understand how a new task is assigned
            </li>

            <li>
              Follow the instructions provided for the task
            </li>

            <li>
              Ask for help when something is unclear
            </li>

            <li>
              Follow the correct workflow
            </li>

          </ul>

        </div>

        {/* Quiz */}
        <div className="quiz-section">

          <div className="quiz-header">
            <p className="label">
              KNOWLEDGE CHECK
            </p>

            <h2>
              Quick Quiz
            </h2>

            <p>
              Answer at least 2 out of 3 questions correctly
              to pass.
            </p>
          </div>

          {questions.map((question, questionIndex) => (

            <div
              className="question"
              key={questionIndex}
            >

              <h3>
                {questionIndex + 1}. {question.question}
              </h3>

              <div className="options">

                {question.options.map(
                  (option, optionIndex) => (

                    <button
                      key={optionIndex}
                      className={
                        selectedAnswers[questionIndex] ===
                        optionIndex
                          ? "option selected"
                          : "option"
                      }
                      onClick={() =>
                        selectAnswer(
                          questionIndex,
                          optionIndex
                        )
                      }
                      disabled={result !== null}
                    >
                      {option}
                    </button>

                  )
                )}

              </div>

            </div>

          ))}

          {/* Quiz Result */}
          {result === null ? (

            <button
              className="quiz-submit"
              onClick={submitQuiz}
              disabled={
                Object.keys(selectedAnswers).length !==
                questions.length
              }
            >
              Submit Quiz →
            </button>

          ) : (

            <div className="quiz-result">

              {result >= 2 ? (

                <>
                  <h3>
                    🎉 Quiz Passed!
                  </h3>

                  <p>
                    You scored {result} out of{" "}
                    {questions.length}.
                  </p>

                  <button
                    onClick={completeModule}
                  >
                    Complete Module →
                  </button>
                </>

              ) : (

                <>
                  <h3>
                    Try Again
                  </h3>

                  <p>
                    You scored {result} out of{" "}
                    {questions.length}.
                    You need at least 2 correct answers
                    to pass.
                  </p>

                  <button
                    onClick={retryQuiz}
                  >
                    Retry Quiz
                  </button>
                </>

              )}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Module3;