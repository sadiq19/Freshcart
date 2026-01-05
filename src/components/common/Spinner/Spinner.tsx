import './Spinner.css';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
    return (
        <div className={`spinner spinner--${size}`} role="status" aria-label="Loading">
            <svg
                className="spinner__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <circle
                    className="spinner__track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <path
                    className="spinner__arc"
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
