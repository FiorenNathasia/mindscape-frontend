import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="protectedroute__position">
        <p className="protectedroute__message">
          You are not authorised! <br />
          <span>You will be taken to login page...</span>
        </p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
