import React from 'react';
import { c } from 'ttag';
import VPNClientCard from './VPNClientCard';
import { DropdownMenuLink, Copy, Group } from '../../../components';

const ProtonVPNClientsSection = () => {
    const androidLinks = [
        {
            href: 'https://protonvpn.com/download/ProtonVPN.apk',
            children: 'APK',
        },
        {
            href: 'https://github.com/ProtonVPN/android-app/releases',
            children: 'GitHub',
        },
        {
            href: 'https://f-droid.org/en/packages/ch.protonvpn.android/',
            children: 'F-Droid',
        },
    ].map(({ href, children }) => {
        return (
            <Group className="flex flex-align-items-center">
                <DropdownMenuLink href={href}>{children}</DropdownMenuLink>
                <Copy value={href} className="pt0-25 pb0-25 pl0-5 pr0-5 mr0-5" />
            </Group>
        );
    });

    return (
        <div className="flex on-mobile-flex-column">
            <VPNClientCard
                title={c('VPNClient').t`Android`}
                icon="android"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
            <VPNClientCard
                title={c('VPNClient').t`iOS`}
                icon="apple"
                link="https://itunes.apple.com/us/app/protonvpn-fast-secure-vpn/id1437005085"
            />
            <VPNClientCard title={c('VPNClient').t`Windows`} icon="windows" link="https://protonvpn.com/download/" />
            <VPNClientCard title={c('VPNClient').t`macOS`} icon="apple" link="https://protonvpn.com/download/" />
            <VPNClientCard
                title={c('VPNClient').t`GNU/Linux`}
                icon="linux"
                link=" https://protonvpn.com/support/official-linux-client/"
            />
            <VPNClientCard
                title={c('VPNClient').t`ChromeBook`}
                icon="chrome"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
            <VPNClientCard
                title={c('VPNClient').t`Android TV`}
                icon="tv"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
        </div>
    );
};

export default ProtonVPNClientsSection;
