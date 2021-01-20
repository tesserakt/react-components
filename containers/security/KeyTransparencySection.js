import React from 'react';
import { c } from 'ttag';
import { updateKT } from 'proton-shared/lib/api/mailSettings';
import { Alert, Row, Field, Label, Info, Toggle } from '../../components';
import { useApi, useLoading, useMailSettings, useEventManager, useNotifications } from '../../hooks';

const KeyTransparencySection = () => {
    const { createNotification } = useNotifications();
    const { call } = useEventManager();
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [{ KT } = {}] = useMailSettings();

    const handleChange = async ({ target }) => {
        await api(updateKT(+target.checked));
        await call();
        createNotification({ text: c('Success').t`Preference saved` });
    };

    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/key-transparency/">
                {c('Info')
                    .t`Key Transparency is an advanced security feature. Only turn this on if you know what it does.`}
            </Alert>
            <Row>
                <Label htmlFor="trustToggle">
                    <span className="mr0-5">{c('Label').t`Verify keys using Key Transparency`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/key-transparency/"
                        title={c('Tooltip verify keys using Key Transparency')
                            .t`Insert your keys in Key Transparency. When sending an internal message to a sender that has keys in Key Transparency, verify them.`}
                    />
                </Label>
                <Field>
                    <Toggle
                        id="trustToggle"
                        loading={loading}
                        checked={!!KT}
                        onChange={(e) => withLoading(handleChange(e))}
                    />
                </Field>
            </Row>
        </>
    );
};

export default KeyTransparencySection;
