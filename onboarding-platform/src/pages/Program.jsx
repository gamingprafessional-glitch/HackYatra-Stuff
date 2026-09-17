import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Program() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(() => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    const programs = savedPrograms
      ? JSON.parse(savedPrograms)
      : [];

    const foundProgram = programs.find(
      (item) => String(item.id) === String(id)
    );

    if (!foundProgram) {
      return null;
    }

    return {
      ...foundProgram,
      modules: Array.isArray(foundProgram.modules)
        ? foundProgram.modules
        : [],
    };
  });

  const [showForm, setShowForm] = useState(false);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] =
    useState("");

  const [contentType, setContentType] =
    useState("Video");

  if (!program) {
    return (
      <div className="app">
        <header className="navbar">
          <h2>Onboard</h2>
          <span>Admin</span>
        </header>

        <main className="admin-page">
          <h1>Program not found</h1>

          <button
            className="back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Admin
          </button>
        </main>
      </div>
    );
  }

  const savePrograms = (updatedProgram) => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    const programs = savedPrograms
      ? JSON.parse(savedPrograms)
      : [];

    const updatedPrograms = programs.map(
      (item) =>
        String(item.id) === String(id)
          ? updatedProgram
          : item
    );

    localStorage.setItem(
      "onboardingPrograms",
      JSON.stringify(updatedPrograms)
    );

    setProgram(updatedProgram);
  };

  const addModule = (event) => {
    event.preventDefault();

    if (!moduleTitle || !moduleDescription) {
      return;
    }

    const newModule = {
      id: Date.now(),
      title: moduleTitle,
      description: moduleDescription,
      contentType,
      order: program.modules.length + 1,

      videoUrl: "",
      content: "",
      task: "",
      questions: [],
    };

    const updatedProgram = {
      ...program,
      modules: [
        ...program.modules,
        newModule,
      ],
    };

    savePrograms(updatedProgram);

    setModuleTitle("");
    setModuleDescription("");
    setContentType("Video");

    setShowForm(false);
  };

  const deleteModule = (moduleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module?"
    );

    if (!confirmed) {
      return;
    }

    const remainingModules =
      program.modules
        .filter(
          (module) =>
            String(module.id) !==
            String(moduleId)
        )
        .map((module, index) => ({
          ...module,
          order: index + 1,
        }));

    const updatedProgram = {
      ...program,
      modules: remainingModules,
    };

    savePrograms(updatedProgram);
  };

  return (
    <div className="app">

      <header className="navbar">
        <h2>Onboard</h2>
        <span>Admin</span>
      </header>

      <main className="admin-page">

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Programs
        </button>

        <section className="program-page-header">

          <p className="label">
            {program.organization}
            {" • "}
            {program.role}
          </p>

          <h1>{program.title}</h1>

          <p>
            {program.description}
          </p>

        </section>

        <section className="journey-header">

          <div>

            <p className="label">
              JOURNEY BUILDER
            </p>

            <h2>
              Onboarding Journey
            </h2>

            <p>
              Build the learning path your
              employees will follow.
            </p>

          </div>

          <button
            className="start-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "+ Add Module"}
          </button>

        </section>

        {showForm && (

          <section className="admin-form-card">

            <h2>Add Module</h2>

            <p>
              Create a step in this
              onboarding journey.
            </p>

            <form onSubmit={addModule}>

              <div className="form-group">

                <label>
                  Module Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Welcome to the Workplace"
                  value={moduleTitle}
                  onChange={(event) =>
                    setModuleTitle(
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
                  placeholder="What will the employee learn?"
                  value={moduleDescription}
                  onChange={(event) =>
                    setModuleDescription(
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

              <button
                type="submit"
                className="form-submit"
              >
                Add Module →
              </button>

            </form>

          </section>

        )}

        <section className="journey-modules">

          {program.modules.length === 0 ? (

            <div className="empty-journey">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                Your journey is empty
              </h3>

              <p>
                Add your first module to start
                building the onboarding experience.
              </p>

              <button
                className="form-submit"
                onClick={() =>
                  setShowForm(true)
                }
              >
                + Add First Module
              </button>

            </div>

          ) : (

            program.modules.map(
              (module, index) => (

                <div
                  className="journey-module"
                  key={module.id}
                >

                  <div className="journey-number">
                    {index + 1}
                  </div>

                  <div className="journey-module-info">

                    <div className="journey-module-top">

                      <span className="content-badge">
                        {module.contentType}
                      </span>

                    </div>

                    <h3>
                      {module.title}
                    </h3>

                    <p>
                      {module.description}
                    </p>

                  </div>

                  <div className="module-actions">

                    <button
                      className="edit-module-button"
                      onClick={() =>
                        navigate(
                          `/admin/program/${program.id}/module/${module.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-module-button"
                      onClick={() =>
                        deleteModule(module.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </section>

      </main>

    </div>
  );
}

export default Program;