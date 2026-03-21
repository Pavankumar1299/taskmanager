import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    await API.post("/users", {
      name, email, password, role: "USER"
    });
    alert("Account created!");
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input className="w-full mb-3 p-2 border rounded" placeholder="Name"
          onChange={(e)=>setName(e.target.value)} />

        <input className="w-full mb-3 p-2 border rounded" placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" className="w-full mb-4 p-2 border rounded" placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleSignup}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;