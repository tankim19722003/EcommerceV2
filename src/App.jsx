import { RouterProvider } from "react-router-dom";
import { router } from "./App.routes";
import { useEffect, useState } from "react";
import { userAction } from "./store/user-slice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        dispatch(userAction.setUser(JSON.parse(storedUser).user));
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
    }
    setIsLoading(false); // Mark loading as complete
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Show a loading indicator
  }

  return <RouterProvider router={router} />;
}

export default App;
