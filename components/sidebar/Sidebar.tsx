import React, { ReactNode, useRef } from 'react';

import Hamburger from './Hamburger';
import MobileAppsLinks from './MobileAppsLinks';
import { useFocusTrap } from '../focus';

interface Props {
    logo?: React.ReactNode;
    expanded?: boolean;
    onToggleExpand?: () => void;
    primary?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    hasAppLinks?: boolean;
}

const Sidebar = ({ expanded = false, onToggleExpand, hasAppLinks = true, logo, primary, children, footer }: Props) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const focusTrapProps = useFocusTrap({
        active: expanded,
        rootRef,
    });
    return (
        <div
            ref={rootRef}
            className="sidebar flex flex-nowrap flex-column noprint no-outline"
            data-expanded={expanded}
            {...focusTrapProps}
        >
            <div className="nodesktop notablet flex-item-noshrink">
                <div className="flex flex-spacebetween flex-items-center pl1 pr1">
                    {logo}
                    <Hamburger expanded={expanded} onToggle={onToggleExpand} data-focus-fallback={1} />
                </div>
            </div>
            {primary ? <div className="pl1 pr1 pb1 flex-item-noshrink">{primary}</div> : null}
            <div className="onmobile-mt1" aria-hidden="true" />
            <div className="flex-item-fluid flex-nowrap flex flex-column scroll-if-needed customScrollBar-container pb1">
                {children}
            </div>
            {footer}
            {hasAppLinks ? <MobileAppsLinks /> : null}
        </div>
    );
};

export default Sidebar;
