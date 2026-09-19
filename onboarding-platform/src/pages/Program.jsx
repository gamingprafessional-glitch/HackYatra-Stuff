import { useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Program() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(() => {
    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    if (!savedPrograms) {
      return null;
    }

    try {
      const programs = JSON.parse(
        savedPrograms
      );

      return programs.find(
        (item) =>
          String(item.id) ===
          String(id)
      );
    } catch {
      return null;
    }
  });

  const [showForm, setShowForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [contentType, setContentType] =
    useState("Video");

  if (!program) {
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

            <h3>Program not found</h3>

            <p>
              This onboarding program may have
              been deleted or does not exist.
            </p>

            <Link
              to="/admin"
              className="start-button"
            >
              Back to Programs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const modules =
    Array.isArray(program.modules)
      ? program.modules
      : [];

  const saveProgram = (
    updatedProgram
  ) => {
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
          String(updatedProgram.id)
            ? updatedProgram
            : item
        );

      localStorage.setItem(
        "onboardingPrograms",
        JSON.stringify(updatedPrograms)
      );

      setProgram(updatedProgram);
    } catch {
      return;
    }
  };

  const addModule = (event) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !description.trim()
    ) {
      return;
    }

    const newModule = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      contentType,
      content: "",
      order: modules.length + 1,
    };

    const updatedProgram = {
      ...program,
      modules: [
        ...modules,
        newModule,
      ],
    };

    saveProgram(updatedProgram);

    setTitle("");
    setDescription("");
    setContentType("Video");
    setShowForm(false);
  };

  const deleteModule = (
    moduleId
  ) => {
    const module = modules.find(
      (item) =>
        String(item.id) ===
        String(moduleId)
    );

    if (!module) return;

    const confirmed =
      window.confirm(
        `Delete "${module.title}"? This cannot be undone.`
      );

    if (!confirmed) return;

    const remainingModules =
      modules
        .filter(
          (item) =>
            String(item.id) !==
            String(moduleId)
        )
        .map((item, index) => ({
          ...item,
          order: index + 1,
        }));

    const updatedProgram = {
      ...program,
      modules: remainingModules,
    };

    saveProgram(updatedProgram);

    localStorage.removeItem(
      `completedModules_${program.id}`
    );
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
            to="/admin"
            className="program-back-link"
          >
            Programs
          </Link>

          <ThemeToggle />

          <span>Admin</span>
        </div>
      </header>

      <main className="admin-page">
        <section className="program-header">
          <div className="program-header-info">
            <p className="label">
              {program.organization}
            </p>

            <h1>{program.title}</h1>

            <p>
              {program.role}
              {" · "}
              {modules.length}{" "}
              {modules.length === 1
                ? "module"
                : "modules"}
            </p>

            {program.description && (
              <div className="program-description">
                {program.description}
              </div>
            )}
          </div>

          <div className="program-header-actions">
            <Link
              to={`/program/${program.id}`}
              className="secondary-action-button"
            >
              Preview
            </Link>

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
          </div>
        </section>

        {showForm && (
          <section className="admin-form-card module-add-form">
            <div className="admin-form-heading">
              <p className="label">
                NEW MODULE
              </p>

              <h2>Add a module</h2>

              <p>
                Add the next step in this
                onboarding journey.
              </p>
            </div>

            <form onSubmit={addModule}>
              <div className="form-group">
                <label>
                  Module title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Store Navigation"
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
                  placeholder="What will the employee learn?"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
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

              <div className="program-form-actions">
                <button
                  type="submit"
                  className="form-submit"
                >
                  Add module →
                </button>

                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="journey-section">
          <div className="section-heading">
            <div>
              <h2>Learning path</h2>

              <p className="section-heading-subtitle">
                {modules.length === 0
                  ? "No modules added yet"
                  : "Modules are completed in order"}
              </p>
            </div>

            {modules.length > 0 && (
              <span className="module-count">
                {modules.length}
              </span>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="empty-journey">
              <div className="empty-icon">
                +
              </div>

              <h3>No modules yet</h3>

              <p>
                Add your first module to build
                this onboarding journey.
              </p>

              <button
                className="start-button"
                onClick={() =>
                  setShowForm(true)
                }
              >
                + Add module
              </button>
            </div>
          ) : (
            <div className="journey">
              {modules.map(
                (module, index) => (
                  <article
                    className="journey-module"
                    key={module.id}
                  >
                    <div className="journey-module-number">
                      {index + 1}
                    </div>

                    <div className="journey-module-info">
                      <div className="journey-module-topline">
                        <span className="module-type">
                          {
                            module.contentType
                          }
                        </span>
                      </div>

                      <h3>
                        {module.title}
                      </h3>

                      <p>
                        {module.description}
                      </p>
                    </div>

                    <div className="journey-module-actions">
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
                          deleteModule(
                            module.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Program;