import { CreateStudent } from "./components/CreateStudent";
import { EditStudent } from "./components/EditStudent";
import { LogIn } from "./components/LogIn";
import { StudentDetail } from "./components/StudentDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentDetailPage } from "./components/StudentDetailPage";
import { LoanDetail } from "./components/LoanDetail";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDetail />} />
          <Route path="add-student" element={<CreateStudent />} />  
          <Route path="edit-student/:id" element={<EditStudent />} />
          <Route path="student-detail/:id" element={<StudentDetailPage />} />
          <Route path="loan-detail/:id" element={<LoanDetail />} />
        </Route>
        <Route path="login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
