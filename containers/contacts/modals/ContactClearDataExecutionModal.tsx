import React, { useEffect, useRef, useState } from 'react';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { CachedKey } from 'proton-shared/lib/interfaces';
import { dropDataEncryptedWithAKey } from 'proton-shared/lib/contacts/globalOperations';
import { Alert, DynamicProgress, FormModal, PrimaryButton } from '../../../components';
import { useApi, useContacts, useEventManager } from '../../../hooks';

interface Props {
    errorKey: CachedKey;
    onClose?: () => void;
}

const ContactClearDataExecutionModal = ({ onClose = noop, errorKey, ...rest }: Props) => {
    const [contacts = [], loadingContacts] = useContacts() as [Contact[] | undefined, boolean, Error];
    const api = useApi();
    const { call } = useEventManager();

    const [progress, setProgress] = useState(0);
    const [closing, setClosing] = useState(false);
    const [execution, setExecution] = useState(true);
    const exitRef = useRef(false);

    const max = contacts.length;

    useEffect(() => {
        if (loadingContacts) {
            return;
        }

        const execute = async () => {
            await dropDataEncryptedWithAKey(contacts, errorKey, api, (index) => setProgress(index), exitRef);
            await call();
            setExecution(false);
        };

        void execute();
    }, [loadingContacts]);

    // Delayed closing no to leave ongoing process
    useEffect(() => {
        if (closing && !execution) {
            onClose();
        }
    }, [closing, execution]);

    const handleClose = () => {
        exitRef.current = true;
        setClosing(true);
    };

    return (
        <FormModal
            title={c('Title').t`Clearing data`}
            onSubmit={onClose}
            onClose={handleClose}
            submit={
                <PrimaryButton disabled={execution} type="submit" data-focus-fallback="-1">
                    {c('Action').t`Done`}
                </PrimaryButton>
            }
            className="pm-modal--smaller"
            {...rest}
        >
            <Alert type="info">{c('Info')
                .t`This process may take some time depending on the amount of contacts that contained data encrypted with the key.`}</Alert>
            <DynamicProgress
                id="clear-data-execution-progress"
                value={progress}
                display={
                    execution
                        ? c('Info').t`Clearing data from ${progress}/${max}. Please wait...`
                        : c('Info').t`All your contacts have been processed.`
                }
                max={max}
                loading={execution}
            />
        </FormModal>
    );
};

export default ContactClearDataExecutionModal;