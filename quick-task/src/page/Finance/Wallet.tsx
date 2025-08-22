import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { supabase } from "../../supabase/supabaseClient";
import type { WalletInterface } from "../../interface";
import { message } from 'antd';
import Loader from "../../component/Loader";
import '../style/Wallet.css'

const Wallet = () => {
    const user_id = localStorage.getItem('user_id');
    const [messageApi, contextHolder] = message.useMessage();
    const [wallet, setWallet] = useState<WalletInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [Wait, setWait] = useState(false);
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
        if (!WalletForm.user_id || !WalletForm.name) {
            alert("pless select user");
            return;
        }
        try {
            // console.table(WalletForm);
            setWait(true);
            const { error } = await supabase
                .from('wallets')
                .insert(WalletForm);
            if (error) {
                throw error;
            }
            setWait(false);
            await fetchWallet();
            messageApi.open({
                type: 'success',
                content: 'Wallet created.',
            });
        } catch (error: any) {
            console.error('Error inserting task:', error.message);
            setWait(false);
        }
    }

    const DeleteWallet = async (id: string) => {
        try {
            setWait(true);
            const { error } = await supabase
                .from('wallets')
                .delete()
                .eq('id', id)
            if (error) {
                throw error;
            } else {
                await fetchWallet();
                setWait(false);
                messageApi.open({
                    type: 'success',
                    content: 'Wallet deleted.',
                });
            }
        } catch (error: any) {
            console.error('Error deleting Wallet:', error.message);
            setWait(false);
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
            {contextHolder}
            <div className="wallet-page-container">
                <h1 className="wallet-header">💰 My Wallets</h1>
                <div className="wallet-form-container">
                    <input
                        type="text"
                        className="wallet-input"
                        onChange={(e) => setWalletForm({ ...WalletForm, name: e.target.value })}
                        placeholder="Add a new wallet..."
                    />
                    {Wait ? (
                        <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#999999">
                            <path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
                        </svg>
                    ) : (
                        <button className="wallet-button" onClick={InsertWallet} disabled={!WalletForm.name}>
                            Add Wallet
                        </button>
                    )}
                </div>
                <div className="wallet-list-grid">
                    {wallet.map((wallet, index) => (
                        <div key={index} className="wallet-card-item">
                            <div>
                                <h2 className="wallet-name">{wallet.name}</h2>
                                <p className="wallet-balance">Balance: {wallet.balance || 0} Baht</p>
                                {Wait ? (
                                    <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999">
                                        <path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999" onClick={() => DeleteWallet(String(wallet.id))} style={{ cursor: 'pointer' }}>
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                    </svg>
                                )}
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
