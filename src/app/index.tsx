import { Flip, ToastContainer } from 'react-toastify';
import { Routing } from '../pages/routing/routing';
import 'react-toastify/dist/ReactToastify.css';

const Application = () => {
    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Flip}
            />
            <Routing />
        </>
    );
};

export default Application;

