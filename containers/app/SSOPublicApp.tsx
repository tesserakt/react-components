import React, { useEffect, useState } from 'react';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getLocalIDFromPathname } from 'proton-shared/lib/authentication/pathnameHelper';
import { resumeSession } from 'proton-shared/lib/authentication/persistedSessionHelper';
import { getApiErrorMessage, getIs401Error } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';

import LoaderPage from './LoaderPage';
import ModalsChildren from '../modals/Children';
import { ProtonLoginCallback, StandardLoadError, useApi, useNotifications } from '../../index';

interface Props {
    onLogin: ProtonLoginCallback;
    onInactiveSession: (localID?: number) => void;
}
const SSOPublicApp = ({ onLogin, onInactiveSession }: Props) => {
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useEffect(() => {
        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                return onInactiveSession(undefined);
            }
            await loadOpenPGP();
            try {
                const result = await resumeSession(silentApi, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError || getIs401Error(e)) {
                    return onInactiveSession(localID);
                }
                throw e;
            }
        };
        run().catch((e) => {
            const errorMessage = getApiErrorMessage(e) || 'Unknown error';
            createNotification({ type: 'error', text: errorMessage });
            console.error(error);
            setError(e);
        });
    }, []);

    if (error) {
        return <StandardLoadError />;
    }

    return (
        <>
            <LoaderPage />
            <ModalsChildren />
        </>
    );
};

export default SSOPublicApp;