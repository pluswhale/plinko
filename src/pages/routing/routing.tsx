import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';

const MainPage = React.lazy(() => import('../main/main'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense fallback={<LoaderScreen />}>
            <BrowserRouter>
                <Routes>
                    <Route path="plinko" element={<MainPage />} />
                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

