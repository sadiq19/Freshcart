import { useUser } from '../state/UserContext';

export function ProfilePage() {
    const { user, isAuthenticated } = useUser();
    
    if (!isAuthenticated || !user) {
        return (
            <div className="container">
                <h1>Profile</h1>
                <p>Please log in to view your profile.</p>
            </div>
        );
    }
    
    return (
        <div className="container">
            <h1>Profile</h1>
            <p>Welcome, {user.firstName} {user.lastName}!</p>
            <p>Email: {user.email}</p>
        </div>
    );
}