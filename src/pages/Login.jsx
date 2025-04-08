import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
            'http://localhost:5000/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            }
        );       

        const data = await response.json()

        if (response.ok) {
            login({ token: data.token})
        } else {
            alert(data.message)
        }
      } catch (error) {
        setError("Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu.");
      }
    };
  
    return (
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Đăng nhập
          </button>
        </form>
      </div>
    );
  };
  
  export default Login;
