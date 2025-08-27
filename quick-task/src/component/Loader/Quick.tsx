import './quickLoader.css';
import A1 from '../../assets/logo/a1.png';
import A2 from '../../assets/logo/a2.png';
import A3 from '../../assets/logo/a3.png';
import A4 from '../../assets/logo/a4.png';
const QuickLoader = () => {
    return (
        <>
            <div className='container-loader-quick'>
                <img src={A1} alt="A1" className='quick-a1' />
                <img src={A2} alt="A2" className='quick-a2' />
                <img src={A3} alt="A3" className='quick-a3' />
                <img src={A4} alt="A4" className='quick-a4' />
            </div>
        </>
    )
}

export default QuickLoader
