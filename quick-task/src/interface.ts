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