import React from 'react';
import { c } from 'ttag';

import { PrimaryButton, useModals, ContactModal } from 'react-components';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import { noop } from 'proton-shared/lib/helpers/function';

import noContactsImgLight from 'design-system/assets/img/shared/empty-address-book.svg';
import noContactsImgDark from 'design-system/assets/img/shared/empty-address-book-dark.svg';

interface Props {
    onClose?: () => void;
}

const EmptyContacts = ({ onClose = noop }: Props) => {
    const { createModal } = useModals();
    const title = c('Error message').t`No results found`;
    const image = getLightOrDark(noContactsImgLight, noContactsImgDark);

    const handleClick = () => {
        createModal(<ContactModal properties={[]} />);
        onClose();
    };

    return (
        <div className="flex flex-column flex-items-center w100 p0-5">
            <span className="mb1">{c('Error message')
                .t`You do not have any contact yet. Start by creating a new contact`}</span>
            <img src={image} alt={title} className="p1 mb1" />
            <PrimaryButton onClick={handleClick}>{c('Action').t`Create new contact`}</PrimaryButton>
        </div>
    );
};

export default EmptyContacts;
