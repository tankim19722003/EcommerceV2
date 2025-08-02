import { RouterProvider } from "react-router-dom";
import { router } from "./App.routes";
import { useEffect, useState } from "react";
import { userAction } from "./store/user-slice";
import { useDispatch } from "react-redux";
import isTokenExpired from "./config/jwt-config";
import Assistant from "./Component/Modal/Assistant";
// import isTokenExpired from "./config/jwt-config";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);

    if (user != null && !isTokenExpired(user.token)) {
      try {
        dispatch(userAction.setUser(user.user));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    } else {
      localStorage.removeItem("user");
    }
    setIsLoading(false); // Mark loading as complete
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Show a loading indicator
  }

  const toggleAssistant = () => {
    setShowAssistant((prev) => !prev);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
       onClick={toggleAssistant}>
        🤖 Nhắn tin với AI
      </div>
      <RouterProvider router={router} />
      <Assistant showAssistant={showAssistant} />
    </>
  );
}

export default App;
