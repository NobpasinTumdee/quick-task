import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useEffect, useState } from "react";
import Loader from "../../component/Loader";
import type { TransactionInterface, TransactionStatusInterface } from "../../interface";
import '../style/Wallet.css'

const Finance = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [Transactions, setTransactions] = useState<TransactionInterface[]>([]);
    const [status, setStatus] = useState<TransactionStatusInterface[]>([]);
    const [popup, setPopup] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [TransactionForm, setTransactionForm] = useState<TransactionInterface>({
        wallet_id: String(id),
        status_id: 0,
        amount: 0,
        type: '',
        description: '',
        transaction_date: new Date(),
    });
    useEffect(() => {
        fetchTransactions();
    }, []);
    const fetchTransactions = async () => {
        try {
            const { data: transactions, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    transaction_statuses (
                        id,
                        name
                    )`)
                .eq('wallet_id', id);
            if (error) {
                console.error("Error fetching transactions:", error);
                return;
            }
            if (transactions) {
                setLoading(false);
                setTransactions(transactions);
                // console.table(transactions);
            } else {
                setLoading(false);
                setTransactions([]);
                console.log("No transactions found.");
            }
            await fetchStatus();
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    const fetchStatus = async () => {
        try {
            const { data: status, error } = await supabase
                .from('transaction_statuses')
                .select('*');
            if (error) {
                console.error("Error fetching status:", error);
                return;
            }
            if (status) {
                setStatus(status);
                // console.table(status);
            } else {
                setStatus([]);
                console.log("No status found.");
            }
        } catch (error) {
            console.error("Error fetching status:", error);
        }
    }

    const createTransaction = async () => {
        if (TransactionForm.type === '' || TransactionForm.amount === 0 || TransactionForm.status_id === 0) {
            alert("Please select a type.");
            return;
        }
        try {
            // console.table(TransactionForm);
            const { error } = await supabase
                .from('transactions')
                .insert(TransactionForm);
            if (error) {
                console.error("Error creating transaction:", error);
                return;
            } else {
                setTransactionForm({
                    wallet_id: String(id),
                    status_id: 1,
                    amount: 0,
                    type: '',
                    description: '',
                    transaction_date: new Date(),
                });
                alert("Transaction created.");
            }
            await fetchTransactions();
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    }

    const deleteTransaction = async (id: string) => {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)
            if (error) {
                console.error("Error deleting transaction:", error);
            }
            await fetchTransactions();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }

    const calculateBalance = () => {
        let balance = 0;
        if (loading) {
            return balance;
        } else {
            Transactions.forEach((transaction) => {
                if (transaction.type === "income") {
                    balance += Number(transaction.amount || 0);
                } else if (transaction.type === "expense") {
                    balance -= Number(transaction.amount || 0);
                }
            });
            return balance;
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
            <div style={{ margin: '0 5%' }}>
                <h2>Welcome to Finance!</h2>
                <p style={{ opacity: 0.7, fontWeight: '100' }}>ID: {id}</p>
                <p style={{ textAlign: 'right' }} onClick={() => setPopup(!popup)}>{popup ? '- Close' : '+ Add'}</p>
            </div>
            <div className="balance" onClick={() => setPopup(!popup)}>
                <p>Total Balance</p>
                <h1>฿ {calculateBalance()}</h1>
                <div className="income-expense">
                    <div><p>Income:</p><br />{Transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + Number(transaction.amount), 0)} ฿</div>
                    <div><p>Expense:</p><br />{Transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + Number(transaction.amount), 0)} ฿</div>
                </div>
            </div>
            <div className="income-expense-summary">
                <div className="income">
                    <p>Income</p>
                    <h1>฿ {Transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + Number(transaction.amount), 0)}</h1>
                </div>
                <div className="expense">
                    <p>Expense</p>
                    <h1>฿ {Transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + Number(transaction.amount), 0)}</h1>
                </div>
            </div>
            {popup &&
                <div className="form-income-expense">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={TransactionForm.amount} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
                    <label htmlFor="amount">Description</label>
                    <input type="text" value={TransactionForm.description} onChange={(e) => setTransactionForm({ ...TransactionForm, description: e.target.value })} />
                    <div className="form-select">
                        <select name="type" id="type" value={TransactionForm.type} onChange={(e) => setTransactionForm({ ...TransactionForm, type: e.target.value })}>
                            <option value="">Income / Expense</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <select name="status" id="status" value={TransactionForm.status_id} onChange={(e) => setTransactionForm({ ...TransactionForm, status_id: Number(e.target.value) })}>
                            <option value="">select type</option>
                            {status.map((status) => (
                                <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={createTransaction}>Create Transaction</button>
                </div>
            }

            <div className="transaction-type">
                <h2 onClick={() => setFilterType('all')}>all</h2>
                <h2 onClick={() => setFilterType('income')}>income</h2>
                <h2 onClick={() => setFilterType('expense')}>expense</h2>
            </div>

            <div className="transactions">
                <div className="line-transactions">
                    {Transactions.filter((transaction) => {
                        if (filterType === 'all') return true;
                        if (filterType === 'income') return transaction.type === 'income';
                        if (filterType === 'expense') return transaction.type === 'expense';
                    }).map((transaction, index) => (
                        <>
                            <div key={index} className="transaction">
                                <div className="transaction-status">
                                    <div style={{ backgroundColor: transaction.type === "income" ? "green" : "red" }} className="transaction-icon"></div>
                                    <p className="transaction-status-name">{transaction.transaction_statuses?.name}</p>
                                </div>
                                <div>
                                    <p>{transaction.type === "income" ? "+" : "-"}{transaction.amount} ฿</p>
                                    {/* <p>{transaction.description}</p> */}
                                    <p style={{ opacity: 0.7 }}>{String(transaction.transaction_date).slice(0, 10)}</p>
                                    <h3 onClick={() => deleteTransaction(String(transaction.id))}>delete</h3>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Finance
