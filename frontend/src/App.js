import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {/* If logged in, show Main page, else redirect to Login */}
      <Route path="/" element={user ? <Main /> : <Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* Optional 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;