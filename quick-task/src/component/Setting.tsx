import { useTheme } from "./Theme";


const Setting = () => {
    const { theme, setTheme } = useTheme();
    return (
        <>
            <div className="setting">
                <h1>Theme : {theme}</h1>
                <div onClick={() => setTheme("White")} className="theme">
                    <p>While Theme</p>
                </div>
                <div onClick={() => setTheme("Dark")} className="theme">
                    <p>dark Theme</p>
                </div>
            </div>
        </>
    )
}

export default Setting
