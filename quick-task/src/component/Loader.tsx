import './loader.css'

const Loader = () => {
    return (
        <>
            <div className="container-loader">
                <div className="top-loader">
                    <div className="square">
                        <div className="square">
                            <div className="square">
                                <div className="square">
                                    <div className="square"><div className="square">
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-loader">
                    <div className="square">
                        <div className="square">
                            <div className="square">
                                <div className="square">
                                    <div className="square"><div className="square">
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="left-loader">
                    <div className="square">
                        <div className="square">
                            <div className="square">
                                <div className="square">
                                    <div className="square"><div className="square">
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-loader">
                    <div className="square">
                        <div className="square">
                            <div className="square">
                                <div className="square">
                                    <div className="square"><div className="square">
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-loader'>
                <h1>Loading...</h1>
                <p>เหตุผลที่โหลดช้าง่ายๆเลยครับ เพราะเว็ปนี้ใช้ ฐานข้อมูลจาก Supabase แบบฟรีทำให้เราโหลดข้อมูลของท่านได้ช้า</p>
                <p>สรุปง่ายครับผมไม่มีตัง 😭</p>
            </div>

        </>
    )
}

export default Loader
