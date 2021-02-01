import React from 'react';
import { CRYPTO_PROCESSING_TYPES } from 'proton-shared/lib/contacts/constants';
import { ContactProperties, ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';
import { DecryptedKey } from 'proton-shared/lib/interfaces';
import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { singleExport } from 'proton-shared/lib/contacts/export';
import { useModals, useActiveBreakpoint } from '../../hooks';
import ContactSummary from '../../components/contacts/ContactSummary';
import ContactViewProperties from '../../components/contacts/ContactViewProperties';
import { classnames } from '../../helpers';
import ContactModal from './modals/ContactModal';
import ContactDeleteModal from './modals/ContactDeleteModal';
import ContactViewErrors from './ContactViewErrors';

interface Props {
    contactID: string;
    contactEmails: ContactEmail[];
    contactGroupsMap: { [contactGroupID: string]: ContactGroup };
    ownAddresses: string[];
    properties: ContactProperties;
    userKeysList: DecryptedKey[];
    errors?: CryptoProcessingError[];
    isModal: boolean;
    onDelete: () => void;
    onReload?: () => void;
    onResign?: () => Promise<void>;
    isPreview?: boolean;
}

const ContactView = ({
    properties = [],
    contactID,
    contactEmails,
    contactGroupsMap,
    ownAddresses,
    userKeysList,
    errors,
    isModal,
    onDelete,
    onReload,
    onResign,
    isPreview = false,
}: Props) => {
    const { createModal } = useModals();
    const { isNarrow } = useActiveBreakpoint();

    const handleDelete = () => {
        createModal(<ContactDeleteModal contactIDs={[contactID]} onDelete={onDelete} />);
    };

    const handleEdit = (field?: string) => {
        createModal(<ContactModal properties={properties} contactID={contactID} newField={field} />);
    };

    const handleExport = () => singleExport(properties);

    const hasError = !!errors?.filter((error) => error.type !== CRYPTO_PROCESSING_TYPES.SIGNATURE_NOT_VERIFIED).length;

    const contactViewPropertiesProps = {
        contactID,
        userKeysList,
        contactEmails,
        ownAddresses,
        properties,
        contactGroupsMap,
        leftBlockWidth: 'w100 mw100p',
        rightBlockWidth: 'w100',
    };

    return (
        <div className={classnames([!isModal && 'view-column-detail flex-item-fluid scroll-if-needed'])}>
            <div className="border-bottom m1 pb1">
                <ContactSummary
                    onExport={handleExport}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    properties={properties}
                    leftBlockWidth={isNarrow ? 'mauto mw100p' : 'w100 mw100p'}
                    isPreview={isPreview}
                    hasError={hasError}
                />
                <ContactViewErrors errors={errors} onReload={onReload} onResign={onResign} />
            </div>
            <div className="pl1 pr1">
                <ContactViewProperties field="fn" {...contactViewPropertiesProps} />
                <ContactViewProperties field="email" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties field="tel" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties field="adr" {...contactViewPropertiesProps} isPreview={isPreview} />
                <ContactViewProperties {...contactViewPropertiesProps} />
            </div>
        </div>
    );
};

export default ContactView;
