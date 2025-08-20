import { useEffect, useState } from "react";

export function useTheme(defaultTheme: string = "White") {
    const [theme, setTheme] = useState(
        localStorage.getItem("SelectedTheme") || defaultTheme
    );

    useEffect(() => {
        document.querySelector("body")?.setAttribute("data-theme", theme);
        localStorage.setItem("SelectedTheme", theme);
    }, [theme]);

    return { theme, setTheme };
}
export function checkTheme() {
    const SelectedTheme = localStorage.getItem("SelectedTheme");
    const setWhite = () => { document.querySelector("body")?.setAttribute("data-theme", "White"); localStorage.setItem("SelectedTheme", "White") }
    const setDark = () => { document.querySelector("body")?.setAttribute("data-theme", "Dark"); localStorage.setItem("SelectedTheme", "Dark") }
    if (SelectedTheme === "White") { setWhite(); } else if (SelectedTheme === "Dark") { setDark(); }
}
