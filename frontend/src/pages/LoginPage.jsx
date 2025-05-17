import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login_user } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login_user(username, password);

      if (response && response.success === true) {
        const role = response.user?.user_role;

        if (role === 'employee') {
          navigate('/trainingmanage');
        } else if (role === 'admin' || role === 'supervisor') {
          navigate('/dashboard');
        } else {
          navigate('/'); // fallback
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-xl py-2 px-6 flex justify-between items-center z-50 h-20">
        <div className='flex items-center space-x-4'>
          <img src="src/assets/dti-logo.png" alt="DTI Logo" className="h-18" />
          <div>
            <p className="text-sm font-bold text-gray-500">
              DEPARTMENT OF TRADE AND INDUSTRY REGIONAL OFFICE 1
            </p>
            <div className="border-t border-black w-105 mb-1"></div>
            <h2 className="text-xl font-bold leading-none">
              EMPLOYEES TRAINING MANAGEMENT SYSTEM<br />
            </h2>
          </div>
        </div>
      </header>

      <div>
        <div className="flex flex-col justify-center items-center h-screen pt-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('src/assets/loginBG2.png')" }}>
          <div className="bg-white p-8 rounded-lg w-110 relative shadow-xl">
            <div className="absolute -top-17 left-1/2 transform -translate-x-1/2 ">
              <img
                src="src/assets/roundDTI.png"
                alt="Logo"
                className="w-30 h-30 rounded-full shadow-[0_3px_4px_rgba(0,0,0,0.4)]"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <p className="text-3xl font-bold text-center mt-10">WELCOME</p>

              <div className="mb-0">
                <br />
                <input
                  type="text"
                  placeholder="Email"
                  id="username"
                  name="username"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded shadow-md mb-5 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>
            {error &&
              <div className="bg-red-100 text-red-800 p-2 w-full text-center border border-red-400 rounded">
                <i className="text-xs">{error}</i>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
