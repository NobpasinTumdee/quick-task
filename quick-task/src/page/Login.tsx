import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

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
        <div>
            <h2>Signup / Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <button onClick={handleLogin}>Log In</button>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default Login;