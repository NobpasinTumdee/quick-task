

const Setting = () => {
    const setWhite = () => {
        document.querySelector("body")?.setAttribute("data-theme", "White");
        localStorage.setItem("SelectedTheme", "White")
    }
    const setDark = () => {
        document.querySelector("body")?.setAttribute("data-theme", "Dark");
        localStorage.setItem("SelectedTheme", "Dark")
    }
    const SelectedTheme = localStorage.getItem("SelectedTheme");
    if (SelectedTheme === "White") {
        setWhite();
    }else if (SelectedTheme === "Dark") {
        setDark();
    }

    return (
        <>
            <div className="setting">
                <div onClick={setWhite} className="theme">
                    <p>While Theme</p>
                </div>
                <div onClick={setDark} className="theme">
                    <p>dark Theme</p>
                </div>
            </div>
        </>
    )
}

export default Setting
