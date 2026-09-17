import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/Dashboard";
import Module from "./pages/Module";
import Module2 from "./pages/Module2";
import Module3 from "./pages/Module3";

import Admin from "./pages/Admin";
import Program from "./pages/Program";
import ModuleEditor from "./pages/ModuleEditor";
import Users from "./pages/Users";

import EmployeeProgram from "./pages/EmployeeProgram";
import EmployeeModule from "./pages/EmployeeModule";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* OLD EMPLOYEE DEMO */}

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/module/1"
          element={<Module />}
        />

        <Route
          path="/module/2"
          element={<Module2 />}
        />

        <Route
          path="/module/3"
          element={<Module3 />}
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/program/:id"
          element={<Program />}
        />

        <Route
          path="/admin/program/:programId/module/:moduleId"
          element={<ModuleEditor />}
        />


        {/* EMPLOYEE */}

        <Route
          path="/employee/:userId"
          element={<EmployeeProgram />}
        />
          
        <Route
          path="/program/:id"
          element={<EmployeeProgram />}
        />
          
        <Route
          path="/program/:programId/module/:moduleId"
          element={<EmployeeModule />}
        />

        <Route
          path="/program/:programId/module/:moduleId"
          element={<EmployeeModule />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;