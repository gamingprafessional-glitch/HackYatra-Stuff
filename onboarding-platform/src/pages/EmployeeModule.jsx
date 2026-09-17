import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EmployeeModule() {
  const {
    programId,
    moduleId,
  } = useParams();

  const navigate = useNavigate();

  const [data] = useState(() => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    const programs = savedPrograms
      ? JSON.parse(savedPrograms)
      : [];

    const program = programs.find(
      (item) =>
        String(item.id) ===
        String(programId)
    );

    if (!program) {
      return null;
    }

    const modules =
      Array.isArray(program.modules)
        ? program.modules
        : [];

    const module = modules.find(
      (item) =>
        String(item.id) ===
        String(moduleId)
    );

    if (!module) {
      return null;
    }

    return {
      program,
      module,
    };
  });

  const [quizAnswers, setQuizAnswers] =
    useState({});

  const [quizResult, setQuizResult] =
    useState(null);

  if (!data) {
    return (
      <div className="app">

        <header className="navbar">
          <h2>Onboard</h2>
          <span>Employee</span>
        </header>

        <main className="module-page">

          <h1>
            Module not found
          </h1>

          <Link
            to={`/program/${programId}`}
            className="start-button"
          >
            Back to Program
          </Link>

        </main>

      </div>
    );
  }

  const {
    program,
    module,
  } = data;

  /* =========================
     VIDEO URL CONVERTER
  ========================= */

  const getVideoUrl = (url) => {

    if (!url) {
      return "";
    }

    try {
      const parsedUrl =
        new URL(url);

      /* YouTube watch link */

      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        )
      ) {

        const videoId =
          parsedUrl.searchParams.get(
            "v"
          );

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        /* Already an embed URL */

        if (
          parsedUrl.pathname.startsWith(
            "/embed/"
          )
        ) {
          return url;
        }
      }

      /* YouTube short link */

      if (
        parsedUrl.hostname ===
          "youtu.be"
      ) {

        const videoId =
          parsedUrl.pathname.slice(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      /* Other video URLs */

      return url;

    } catch (error) {

      return "";

    }
  };

  const videoUrl =
    getVideoUrl(module.videoUrl);

  /* =========================
     COMPLETE MODULE
  ========================= */

  const markComplete = () => {

    const storageKey =
      `completedModules_${programId}`;

    const saved =
      localStorage.getItem(
        storageKey
      );

    const completed =
      saved
        ? JSON.parse(saved)
        : [];

    const moduleIdString =
      String(module.id);

    if (
      !completed.includes(
        moduleIdString
      )
    ) {
      completed.push(
        moduleIdString
      );
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(completed)
    );

    navigate(
      `/program/${programId}`
    );
  };

  /* =========================
     QUIZ
  ========================= */

  const selectQuizAnswer = (
    questionIndex,
    optionIndex
  ) => {

    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]:
        optionIndex,
    });
  };

  const submitQuiz = () => {

    const questions =
      Array.isArray(module.questions)
        ? module.questions
        : [];

    let score = 0;

    questions.forEach(
      (question, index) => {

        if (
          quizAnswers[index] ===
          question.correctAnswer
        ) {
          score++;
        }

      }
    );

    setQuizResult(score);
  };

  const questions =
    Array.isArray(module.questions)
      ? module.questions
      : [];

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <h2>
          Onboard
        </h2>

        <span>
          {program.role}
        </span>

      </header>

      <main className="module-page">

        {/* =========================
            BACK
        ========================= */}

        <button
          className="back-button"
          onClick={() =>
            navigate(
              `/program/${programId}`
            )
          }
        >
          ← Back to Program
        </button>

        {/* =========================
            MODULE HEADER
        ========================= */}

        <div className="module-header">

          <p className="label">
            MODULE {module.order}
          </p>

          <h1>
            {module.title}
          </h1>

          <p>
            {module.description}
          </p>

        </div>

        {/* =========================
            VIDEO
        ========================= */}

        {module.contentType ===
          "Video" && (

          <div className="video-container">

            {videoUrl ? (

              <div className="video-content">

                <iframe
                  src={videoUrl}
                  title={module.title}
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share
                  "
                  allowFullScreen
                />

              </div>

            ) : (

              <div className="video-placeholder">

                <div className="play-button">
                  ▶
                </div>

                <p>
                  Training Video
                </p>

                <span>
                  Video content will
                  appear here.
                </span>

              </div>

            )}

          </div>

        )}

        {/* =========================
            GUIDE
        ========================= */}

        {module.contentType ===
          "Guide" && (

          <div className="employee-content-card">

            <p className="label">
              LEARNING GUIDE
            </p>

            <h2>
              {module.title}
            </h2>

            <div className="guide-content">

              {module.content ||
                "Guide content will appear here."}

            </div>

          </div>

        )}

        {/* =========================
            TASK
        ========================= */}

        {module.contentType ===
          "Task" && (

          <div className="employee-content-card">

            <p className="label">
              TASK
            </p>

            <h2>
              Complete this task
            </h2>

            <div className="task-content">

              {module.task ||
                "Task instructions will appear here."}

            </div>

          </div>

        )}

        {/* =========================
            QUIZ
        ========================= */}

        {module.contentType ===
          "Quiz" && (

          <div className="quiz-section">

            <div className="quiz-header">

              <p className="label">
                KNOWLEDGE CHECK
              </p>

              <h2>
                {module.title}
              </h2>

              <p>
                Answer the questions below
                to complete this module.
              </p>

            </div>

            {questions.length === 0 ? (

              <p className="field-help">
                This quiz has not been
                configured yet.
              </p>

            ) : (

              questions.map(
                (
                  question,
                  questionIndex
                ) => (

                  <div
                    className="question"
                    key={question.id}
                  >

                    <h3>
                      {questionIndex + 1}.
                      {" "}
                      {question.question}
                    </h3>

                    <div className="options">

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <button
                            key={optionIndex}
                            className={
                              quizAnswers[
                                questionIndex
                              ] ===
                              optionIndex
                                ? "option selected"
                                : "option"
                            }
                            onClick={() =>
                              selectQuizAnswer(
                                questionIndex,
                                optionIndex
                              )
                            }
                            disabled={
                              quizResult !==
                              null
                            }
                          >
                            {option}
                          </button>

                        )
                      )}

                    </div>

                  </div>

                )
              )

            )}

            {questions.length > 0 &&
              quizResult === null && (

              <button
                className="quiz-submit"
                onClick={submitQuiz}
                disabled={
                  Object.keys(
                    quizAnswers
                  ).length !==
                  questions.length
                }
              >
                Submit Quiz →
              </button>

            )}

            {quizResult !== null && (

              <div className="quiz-result">

                {quizResult >=
                  (module.passingScore ||
                    questions.length) ? (

                  <>
                    <h3>
                      🎉 Quiz Passed!
                    </h3>

                    <p>
                      You scored{" "}
                      {quizResult} out of{" "}
                      {questions.length}.
                    </p>

                    <button
                      onClick={
                        markComplete
                      }
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
                      You scored{" "}
                      {quizResult} out of{" "}
                      {questions.length}.
                    </p>

                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                    >
                      Retry Quiz
                    </button>
                  </>

                )}

              </div>

            )}

          </div>

        )}

        {/* =========================
            COMPLETE
        ========================= */}

        {module.contentType !==
          "Quiz" && (

          <div className="complete-section">

            <p>
              Complete the learning material
              and mark this module as complete.
            </p>

            <button
              onClick={markComplete}
            >
              Complete Module →
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default EmployeeModule;