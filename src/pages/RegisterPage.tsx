import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../state/UserContext';
import './AuthPages.css';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error } = useUser();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptMarketing: false,
    });
    const [localError, setLocalError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setLocalError('Vennligst fyll ut alle påkrevde feltene');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passordene stemmer ikke overens');
            return;
        }

        if (formData.password.length < 8) {
            setLocalError('Passordet må være minst 8 tegn');
            return;
        }

        if (!formData.acceptTerms) {
            setLocalError('Du må godta vilkårene for å opprette konto');
            return;
        }

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                preferences: {
                    dietaryRestrictions: [],
                    allergens: [],
                    preferredDeliveryTime: 'afternoon',
                    sustainabilityFocus: false,
                    organicPreference: false,
                    localProductsPreference: false,
                    packagingPreference: 'recyclable',
                    communicationPreferences: {
                        email: formData.acceptMarketing,
                        sms: false,
                        pushNotifications: true,
                    },
                },
                addresses: [],
                paymentMethods: [],
            });
            navigate('/');
        } catch {
            setLocalError('Registrering mislyktes. Prøv igjen.');
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-layout">
                    <div className="auth-content">
                        <div className="auth-card auth-card--wide">
                            <div className="auth-card__header">
                                <h1 className="auth-card__title">Opprett konto</h1>
                                <p className="auth-card__subtitle">
                                    Bli kunde og få 3 måneder gratis levering!
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                {(error || localError) && (
                                    <div className="auth-form__error">
                                        {localError || error}
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">Fornavn *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Etternavn *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">E-post *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="din@epost.no"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Telefon</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+47 000 00 000"
                                        autoComplete="tel"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="password">Passord *</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Minst 8 tegn"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Bekreft passord *</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Gjenta passordet"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="auth-form__checkboxes">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="acceptTerms"
                                            checked={formData.acceptTerms}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-mark" />
                                        <span>
                                            Jeg godtar <Link to="/terms">vilkårene</Link> og{' '}
                                            <Link to="/privacy">personvernerklæringen</Link> *
                                        </span>
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="acceptMarketing"
                                            checked={formData.acceptMarketing}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-mark" />
                                        <span>
                                            Jeg ønsker å motta tilbud og nyheter på e-post
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="auth-form__submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading-spinner" />
                                    ) : (
                                        'Opprett konto'
                                    )}
                                </button>
                            </form>

                            <div className="auth-divider">
                                <span>eller</span>
                            </div>

                            <div className="auth-social">
                                <button type="button" className="auth-social__btn auth-social__btn--vipps">
                                    <span className="auth-social__icon">Vipps</span>
                                    Registrer med Vipps
                                </button>
                            </div>

                            <p className="auth-card__footer">
                                Har du allerede konto? <Link to="/login">Logg inn</Link>
                            </p>
                        </div>
                    </div>

                    {/* Benefits Sidebar */}
                    <div className="auth-benefits">
                        <div className="auth-benefits__promo">
                            <div className="auth-benefits__badge">🎉 Spesialtilbud</div>
                            <h3 className="auth-benefits__title">Få 3 måneder gratis levering!</h3>
                            <p className="auth-benefits__subtitle">
                                Nye kunder får gratis levering i 3 måneder når du handler annenhver uke eller oftere.
                            </p>
                        </div>
                        <ul className="auth-benefits__list">
                            <li className="auth-benefit">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Lave priser hver dag</span>
                            </li>
                            <li className="auth-benefit">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Ferske varer levert på døra</span>
                            </li>
                            <li className="auth-benefit">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Velg når du vil ha levering</span>
                            </li>
                            <li className="auth-benefit">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Over 1500 oppskrifter</span>
                            </li>
                            <li className="auth-benefit">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Bærekraftig valg</span>
                            </li>
                        </ul>
                        <div className="auth-benefits__trust">
                            <p className="auth-benefits__trust-text">
                                <strong>Trygt og sikkert</strong>
                                <br />
                                Dine opplysninger er beskyttet med kryptering
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

