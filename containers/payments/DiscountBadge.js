import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { COUPON_CODES, BLACK_FRIDAY } from 'proton-shared/lib/constants';

import { Badge } from '../../components';

const { BUNDLE, PROTONTEAM, BLACK_FRIDAY_2018, BLACK_FRIDAY_2019 } = COUPON_CODES;

const DiscountBadge = ({ code }) => {
    if (code === BUNDLE) {
        return (
            <Badge type="light" tooltip={c('Info').t`20% discount applied to your subscription with coupon ${code}`}>
                -20%
            </Badge>
        );
    }

    if (code === BLACK_FRIDAY_2018) {
        return (
            <Badge type="info" tooltip={c('Info').t`Black Friday 2018 applied to your subscription`}>
                Black Friday
            </Badge>
        );
    }

    if (code === BLACK_FRIDAY_2019) {
        return (
            <Badge type="info" tooltip={c('Info').t`Black Friday 2019 applied to your subscription`}>
                Black Friday
            </Badge>
        );
    }

    if (code === BLACK_FRIDAY.COUPON_CODE) {
        return (
            <Badge type="info" tooltip={c('Info').t`Black Friday 2020 newcomer discount has been applied`}>
                Black Friday
            </Badge>
        );
    }

    if (code === PROTONTEAM) {
        return <Badge type="info">-100%</Badge>;
    }

    return (
        <Badge type="light" tooltip={c('Info').t`Discount applied to your subscription with coupon ${code}`}>
            {code}
        </Badge>
    );
};

DiscountBadge.propTypes = {
    code: PropTypes.string,
};

export default DiscountBadge;
