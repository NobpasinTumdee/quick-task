import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import './style/Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [signUp, setSignUp] = useState(false);

    const handleSignup = async () => {
        if (password !== ConfirmPassword) {
            alert('password not match');
            return;
        } else if (password.length < 6) {
            alert('password must be at least 6 characters');
            return;
        }
        try {
            setLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                throw error;
            } else {
                alert('signup success! please check your email to verify.');
                setLoading(false); setEmail(''); setPassword(''); setConfirmPassword(''); setSignUp(false);
            }
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                throw error;
            } else {
                alert('login success!');
                setLoading(false); setEmail(''); setPassword(''); setConfirmPassword('');
                localStorage.setItem('user_id', data.user.id);
                navigate("/");
            }
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut()
            if (error) {
                throw error
            } else {
                alert('logout success!');
                setLoading(false); setEmail(''); setPassword(''); setConfirmPassword('');
                window.location.reload();
            }
        } catch (error) {
            alert('error' + error);
            setLoading(false);
        }
    }

    return (
        <>
            {signUp ? (
                <>
                    <div className="auth-wrapper">
                        <div className="auth-card">
                            <h2 className="auth-title">Welcome to Quick Task 🔥</h2>
                            <p className="auth-subtitle">Sign up to continue</p>

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

                            <div className="auth-input">
                                <span className="auth-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={ConfirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button className="btn-primary" onClick={handleSignup} style={{ pointerEvents: loading ? 'none' : 'auto' }}>{loading ? 'Loading...' : 'Sign Up'}</button>

                            <p className="auth-footer">
                                Already have an account{" "}
                                <span className="auth-link" onClick={() => setSignUp(false)}>Log In</span>
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="auth-wrapper">
                        <div className="auth-card">
                            <h2 className="auth-title">Welcome Back 👋</h2>
                            <p className="auth-subtitle">Log in to continue</p>

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

                            <button className="btn-primary" onClick={handleLogin} style={{ pointerEvents: loading ? 'none' : 'auto' }}>{loading ? 'Loading...' : 'Log In'}</button>
                            <button className="btn-secondary" onClick={handleLogout} style={{ pointerEvents: loading ? 'none' : 'auto' }}>{loading ? 'Loading...' : 'Log Out'}</button>

                            <p className="auth-footer">
                                Don't have an account?{" "}
                                <span className="auth-link" onClick={() => setSignUp(true)}>Create one</span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Login;