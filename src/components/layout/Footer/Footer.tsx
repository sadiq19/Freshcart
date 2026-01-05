import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__main">
                    {/* Column 1: About */}
                    <div className="footer__column">
                        <h4 className="footer__heading">Nettbutikk</h4>
                        <ul className="footer__links">
                            <li><Link to="/">Inspirasjon</Link></li>
                            <li><Link to="/recipes">Oppskrifter</Link></li>
                            <li><Link to="/">Kvalitet og holdbarhet</Link></li>
                            <li><Link to="/">Lave priser</Link></li>
                            <li><Link to="/">Bedriftslevering</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Customer Service */}
                    <div className="footer__column">
                        <h4 className="footer__heading">Kundeservice</h4>
                        <ul className="footer__links">
                            <li><Link to="/">Hjelp og kundeservice</Link></li>
                            <li><Link to="/">Sånn bestiller du</Link></li>
                            <li><Link to="/">Hjemlevering</Link></li>
                            <li><Link to="/">Retur av pant</Link></li>
                            <li><Link to="/">Retur av elektronisk avfall</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="footer__column">
                        <h4 className="footer__heading">FreshCart</h4>
                        <ul className="footer__links">
                            <li><Link to="/">Om oss</Link></li>
                            <li><Link to="/">Jobb og karriere</Link></li>
                            <li><Link to="/">Inviter venner</Link></li>
                            <li><Link to="/">Bærekraft</Link></li>
                            <li><Link to="/">For utviklere</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: App Download */}
                    <div className="footer__column footer__column--app">
                        <h4 className="footer__heading">Last ned appen</h4>
                        <div className="footer__app-buttons">
                            <a href="#" className="footer__app-btn" aria-label="Last ned fra App Store">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                                <div className="footer__app-text">
                                    <span>Download on the</span>
                                    <strong>App Store</strong>
                                </div>
                            </a>
                            <a href="#" className="footer__app-btn" aria-label="Last ned fra Google Play">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.991l-2.303 2.303-8.633-8.636z"/>
                                </svg>
                                <div className="footer__app-text">
                                    <span>GET IT ON</span>
                                    <strong>Google Play</strong>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Payment methods */}
                <div className="footer__payments">
                    <span className="footer__payments-label">Betal med</span>
                    <div className="footer__payment-icons">
                        <span className="payment-icon payment-icon--vipps">Vipps</span>
                        <span className="payment-icon payment-icon--klarna">Klarna</span>
                        <span className="payment-icon payment-icon--apple">Apple Pay</span>
                        <span className="payment-icon payment-icon--mastercard">MC</span>
                        <span className="payment-icon payment-icon--visa">Visa</span>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer__bottom">
                    <p className="footer__copyright">© {currentYear} FreshCart</p>
                    <div className="footer__legal">
                        <Link to="/">Salgs- og bruksvilkår</Link>
                        <Link to="/">Personvern</Link>
                        <Link to="/">Informasjonskapsler</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

