import { Link, useParams } from "react-router-dom";
import { useState } from "react";

function EmployeeProgram() {
  const { id, userId } = useParams();

  const isUserMode = Boolean(userId);

  const [user] = useState(() => {

    if (!userId) {
      return null;
    }

    const savedUsers =
      localStorage.getItem(
        "onboardingUsers"
      );

    if (!savedUsers) {
      return null;
    }

    try {

      const users =
        JSON.parse(savedUsers);

      return users.find(
        (item) =>
          String(item.id) ===
          String(userId)
      );

    } catch {

      return null;

    }
  });


  const programId =
    isUserMode
      ? user?.programId
      : id;


  const [program] = useState(() => {

    if (!programId) {
      return null;
    }

    const savedPrograms =
      localStorage.getItem(
        "onboardingPrograms"
      );

    if (!savedPrograms) {
      return null;
    }

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


  const [completedModules] =
    useState(() => {

      if (!programId) {
        return [];
      }

      const saved =
        localStorage.getItem(
          `completedModules_${programId}`
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });


  /* ================================
     INVALID USER
  ================================= */

  if (isUserMode && !user) {

    return (
      <div className="app">

        <header className="navbar">

          <h2>
            Onboard
          </h2>

          <span>
            Employee
          </span>

        </header>


        <main className="dashboard">

          <h1>
            User not found
          </h1>

          <p>
            This employee does not exist.
          </p>

          <Link
            to="/admin/users"
            className="start-button"
          >
            Back to Users
          </Link>

        </main>

      </div>
    );

  }


  /* ================================
     NO ASSIGNMENT
  ================================= */

  if (
    isUserMode &&
    user &&
    !user.programId
  ) {

    return (
      <div className="app">

        <header className="navbar">

          <h2>
            Onboard
          </h2>

          <span>
            Employee
          </span>

        </header>


        <main className="dashboard">

          <section className="welcome">

            <p className="label">
              EMPLOYEE
            </p>

            <h1>
              Welcome, {user.name} 👋
            </h1>

            <p>
              Your onboarding program has
              not been assigned yet.
            </p>

          </section>


          <Link
            to="/admin/users"
            className="start-button"
          >
            Back to Users
          </Link>

        </main>

      </div>
    );

  }


  /* ================================
     PROGRAM NOT FOUND
  ================================= */

  if (!program) {

    return (
      <div className="app">

        <header className="navbar">

          <h2>
            Onboard
          </h2>

          <span>
            Employee
          </span>

        </header>


        <main className="dashboard">

          <h1>
            Program not found
          </h1>

          <Link
            to="/admin"
            className="start-button"
          >
            Back to Admin
          </Link>

        </main>

      </div>
    );

  }


  /* ================================
     MODULES
  ================================= */

  const modules =
    Array.isArray(program.modules)
      ? program.modules
      : [];


  const completedCount =
    completedModules.length;


  const progress =
    modules.length === 0
      ? 0
      : Math.round(
          (completedCount /
            modules.length) *
            100
        );


  const isModuleCompleted =
    (moduleId) =>
      completedModules.includes(
        String(moduleId)
      );


  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <Link
          to={
            isUserMode
              ? `/employee/${user.id}`
              : `/program/${program.id}`
          }
          className="navbar-brand"
        >
          Onboard
        </Link>

        <span>
          {isUserMode
            ? user.name
            : "Employee"}
        </span>

      </header>


      <main className="dashboard">

        {/* WELCOME */}

        <section className="welcome">

          <p className="label">

            {program.organization}

            {" • "}

            {program.role}

          </p>


          <h1>

            Welcome
            {isUserMode
              ? `, ${user.name}`
              : ""}{" "}
            👋

          </h1>


          <p>
            Let's get you ready for your
            new role.
          </p>

        </section>


        {/* PROGRAM */}

        <section className="course-card">

          <div>

            <p className="label">
              YOUR ONBOARDING PROGRAM
            </p>

            <h2>
              {program.title}
            </h2>

            <p className="description">
              {program.description}
            </p>

          </div>


          {/* PROGRESS */}

          <div className="progress-section">

            <div className="progress-info">

              <span>
                Progress
              </span>

              <span>
                {progress}%
              </span>

            </div>


            <div className="progress-bar">

              <div
                className="progress"
                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>


            <p className="progress-text">

              {completedCount} of{" "}

              {modules.length}

              {" "}modules completed

            </p>

          </div>


          {modules.length === 0 && (

            <div className="completion-message">

              This onboarding program is
              currently being prepared.

            </div>

          )}


          {modules.length > 0 &&
            completedCount ===
              modules.length && (

              <div className="completion-message">

                🎉 Onboarding Complete!

              </div>

            )}

        </section>


        {/* LEARNING PATH */}

        <section className="modules">

          <h2>
            Your Learning Path
          </h2>


          <div className="module-list">

            {modules.map(
              (module, index) => {

                const completed =
                  isModuleCompleted(
                    module.id
                  );


                const previousCompleted =
                  index === 0 ||
                  isModuleCompleted(
                    modules[
                      index - 1
                    ].id
                  );


                const locked =
                  !completed &&
                  !previousCompleted;


                return (

                  <Link
                    key={module.id}
                    to={
                      locked
                        ? "#"
                        : `/program/${program.id}/module/${module.id}`
                    }
                    className={
                      locked
                        ? "module employee-module locked"
                        : "module employee-module"
                    }
                    onClick={(event) => {

                      if (locked) {

                        event.preventDefault();

                      }

                    }}
                  >

                    <span className="number">

                      {completed
                        ? "✓"
                        : index + 1}

                    </span>


                    <div>

                      <h3>
                        {module.title}
                      </h3>

                      <p>
                        {module.description}
                      </p>


                      <span className="employee-content-type">

                        {module.contentType}

                      </span>

                    </div>


                    <span className="status">

                      {completed
                        ? "Completed"
                        : locked
                        ? "Locked"
                        : "Start"}

                    </span>

                  </Link>

                );

              }
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default EmployeeProgram;