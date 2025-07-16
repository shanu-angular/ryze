import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Login from './pages/login';
import Notification from './pages/Notification';
import User from './pages/user';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/user"
          element={
            <Layout activeMenu="user">
              <User />
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout activeMenu="notifications">
              <Notification />
            </Layout>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;