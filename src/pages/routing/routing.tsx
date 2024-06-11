import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';

const MainPage = React.lazy(() => import('../main/main'));
const PaymentPage = React.lazy(() => import('../payment/payment'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense fallback={<LoaderScreen />}>
            <BrowserRouter basename="/whisky-plinko">
                {' '}
                {/* Add basename here */}
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="payment" element={<PaymentPage />} />
                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

