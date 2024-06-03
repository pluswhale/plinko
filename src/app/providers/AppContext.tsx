import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { loginUser } from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';

//@ts-ignore
const tg: any = window?.Telegram?.WebApp;

export interface UserData {
    createdAt: string;
    unclaimedTokens: number;
    updatedAt: string;
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
    isMobile: boolean;
    tgUser: TelegramUserData | null;
    decrementCurrentBalance: (amount: number) => void;
    incrementCurrentBalance: (amount: number) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

const FAKE_USER = {
    _id: '664df59323d74ce23ab961f5',
    userId: '574813379',
    unclaimedTokens: 1000,
    createdAt: '2024-05-21T11:33:49.389+00:00',
    updatedAt: '2024-05-22T10:17:34.733+00:00',
    __v: 5,
} as UserData;

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
    const [userData, setUserData] = useState<UserData | null>(FAKE_USER);
    const [loading, setIsLoading] = useState<boolean>(true);
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
                const res = await loginUser(tgUser?.id?.toString() || '90849048490'); //574813379
                if (res) {
                    setUserData(res.user || FAKE_USER);
                }
            } catch (error) {
                setUserData(FAKE_USER);
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [tgUser?.id, uriParams?.startapp]);

    useEffect(() => {
        setTimeout(() => {
            setIsAppLoaded(true);
            setIsLoading(false);
        }, 4000);
    }, [userData]);

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    function decrementCurrentBalance(amount: number) {
        setUserData((prev: any) => {
            return { ...prev, unclaimedTokens: parseFloat(prev?.unclaimedTokens) - amount };
        });
    }

    function incrementCurrentBalance(amount: number) {
        setUserData((prev: any) => {
            return { ...prev, unclaimedTokens: parseFloat(prev?.unclaimedTokens) + amount };
        });
    }

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                isMobile,
                decrementCurrentBalance,
                incrementCurrentBalance,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

