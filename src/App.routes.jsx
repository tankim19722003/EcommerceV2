import { createBrowserRouter } from "react-router-dom";
import { ShopPage } from "./page/ShopPage";
import RootLayout from "./layouts/RootLayout";
import RegisterForm from "./Component/Register/RegisterForm";
import HomePage from "./page/HomePage";
import LoginForm from "./Component/Login/Login";
import ShopRegistration from "./page/ShopRegistrationPage";
import ProductDetail from "./Component/ProductDetail/ProductDetail";
import CategoryManagement from "./Component/AdminComponent/CategoryManagement";
import SalesManagement from "./Component/AdminComponent/SalesManagement";
import OverviewSection from "./Component/AdminComponent/OverviewSection";
import AdminLayout from "./layouts/AdminLayout";
import ShopLayOut from "./layouts/ShopLayout";
import ShopOverview from "./Component/ShopComponent/Overview";
import NotFound from "./page/NotFound";
import ProductCreation from "./Component/ShopComponent/ProductCreation";
import Cart from "./Component/Cart/Cart";
import { authLoader } from "./auth/authLoader";
import PaymentPage from "./page/Payment";
import PaymentConfirmation from "./page/PaymentConfirmation";
import ProductList from "./Component/ProductList/ProductList";
import OrderList from "./Component/Order/OrderList";
import OrderManagement from "./Component/ShopComponent/OrderManagement";
import ProductManagement from "./Component/ShopComponent/ProductManagement";

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
      { path: "products", element: <ProductList/> },
      { path: "orders", element: <OrderList/> },
    ],
  },
  { path: "cart", element: <Cart />, loader: authLoader },
  { path: "payment", element: <PaymentPage />, loader: authLoader },
  { path: "payment-confirmation", element: <PaymentConfirmation /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <OverviewSection /> },
      // { path: "orders", element: <OrderManagement /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "sales", element: <SalesManagement /> },
      { path: "products", element: <ProductManagement /> },
    ],
  },
  {
    path: "/shop",
    element: <ShopLayOut />,
    children: [
      { index: true, element: <ShopOverview /> },
      { path: "product-management", element: <ProductManagement /> },
      { path: "product-creation", element: <ProductCreation /> },
      { path: "order", element: <OrderManagement/> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
