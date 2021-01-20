import { MINUTE, RECIPIENT_TYPES } from 'proton-shared/lib/constants';
import { cleanEmail, normalizeEmail, normalizeInternalEmail } from 'proton-shared/lib/helpers/email';
import { useCallback } from 'react';
import getPublicKeysVcardHelper from 'proton-shared/lib/api/helpers/getPublicKeysVcardHelper';
import { getContactPublicKeyModel } from 'proton-shared/lib/keys/publicKeys';
import extractEncryptionPreferences, { EncryptionPreferences } from 'proton-shared/lib/mail/encryptionPreferences';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { verifyPublicKeys } from 'key-transparency-web-client';
import useApi from './useApi';
import { useGetAddresses } from './useAddresses';
import { useGetAddressKeys } from './useGetAddressKeys';
import { useGetMailSettings } from './useMailSettings';
import { useGetUserKeys } from './useUserKeys';
import useGetPublicKeys from './useGetPublicKeys';
import { getPromiseValue } from './useCachedModelResult';
import useCache from './useCache';

export const CACHE_KEY = 'ENCRYPTION_PREFERENCES';

const DEFAULT_LIFETIME = 5 * MINUTE;

export type GetEncryptionPreferences = (
    emailAddress: string,
    lifetime?: number,
    contactEmailsMap?: { [email: string]: ContactEmail | undefined }
) => Promise<EncryptionPreferences>;

/**
 * Given an email address and the user mail settings, return the encryption preferences for sending to that email.
 * The logic for how those preferences are determined is laid out in the
 * Confluence document 'Encryption preferences for outgoing email'
 */
const useGetEncryptionPreferences = () => {
    const api = useApi();
    const cache = useCache();
    const getAddresses = useGetAddresses();
    const getUserKeys = useGetUserKeys();
    const getAddressKeys = useGetAddressKeys();
    const getPublicKeys = useGetPublicKeys();
    const getMailSettings = useGetMailSettings();

    const getEncryptionPreferences = useCallback<GetEncryptionPreferences>(
        async (emailAddress, lifetime, contactEmailsMap) => {
            const [addresses, mailSettings] = await Promise.all([getAddresses(), getMailSettings()]);
            const normalizedInternalEmail = cleanEmail(emailAddress, true);
            const selfAddress = addresses.find(
                ({ Email }) => normalizeInternalEmail(Email) === normalizedInternalEmail
            );
            let selfSend;
            let apiKeysConfig;
            let pinnedKeysConfig;
            let ktConfig;
            if (selfAddress) {
                // we do not trust the public keys in ownAddress (they will be deprecated in the API response soon anyway)
                const selfPublicKey = (await getAddressKeys(selfAddress.ID))[0]?.publicKey;
                selfSend = { address: selfAddress, publicKey: selfPublicKey };
                // For own addresses, we use the decrypted keys in selfSend and do not fetch any data from the API
                apiKeysConfig = { Keys: [], publicKeys: [], RecipientType: RECIPIENT_TYPES.TYPE_INTERNAL };
                pinnedKeysConfig = { pinnedKeys: [], isContact: false };
            } else {
                const { publicKeys } = splitKeys(await getUserKeys());
                apiKeysConfig = await getPublicKeys(emailAddress, lifetime);
                const isInternal = apiKeysConfig.RecipientType === RECIPIENT_TYPES.TYPE_INTERNAL;
                pinnedKeysConfig = await getPublicKeysVcardHelper(
                    api,
                    emailAddress,
                    publicKeys,
                    isInternal,
                    contactEmailsMap
                );
                if (mailSettings){// && mailSettings.KT) {
                    ktConfig = await verifyPublicKeys(
                        apiKeysConfig.Keys,
                        emailAddress,
                        apiKeysConfig.SignedKeyList,
                        api
                    );
                }
            }
            const publicKeyModel = await getContactPublicKeyModel({
                emailAddress,
                apiKeysConfig,
                pinnedKeysConfig,
            });
            return extractEncryptionPreferences(publicKeyModel, mailSettings, selfSend, ktConfig);
        },
        [api, getAddressKeys, getAddresses, getPublicKeys, getMailSettings]
    );

    return useCallback<GetEncryptionPreferences>(
        (email, lifetime = DEFAULT_LIFETIME, contactEmailsMap) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            // By normalizing email here, we consider that it could not exists different encryption preferences
            // For 2 addresses identical but for the cases.
            // If a provider does different one day, this would have to evolve.
            const normalizedEmail = normalizeEmail(email);
            const miss = () => getEncryptionPreferences(normalizedEmail, lifetime, contactEmailsMap);
            return getPromiseValue(subCache, normalizedEmail, miss, lifetime);
        },
        [cache, getEncryptionPreferences]
    );
};

export default useGetEncryptionPreferences;
