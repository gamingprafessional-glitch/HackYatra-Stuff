import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=...
    const videoId =
      parsedUrl.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be/...
    if (
      parsedUrl.hostname.includes(
        "youtu.be"
      )
    ) {
      const id =
        parsedUrl.pathname.replace(
          "/",
          ""
        );

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    // youtube.com/embed/...
    if (
      parsedUrl.pathname.startsWith(
        "/embed/"
      )
    ) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
}

function EmployeeModule() {
  const {
    programId,
    moduleId,
  } = useParams();

  const navigate = useNavigate();

  const [program] = useState(() => {
    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    if (!savedPrograms) return null;

    try {
      const programs =
        JSON.parse(savedPrograms);

      return programs.find(
        (item) =>
          String(item.id) ===
          String(programId)
      );
    } catch {
      return null;
    }
  });

  const module = program
    ? (
        Array.isArray(program.modules)
          ? program.modules
          : []
      ).find(
        (item) =>
          String(item.id) ===
          String(moduleId)
      )
    : null;

  const questions = Array.isArray(
    module?.questions
  )
    ? module.questions
    : [];

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [quizResult, setQuizResult] =
    useState(null);

  const [completed, setCompleted] =
    useState(() => {
      if (!program) return false;

      const saved =
        localStorage.getItem(
          `completedModules_${program.id}`
        );

      if (!saved) return false;

      try {
        const completedModules =
          JSON.parse(saved);

        return completedModules.includes(
          String(moduleId)
        );
      } catch {
        return false;
      }
    });

  if (!program || !module) {
    return (
      <div className="preview-app">
        <header className="preview-navbar">
          <Link
            to="/admin"
            className="preview-logo"
          >
            Onboard
          </Link>

          <div className="preview-navbar-right">
            <ThemeToggle />
            <span>Employee</span>
          </div>
        </header>

        <main className="preview-container">
          <div className="preview-empty">
            <div className="preview-empty-icon">
              ?
            </div>

            <h2>
              Module not found
            </h2>

            <p>
              This module does not exist.
            </p>

            <Link
              to={`/program/${programId}`}
              className="preview-primary-button"
            >
              Back to Program
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const markModuleComplete = () => {
    const storageKey =
      `completedModules_${program.id}`;

    const saved =
      localStorage.getItem(storageKey);

    let completedModules = [];

    if (saved) {
      try {
        completedModules =
          JSON.parse(saved);
      } catch {
        completedModules = [];
      }
    }

    const moduleIdString =
      String(module.id);

    if (
      !completedModules.includes(
        moduleIdString
      )
    ) {
      completedModules.push(
        moduleIdString
      );
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(completedModules)
    );

    setCompleted(true);
  };

  const goBackToProgram = () => {
    navigate(
      `/program/${program.id}`
    );
  };

  const handleAnswer = (
    questionIndex,
    optionIndex
  ) => {
    if (quizResult !== null) {
      return;
    }

    setSelectedAnswers(
      (current) => ({
        ...current,
        [questionIndex]:
          optionIndex,
      })
    );
  };

  const submitQuiz = (event) => {
    event.preventDefault();

    if (questions.length === 0) {
      return;
    }

    // Don't allow submission until
    // every question has an answer.
    const unansweredQuestions =
      questions.some(
        (_, index) =>
          selectedAnswers[index] ===
          undefined
      );

    if (unansweredQuestions) {
      return;
    }

    let correctAnswers = 0;

    questions.forEach(
      (question, index) => {
        const selectedAnswer =
          Number(
            selectedAnswers[index]
          );

        const correctAnswer =
          Number(
            question.correctAnswer
          );

        if (
          selectedAnswer ===
          correctAnswer
        ) {
          correctAnswers += 1;
        }
      }
    );

    const percentage = Math.round(
      (correctAnswers /
        questions.length) *
        100
    );

    const requiredScore =
      Number(
        module.passingScore
      ) || 70;

    const passed =
      percentage >= requiredScore;

    setQuizResult({
      correctAnswers,
      totalQuestions:
        questions.length,
      percentage,
      passingScore:
        requiredScore,
      passed,
    });

    if (passed) {
      markModuleComplete();
    }
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setQuizResult(null);
    setCompleted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderVideo = () => {
    const embedUrl =
      getYouTubeEmbedUrl(
        module.content
      );

    if (!embedUrl) {
      return (
        <div className="employee-content-empty">
          <h3>
            No video added yet
          </h3>

          <p>
            This module does not have a
            video assigned.
          </p>
        </div>
      );
    }

    return (
      <div className="employee-video-wrapper">
        <iframe
          src={embedUrl}
          title={module.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  };

  const renderGuide = () => {
    return (
      <div className="employee-text-content">
        {module.content ? (
          <p>
            {module.content}
          </p>
        ) : (
          <>
            <h3>
              No guide content yet
            </h3>

            <p>
              Your administrator has not
              added instructions for this
              module.
            </p>
          </>
        )}
      </div>
    );
  };

  const renderTask = () => {
    return (
      <div className="employee-task-content">
        <div className="employee-task-icon">
          ✓
        </div>

        <div>
          <h3>
            Complete this task
          </h3>

          <p>
            {module.content ||
              "Complete the assigned task before continuing."}
          </p>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (questions.length === 0) {
      return (
        <div className="employee-content-empty">
          <h3>
            No questions available
          </h3>

          <p>
            This quiz has not been configured
            yet.
          </p>
        </div>
      );
    }

    return (
      <form
        className="employee-quiz"
        onSubmit={submitQuiz}
      >
        <div className="employee-quiz-header">
          <div>
            <p className="preview-label">
              QUIZ
            </p>

            <h2>
              Check your knowledge
            </h2>

            <p>
              Answer all questions and
              submit your quiz.
            </p>
          </div>

          <div className="employee-quiz-score-info">
            Pass:{" "}
            {Number(
              module.passingScore
            ) || 70}
            %
          </div>
        </div>

        <div className="employee-question-list">
          {questions.map(
            (question, questionIndex) => {
              const selected =
                selectedAnswers[
                  questionIndex
                ];

              const correctAnswer =
                Number(
                  question.correctAnswer
                );

              return (
                <div
                  className="employee-question-card"
                  key={
                    question.id ||
                    questionIndex
                  }
                >
                  <div className="employee-question-number">
                    Question{" "}
                    {questionIndex + 1}
                  </div>

                  <h3>
                    {question.question}
                  </h3>

                  <div className="employee-options">
                    {(
                      question.options ||
                      []
                    ).map(
                      (
                        option,
                        optionIndex
                      ) => {
                        const isSelected =
                          selected ===
                          optionIndex;

                        const isCorrect =
                          quizResult !==
                            null &&
                          optionIndex ===
                            correctAnswer;

                        const isWrongSelected =
                          quizResult !==
                            null &&
                          isSelected &&
                          optionIndex !==
                            correctAnswer;

                        return (
                          <label
                            key={
                              optionIndex
                            }
                            className={[
                              "employee-option",
                              isSelected
                                ? "employee-option-selected"
                                : "",
                              isCorrect
                                ? "employee-option-correct"
                                : "",
                              isWrongSelected
                                ? "employee-option-wrong"
                                : "",
                            ]
                              .filter(
                                Boolean
                              )
                              .join(" ")}
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              checked={
                                isSelected
                              }
                              disabled={
                                quizResult !==
                                null
                              }
                              onChange={() =>
                                handleAnswer(
                                  questionIndex,
                                  optionIndex
                                )
                              }
                            />

                            <span className="employee-option-letter">
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </span>

                            <span>
                              {option}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {quizResult === null && (
          <div className="employee-quiz-actions">
            <button
              type="submit"
              className="employee-submit-quiz-button"
              disabled={
                questions.some(
                  (_, index) =>
                    selectedAnswers[
                      index
                    ] === undefined
                )
              }
            >
              Submit Quiz →
            </button>
          </div>
        )}

        {quizResult !== null && (
          <div
            className={`employee-quiz-result ${
              quizResult.passed
                ? "employee-quiz-passed"
                : "employee-quiz-failed"
            }`}
          >
            <div className="employee-result-icon">
              {quizResult.passed
                ? "✓"
                : "!"}
            </div>

            <div className="employee-result-content">
              <h3>
                {quizResult.passed
                  ? "Quiz passed!"
                  : "Quiz not passed"}
              </h3>

              <p>
                You scored{" "}
                <strong>
                  {
                    quizResult.percentage
                  }
                  %
                </strong>{" "}
                (
                {
                  quizResult.correctAnswers
                }
                /
                {
                  quizResult.totalQuestions
                }
                ). You need{" "}
                <strong>
                  {
                    quizResult.passingScore
                  }
                  %
                </strong>{" "}
                to pass.
              </p>

              <div className="employee-result-actions">
                {quizResult.passed ? (
                  <button
                    type="button"
                    className="employee-complete-button"
                    onClick={
                      goBackToProgram
                    }
                  >
                    Module Completed →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="employee-retry-button"
                    onClick={
                      retryQuiz
                    }
                  >
                    ↻ Retry Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    );
  };

  const renderContent = () => {
    switch (
      module.contentType
    ) {
      case "Video":
        return renderVideo();

      case "Guide":
        return renderGuide();

      case "Task":
        return renderTask();

      case "Quiz":
        return renderQuiz();

      default:
        return (
          <div className="employee-content-empty">
            <h3>
              Content unavailable
            </h3>

            <p>
              This module does not have a
              supported content type.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="preview-app">
      <header className="preview-navbar">
        <Link
          to={`/program/${program.id}`}
          className="preview-logo"
        >
          Onboard
        </Link>

        <div className="preview-navbar-right">
          <ThemeToggle />

          <span>Employee</span>
        </div>
      </header>

      <main className="employee-module-container">
        <div className="employee-module-topbar">
          <Link
            to={`/program/${program.id}`}
            className="employee-back-link"
          >
            ← Back to onboarding
          </Link>

          <span className="employee-module-type-label">
            {module.contentType}
          </span>
        </div>

        <section className="employee-module-header">
          <p className="preview-label">
            MODULE{" "}
            {module.order || ""}
          </p>

          <h1>{module.title}</h1>

          <p>
            {module.description}
          </p>
        </section>

        <section className="employee-module-content-card">
          {renderContent()}
        </section>

        {module.contentType !==
          "Quiz" && (
          <div className="employee-module-bottom-actions">
            {completed ? (
              <button
                type="button"
                className="employee-completed-button"
                onClick={
                  goBackToProgram
                }
              >
                ✓ Completed — Back to
                Program
              </button>
            ) : (
              <button
                type="button"
                className="employee-complete-button"
                onClick={
                  () => {
                    markModuleComplete();
                    navigate(
                      `/program/${program.id}`
                    );
                  }
                }
              >
                Mark as Complete →
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeeModule;