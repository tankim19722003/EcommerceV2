import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/HomePage"
import ProductDetail from "./page/ProductDetailPage"


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    // errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
    // errorElement: <ErrorPage />,
  }
])
function App() {
   return <RouterProvider router={router} />;
}

export default App
