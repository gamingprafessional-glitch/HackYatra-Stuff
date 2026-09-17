import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const defaultPrograms = [
    {
      id: 1,
      organization: "Retail Company",
      role: "Store Picker",
      title: "Store Picker Onboarding",
      description:
        "Learn everything you need to get started as a store picker.",
      modules: [
        {
          id: 1,
          title: "Introduction",
          description:
            "Understand the role and onboarding process.",
          contentType: "Video",
          content: "",
          order: 1,
        },
        {
          id: 2,
          title: "Store Navigation",
          description:
            "Learn how to navigate the store efficiently.",
          contentType: "Guide",
          content: "",
          order: 2,
        },
        {
          id: 3,
          title: "Safety & Best Practices",
          description:
            "Learn important safety rules and best practices.",
          contentType: "Guide",
          content: "",
          order: 3,
        },
      ],
    },
  ];

  const [programs, setPrograms] = useState(() => {
    const savedPrograms =
      localStorage.getItem("onboardingPrograms");

    if (savedPrograms) {
      try {
        const parsed =
          JSON.parse(savedPrograms);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return defaultPrograms;
      }
    }

    localStorage.setItem(
      "onboardingPrograms",
      JSON.stringify(defaultPrograms)
    );

    return defaultPrograms;
  });

  const [showForm, setShowForm] =
    useState(false);

  const [editingProgramId, setEditingProgramId] =
    useState(null);

  const [organization, setOrganization] =
    useState("");

  const [role, setRole] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const resetForm = () => {
    setOrganization("");
    setRole("");
    setTitle("");
    setDescription("");
    setEditingProgramId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setOrganization("");
    setRole("");
    setTitle("");
    setDescription("");
    setEditingProgramId(null);
    setShowForm(true);
  };

  const openEditForm = (program) => {
    setOrganization(
      program.organization || ""
    );

    setRole(
      program.role || ""
    );

    setTitle(
      program.title || ""
    );

    setDescription(
      program.description || ""
    );

    setEditingProgramId(program.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveProgram = (event) => {
    event.preventDefault();

    if (
      !organization.trim() ||
      !role.trim() ||
      !title.trim()
    ) {
      return;
    }

    if (editingProgramId !== null) {
      const updatedPrograms =
        programs.map((program) => {
          if (
            String(program.id) !==
            String(editingProgramId)
          ) {
            return program;
          }

          return {
            ...program,
            organization:
              organization.trim(),
            role: role.trim(),
            title: title.trim(),
            description:
              description.trim(),
            modules: Array.isArray(
              program.modules
            )
              ? program.modules
              : [],
          };
        });

      setPrograms(updatedPrograms);

      localStorage.setItem(
        "onboardingPrograms",
        JSON.stringify(updatedPrograms)
      );

      resetForm();

      return;
    }

    const newProgram = {
      id: Date.now(),
      organization:
        organization.trim(),
      role: role.trim(),
      title: title.trim(),
      description:
        description.trim(),
      modules: [],
    };

    const updatedPrograms = [
      ...programs,
      newProgram,
    ];

    setPrograms(updatedPrograms);

    localStorage.setItem(
      "onboardingPrograms",
      JSON.stringify(updatedPrograms)
    );

    resetForm();
  };

  const deleteProgram = (programId) => {
    const program = programs.find(
      (item) =>
        String(item.id) ===
        String(programId)
    );

    if (!program) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${program.title}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const updatedPrograms =
      programs.filter(
        (item) =>
          String(item.id) !==
          String(programId)
      );

    setPrograms(updatedPrograms);

    localStorage.setItem(
      "onboardingPrograms",
      JSON.stringify(updatedPrograms)
    );

    localStorage.removeItem(
      `completedModules_${programId}`
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

        <span>
          Admin
        </span>

      </header>


      <main className="admin-page">

        {/* ================================
            HEADER
        ================================= */}

        <section className="admin-header">

          <div>

            <p className="label">
              ADMIN PANEL
            </p>

            <h1>
              Onboarding Programs
            </h1>

            <p>
              Create and manage onboarding
              journeys for different roles.
            </p>

          </div>


          <div className="admin-header-actions">

            <Link
              to="/admin/users"
              className="secondary-action-button"
            >
              👥 Users
            </Link>

            <button
              className="start-button admin-create-button"
              onClick={
                showForm
                  ? resetForm
                  : openCreateForm
              }
            >
              {showForm
                ? "Cancel"
                : "+ Create Program"}
            </button>

          </div>

        </section>


        {/* ================================
            PROGRAM FORM
        ================================= */}

        {showForm && (

          <section className="admin-form-card">

            <p className="label">
              {editingProgramId !== null
                ? "EDIT PROGRAM"
                : "NEW PROGRAM"}
            </p>

            <h2>
              {editingProgramId !== null
                ? "Edit Program"
                : "Create Program"}
            </h2>

            <p>
              Define who this onboarding
              program is for.
            </p>


            <form onSubmit={saveProgram}>

              <div className="form-group">

                <label>
                  Organization
                </label>

                <input
                  type="text"
                  placeholder="e.g. ABC Retail"
                  value={organization}
                  onChange={(event) =>
                    setOrganization(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Role
                </label>

                <input
                  type="text"
                  placeholder="e.g. Store Picker"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Program Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Store Picker Onboarding"
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
                  placeholder="Describe this onboarding program..."
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="program-form-actions">

                <button
                  type="submit"
                  className="form-submit"
                >
                  {editingProgramId !== null
                    ? "Save Changes →"
                    : "Create Program →"}
                </button>

                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}


        {/* ================================
            PROGRAM LIST
        ================================= */}

        <section className="admin-programs">

          <div className="section-heading">

            <h2>
              Your Programs
            </h2>

            <span>
              {programs.length} programs
            </span>

          </div>


          {programs.length === 0 ? (

            <div className="empty-journey">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                No programs yet
              </h3>

              <p>
                Create your first onboarding
                program to get started.
              </p>

              <button
                className="start-button"
                onClick={openCreateForm}
              >
                + Create Program
              </button>

            </div>

          ) : (

            <div className="program-grid">

              {programs.map((program) => {

                const modules =
                  Array.isArray(
                    program.modules
                  )
                    ? program.modules
                    : [];

                return (

                  <div
                    className="program-admin-card"
                    key={program.id}
                  >

                    <div className="program-card-top">

                      <div>

                        <span className="program-role">
                          {program.organization}
                        </span>

                        <h3>
                          {program.title}
                        </h3>

                        <p>
                          {program.role}
                        </p>

                      </div>

                    </div>


                    <p className="program-card-description">
                      {program.description ||
                        "No description provided."}
                    </p>


                    <div className="program-card-meta">

                      <span>
                        {modules.length} modules
                      </span>

                    </div>


                    <div className="program-card-actions">

                      <button
                        className="program-action-button"
                        onClick={() =>
                          navigate(
                            `/admin/program/${program.id}`
                          )
                        }
                      >
                        Manage
                      </button>


                      <Link
                        to={`/program/${program.id}`}
                        className="program-action-button"
                      >
                        Preview
                      </Link>


                      <button
                        className="edit-program-button"
                        onClick={() =>
                          openEditForm(program)
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete-program-button"
                        onClick={() =>
                          deleteProgram(
                            program.id
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

export default Admin;