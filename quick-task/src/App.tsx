import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import Rootlayout from './layout/Layout';
import Home from './page/Home';
import Todo from './page/Todo';
import Task from './page/Task';
import Finance from './page/Finance/Finance';
import Login from './page/Login';
import ProtectedRoute from './component/ProtectedRoute';
import Me from './page/Me';
import Wallet from './page/Finance/wallet';
import Categories from './page/Finance/categories';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <h1 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>Not found this page...</h1>,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "task", element: <ProtectedRoute><Task /></ProtectedRoute> },
      { path: "wallet", element: <ProtectedRoute><Wallet /></ProtectedRoute> },
      { path: "categories", element: <ProtectedRoute><Categories /></ProtectedRoute> },
      { path: "finance/:id", element: <ProtectedRoute><Finance /></ProtectedRoute> },
      { path: "todo-list", element: <ProtectedRoute><Todo /></ProtectedRoute> },
      { path: "me", element: <ProtectedRoute><Me /></ProtectedRoute> },
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
