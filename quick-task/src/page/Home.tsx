import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export type users = {
    id: number;
    name: string;
    password: string;
    created_at: string;
}

const Home = () => {
    const [users, setUsers] = useState<users[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('users').select('*');
        setLoading(false);
        if (!error) {
            setUsers(data);
            console.log("Fetched users:", data);
        } else {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <>
            <h1>Home</h1>
            {users.map((user) => (
                <div key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.created_at}</p>
                    <p>{user.password}</p>
                </div>
            ))}
            {loading ? <p>Loading...</p> : <button onClick={fetchUsers}>Get Users</button>}
        </>
    );
};

export default Home;

