import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function ModuleEditor() {
  const {
    programId,
    moduleId,
  } = useParams();

  const navigate = useNavigate();

  const [program, setProgram] = useState(() => {
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

  const [title, setTitle] = useState(
    module?.title || ""
  );

  const [description, setDescription] =
    useState(
      module?.description || ""
    );

  const [contentType, setContentType] =
    useState(
      module?.contentType || "Video"
    );

  const [content, setContent] =
    useState(
      module?.content || ""
    );

  const [questions, setQuestions] =
    useState(
      Array.isArray(module?.questions)
        ? module.questions
        : []
    );

  const [passingScore, setPassingScore] =
    useState(
      module?.passingScore ?? 70
    );

  if (!program || !module) {
    return (
      <div className="app">
        <header className="navbar">
          <Link
            to="/admin"
            className="navbar-brand"
          >
            Onboard
          </Link>

          <div className="navbar-right">
            <ThemeToggle />
            <span>Admin</span>
          </div>
        </header>

        <main className="admin-page">
          <div className="empty-journey">
            <div className="empty-icon">
              ?
            </div>

            <h3>
              Module not found
            </h3>

            <p>
              This module may have been
              deleted or does not exist.
            </p>

            <Link
              to={
                program
                  ? `/admin/program/${program.id}`
                  : "/admin"
              }
              className="start-button"
            >
              Back to Program
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const updateQuestion = (
    questionIndex,
    field,
    value
  ) => {
    setQuestions((current) =>
      current.map(
        (question, index) => {
          if (
            index !== questionIndex
          ) {
            return question;
          }

          return {
            ...question,
            [field]: value,
          };
        }
      )
    );
  };

  const updateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setQuestions((current) =>
      current.map(
        (question, index) => {
          if (
            index !== questionIndex
          ) {
            return question;
          }

          const updatedOptions = [
            ...(question.options ||
              []),
          ];

          updatedOptions[
            optionIndex
          ] = value;

          return {
            ...question,
            options:
              updatedOptions,
          };
        }
      )
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [
      ...current,
      {
        id: Date.now(),
        question: "",
        options: [
          "",
          "",
          "",
          "",
        ],
        correctAnswer: 0,
      },
    ]);
  };

  const deleteQuestion = (
    questionIndex
  ) => {
    setQuestions((current) =>
      current.filter(
        (_, index) =>
          index !== questionIndex
      )
    );
  };

  const saveChanges = (event) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !description.trim()
    ) {
      return;
    }

    const updatedModules =
      (
        Array.isArray(
          program.modules
        )
          ? program.modules
          : []
      ).map((item) => {
        if (
          String(item.id) !==
          String(module.id)
        ) {
          return item;
        }

        return {
          ...item,
          title: title.trim(),
          description:
            description.trim(),
          contentType,
          content,
          questions:
            contentType === "Quiz"
              ? questions
              : [],
          passingScore:
            contentType === "Quiz"
              ? Number(passingScore)
              : 0,
        };
      });

    const updatedProgram = {
      ...program,
      modules: updatedModules,
    };

    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    if (!savedPrograms) return;

    try {
      const programs =
        JSON.parse(savedPrograms);

      const updatedPrograms =
        programs.map((item) =>
          String(item.id) ===
          String(program.id)
            ? updatedProgram
            : item
        );

      localStorage.setItem(
        "onboardingPrograms",
        JSON.stringify(
          updatedPrograms
        )
      );

      setProgram(updatedProgram);

      navigate(
        `/admin/program/${program.id}`
      );
    } catch {
      return;
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <Link
          to="/admin"
          className="navbar-brand"
        >
          Onboard
        </Link>

        <div className="navbar-right">
          <Link
            to={`/admin/program/${program.id}`}
            className="editor-exit-button"
          >
            ← Exit
          </Link>

          <ThemeToggle />

          <span>Admin</span>
        </div>
      </header>

      <main className="admin-page">
        <section className="editor-header">
          <div>
            <p className="label">
              EDIT MODULE
            </p>

            <h1>Edit module</h1>

            <p>
              Update the content and learning
              experience for this module.
            </p>
          </div>
        </section>

        <form
          className="module-editor"
          onSubmit={saveChanges}
        >
          <section className="editor-section">
            <div className="editor-section-heading">
              <p className="label">
                MODULE DETAILS
              </p>

              <h2>
                Basic information
              </h2>

              <p>
                Define what the learner will
                see before starting the module.
              </p>
            </div>

            <div className="form-group">
              <label>
                Module title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Store Navigation"
              />
            </div>

            <div className="form-group">
              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="What will the employee learn?"
              />
            </div>

            <div className="form-group">
              <label>
                Content type
              </label>

              <select
                value={contentType}
                onChange={(event) =>
                  setContentType(
                    event.target.value
                  )
                }
              >
                <option value="Video">
                  Video
                </option>

                <option value="Guide">
                  Guide
                </option>

                <option value="Task">
                  Task
                </option>

                <option value="Quiz">
                  Quiz
                </option>
              </select>
            </div>
          </section>

          {contentType ===
            "Video" && (
            <section className="editor-section">
              <div className="editor-section-heading">
                <p className="label">
                  VIDEO
                </p>

                <h2>
                  Video content
                </h2>

                <p>
                  Add a YouTube video URL
                  for this module.
                </p>
              </div>

              <div className="form-group">
                <label>
                  YouTube URL
                </label>

                <input
                  type="url"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </section>
          )}

          {contentType ===
            "Guide" && (
            <section className="editor-section">
              <div className="editor-section-heading">
                <p className="label">
                  GUIDE
                </p>

                <h2>
                  Guide content
                </h2>

                <p>
                  Write the instructions or
                  information the learner
                  needs to read.
                </p>
              </div>

              <div className="form-group">
                <label>
                  Guide instructions
                </label>

                <textarea
                  className="editor-large-textarea"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Write the guide content here..."
                />
              </div>
            </section>
          )}

          {contentType ===
            "Task" && (
            <section className="editor-section">
              <div className="editor-section-heading">
                <p className="label">
                  TASK
                </p>

                <h2>
                  Task instructions
                </h2>

                <p>
                  Tell the learner what they
                  need to complete.
                </p>
              </div>

              <div className="form-group">
                <label>
                  Instructions
                </label>

                <textarea
                  className="editor-large-textarea"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Write the task instructions here..."
                />
              </div>
            </section>
          )}

          {contentType ===
            "Quiz" && (
            <section className="editor-section">
              <div className="editor-section-heading">
                <p className="label">
                  QUIZ
                </p>

                <h2>
                  Quiz builder
                </h2>

                <p>
                  Create questions and define
                  the passing score.
                </p>
              </div>

              <div className="form-group">
                <label>
                  Passing score (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(event) =>
                    setPassingScore(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="quiz-editor-list">
                {questions.length ===
                0 ? (
                  <div className="quiz-empty">
                    <h3>
                      No questions yet
                    </h3>

                    <p>
                      Add your first question
                      to build the quiz.
                    </p>
                  </div>
                ) : (
                  questions.map(
                    (
                      question,
                      questionIndex
                    ) => (
                      <div
                        className="quiz-editor-card"
                        key={
                          question.id ||
                          questionIndex
                        }
                      >
                        <div className="quiz-editor-top">
                          <span>
                            Question{" "}
                            {questionIndex +
                              1}
                          </span>

                          <button
                            type="button"
                            className="quiz-delete-button"
                            onClick={() =>
                              deleteQuestion(
                                questionIndex
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>

                        <div className="form-group">
                          <label>
                            Question
                          </label>

                          <input
                            type="text"
                            value={
                              question.question ||
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateQuestion(
                                questionIndex,
                                "question",
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="e.g. What should you do before entering the store?"
                          />
                        </div>

                        <div className="quiz-options">
                          <label className="quiz-options-label">
                            Answer options
                          </label>

                          {(
                            question.options ||
                            []
                          ).map(
                            (
                              option,
                              optionIndex
                            ) => (
                              <div
                                className="quiz-option-editor"
                                key={
                                  optionIndex
                                }
                              >
                                <span className="quiz-option-number">
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                                </span>

                                <input
                                  type="text"
                                  value={
                                    option
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateOption(
                                      questionIndex,
                                      optionIndex,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder={`Option ${
                                    optionIndex +
                                    1
                                  }`}
                                />

                                <label className="correct-answer-label">
                                  <input
                                    type="radio"
                                    name={`correct-${questionIndex}`}
                                    checked={
                                      Number(
                                        question.correctAnswer
                                      ) ===
                                      optionIndex
                                    }
                                    onChange={() =>
                                      updateQuestion(
                                        questionIndex,
                                        "correctAnswer",
                                        optionIndex
                                      )
                                    }
                                  />

                                  Correct
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              <button
                type="button"
                className="add-question-button"
                onClick={addQuestion}
              >
                + Add Question
              </button>
            </section>
          )}

          <section className="editor-actions">
            <Link
              to={`/admin/program/${program.id}`}
              className="editor-exit-large-button"
            >
              Exit
            </Link>

            <button
              type="submit"
              className="editor-save-button"
            >
              Save changes →
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default ModuleEditor;