import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: ReactNode;
}

export function EmptyState({
    title = 'No results',
    message = "We couldn't find what you're looking for.",
    icon,
}: EmptyStateProps) {
    return (
        <div className="empty-state">
            {icon ? (
                <div className="empty-state__icon">{icon}</div>
            ) : (
                <svg
                    className="empty-state__icon"
                    viewBox="0 0 64 64"
                    width="64"
                    height="64"
                    aria-hidden="true"
                >
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                    <path
                        d="M24 26h16M24 32h12M24 38h8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            )}
            <h2 className="empty-state__title">{title}</h2>
            <p className="empty-state__message">{message}</p>
        </div>
    );
}
