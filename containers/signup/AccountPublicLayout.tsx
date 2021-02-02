import React, { ReactNode } from 'react';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import { c } from 'ttag';

import { useAppTitle, useConfig } from '../../hooks';
import { classnames, getAppVersion } from '../../helpers';

import { PublicTopBanners } from '../topBanners';
import { Href, Icon, ProtonLogo } from '../../components';

import PublicLanguageSelect from './PublicLanguageSelect';

import './AccountPublicLayout.scss';

export interface Props {
    children: ReactNode;
    title: string;
    subtitle?: string;
    right?: ReactNode;
    left?: ReactNode;
    center?: ReactNode;
    larger?: boolean;
    locales?: TtagLocaleMap;
}

const AccountPublicLayout = ({ children, title, subtitle, larger, left, center, right, locales }: Props) => {
    const { APP_VERSION, APP_VERSION_DISPLAY } = useConfig();
    const termsLink = (
        <Href key="terms" className="signup-footer-link" href="https://protonmail.com/terms-and-conditions">{c('Link')
            .t`Terms`}</Href>
    );
    const privacyLink = (
        <Href key="privacy" className="signup-footer-link" href="https://protonmail.com/privacy-policy">{c('Link')
            .t`Privacy policy`}</Href>
    );

    useAppTitle(title);

    const appVersion = getAppVersion(APP_VERSION_DISPLAY || APP_VERSION);

    return (
        <div className="flex flex-column h100 signLayout-bg">
            <PublicTopBanners />
            <header className="flex flex-spacebetween flex-item-noshrink p2">
                <span>
                    <ProtonLogo />
                </span>
                <span className="alignright">
                    {locales ? <PublicLanguageSelect className="support-dropdown-button" locales={locales} /> : null}
                </span>
            </header>
            <div className="pt1 pb1 pl2 pr2 onmobile-p0 signLayout-container flex-item-fluid flex flex-nowrap flex-column flex-spacebetween">
                <div className="flex-item-fluid-auto signLayout flex-item-noshrink flex flex-column flex-nowrap">
                    <div className="flex flex-column flex-nowrap flex-item-noshrink onmobile-flex-item-fluid-auto">
                        <div
                            className={classnames([
                                'center bg-white-dm color-global-grey-dm onmobile-pb1 w100 mw100 bordered-container flex-item-noshrink flex flex-nowrap signup-container',
                                larger ? '' : 'mw50e',
                            ])}
                        >
                            <main className="onmobile-p1 flex-item-fluid signLayout-main flex-noMinChildren flex-column flex-nowrap">
                                <div className="flex flex-items-center flex-nowrap mb2">
                                    <span className="flex-item-fluid flex">{left}</span>
                                    <span className="aligncenter flex w70p">{center}</span>
                                </div>
                                <div className="mb2 flex-item-fluid signLayout-main-content">
                                    {title ? (
                                        <h1 className={classnames(['h4 bold mt0', subtitle ? 'mb0-25' : 'mb1'])}>
                                            {title}
                                        </h1>
                                    ) : null}
                                    {subtitle ? <div className="mb1">{subtitle}</div> : null}
                                    {children}
                                </div>
                                <footer className="flex flex-items-center flex-nowrap">
                                    <span className="flex-item-fluid alignright">{right}</span>
                                </footer>
                            </main>
                        </div>
                    </div>
                    <div className="aligncenter small m0 pt0-5 pb0-5 flex-item-noshrink">
                        <span className="opacity-50 automobile">{c('Info')
                            .t`Made globally - Hosted in Switzerland`}</span>
                        <span className="opacity-50 pl0-75 pr0-75 nomobile" aria-hidden="true">
                            |
                        </span>
                        <span className="automobile">{termsLink}</span>
                        <span className="opacity-50 pl0-75 pr0-75 nomobile" aria-hidden="true">
                            |
                        </span>
                        <span className="automobile">{privacyLink}</span>
                        <span className="opacity-50 pl0-75 pr0-75 nomobile" aria-hidden="true">
                            |
                        </span>
                        <span className="opacity-50 automobile">{c('Info').jt`Version ${appVersion}`}</span>
                    </div>
                </div>
            </div>
            <footer className="flex-item-noshrink aligncenter nomobile p1">
                {c('Info').t`One account for all Proton services`}
                <div className="p0-5">
                    <Icon name="protonmail" className="ml0-5 mr0-5" alt="Proton Mail" size={20} />
                    <Icon name="protoncalendar" className="ml0-5 mr0-5" alt="Proton Calendar" size={20} />
                    <Icon name="protonvpn" className="ml0-5 mr0-5" alt="Proton VPN" size={20} />
                    <Icon name="protondrive" className="ml0-5 mr0-5" alt="Proton Drive" size={20} />
                    <Icon name="protoncontacts" className="ml0-5 mr0-5" alt="Proton Contacts" size={20} />
                </div>
            </footer>
        </div>
    );
};

export default AccountPublicLayout;
