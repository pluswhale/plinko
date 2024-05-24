import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { loginUser, referralUser, spinWheelByUser } from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';
import { WHEEL_SPINNING_SECONDS } from '../../shared/libs/constants';

//@ts-ignore
const tg: any = window?.Telegram?.WebApp;

export interface UserData {
    bonusSpins: number;
    createdAt: string;
    referralCode: string;
    referredBy: null | any;
    referredUsers: any[];
    spinsAvailable: number;
    unclaimedTokens: number;
    updatedAt: string;
    lastSpinTime: string[];
    userId: string;
    __v: number;
    _id: string;
}

export interface TelegramUserData {
    allows_write_to_pm: boolean;
    first_name: string;
    id: number;
    is_premium: boolean;
    language_code: string;
    last_name: string;
    username: string;
}

interface AppContextType {
    userData: UserData | null;
    isFreeSpins: boolean | null;
    isMobile: boolean;
    isAvailableToSpin: boolean;
    tgUser: TelegramUserData | null;
    updateFreeSpins: () => void;
    updateBonusSpins: (countSpins?: number) => void;
    updateTempWinScore: (score: number) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// const FAKE_USER = {
//     _id: '664df59323d74ce23ab961f5',
//     userId: '574813379',
//     unclaimedTokens: 60,
//     countSpins: 3,
//     spinsAvailable: 2,
//     bonusSpins: 0,
//     referralCode: '6910180d-d5b0-4093-a4b0-268a999c4ac2',
//     referredBy: null,
//     referredUsers: [],
//     lastSpinTime: ['2024-05-21T19:02:04.007+00:00', '2024-05-22T04:24:11.639+00:00', '2024-05-22T10:17:34.732+00:00'],
//     createdAt: '2024-05-21T11:33:49.389+00:00',
//     updatedAt: '2024-05-22T10:17:34.733+00:00',
//     __v: 5,
// } as any;

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export const AppContextProvider: React.FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [tgUser, setTgUser] = useState<TelegramUserData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [isFreeSpins, setIsFreeSpins] = useState<boolean | null>(false);
    const [isAvailableToSpin, setIsAvailableToSpin] = useState<boolean>(false);
    const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false);
    const uriParams = parseUriParamsLine(window.location.href?.split('?')?.[1]);

    useEffect(() => {
        return () => {
            onExitFromApp();
        };
    }, []);

    useEffect(() => {
        //@ts-ignore
        if (window.Telegram && window.Telegram.WebApp) {
            //@ts-ignore
            tg.ready();
            // Get user data from the Telegram Web App context
            const user = tg.initDataUnsafe.user;
            setTgUser(user);
        } else {
            console.error('Telegram WebApp is not initialized or running outside of Telegram context.');
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await loginUser(tgUser?.id?.toString() || '574813379'); //574813379
                if (res) {
                    setUserData(res.user);
                    if (uriParams?.tgWebAppStartParam) {
                        await referralUser(res.user.userId, {
                            referredById: uriParams?.tgWebAppStartParam?.split('#')?.[0],
                        });
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [tgUser?.id, uriParams?.startapp]);

    useEffect(() => {
        //@ts-ignore
        if (userData?.bonusSpins > 0) {
            setIsFreeSpins(false);
            setIsAvailableToSpin(true);
            //@ts-ignore
        } else if (userData?.spinsAvailable > 0) {
            setIsFreeSpins(true);
            setIsAvailableToSpin(true);
        } else {
            setIsFreeSpins(null);
            setIsAvailableToSpin(false);
        }

        setTimeout(() => {
            setIsAppLoaded(true);
            setIsLoading(false);
        }, 4000);
    }, [userData?.spinsAvailable, userData?.bonusSpins]);

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    // Actions
    const updateTempWinScore = (score: number) => {
        if (userData?.userId) {
            spinWheelByUser(userData?.userId, {
                winScore: score,
                isFreeSpin: isFreeSpins,
            }).then((res) => {
                if (res && res.status && res?.status === 200) {
                    setTimeout(() => {
                        setUserData((prevUserData: any) => ({
                            ...prevUserData,
                            unclaimedTokens: prevUserData.unclaimedTokens + score,
                        }));
                    }, WHEEL_SPINNING_SECONDS);
                }
            });
        }
    };

    const updateFreeSpins = () => {
        if (userData) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                spinsAvailable: prevUserData.spinsAvailable > 0 ? prevUserData.spinsAvailable - 1 : 0,
            }));
        }
    };

    const updateBonusSpins = (countSpins?: number) => {
        if (countSpins) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: (prevUserData.bonusSpins += countSpins),
            }));
        } else {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: prevUserData.bonusSpins - 1,
            }));
        }
    };

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                isFreeSpins,
                isAvailableToSpin,
                isMobile,
                updateTempWinScore,
                updateFreeSpins,
                updateBonusSpins,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

