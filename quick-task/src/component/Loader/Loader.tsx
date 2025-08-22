import './loader.css'

const Loader = () => {
    return (
        <>
            <div className='container-group'>
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
                </div>
            </div>
        </>
    )
}

export default Loader
