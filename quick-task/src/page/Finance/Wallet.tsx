import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { supabase } from "../../supabase/supabaseClient";
import type { WalletInterface } from "../../interface";
import Loader from "../../component/Loader";

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
            }else {
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
            <h1>Wallet</h1>
            <div>
                <input type="text" onChange={(e) => setWalletForm({ ...WalletForm, name: e.target.value })} />
                <button onClick={InsertWallet}>Insert</button>
            </div>
            <div>
                {wallet.map((wallet, index) => (
                    <div key={index}>
                        <h2>{wallet.name}</h2>
                        <p>Balance: {wallet.balance}</p>
                        <Link to={`/finance/${wallet.id}`}>Details</Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Wallet
