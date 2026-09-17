import { useNavigate } from "react-router-dom";

function Module() {
  const navigate = useNavigate();

  const completeModule = () => {
    localStorage.setItem("module1Completed", "true");

    navigate("/");
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
            MODULE 1
          </p>

          <h1>
            Welcome to Your Role
          </h1>

          <p>
            Learn what your role involves and what you can
            expect during your first day.
          </p>

        </div>

        {/* Video */}
        <div className="video-container">

          <div className="video-placeholder">

            <div className="play-button">
              ▶
            </div>

            <p>
              Training Video
            </p>

            <span>
              Introduction to your role
            </span>

          </div>

        </div>

        {/* Lesson */}
        <div className="lesson">

          <h2>
            What you'll learn
          </h2>

          <ul>

            <li>
              Understand your role and responsibilities
            </li>

            <li>
              Learn how the workplace is organized
            </li>

            <li>
              Understand the basic workflow
            </li>

            <li>
              Know who to contact when you need help
            </li>

          </ul>

        </div>

        {/* Complete */}
        <div className="complete-section">

          <p>
            Once you've watched the training, mark this
            module as complete.
          </p>

          <button onClick={completeModule}>
            Complete Module →
          </button>

        </div>

      </main>

    </div>
  );
}

export default Module;