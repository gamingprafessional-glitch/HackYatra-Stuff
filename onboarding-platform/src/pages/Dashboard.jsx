import { Link } from "react-router-dom";

function Dashboard() {

  const module1Completed =
    localStorage.getItem("module1Completed") === "true";

  const module2Completed =
    localStorage.getItem("module2Completed") === "true";

  const module3Completed =
    localStorage.getItem("module3Completed") === "true";

  const completedModules =
    (module1Completed ? 1 : 0) +
    (module2Completed ? 1 : 0) +
    (module3Completed ? 1 : 0);

  const progress = Math.round(
    (completedModules / 3) * 100
  );

  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">

        <h2>
          Onboard
        </h2>

        <span>
          Employee
        </span>

      </header>

      <main className="dashboard">

        {/* Welcome */}
        <section className="welcome">

          <h1>
            Welcome 👋
          </h1>

          <p>
            Let's get you ready for your new role.
          </p>

        </section>

        {/* Course Card */}
        <section className="course-card">

          <div>

            <p className="label">
              YOUR ONBOARDING PROGRAM
            </p>

            <h2>
              Store Picker Onboarding
            </h2>

            <p className="description">
              Learn everything you need to confidently
              start your role.
            </p>

          </div>

          {/* Progress */}
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
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* Main Action */}
          {!module1Completed && (

            <Link
              to="/module/1"
              className="start-button"
            >
              Start Onboarding →
            </Link>

          )}

          {module1Completed &&
            !module2Completed && (

              <Link
                to="/module/2"
                className="start-button"
              >
                Continue Onboarding →
              </Link>

            )}

          {module2Completed &&
            !module3Completed && (

              <Link
                to="/module/3"
                className="start-button"
              >
                Continue Onboarding →
              </Link>

            )}

          {module3Completed && (

            <div className="completion-message">

              🎉 Onboarding Complete!

            </div>

          )}

        </section>

        {/* Learning Path */}
        <section className="modules">

          <h2>
            Your Learning Path
          </h2>

          <div className="module-list">

            {/* MODULE 1 */}
            <div className="module">

              <span className="number">

                {module1Completed
                  ? "✓"
                  : "1"}

              </span>

              <div>

                <h3>
                  Welcome to Your Role
                </h3>

                <p>
                  Introduction to your workplace
                  and responsibilities.
                </p>

              </div>

              <span className="status">

                {module1Completed ? (

                  "Completed"

                ) : (

                  <Link to="/module/1">
                    Start
                  </Link>

                )}

              </span>

            </div>

            {/* MODULE 2 */}
            <div className="module">

              <span className="number">

                {module2Completed
                  ? "✓"
                  : "2"}

              </span>

              <div>

                <h3>
                  Understanding the Workplace
                </h3>

                <p>
                  Learn how your workplace operates.
                </p>

              </div>

              <span className="status">

                {module2Completed ? (

                  "Completed"

                ) : module1Completed ? (

                  <Link to="/module/2">
                    Start
                  </Link>

                ) : (

                  "Locked"

                )}

              </span>

            </div>

            {/* MODULE 3 */}
            <div className="module">

              <span className="number">

                {module3Completed
                  ? "✓"
                  : "3"}

              </span>

              <div>

                <h3>
                  Learn Your First Task
                </h3>

                <p>
                  Complete training and pass
                  the knowledge check.
                </p>

              </div>

              <span className="status">

                {module3Completed ? (

                  "Completed"

                ) : module2Completed ? (

                  <Link to="/module/3">
                    Start
                  </Link>

                ) : (

                  "Locked"

                )}

              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;