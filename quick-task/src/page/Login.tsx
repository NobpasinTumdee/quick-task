import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import './style/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Signup error:", error.message);
        } else {
            alert('ลงทะเบียนสำเร็จ! โปรดตรวจสอบอีเมลเพื่อยืนยัน');
        }
    };

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Login error:", error.message);
        } else {
            alert('เข้าสู่ระบบสำเร็จ!');
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error("Logout error:", error.message);
            } else {
                alert('ออกจากระบบสำเร็จ!');
            }
        } catch (error) {
            alert('error' + error);
        }


    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-card">
                    <h2 className="auth-title">Welcome Back 👋</h2>
                    <p className="auth-subtitle">Sign up or log in to continue</p>

                    <div className="auth-input">
                        <span className="auth-icon">📧</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-input">
                        <span className="auth-icon">🔒</span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="btn-primary" onClick={handleLogin}>Log In</button>
                    <button className="btn-outline" onClick={handleSignup}>Sign Up</button>
                    <button className="btn-secondary" onClick={handleLogout}>Log Out</button>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <span className="auth-link">Create one</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;