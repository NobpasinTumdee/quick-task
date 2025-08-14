import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import Rootlayout from './layout/Layout';
import Home from './page/Home';
import Todo from './page/Todo';
import Task from './page/Task';
import Finance from './page/Finance';
import Login from './page/Login';
import ProtectedRoute from './component/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <h1 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>Not found this page...</h1>,
    children: [
      { index: true, element: <Home /> },
      { path: "todo-list", element: <ProtectedRoute><Todo /></ProtectedRoute> },
      { path: "task", element: <ProtectedRoute><Task /></ProtectedRoute> },
      { path: "finance", element: <ProtectedRoute><Finance /></ProtectedRoute> },
      { path: "login", element: <Login /> },
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
