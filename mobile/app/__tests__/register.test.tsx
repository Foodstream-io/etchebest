import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import RegisterScreen from '../register';
import apiService from '../../services/api';

jest.mock('../../services/api', () => ({
    __esModule: true,
    default: {
        register: jest.fn().mockResolvedValue({}),
    },
}));

describe('RegisterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getAllByText, getByText, getByPlaceholderText } = render(<RegisterScreen />);

        expect(getAllByText('Inscription').length).toBeGreaterThan(0);
        expect(getByText('Bienvenue')).toBeTruthy();
        expect(getByPlaceholderText('Adresse e-mail')).toBeTruthy();
        expect(getByPlaceholderText('Identifiant')).toBeTruthy();
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    }); it('shows floating labels when inputs have values', async () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const usernameInput = getByPlaceholderText('Identifiant');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(usernameInput, 'testuser');

        await waitFor(() => {
            expect(getByText('Adresse e-mail')).toBeTruthy();
            expect(getByText('Identifiant')).toBeTruthy();
        });
    });

    it('displays inline error for invalid email', async () => {
        const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const registerButtons = getAllByText('Inscription');
        const registerButton = registerButtons[1]; // Get the button, not the heading

        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(getAllByText('Adresse e-mail invalide').length).toBeGreaterThan(0);
        });
    });

    it('displays inline error for short username', async () => {
        const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const firstNameInput = getByPlaceholderText('Prénom');
        const lastNameInput = getByPlaceholderText('Nom');
        const usernameInput = getByPlaceholderText('Identifiant');
        const registerButtons = getAllByText('Inscription');
        const registerButton = registerButtons[1];

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(firstNameInput, 'Jean');
        fireEvent.changeText(lastNameInput, 'Dupont');
        fireEvent.changeText(usernameInput, 'ab');
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(getAllByText("L'identifiant doit contenir au moins 3 caractères").length).toBeGreaterThan(0);
        });
    });

    it('displays inline error for short password', async () => {
        const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const firstNameInput = getByPlaceholderText('Prénom');
        const lastNameInput = getByPlaceholderText('Nom');
        const usernameInput = getByPlaceholderText('Identifiant');
        const passwordInput = getByPlaceholderText('Mot de passe');
        const registerButtons = getAllByText('Inscription');
        const registerButton = registerButtons[1];

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(firstNameInput, 'Jean');
        fireEvent.changeText(lastNameInput, 'Dupont');
        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, '123');
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(getAllByText('Le mot de passe doit contenir au moins 8 caractères').length).toBeGreaterThan(0);
        });
    });

    it('displays inline error for missing description', async () => {
        const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const firstNameInput = getByPlaceholderText('Prénom');
        const lastNameInput = getByPlaceholderText('Nom');
        const usernameInput = getByPlaceholderText('Identifiant');
        const passwordInput = getByPlaceholderText('Mot de passe');
        const phoneInput = getByPlaceholderText('Numéro de téléphone');
        const registerButtons = getAllByText('Inscription');
        const registerButton = registerButtons[1];

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(firstNameInput, 'Jean');
        fireEvent.changeText(lastNameInput, 'Dupont');
        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '0612345678');
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(getAllByText('La description requis').length).toBeGreaterThan(0);
        });
    });

    it('submits form successfully with valid data', async () => {
        const { getByPlaceholderText, getAllByText } = render(<RegisterScreen />);

        const emailInput = getByPlaceholderText('Adresse e-mail');
        const firstNameInput = getByPlaceholderText('Prénom');
        const lastNameInput = getByPlaceholderText('Nom');
        const usernameInput = getByPlaceholderText('Identifiant');
        const passwordInput = getByPlaceholderText('Mot de passe');
        const phoneInput = getByPlaceholderText('Numéro de téléphone');
        const descriptionInput = getByPlaceholderText('Parlez-nous de vous...');
        const registerButtons = getAllByText('Inscription');
        const registerButton = registerButtons[1];

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(firstNameInput, 'Jean');
        fireEvent.changeText(lastNameInput, 'Dupont');
        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'Password123!');
        fireEvent.changeText(phoneInput, '0612345678');
        fireEvent.changeText(descriptionInput, 'Description valide pour inscription.');
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(apiService.register).toHaveBeenCalled();
        });
    });
});
