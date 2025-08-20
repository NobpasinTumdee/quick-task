import { createBrowserRouter, Link } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import Rootlayout from './layout/Layout';
import Home from './page/Home';
import Todo from './page/Todo/Todo';
import Task from './page/Task';
import Finance from './page/Finance/Finance';
import Login from './page/Login';
import ProtectedRoute from './component/ProtectedRoute';
import Me from './page/Me';
import Wallet from './page/Finance/Wallet';
import Categories from './page/Finance/Categories';
import FuzzyText from './component/PageNotFound';
import Setting from './component/Setting';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: (
      <>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <FuzzyText
            baseIntensity={0.1}
            hoverIntensity={2}
            enableHover={true}
          >
            404
          </FuzzyText>
          <p style={{ textAlign: "center" }}>Page Not Found...</p>
          <Link to="/" style={{ margin: '0 30%' }}><button>Back to Home</button></Link>
        </div>
      </>
    ),
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "task", element: <ProtectedRoute><Task /></ProtectedRoute> },
      { path: "wallet", element: <ProtectedRoute><Wallet /></ProtectedRoute> },
      { path: "categories", element: <ProtectedRoute><Categories /></ProtectedRoute> },
      { path: "finance/:id", element: <ProtectedRoute><Finance /></ProtectedRoute> },
      { path: "todo-list", element: <ProtectedRoute><Todo /></ProtectedRoute> },
      { path: "me", element: <ProtectedRoute><Me /></ProtectedRoute> },
      { path: "login", element: <Login /> },
      { path: "setting", element: <Setting /> },
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
