import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModuleEditor() {
  const { programId, moduleId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    const programs = savedPrograms
      ? JSON.parse(savedPrograms)
      : [];

    const program = programs.find(
      (item) => String(item.id) === String(programId)
    );

    if (!program) {
      return null;
    }

    const modules = Array.isArray(program.modules)
      ? program.modules
      : [];

    const module = modules.find(
      (item) => String(item.id) === String(moduleId)
    );

    if (!module) {
      return null;
    }

    return {
      program,
      module,
    };
  });

  const [title, setTitle] = useState(
    data?.module?.title || ""
  );

  const [description, setDescription] = useState(
    data?.module?.description || ""
  );

  const [contentType, setContentType] = useState(
    data?.module?.contentType || "Video"
  );

  const [videoUrl, setVideoUrl] = useState(
    data?.module?.videoUrl || ""
  );

  const [content, setContent] = useState(
    data?.module?.content || ""
  );

  const [task, setTask] = useState(
    data?.module?.task || ""
  );

  const [questions, setQuestions] = useState(
    data?.module?.questions || []
  );

  const [questionText, setQuestionText] =
    useState("");

  const [options, setOptions] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [correctAnswer, setCorrectAnswer] =
    useState(0);

  const [passingScore, setPassingScore] =
    useState(
      data?.module?.passingScore ||
      1
    );

  const [saved, setSaved] = useState(false);

  if (!data) {
    return (
      <div className="app">

        <header className="navbar">
          <h2>Onboard</h2>
          <span>Admin</span>
        </header>

        <main className="admin-page">

          <h1>Module not found</h1>

          <button
            className="back-button"
            onClick={() =>
              navigate(
                `/admin/program/${programId}`
              )
            }
          >
            ← Back to Program
          </button>

        </main>

      </div>
    );
  }

  const updateOption = (
    index,
    value
  ) => {

    const updatedOptions = [
      ...options,
    ];

    updatedOptions[index] = value;

    setOptions(updatedOptions);
  };

  const addQuestion = () => {

    if (!questionText.trim()) {
      return;
    }

    if (
      options.some(
        (option) => !option.trim()
      )
    ) {
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: questionText,
      options,
      correctAnswer,
    };

    const updatedQuestions = [
      ...questions,
      newQuestion,
    ];

    setQuestions(updatedQuestions);

    setQuestionText("");

    setOptions([
      "",
      "",
      "",
      "",
    ]);

    setCorrectAnswer(0);
  };

  const deleteQuestion = (
    questionId
  ) => {

    const updatedQuestions =
      questions.filter(
        (question) =>
          question.id !== questionId
      );

    setQuestions(updatedQuestions);
  };

  const saveModule = (event) => {

    event.preventDefault();

    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    const programs = savedPrograms
      ? JSON.parse(savedPrograms)
      : [];

    const updatedPrograms =
      programs.map((program) => {

        if (
          String(program.id) !==
          String(programId)
        ) {
          return program;
        }

        const updatedModules =
          program.modules.map(
            (module) => {

              if (
                String(module.id) !==
                String(moduleId)
              ) {
                return module;
              }

              return {
                ...module,

                title,
                description,
                contentType,

                videoUrl,
                content,
                task,

                questions,
                passingScore,
              };
            }
          );

        return {
          ...program,
          modules: updatedModules,
        };
      });

    localStorage.setItem(
      "onboardingPrograms",
      JSON.stringify(
        updatedPrograms
      )
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

    setData({
      ...data,

      module: {
        ...data.module,

        title,
        description,
        contentType,

        videoUrl,
        content,
        task,

        questions,
        passingScore,
      },
    });
  };

  return (
    <div className="app">

      {/* Navbar */}

      <header className="navbar">

        <h2>
          Onboard
        </h2>

        <span>
          Admin
        </span>

      </header>

      <main className="admin-page">

        {/* Back */}

        <button
          className="back-button"
          onClick={() =>
            navigate(
              `/admin/program/${programId}`
            )
          }
        >
          ← Back to Program
        </button>

        {/* Header */}

        <section className="program-page-header">

          <p className="label">
            MODULE {data.module.order}
          </p>

          <h1>
            Edit Module
          </h1>

          <p>
            Add the learning content employees
            will see when they open this module.
          </p>

        </section>

        <section className="admin-form-card">

          <form onSubmit={saveModule}>

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <div className="editor-section">

              <p className="label">
                BASIC INFORMATION
              </p>

              <h2>
                Module Details
              </h2>

              <div className="form-group">

                <label>
                  Module Name
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
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
                  rows="4"
                />

              </div>

              <div className="form-group">

                <label>
                  Content Type
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

            </div>

            {/* =========================
                VIDEO
            ========================= */}

            {contentType === "Video" && (

              <div className="editor-section">

                <p className="label">
                  VIDEO CONTENT
                </p>

                <h2>
                  Training Video
                </h2>

                <div className="form-group">

                  <label>
                    Video URL
                  </label>

                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={videoUrl}
                    onChange={(event) =>
                      setVideoUrl(
                        event.target.value
                      )
                    }
                  />

                </div>

                <p className="field-help">
                  Paste a YouTube or other video
                  URL that employees can watch.
                </p>

              </div>

            )}

            {/* =========================
                GUIDE
            ========================= */}

            {contentType === "Guide" && (

              <div className="editor-section">

                <p className="label">
                  GUIDE CONTENT
                </p>

                <h2>
                  Learning Material
                </h2>

                <div className="form-group">

                  <label>
                    Guide Content
                  </label>

                  <textarea
                    placeholder="Write the instructions or learning material..."
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value
                      )
                    }
                    rows="10"
                  />

                </div>

              </div>

            )}

            {/* =========================
                TASK
            ========================= */}

            {contentType === "Task" && (

              <div className="editor-section">

                <p className="label">
                  TASK CONTENT
                </p>

                <h2>
                  Employee Task
                </h2>

                <div className="form-group">

                  <label>
                    Task Instructions
                  </label>

                  <textarea
                    placeholder="Describe what the employee needs to complete..."
                    value={task}
                    onChange={(event) =>
                      setTask(
                        event.target.value
                      )
                    }
                    rows="8"
                  />

                </div>

              </div>

            )}

            {/* =========================
                QUIZ
            ========================= */}

            {contentType === "Quiz" && (

              <div className="editor-section">

                <p className="label">
                  QUIZ BUILDER
                </p>

                <h2>
                  Knowledge Check
                </h2>

                <p className="field-help">
                  Create multiple-choice questions
                  for this module.
                </p>

                {/* Existing Questions */}

                {questions.length > 0 && (

                  <div className="question-list">

                    {questions.map(
                      (
                        question,
                        index
                      ) => (

                        <div
                          className="admin-question"
                          key={question.id}
                        >

                          <div className="question-number">
                            {index + 1}
                          </div>

                          <div className="admin-question-content">

                            <h3>
                              {question.question}
                            </h3>

                            <div className="admin-options">

                              {question.options.map(
                                (
                                  option,
                                  optionIndex
                                ) => (

                                  <div
                                    className={
                                      optionIndex ===
                                      question.correctAnswer
                                        ? "admin-option correct"
                                        : "admin-option"
                                    }
                                    key={optionIndex}
                                  >

                                    <span>
                                      {String.fromCharCode(
                                        65 +
                                        optionIndex
                                      )}
                                    </span>

                                    {option}

                                    {optionIndex ===
                                      question.correctAnswer && (
                                      <strong>
                                        ✓ Correct
                                      </strong>
                                    )}

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                          <button
                            type="button"
                            className="delete-question"
                            onClick={() =>
                              deleteQuestion(
                                question.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                {/* Add Question */}

                <div className="add-question-box">

                  <h3>
                    + Add Question
                  </h3>

                  <div className="form-group">

                    <label>
                      Question
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Where should you go if you need help?"
                      value={questionText}
                      onChange={(event) =>
                        setQuestionText(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="quiz-options-editor">

                    {options.map(
                      (
                        option,
                        index
                      ) => (

                        <div
                          className="quiz-option-row"
                          key={index}
                        >

                          <span>
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>

                          <input
                            type="text"
                            placeholder={`Option ${
                              index + 1
                            }`}
                            value={option}
                            onChange={(event) =>
                              updateOption(
                                index,
                                event.target.value
                              )
                            }
                          />

                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={
                              correctAnswer ===
                              index
                            }
                            onChange={() =>
                              setCorrectAnswer(
                                index
                              )
                            }
                          />

                          <label>
                            Correct
                          </label>

                        </div>

                      )
                    )}

                  </div>

                  <button
                    type="button"
                    className="add-question-button"
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>

                </div>

                {/* Passing Score */}

                <div className="passing-score">

                  <div>

                    <strong>
                      Passing Score
                    </strong>

                    <p>
                      Minimum number of correct
                      answers required.
                    </p>

                  </div>

                  <select
                    value={passingScore}
                    onChange={(event) =>
                      setPassingScore(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  >

                    {Array.from(
                      {
                        length:
                          Math.max(
                            questions.length,
                            1
                          ),
                      },
                      (_, index) => (
                        <option
                          key={index + 1}
                          value={index + 1}
                        >
                          {index + 1}
                        </option>
                      )
                    )}

                  </select>

                  <span>
                    / {questions.length}
                  </span>

                </div>

              </div>

            )}

            {/* Save */}

            <div className="editor-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate(
                    `/admin/program/${programId}`
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="form-submit"
              >
                {saved
                  ? "✓ Saved"
                  : "Save Module →"}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default ModuleEditor;