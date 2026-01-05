import './ErrorState.css';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Something went wrong',
    message = "We couldn't load the content. Please try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="error-state" role="alert">
            <svg
                className="error-state__icon"
                viewBox="0 0 64 64"
                width="64"
                height="64"
                aria-hidden="true"
            >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
                <path
                    d="M32 20v16M32 42v2"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
            <h2 className="error-state__title">{title}</h2>
            <p className="error-state__message">{message}</p>
            {onRetry && (
                <button type="button" className="error-state__retry" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}
