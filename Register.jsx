import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";

export default function Register(){
  const [form, setForm] = useState({
    FullName:"", Email:"", Password:"", PhoneNumber:"", Role:"Guest"
  });
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await api.post("/auth/register", form);
      alert("Registration successful. Please sign in.");
      navigate("/login");
    }catch(err){
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card card" onSubmit={submit}>
        <h2>Create account</h2>
        <input className="a-input" placeholder="Full name" name="FullName" onChange={e=>setForm({...form,[e.target.name]:e.target.value})} required />
        <input className="a-input" type="email" placeholder="Email" name="Email" onChange={e=>setForm({...form,[e.target.name]:e.target.value})} required />
        <input className="a-input" type="password" placeholder="Password" name="Password" onChange={e=>setForm({...form,[e.target.name]:e.target.value})} required />
        <input className="a-input" placeholder="Phone number" name="PhoneNumber" onChange={e=>setForm({...form,[e.target.name]:e.target.value})} required />
        <select className="a-input" name="Role" value={form.Role} onChange={e=>setForm({...form,Role:e.target.value})}>
          <option value="Guest">Guest</option>
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="a-btn" type="submit">Register</button>
        <div className="muted">Already have an account? <Link to="/login">Sign in</Link></div>
      </form>
    </div>
  );
}
