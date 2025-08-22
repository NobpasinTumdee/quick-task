export type Profile = {
    id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    nickname?: string;
    age?: number;
    avatar_url?: string;
};

export type TaskInterface = {
    id?: string;
    task_name?: string;
    task_description?: string;
    start_date?: Date;
    end_date?: Date;
    user_id?: string;
    status_id?: string;

    status_task?: StatusTaskInterface;
};

export type StatusTaskInterface = {
    id: string;
    status_name: string;
    description: string;
};

export type WalletInterface = {
    id?: string;
    name?: string;
    balance?: number;
    user_id?: string;
    created_at?: Date;
};

export type TransactionInterface = {
    id?: string;
    wallet_id?: string;
    status_id?: number;
    amount?: number;
    description?: string;
    type?: string;
    transaction_date: Date;

    transaction_statuses?: TransactionStatusInterface;
};

export type TransactionStatusInterface = {
    id?: string;
    name?: string;
};


export interface TodoItem {
    id: string;
    task: string;
    time: string;
    is_completed: boolean;
    due_date: string;
}