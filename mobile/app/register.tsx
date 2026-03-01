import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import apiService from '../services/api';
import { validateEmail, validateLengthRange, validateMinLength, validatePassword, validatePhone } from '../utils/validation';

// Common country codes for phone registration
// Each entry has:
// - code: The international dialing prefix (string with +)
// - country: Localized country name in French
// - flag: Emoji flag for visual identification
// - value: Numeric country code for API (matches API's countryNumberPhone field)
const COUNTRY_CODES = [
    { code: '+33', country: 'France', flag: '🇫🇷', value: 33 },
    { code: '+1', country: 'États-Unis', flag: '🇺🇸', value: 1 },
    { code: '+1', country: 'Canada', flag: '🇨🇦', value: 1 },
    { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧', value: 44 },
    { code: '+49', country: 'Allemagne', flag: '🇩🇪', value: 49 },
    { code: '+34', country: 'Espagne', flag: '🇪🇸', value: 34 },
    { code: '+39', country: 'Italie', flag: '🇮🇹', value: 39 },
    { code: '+32', country: 'Belgique', flag: '🇧🇪', value: 32 },
    { code: '+41', country: 'Suisse', flag: '🇨🇭', value: 41 },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺', value: 352 },
    { code: '+212', country: 'Maroc', flag: '🇲🇦', value: 212 },
    { code: '+213', country: 'Algérie', flag: '🇩🇿', value: 213 },
    { code: '+216', country: 'Tunisie', flag: '🇹🇳', value: 216 },
];

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]); // Default to France
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [obscurePassword, setObscurePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [firstNameFocused, setFirstNameFocused] = useState(false);
    const [lastNameFocused, setLastNameFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [firstNameError, setFirstNameError] = useState<string | null>(null);
    const [lastNameError, setLastNameError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formInfo, setFormInfo] = useState<string | null>(null);

    const router = useRouter();

    const handleRegister = async () => {
        setFormError(null);
        setFormInfo(null);
        setEmailError(null);
        setFirstNameError(null);
        setLastNameError(null);
        setUsernameError(null);
        setPasswordError(null);
        setDescriptionError(null);
        setPhoneError(null);

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error ?? "Adresse e-mail invalide");
            return;
        }

        const firstNameValidation = validateMinLength(firstName, 2, 'Le prénom');
        if (!firstNameValidation.isValid) {
            setFirstNameError(firstNameValidation.error ?? 'Le prénom est requis');
            return;
        }

        const lastNameValidation = validateMinLength(lastName, 2, 'Le nom');
        if (!lastNameValidation.isValid) {
            setLastNameError(lastNameValidation.error ?? 'Le nom est requis');
            return;
        }

        const usernameValidation = validateMinLength(username, 3, "L'identifiant");
        if (!usernameValidation.isValid) {
            setUsernameError(usernameValidation.error ?? "L'identifiant est requis");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setPasswordError(passwordValidation.error ?? 'Mot de passe invalide');
            return;
        }

        const descriptionValidation = validateLengthRange(description, 10, 500, 'La description');
        if (!descriptionValidation.isValid) {
            setDescriptionError(descriptionValidation.error ?? 'La description est requise');
            return;
        }

        const phoneValidation = validatePhone(phoneNumber);
        if (!phoneValidation.isValid) {
            setPhoneError(phoneValidation.error ?? 'Numéro de téléphone invalide');
            return;
        }

        setLoading(true);
        try {
            await apiService.register({
                email,
                password,
                username,
                firstName,
                lastName,
                description,
                countryNumberPhone: countryCode.value,
                numberPhone: phoneNumber,
                profileImage: '',
            });
            router.replace('/login');
        } catch (error) {
            console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
            setFormError(error instanceof Error ? error.message : "Erreur d'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={styles.heading}>Inscription</Text>
                        <View style={styles.formSection}>
                            <Text style={styles.subHeading}>Bienvenue</Text>

                            <View style={styles.inputWrapper}>
                                {Boolean(emailFocused || email) && (
                                    <Text style={styles.floatingLabel}>Adresse e-mail</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (emailFocused || email) && styles.inputGroupFocused,
                                        emailError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="mail-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={emailFocused || email ? '' : 'Adresse e-mail'}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={(value) => {
                                            setEmail(value);
                                            if (emailError) setEmailError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(firstNameFocused || firstName) && (
                                    <Text style={styles.floatingLabel}>Prénom</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (firstNameFocused || firstName) && styles.inputGroupFocused,
                                        firstNameError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="person-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={firstNameFocused || firstName ? '' : 'Prénom'}
                                        autoCapitalize="words"
                                        value={firstName}
                                        onChangeText={(value) => {
                                            setFirstName(value);
                                            if (firstNameError) setFirstNameError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setFirstNameFocused(true)}
                                        onBlur={() => setFirstNameFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(lastNameFocused || lastName) && (
                                    <Text style={styles.floatingLabel}>Nom</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (lastNameFocused || lastName) && styles.inputGroupFocused,
                                        lastNameError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="person-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={lastNameFocused || lastName ? '' : 'Nom'}
                                        autoCapitalize="words"
                                        value={lastName}
                                        onChangeText={(value) => {
                                            setLastName(value);
                                            if (lastNameError) setLastNameError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setLastNameFocused(true)}
                                        onBlur={() => setLastNameFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(usernameFocused || username) && (
                                    <Text style={styles.floatingLabel}>Identifiant</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (usernameFocused || username) && styles.inputGroupFocused,
                                        usernameError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="at-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={usernameFocused || username ? '' : 'Identifiant'}
                                        autoCapitalize="none"
                                        value={username}
                                        onChangeText={(value) => {
                                            setUsername(value);
                                            if (usernameError) setUsernameError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setUsernameFocused(true)}
                                        onBlur={() => setUsernameFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(passwordFocused || password) && (
                                    <Text style={styles.floatingLabel}>Mot de passe</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (passwordFocused || password) && styles.inputGroupFocused,
                                        passwordError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="lock-closed-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={passwordFocused || password ? '' : 'Mot de passe'}
                                        secureTextEntry={obscurePassword}
                                        value={password}
                                        onChangeText={(value) => {
                                            setPassword(value);
                                            if (passwordError) setPasswordError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                    <TouchableOpacity onPress={() => setObscurePassword(!obscurePassword)}>
                                        <Ionicons
                                            name={obscurePassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#000"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(phoneFocused || phoneNumber) && (
                                    <Text style={styles.floatingLabel}>Numéro de téléphone</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (phoneFocused || phoneNumber) && styles.inputGroupFocused,
                                        phoneError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="call-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TouchableOpacity 
                                        style={styles.countryCodeButton}
                                        onPress={() => setShowCountryPicker(true)}
                                    >
                                        <Text style={styles.countryCodeText}>{countryCode.flag} {countryCode.code}</Text>
                                        <Ionicons name="chevron-down-outline" size={16} color="#000" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={phoneFocused || phoneNumber ? '' : 'Numéro de téléphone'}
                                        keyboardType="phone-pad"
                                        value={phoneNumber}
                                        onChangeText={(value) => {
                                            setPhoneNumber(value);
                                            if (phoneError) setPhoneError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setPhoneFocused(true)}
                                        onBlur={() => setPhoneFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
                            </View>

                            <View style={styles.inputWrapper}>
                                {Boolean(descriptionFocused || description) && (
                                    <Text style={styles.floatingLabel}>Description</Text>
                                )}
                                <View
                                    style={[
                                        styles.inputGroup,
                                        (descriptionFocused || description) && styles.inputGroupFocused,
                                        descriptionError && styles.inputGroupError,
                                    ]}
                                >
                                    <Ionicons name="chatbubble-outline" size={20} color="#000" style={styles.leadingIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={descriptionFocused || description ? '' : 'Parlez-nous de vous...'}
                                        multiline
                                        value={description}
                                        onChangeText={(value) => {
                                            setDescription(value);
                                            if (descriptionError) setDescriptionError(null);
                                            if (formError) setFormError(null);
                                            if (formInfo) setFormInfo(null);
                                        }}
                                        onFocus={() => setDescriptionFocused(true)}
                                        onBlur={() => setDescriptionFocused(false)}
                                        placeholderTextColor="#7a7a7a"
                                    />
                                </View>
                                {descriptionError && <Text style={styles.errorText}>{descriptionError}</Text>}
                            </View>
                            {formError && <Text style={styles.formErrorText}>{formError}</Text>}
                            {formInfo && <Text style={styles.formInfoText}>{formInfo}</Text>}
                            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
                                <LinearGradient
                                    colors={['#FFA92E', '#FF5D1E']}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={styles.primaryGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.primaryButtonText}>Inscription</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.dividerRow}>
                                <View style={styles.line} />
                                <Text style={styles.dividerLabel}>Ou</Text>
                                <View style={styles.line} />
                            </View>

                            <View style={styles.socialIconsRow}>
                                <TouchableOpacity
                                    style={styles.socialIconButton}
                                    onPress={() => {
                                        setFormInfo('Inscription Google bientôt disponible.');
                                    }}
                                >
                                    <Image
                                        source={require('@/assets/images/google_logo.png')}
                                        style={styles.socialIcon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.socialIconButton}
                                    onPress={() => {
                                        setFormInfo('Inscription Apple bientôt disponible.');
                                    }}
                                >
                                    <Ionicons name="logo-apple" size={26} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Country Code Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sélectionner un indicatif</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <Ionicons name="close-outline" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.countryList}>
                            {COUNTRY_CODES.map((country) => (
                                <TouchableOpacity
                                    key={country.code}
                                    style={[
                                        styles.countryItem,
                                        countryCode.code === country.code && styles.countryItemSelected
                                    ]}
                                    onPress={() => {
                                        setCountryCode(country);
                                        setShowCountryPicker(false);
                                    }}
                                >
                                    <Text style={styles.countryFlag}>{country.flag}</Text>
                                    <View style={styles.countryInfo}>
                                        <Text style={styles.countryName}>{country.country}</Text>
                                        <Text style={styles.countryCodeLabel}>{country.code}</Text>
                                    </View>
                                    {countryCode.code === country.code && (
                                        <Ionicons name="checkmark-outline" size={24} color="#FF8A00" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fdfdfc',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 32,
        paddingVertical: 48,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#111',
    },
    formSection: {
        marginTop: 80,
    },
    subHeading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        marginBottom: 28,
        textAlign: 'center',
    },
    inputWrapper: {
        marginBottom: 16,
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        top: -8,
        left: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 4,
        fontSize: 12,
        color: '#FF8A00',
        fontWeight: '600',
        zIndex: 1,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff',
        width: '100%',
    },
    inputGroupFocused: {
        borderColor: '#FF8A00',
    },
    inputGroupError: {
        borderColor: '#E53935',
    },
    leadingIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        marginTop: 6,
        marginLeft: 8,
        color: '#E53935',
        fontSize: 12,
        fontWeight: '600',
    },
    formErrorText: {
        marginTop: 4,
        marginBottom: 12,
        textAlign: 'center',
        color: '#E53935',
        fontSize: 12,
        fontWeight: '600',
    },
    formInfoText: {
        marginTop: 4,
        marginBottom: 12,
        textAlign: 'center',
        color: '#1976D2',
        fontSize: 12,
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
    },
    primaryGradient: {
        paddingVertical: 16,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#121212',
    },
    dividerLabel: {
        marginHorizontal: 12,
        color: '#000',
        fontWeight: '600',
    },
    socialIconsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialIconButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e8e8e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        borderRightWidth: 1,
        borderRightColor: '#e8e8e8',
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 16,
        color: '#000',
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
    },
    countryList: {
        flex: 1,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    countryItemSelected: {
        backgroundColor: '#FFF5E6',
    },
    countryFlag: {
        fontSize: 28,
        marginRight: 12,
    },
    countryInfo: {
        flex: 1,
    },
    countryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        marginBottom: 2,
    },
    countryCodeLabel: {
        fontSize: 14,
        color: '#7a7a7a',
    },
});
