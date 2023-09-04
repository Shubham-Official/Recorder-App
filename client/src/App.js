import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/home",
    element: <Home />
  }
])

function App() {
  return (
    <div className="App">
      <Navbar />
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
