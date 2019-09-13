import React from 'react';
import PropTypes from 'prop-types';
import { FullLoader, TextLoader, useConfig } from 'react-components';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';

import './loaderPage.scss';

const { PROTONVPN_SETTINGS } = APPS;

const LoaderPage = ({ text, color = 'global-light' }) => {
    const { APP_NAME } = useConfig();
    const appName = APP_NAME === PROTONVPN_SETTINGS ? 'ProtonVPN' : 'ProtonMail';
    return (
        <div className="centered-absolute aligncenter">
            <FullLoader color={color} size={200} />
            <TextLoader>{text || c('Info').t`Loading ${appName}`}</TextLoader>
        </div>
    );
};

LoaderPage.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
};

export default LoaderPage;
