import Header from "../Component/Header";
import LoginForm from "../Component/Login/Login";
import Footer from "../Component/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  return (
    <>
      <Header />
      <LoginForm />
      <Footer />
    </>
  );
}

export default LoginPage;
