import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3030/api/auth/login",
        user
      );
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/homepage");
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const signup = () => {
    navigate("/signup");
  };
  return (
    <>
      <div className="login">
        <div className="login__container">
          <div className="login__header">
            <p className="login__text">Login</p>
            <div className="login__underline"></div>
          </div>
          <div className="login__inputs">
            <div className="login__input">
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login__input">
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="login_submit-container">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={signup}>Signup</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
