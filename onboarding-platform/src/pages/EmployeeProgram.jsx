import { useMemo, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function EmployeeProgram() {
  const { id, userId } = useParams();

  const [users] = useState(() => {
    const savedUsers =
      localStorage.getItem("onboardingUsers");

    if (!savedUsers) return [];

    try {
      return JSON.parse(savedUsers);
    } catch {
      return [];
    }
  });

  const [programs] = useState(() => {
    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    if (!savedPrograms) return [];

    try {
      return JSON.parse(savedPrograms);
    } catch {
      return [];
    }
  });

  const user = useMemo(() => {
    if (!userId) return null;

    return users.find(
      (item) =>
        String(item.id) ===
        String(userId)
    );
  }, [users, userId]);

  const program = useMemo(() => {
    const programId =
      userId && user
        ? user.programId
        : id;

    if (!programId) return null;

    return programs.find(
      (item) =>
        String(item.id) ===
        String(programId)
    );
  }, [programs, user, userId, id]);

  const modules =
    Array.isArray(program?.modules)
      ? [...program.modules].sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        )
      : [];

  const [completedModules] =
    useState(() => {
      if (!program) return [];

      const saved =
        localStorage.getItem(
          `completedModules_${program.id}`
        );

      if (!saved) return [];

      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    });

  if (!program) {
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

            <h2>Program not found</h2>

            <p>
              No onboarding program is
              available for this employee.
            </p>

            <Link
              to="/admin"
              className="preview-primary-button"
            >
              Back to Admin
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const completedCount =
    modules.filter((module) =>
      completedModules.includes(
        String(module.id)
      )
    ).length;

  const progress =
    modules.length > 0
      ? Math.round(
          (completedCount /
            modules.length) *
            100
        )
      : 0;

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
          <span>
            {user ? user.name : "Employee"}
          </span>
        </div>
      </header>

      <main className="preview-container">
        <section className="preview-hero">
          <div className="preview-hero-content">
            <p className="preview-label">
              {program.organization}
            </p>

            <h1>
              {user
                ? `Welcome, ${user.name}`
                : "Your onboarding journey"}
            </h1>

            <p className="preview-program-name">
              {program.title}
            </p>

            <p className="preview-role">
              {program.role}
            </p>

            {program.description && (
              <p className="preview-description">
                {program.description}
              </p>
            )}
          </div>

          <div className="preview-progress-card">
            <div className="preview-progress-header">
              <span>Your progress</span>

              <strong>
                {progress}%
              </strong>
            </div>

            <div className="preview-progress-track">
              <div
                className="preview-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p>
              {completedCount} of{" "}
              {modules.length} modules
              completed
            </p>
          </div>
        </section>

        <section className="preview-learning-section">
          <div className="preview-section-header">
            <div>
              <p className="preview-label">
                ONBOARDING
              </p>

              <h2>
                Learning path
              </h2>

              <p>
                Complete each module to
                finish your onboarding.
              </p>
            </div>

            <span className="preview-module-count">
              {modules.length}
            </span>
          </div>

          {modules.length === 0 ? (
            <div className="preview-empty">
              <div className="preview-empty-icon">
                +
              </div>

              <h3>
                No modules available
              </h3>

              <p>
                Your administrator has not
                added any onboarding modules
                yet.
              </p>
            </div>
          ) : (
            <div className="preview-module-list">
              {modules.map(
                (module, index) => {
                  const completed =
                    completedModules.includes(
                      String(module.id)
                    );

                  return (
                    <Link
                      key={module.id}
                      to={`/program/${program.id}/module/${module.id}`}
                      className={`preview-module-card ${
                        completed
                          ? "preview-module-completed"
                          : ""
                      }`}
                    >
                      <div className="preview-module-number">
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div className="preview-module-content">
                        <div className="preview-module-top">
                          <span className="preview-module-type">
                            {
                              module.contentType
                            }
                          </span>

                          {completed && (
                            <span className="preview-completed-badge">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3>
                          {module.title}
                        </h3>

                        <p>
                          {
                            module.description
                          }
                        </p>
                      </div>

                      <div className="preview-module-arrow">
                        →
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployeeProgram;