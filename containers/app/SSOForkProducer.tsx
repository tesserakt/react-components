import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import {
    getActiveSessions,
    GetActiveSessionsResult,
    resumeSession,
} from 'proton-shared/lib/authentication/persistedSessionHelper';
import {
    getProduceForkParameters,
    produceFork,
    ProduceForkParameters,
} from 'proton-shared/lib/authentication/sessionForking';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getApiErrorMessage, getIs401Error } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { LoaderPage, ModalsChildren, StandardLoadError, useApi, useNotifications } from '../../index';

interface Props {
    onActiveSessions: (data: ProduceForkParameters, activeSessions: GetActiveSessionsResult) => void;
    onInvalidFork: () => void;
}

const SSOForkProducer = ({ onActiveSessions, onInvalidFork }: Props) => {
    const [error, setError] = useState<Error | undefined>();
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useEffect(() => {
        const run = async () => {
            const { app, state, localID, sessionKey, type } = getProduceForkParameters();
            if (!app || !state || !sessionKey || sessionKey.length !== 32) {
                onInvalidFork();
                return;
            }
            await loadOpenPGP();
            if (localID === undefined) {
                const activeSessionsResult = await getActiveSessions(silentApi);
                return onActiveSessions({ app, state, sessionKey, type }, activeSessionsResult);
            }
            try {
                // Resume session and produce the fork
                const validatedSession = await resumeSession(silentApi, localID);
                await produceFork({
                    api: silentApi,
                    keyPassword: validatedSession.keyPassword,
                    UID: validatedSession.UID,
                    sessionKey,
                    state,
                    app,
                });
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError || getIs401Error(e)) {
                    const activeSessionsResult = await getActiveSessions(silentApi);
                    onActiveSessions({ app, state, sessionKey, type }, activeSessionsResult);
                    return;
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

export default SSOForkProducer;