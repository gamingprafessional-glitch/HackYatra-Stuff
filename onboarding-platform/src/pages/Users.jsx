import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Users.css";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(() => {
    const savedUsers =
      localStorage.getItem("onboardingUsers");

    if (!savedUsers) {
      return [];
    }

    try {
      return JSON.parse(savedUsers);
    } catch {
      return [];
    }
  });

  const [programs] = useState(() => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    if (!savedPrograms) {
      return [];
    }

    try {
      return JSON.parse(savedPrograms);
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("");


  /* ================================
     CREATE USER
  ================================= */

  const createUser = (event) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !role.trim()
    ) {
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      programId: null,
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    setUsers(updatedUsers);

    localStorage.setItem(
      "onboardingUsers",
      JSON.stringify(updatedUsers)
    );

    setName("");
    setEmail("");
    setRole("");

    setShowForm(false);
  };


  /* ================================
     DELETE USER
  ================================= */

  const deleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = users.filter(
      (user) =>
        String(user.id) !==
        String(userId)
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "onboardingUsers",
      JSON.stringify(updatedUsers)
    );
  };


  /* ================================
     ASSIGN PROGRAM
  ================================= */

  const assignProgram = (
    userId,
    programId
  ) => {

    const updatedUsers =
      users.map((user) => {

        if (
          String(user.id) !==
          String(userId)
        ) {
          return user;
        }

        return {
          ...user,
          programId:
            programId === ""
              ? null
              : programId,
        };
      });

    setUsers(updatedUsers);

    localStorage.setItem(
      "onboardingUsers",
      JSON.stringify(updatedUsers)
    );
  };


  /* ================================
     GET PROGRAM
  ================================= */

  const getAssignedProgram = (
    programId
  ) => {

    if (!programId) {
      return null;
    }

    return programs.find(
      (program) =>
        String(program.id) ===
        String(programId)
    );
  };


  return (
    <div className="users-app">

      {/* NAVBAR */}

      <header className="users-navbar">

        <Link
          to="/admin"
          className="users-logo"
        >
          Onboard
        </Link>

        <span className="users-navbar-role">
          Admin
        </span>

      </header>


      <main className="users-main">

        {/* PAGE HEADER */}

        <section className="users-page-header">

          <div className="users-heading">

            <p className="users-eyebrow">
              ADMIN PANEL
            </p>

            <h1>
              Users
            </h1>

            <p className="users-subtitle">
              Create users and assign them
              onboarding programs.
            </p>

          </div>


          <button
            className="users-add-btn"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "+ Add User"}
          </button>

        </section>


        {/* CREATE USER FORM */}

        {showForm && (

          <section className="users-form">

            <div className="users-form-header">

              <p className="users-eyebrow">
                NEW USER
              </p>

              <h2>
                Create User
              </h2>

              <p>
                Add someone who will complete
                an onboarding program.
              </p>

            </div>


            <form onSubmit={createUser}>

              <div className="users-input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="users-input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="users-input-group">

                <label>
                  Role
                </label>

                <input
                  type="text"
                  placeholder="e.g. First-Year CSE Student"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value
                    )
                  }
                />

              </div>


              <button
                type="submit"
                className="users-submit-btn"
              >
                Create User →
              </button>

            </form>

          </section>

        )}


        {/* USER LIST */}

        <section className="users-list-section">

          <div className="users-list-header">

            <h2>
              Your Users
            </h2>

            <span>
              {users.length}{" "}
              {users.length === 1
                ? "user"
                : "users"}
            </span>

          </div>


          {users.length === 0 ? (

            <div className="users-empty">

              <div className="users-empty-icon">
                👤
              </div>

              <h3>
                No users yet
              </h3>

              <p>
                Create your first user to
                start assigning onboarding.
              </p>

            </div>

          ) : (

            <div className="users-grid">

              {users.map((user) => {

                const assignedProgram =
                  getAssignedProgram(
                    user.programId
                  );

                return (

                  <div
                    className="users-user-card"
                    key={user.id}
                  >

                    {/* AVATAR */}

                    <div className="users-user-avatar">
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>


                    {/* DETAILS */}

                    <div className="users-user-details">

                      <h3>
                        {user.name}
                      </h3>

                      <p>
                        {user.email}
                      </p>

                      <span>
                        {user.role}
                      </span>

                    </div>


                    {/* ASSIGNMENT */}

                    <div className="users-assignment">

                      <label>
                        Assign Program
                      </label>

                      <div className="users-assignment-row">

                        <select
                          value={
                            user.programId || ""
                          }
                          onChange={(event) =>
                            assignProgram(
                              user.id,
                              event.target.value
                            )
                          }
                        >

                          <option value="">
                            Not assigned
                          </option>

                          {programs.map(
                            (program) => (

                              <option
                                key={program.id}
                                value={program.id}
                              >
                                {program.title}
                              </option>

                            )
                          )}

                        </select>

                      </div>


                      {assignedProgram && (

                        <p className="users-assigned-program">

                          ✓{" "}
                          {assignedProgram.title}

                        </p>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="users-user-actions">

                      {assignedProgram && (

                        <button
                          className="users-employee-btn"
                          onClick={() =>
                            navigate(
                              `/employee/${user.id}`
                            )
                          }
                        >
                          Open as Employee →
                        </button>

                      )}

                      <button
                        className="users-delete-btn"
                        onClick={() =>
                          deleteUser(
                            user.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Users;