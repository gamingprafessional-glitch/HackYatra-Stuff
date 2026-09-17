import { useNavigate } from "react-router-dom";

function Module2() {
  const navigate = useNavigate();

  const completeModule = () => {
    localStorage.setItem("module2Completed", "true");

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
            MODULE 2
          </p>

          <h1>
            Understanding the Workplace
          </h1>

          <p>
            Learn how your workplace operates and how your
            responsibilities fit into the overall workflow.
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
              Understanding the workplace
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
              Understand the workplace layout
            </li>

            <li>
              Learn the basic workflow
            </li>

            <li>
              Understand how tasks are assigned
            </li>

            <li>
              Know the basic workplace rules
            </li>

          </ul>

        </div>

        {/* Complete */}
        <div className="complete-section">

          <p>
            Once you've completed the training, continue
            to the next stage.
          </p>

          <button onClick={completeModule}>
            Complete Module →
          </button>

        </div>

      </main>

    </div>
  );
}

export default Module2;