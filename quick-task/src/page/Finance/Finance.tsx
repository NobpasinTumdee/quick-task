import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useEffect, useState } from "react";
import Loader from "../../component/Loader";
import type { TransactionInterface, TransactionStatusInterface } from "../../interface";
import { Modal, message } from 'antd';
import '../style/Wallet.css'

const Finance = () => {
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [isModalIncome, setIsModalIncome] = useState(false);
    const [isModalExpense, setIsModalExpense] = useState(false);
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
            setLazyLoading(true);
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
                setLazyLoading(false);
                messageApi.open({
                    type: 'success',
                    content: 'Transaction created.',
                });
            }
            await fetchTransactions();
            await insertBalance();
        } catch (error) {
            console.error("Error creating transaction:", error);
            setLazyLoading(false);
        }
    }

    const deleteTransaction = async (id: string) => {
        try {
            setLazyLoading(true);
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)
            if (error) {
                console.error("Error deleting transaction:", error);
            }
            await fetchTransactions();
            await insertBalance();
            setLazyLoading(false);
            messageApi.open({
                type: 'success',
                content: 'Transaction deleted.',
            });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            setLazyLoading(false);
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

    const insertBalance = async () => {
        const TotalBalance = calculateBalance();
        try {
            const { error } = await supabase
                .from('wallets')
                .update({ balance: TotalBalance })
                .eq('id', id)
                .select()
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    }

    const createIncome_expense = async (type: string) => {
        const newTransactionForm = { ...TransactionForm, type: type };
        setTransactionForm(newTransactionForm);
        if (newTransactionForm.type === '' || TransactionForm.amount === 0 || TransactionForm.status_id === 0) {
            alert("Please fill all the fields.");
            return;
        }
        try {
            // console.table(newTransactionForm);
            setLazyLoading(true);
            const { error } = await supabase
                .from('transactions')
                .insert(newTransactionForm);

            setIsModalIncome(false); setIsModalExpense(false);
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
                setLazyLoading(false);
                messageApi.open({
                    type: 'success',
                    content: 'Transaction created.',
                });
            }
            await fetchTransactions();
            await insertBalance();
        } catch (error) {
            console.error("Error creating transaction:", error);
            setLazyLoading(false);
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
            <div style={{ margin: '0 5%' }}>
                <h2>Welcome to Finance!</h2>
                <p style={{ opacity: 0.7, fontWeight: '100' }}>ID: {id}</p>
                <p style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => setPopup(!popup)}>{popup ? '- Close' : '+ Add'}</p>
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
                <div className="income" onClick={() => setIsModalIncome(true)}>
                    <p>Income</p>
                    <h1>฿ {Transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + Number(transaction.amount), 0)}</h1>
                </div>
                <div className="expense" onClick={() => setIsModalExpense(true)}>
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
                            {status.map((status, index) => (
                                <option key={index} value={status.id}>{status.name}</option>
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
                <div style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Transactions</h2>
                </div>
                <div className="line-transactions">
                    {Transactions.filter((transaction) => {
                        if (filterType === 'all') return true;
                        if (filterType === 'income') return transaction.type === 'income';
                        if (filterType === 'expense') return transaction.type === 'expense';
                    }).map((transaction, index) => (
                        <div key={index} className="transaction">
                            <div className="transaction-status">
                                <div style={{ backgroundColor: transaction.type === "income" ? "green" : "red" }} className="transaction-icon"></div>
                                <div>
                                    <p className="transaction-status-name">{transaction.transaction_statuses?.name}</p>
                                    <p className="transaction-status-description">{transaction.description}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                <div>
                                    <p>{transaction.type === "income" ? "+" : "-"}{transaction.amount} ฿</p>
                                    <p style={{ opacity: 0.7 }}>{String(transaction.transaction_date).slice(0, 10)}</p>
                                </div>
                                {lazyLoading ? (
                                    <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8d8d8dff">
                                        <path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
                                    </svg>
                                ) : (
                                    <svg onClick={() => deleteTransaction(String(transaction.id))} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8d8d8dff">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <Modal
                open={isModalIncome}
                onOk={() => createIncome_expense('income')}
                onCancel={() => setIsModalIncome(false)}
            >
                <div className="form-income-expense-modal income-line">
                    <label htmlFor="amount">Income</label>
                    <input type="number" value={TransactionForm.amount} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
                    <label htmlFor="amount">Description</label>
                    <input type="text" value={TransactionForm.description} onChange={(e) => setTransactionForm({ ...TransactionForm, description: e.target.value })} />
                    <select name="status" id="status" value={TransactionForm.status_id} onChange={(e) => setTransactionForm({ ...TransactionForm, status_id: Number(e.target.value) })}>
                        <option value="">select type</option>
                        {status.map((status) => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                </div>
            </Modal>
            <Modal
                open={isModalExpense}
                onOk={() => createIncome_expense('expense')}
                onCancel={() => setIsModalExpense(false)}
            >
                <div className="form-income-expense-modal expense-line">
                    <label htmlFor="amount">Expense</label>
                    <input type="number" value={TransactionForm.amount} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
                    <label htmlFor="amount">Description</label>
                    <input type="text" value={TransactionForm.description} onChange={(e) => setTransactionForm({ ...TransactionForm, description: e.target.value })} />
                    <select name="status" id="status" value={TransactionForm.status_id} onChange={(e) => setTransactionForm({ ...TransactionForm, status_id: Number(e.target.value) })}>
                        <option value="">select type</option>
                        {status.map((status) => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                </div>
            </Modal>
        </>
    )
}

export default Finance
