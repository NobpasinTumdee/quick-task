import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useEffect, useState } from "react";
import Loader from "../../component/Loader";
import type { TransactionInterface, TransactionStatusInterface } from "../../interface";

const Finance = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [Transactions, setTransactions] = useState<TransactionInterface[]>([]);
    const [status, setStatus] = useState<TransactionStatusInterface[]>([]);
    const [TransactionForm, setTransactionForm] = useState<TransactionInterface>({
        wallet_id: String(id),
        status_id: 1,
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
        if (TransactionForm.type === '' || TransactionForm.amount === 0) {
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
                alert("Transaction created.");
                setTransactionForm({
                    wallet_id: String(id),
                    status_id: 1,
                    amount: 0,
                    type: '',
                    description: '',
                    transaction_date: new Date(),
                });
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

    if (loading) {
        return (
            <>
                <Loader />
            </>
        );
    }
    return (
        <>
            <h1>Finance</h1>
            <p>ID: {id}</p>
            <div>
                <input type="number" onChange={(e) => setTransactionForm({ ...TransactionForm, amount: Number(e.target.value) })} />
                <input type="text" onChange={(e) => setTransactionForm({ ...TransactionForm, description: e.target.value })} />
                <select name="type" id="type" onChange={(e) => setTransactionForm({ ...TransactionForm, type: e.target.value })}>
                    <option value="">---- select ----</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select name="status" id="status" onChange={(e) => setTransactionForm({ ...TransactionForm, status_id: Number(e.target.value) })}>
                    <option value="">---- select ----</option>
                    {status.map((status) => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                </select>
                <button onClick={createTransaction}>Create Transaction</button>
            </div>
            <div>
                {Transactions.map((transaction ,index) => (
                    <div key={index}>
                        <p>{transaction.amount}</p>
                        <p>{transaction.type}</p>
                        <p>{transaction.transaction_statuses?.name}</p>
                        <p>{transaction.description}</p>
                        <p>{String(transaction.transaction_date).slice(0, 10)}</p>
                        <h3 onClick={() => deleteTransaction(String(transaction.id))}>delete</h3>
                        <hr />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Finance
