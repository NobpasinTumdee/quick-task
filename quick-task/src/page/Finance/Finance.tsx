import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useEffect, useState } from "react";
import type { TransactionInterface, TransactionStatusInterface } from "../../interface";
import { Modal, message } from 'antd';
import '../style/Wallet.css'

import Aos from 'aos';
import 'aos/dist/aos.css';
import QuickLoader from "../../component/Loader/Quick";
import WeeklySpendingChart from "./ChartFinance";

const Finance = () => {
    const { id } = useParams();

    // Ui & loading
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [lazyLoading, setLazyLoading] = useState(false);

    // Modals
    const [isModalIncome, setIsModalIncome] = useState(false);
    const [isModalExpense, setIsModalExpense] = useState(false);
    const [popup, setPopup] = useState(false);
    const [popup2, setPopup2] = useState(false);

    // data
    const [Transactions, setTransactions] = useState<TransactionInterface[]>([]);
    const [status, setStatus] = useState<TransactionStatusInterface[]>([]);
    const [weeklyData, setWeeklyData] = useState(4);
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
    useEffect(() => { Aos.init({ duration: 500, once: true, }); }, []);
    useEffect(() => {
        insertBalance();
    }, [Transactions])
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
                .eq('wallet_id', id).order("transaction_date", { ascending: false });
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
        } else if (Number(TransactionForm.amount) < 1) {
            alert("Amount cannot be negative.");
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
                    status_id: 0,
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
        } else if (Number(TransactionForm.amount) < 1) {
            alert("Amount cannot be negative.");
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
                    status_id: 0,
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
        } catch (error) {
            console.error("Error creating transaction:", error);
            setLazyLoading(false);
        }
    }


    if (loading) {
        return (
            <>
                <QuickLoader />
            </>
        );
    }
    return (
        <>
            {contextHolder}
            <div style={{ margin: '0 5%' }} data-aos="fade-down">
                <h2>Welcome to Finance!</h2>
                <p style={{ opacity: 0.7, fontWeight: '100' }}>ID: {id}</p>
            </div>
            <div className="balance" onClick={() => setPopup(!popup)} data-aos="fade-down">
                <p>Total Balance</p>
                <h1>฿ {calculateBalance()}</h1>
                <div className="income-expense">
                    <div><p>Income:</p><br />{Transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + Number(transaction.amount), 0)} ฿</div>
                    <div><p>Expense:</p><br />{Transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + Number(transaction.amount), 0)} ฿</div>
                </div>
            </div>
            <div className="income-expense-summary">
                <div className="income" onClick={() => setIsModalIncome(true)} data-aos="fade-up">
                    <p>Income</p>
                    <h1>฿ {Transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + Number(transaction.amount), 0)}</h1>
                </div>
                <div className="expense" onClick={() => setIsModalExpense(true)} data-aos="fade-up">
                    <p>Expense</p>
                    <h1>฿ {Transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + Number(transaction.amount), 0)}</h1>
                </div>
            </div>
            <div style={{ margin: '0 5% 1%', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--border-box)" onClick={() => setPopup2(!popup2)} style={{ cursor: 'pointer' }} data-aos="zoom-in">
                    {popup2 ?
                        <path d="M73-889 889-73l-57 57-104-104H200q-33 0-56.5-23.5T120-200v-528L16-832l57-57Zm287 447L200-282v82h448L544-304l-22 24-162-162ZM200-648v252l126-126-126-126Zm36-192h524q33 0 56.5 23.5T840-760v524l-80-80v-234L650-426l-57-57 167-187v-90H316l-80-80Zm357 357Zm-158 70ZM326-522Zm34 80Zm176-98Z" />
                        :
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm80-160h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160Zm80-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM480-480Z" />
                    }
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--border-box)" onClick={() => setPopup(!popup)} style={{ cursor: 'pointer' }} data-aos="zoom-in">
                    {popup ?
                        <path d="m177-120-57-57 184-183H200v-80h240v240h-80v-104L177-120Zm343-400v-240h80v104l183-184 57 57-184 183h104v80H520Z" />
                        :
                        <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z" />
                    }
                </svg>
            </div>
            {popup &&
                <div className="form-income-expense">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" min={0} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
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

            {popup2 &&
                <div className="weekly-spending" data-aos="fade-up">
                    <WeeklySpendingChart transactions={Transactions} weeksToShow={weeklyData} />
                    <select name="weekly" id="weekly" value={weeklyData} onChange={(e) => setWeeklyData(Number(e.target.value))} className="weekly-select">
                        <option value={4}>select week</option>
                        <option value={2}>2 Week</option>
                        <option value={3}>3 Week</option>
                        <option value={4}>4 Week</option>
                        <option value={8}>8 Week</option>
                    </select>
                </div>
            }

            <div className="transaction-type" data-aos="fade-down">
                <h2 onClick={() => setFilterType('all')}>all</h2>
                <h2 onClick={() => setFilterType('income')}>income</h2>
                <h2 onClick={() => setFilterType('expense')}>expense</h2>
            </div>

            <div className="transactions" data-aos="fade-up">
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
                                    <p className="transaction-status-description">{(transaction.description)?.slice(0, 15)}</p>
                                    <p className="transaction-status-description">
                                        {new Date(transaction.transaction_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true, })} -
                                        {new Date(transaction.transaction_date).toLocaleDateString("th-TH", { dateStyle: "short" }) === new Date().toLocaleDateString("th-TH", { dateStyle: "short" }) ?
                                            "Today" :
                                            new Date(transaction.transaction_date).toLocaleDateString("th-TH", { dateStyle: "short" })
                                        }
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                <div>
                                    <p>
                                        {transaction.type === "income" ?
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#2da44e"><path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" /></svg>
                                                {" "}+
                                            </>
                                            :
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#c53d3d"><path d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z" /></svg>
                                                {" "}-
                                            </>
                                        }
                                        {transaction.amount} ฿
                                    </p>
                                    {/* <p style={{ opacity: 0.7 }}>{new Date(transaction.transaction_date).toLocaleDateString("th-TH", { dateStyle: "short" })}</p> */}
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
                    <input type="number" min={0} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
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
                    <input type="number" min={0} onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
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
