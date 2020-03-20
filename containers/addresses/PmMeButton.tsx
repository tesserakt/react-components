import React from 'react';
import { c } from 'ttag';
import { setupAddress } from 'proton-shared/lib/api/addresses';
import {
    UnlockModal,
    PrimaryButton,
    useApi,
    useMembers,
    useLoading,
    useEventManager,
    useOrganization,
    useOrganizationKey,
    useModals,
    useNotifications,
    usePremiumDomains
} from 'react-components';
import CreateMissingKeysAddressModal from './missingKeys/CreateMissingKeysAddressModal';

const PmMeButton = () => {
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const api = useApi();
    const { call } = useEventManager();
    const [members, loadingMembers] = useMembers();
    const [premiumDomains, loadingPremiumDomains] = usePremiumDomains();
    const [organization, loadingOrganization] = useOrganization();
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(organization);
    const isLoadingDependencies =
        loadingMembers || loadingPremiumDomains || loadingOrganization || loadingOrganizationKey;
    const member = members.find(({ Self }) => Self);

    if (loadingMembers || !member) {
        return null;
    }

    const createPremiumAddress = async () => {
        const [Domain = ''] = premiumDomains || [];
        const [{ DisplayName = '', Signature = '' } = {}] = member.addresses || [];
        await new Promise((resolve, reject) => {
            createModal(<UnlockModal onClose={() => reject()} onSuccess={resolve} />);
        });
        const { Address } = await api(
            setupAddress({
                Domain,
                DisplayName: DisplayName ? DisplayName : '', // DisplayName can be null
                Signature: Signature ? Signature : '' // Signature can be null
            })
        );
        await call();
        createNotification({ text: c('Success').t`Premium address created` });
        createModal(
            <CreateMissingKeysAddressModal organizationKey={organizationKey} member={member} addresses={[Address]} />
        );
    };

    return (
        <PrimaryButton
            disabled={isLoadingDependencies}
            loading={loading}
            onClick={() => withLoading(createPremiumAddress())}
        >
            {c('Action').t`Activate`}
        </PrimaryButton>
    );
};

export default PmMeButton;
