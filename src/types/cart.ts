import type { Product } from './product';
import type { DeliverySlot, DeliveryAddress } from './user';

export interface CartItem {
    product: Product;
    quantity: number;
    substitutionPreference?: 'allow' | 'contact_first' | 'refund';
    notes?: string;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    deliveryFee: number;
    tax: number;
    sustainability: {
        totalCarbonFootprint: number;
        averageSustainabilityScore: number;
    };
    selectedDeliverySlot?: DeliverySlot;
    selectedDeliveryAddress?: DeliveryAddress;
    minimumOrderAmount: number;
    specialInstructions?: string;
}

export interface CartContextValue extends CartState {
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateItemPreferences: (productId: string, preferences: Partial<Pick<CartItem, 'substitutionPreference' | 'notes'>>) => void;
    clearCart: () => void;
    setDeliverySlot: (slot: DeliverySlot) => void;
    setDeliveryAddress: (address: DeliveryAddress) => void;
    setSpecialInstructions: (instructions: string) => void;
    canCheckout: boolean;
    addRecipeToCart: (recipeId: string, servings?: number) => void;
    saveCartForLater: () => void;
    loadSavedCart: () => void;
}
