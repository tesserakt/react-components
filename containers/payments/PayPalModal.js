import React from 'react';
import PropTypes from 'prop-types';
import { FormModal, PayPal, useApi, Loader, useLoading, useNotifications, useEventManager } from 'react-components';
import { c } from 'ttag';
import { setPaymentMethod } from 'proton-shared/lib/api/payments';

const PAYMENT_AUTHORIZATION_AMOUNT = 100;
const PAYMENT_AUTHORIZATION_CURRENCY = 'CHF';

const PayPalModal = (props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();

    const handleSubmit = async ({ Payment }) => {
        await api(setPaymentMethod(Payment));
        await call();
        props.onClose();
        createNotification({ text: c('Success').t`Payment method added` });
    };

    return (
        <FormModal title={c('Title').t`Add PayPal payment method`} small footer={null} {...props}>
            <div className="pb1">
                {loading ? (
                    <Loader />
                ) : (
                    <PayPal
                        amount={PAYMENT_AUTHORIZATION_AMOUNT}
                        currency={PAYMENT_AUTHORIZATION_CURRENCY}
                        onPay={(data) => withLoading(handleSubmit(data))}
                        type="update"
                    />
                )}
            </div>
        </FormModal>
    );
};

PayPalModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default PayPalModal;
