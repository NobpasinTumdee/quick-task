import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { supabase } from "../../supabase/supabaseClient";
import type { WalletInterface } from "../../interface";
import Loader from "../../component/Loader";
import '../style/Wallet.css'

const Wallet = () => {
    const user_id = localStorage.getItem('user_id');
    const [wallet, setWallet] = useState<WalletInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [WalletForm, setWalletForm] = useState<WalletInterface>({
        name: '',
        user_id: String(user_id)
    });

    useEffect(() => {
        fetchWallet();
    }, []);


    const fetchWallet = async () => {
        try {
            const { data: wallets, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('user_id', user_id);
            if (error) {
                console.error("Error fetching wallet:", error);
                return;
            }
            if (wallets) {
                setLoading(false);
                setWallet(wallets);
                // console.table(wallets);
            } else {
                setLoading(false);
                setWallet([]);
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
        }
    }

    const InsertWallet = async (event: any) => {
        event.preventDefault();
        if (!WalletForm.user_id) {
            alert("pless select user");
            return;
        }
        try {
            // console.table(WalletForm);
            const { error } = await supabase
                .from('wallets')
                .insert(WalletForm);
            if (error) {
                throw error;
            }
            await fetchWallet();
        } catch (error: any) {
            console.error('Error inserting task:', error.message);
        }
    }

    if (loading) {
        return (
            <>
                <Loader />
            </>
        );
    }
    return (
        <>
            <div className="wallet-page-container">
                <h1 className="wallet-header">💰 My Wallets</h1>
                <p style={{textAlign:'center'}}>ยังไม่ได้ทำฟังก์ชั่นลบ นะค้าบบเดะจะรีบมาทำให้เน้อ</p>
                <div className="wallet-form-container">
                    <input
                        type="text"
                        className="wallet-input"
                        onChange={(e) => setWalletForm({ ...WalletForm, name: e.target.value })}
                        placeholder="Add a new wallet..."
                    />
                    <button className="wallet-button" onClick={InsertWallet}>
                        Add Wallet
                    </button>
                </div>
                <div className="wallet-list-grid">
                    {wallet.map((wallet, index) => (
                        <div key={index} className="wallet-card-item">
                            <div>
                                <h2 className="wallet-name">{wallet.name}</h2>
                                <p className="wallet-balance">Balance: {wallet.balance || 0} Baht</p>
                            </div>
                            <Link to={`/finance/${wallet.id}`} className="wallet-link-details">
                                View Details →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Wallet
