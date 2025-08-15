import { useParams } from "react-router-dom";

const Finance = () => {
    const { id } = useParams();
    return (
        <>
            <h1>Finance</h1>
            <p>ID: {id}</p>
        </>
    )
}

export default Finance
