import { createBrowserRouter } from "react-router-dom";
import { ShopPage } from "./page/ShopPage";
import RootLayout from "./layouts/RootLayout";
import RegisterForm from "./Component/Register/RegisterForm";
import HomePage from "./page/HomePage";
import LoginForm from "./Component/Login/Login";
import ShopRegistration from "./page/ShopRegistrationPage";
import ProductDetail from "./Component/ProductDetail/ProductDetail";
import OrderManagement from "./Component/AdminComponent/OrderManagement";
import CategoryManagement from "./Component/AdminComponent/CategoryManagement";
import SalesManagement from "./Component/AdminComponent/SalesManagement";
import OverviewSection from "./Component/AdminComponent/OverviewSection";
import AdminLayout from "./layouts/AdminLayout";
import ProductManagement from "./Component/AdminComponent/ProductManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <RegisterForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "product/:id", element: <ProductDetail /> }, // not complete yet
      { path: "shop-registration", element: <ShopRegistration /> },
      { path: "shop-page", element: <ShopPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
       { index: true, element: <OverviewSection /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "sales", element: <SalesManagement /> },
      { path: "products", element: <ProductManagement /> },

    ]
  }
]);


