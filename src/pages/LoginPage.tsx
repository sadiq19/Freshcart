import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../state/UserContext';
import './AuthPages.css';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!email || !password) {
            setLocalError('Vennligst fyll ut alle feltene');
            return;
        }

        try {
            await login(email, password);
            navigate('/');
        } catch {
            setLocalError('Innlogging mislyktes. Sjekk e-post og passord.');
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-card__header">
                        <h1 className="auth-card__title">Logg inn</h1>
                        <p className="auth-card__subtitle">
                            Velkommen tilbake! Logg inn for å fortsette handelen.
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {(error || localError) && (
                            <div className="auth-form__error">
                                {localError || error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">E-post</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="din@epost.no"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Passord
                                <Link to="/forgot-password" className="form-group__link">
                                    Glemt passord?
                                </Link>
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-form__submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner" />
                            ) : (
                                'Logg inn'
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>eller</span>
                    </div>

                    <div className="auth-social">
                        <button type="button" className="auth-social__btn auth-social__btn--vipps">
                            <span className="auth-social__icon">Vipps</span>
                            Logg inn med Vipps
                        </button>
                        <button type="button" className="auth-social__btn auth-social__btn--google">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Logg inn med Google
                        </button>
                    </div>

                    <p className="auth-card__footer">
                        Har du ikke konto? <Link to="/register">Opprett konto</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

