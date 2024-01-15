import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
        const navigate=useNavigate();
        const handlerClick=()=>{
            navigate('/')
        }
    return (
        <div>
            <div className='container' >
                <button className = 'btn btn-danger' onClick={handlerClick} >Log Out</button>

            </div>
        </div>
    )
}
export default Dashboard