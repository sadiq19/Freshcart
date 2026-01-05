import { useParams } from 'react-router-dom';

export function OrderTrackingPage() {
    const { id } = useParams<{ id: string }>();
    
    return (
        <div className="container">
            <h1>Order Tracking</h1>
            <p>Tracking order {id}...</p>
        </div>
    );
}