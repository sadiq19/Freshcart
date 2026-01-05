export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    preferences: UserPreferences;
    addresses: DeliveryAddress[];
    paymentMethods: PaymentMethod[];
    createdAt: string;
}

export interface UserPreferences {
    dietaryRestrictions: string[];
    allergens: string[];
    preferredDeliveryTime: 'morning' | 'afternoon' | 'evening';
    sustainabilityFocus: boolean;
    organicPreference: boolean;
    localProductsPreference: boolean;
    packagingPreference: 'minimal' | 'recyclable' | 'biodegradable' | 'standard';
    communicationPreferences: {
        email: boolean;
        sms: boolean;
        pushNotifications: boolean;
    };
}

export interface DeliveryAddress {
    id: string;
    label: string; // "Home", "Work", etc.
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    deliveryInstructions?: string;
    accessCode?: string;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    label: string;
    last4?: string; // For cards
    expiryDate?: string; // For cards
    isDefault: boolean;
}

export interface DeliverySlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
    fee: number;
    type: 'same-day' | 'next-day' | 'scheduled';
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    deliveryAddress: DeliveryAddress;
    deliverySlot: DeliverySlot;
    paymentMethod: PaymentMethod;
    status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    sustainability: {
        totalCarbonFootprint: number;
        sustainabilityScore: number;
    };
    createdAt: string;
    updatedAt: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    specialInstructions?: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    substitutionPreference?: 'allow' | 'contact_first' | 'refund';
    notes?: string;
}

export interface ShoppingList {
    id: string;
    name: string;
    items: ShoppingListItem[];
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
}

export interface ShoppingListItem {
    id: string;
    productId?: string;
    name: string;
    quantity: number;
    unit: string;
    completed: boolean;
    notes?: string;
}