import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/product';
import type { CartItem, CartContextValue } from '../types/cart';
import type { DeliverySlot, DeliveryAddress } from '../types/user';

type CartAction =
    | { type: 'ADD_ITEM'; product: Product; quantity?: number }
    | { type: 'REMOVE_ITEM'; productId: string }
    | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
    | { type: 'UPDATE_ITEM_PREFERENCES'; productId: string; preferences: Partial<Pick<CartItem, 'substitutionPreference' | 'notes'>> }
    | { type: 'SET_DELIVERY_SLOT'; slot: DeliverySlot }
    | { type: 'SET_DELIVERY_ADDRESS'; address: DeliveryAddress }
    | { type: 'SET_SPECIAL_INSTRUCTIONS'; instructions: string }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; items: CartItem[] };

interface CartStateInternal {
    items: CartItem[];
    selectedDeliverySlot?: DeliverySlot;
    selectedDeliveryAddress?: DeliveryAddress;
    specialInstructions?: string;
}

const initialState: CartStateInternal = {
    items: [],
    specialInstructions: '',
};

// Constants for Oda-like features
const DELIVERY_FEE = 49; // NOK
const FREE_DELIVERY_THRESHOLD = 500; // NOK
const MINIMUM_ORDER_AMOUNT = 150; // NOK

function cartReducer(state: CartStateInternal, action: CartAction): CartStateInternal {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                (item) => item.product.id === action.product.id
            );
            const quantityToAdd = action.quantity || 1;

            if (existingIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + quantityToAdd,
                };
                return { ...state, items: updatedItems };
            }

            return {
                ...state,
                items: [...state.items, { 
                    product: action.product, 
                    quantity: quantityToAdd,
                    substitutionPreference: 'allow'
                }],
            };
        }

        case 'REMOVE_ITEM': {
            return {
                ...state,
                items: state.items.filter((item) => item.product.id !== action.productId),
            };
        }

        case 'UPDATE_QUANTITY': {
            if (action.quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter((item) => item.product.id !== action.productId),
                };
            }

            return {
                ...state,
                items: state.items.map((item) =>
                    item.product.id === action.productId
                        ? { ...item, quantity: action.quantity }
                        : item
                ),
            };
        }

        case 'UPDATE_ITEM_PREFERENCES': {
            return {
                ...state,
                items: state.items.map((item) =>
                    item.product.id === action.productId
                        ? { ...item, ...action.preferences }
                        : item
                ),
            };
        }

        case 'SET_DELIVERY_SLOT': {
            return {
                ...state,
                selectedDeliverySlot: action.slot,
            };
        }

        case 'SET_DELIVERY_ADDRESS': {
            return {
                ...state,
                selectedDeliveryAddress: action.address,
            };
        }

        case 'SET_SPECIAL_INSTRUCTIONS': {
            return {
                ...state,
                specialInstructions: action.instructions,
            };
        }

        case 'CLEAR_CART': {
            return { 
                ...initialState,
                selectedDeliveryAddress: state.selectedDeliveryAddress, // Keep address
            };
        }

        case 'LOAD_CART': {
            return {
                ...state,
                items: action.items,
            };
        }

        default:
            return state;
    }
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('freshcart_cart');
        if (savedCart) {
            try {
                const { items } = JSON.parse(savedCart);
                if (items && Array.isArray(items)) {
                    dispatch({ type: 'LOAD_CART', items });
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage when it changes
    useEffect(() => {
        if (state.items.length > 0) {
            localStorage.setItem('freshcart_cart', JSON.stringify({ items: state.items }));
        } else {
            localStorage.removeItem('freshcart_cart');
        }
    }, [state.items]);

    const contextValue = useMemo<CartContextValue>(() => {
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
        const tax = subtotal * 0.15; // 15% tax (Norwegian VAT)
        
        // Calculate sustainability metrics
        const totalCarbonFootprint = state.items.reduce(
            (sum, item) => sum + (item.product.sustainability?.carbonFootprint || 0) * item.quantity,
            0
        );
        const averageSustainabilityScore = state.items.length > 0 
            ? state.items.reduce(
                (sum, item) => sum + (item.product.sustainability?.sustainabilityScore || 3),
                0
            ) / state.items.length
            : 3;

        const canCheckout = subtotal >= MINIMUM_ORDER_AMOUNT && 
                           state.selectedDeliveryAddress !== undefined &&
                           state.selectedDeliverySlot !== undefined;

        return {
            items: state.items,
            totalItems,
            totalPrice: subtotal,
            deliveryFee,
            tax,
            sustainability: {
                totalCarbonFootprint,
                averageSustainabilityScore,
            },
            selectedDeliverySlot: state.selectedDeliverySlot,
            selectedDeliveryAddress: state.selectedDeliveryAddress,
            minimumOrderAmount: MINIMUM_ORDER_AMOUNT,
            specialInstructions: state.specialInstructions,
            canCheckout,
            addToCart: (product: Product, quantity = 1) => {
                dispatch({ type: 'ADD_ITEM', product, quantity });
            },
            removeFromCart: (productId: string) => {
                dispatch({ type: 'REMOVE_ITEM', productId });
            },
            updateQuantity: (productId: string, quantity: number) => {
                dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
            },
            updateItemPreferences: (productId: string, preferences) => {
                dispatch({ type: 'UPDATE_ITEM_PREFERENCES', productId, preferences });
            },
            clearCart: () => {
                dispatch({ type: 'CLEAR_CART' });
            },
            setDeliverySlot: (slot: DeliverySlot) => {
                dispatch({ type: 'SET_DELIVERY_SLOT', slot });
            },
            setDeliveryAddress: (address: DeliveryAddress) => {
                dispatch({ type: 'SET_DELIVERY_ADDRESS', address });
            },
            setSpecialInstructions: (instructions: string) => {
                dispatch({ type: 'SET_SPECIAL_INSTRUCTIONS', instructions });
            },
            addRecipeToCart: (recipeId: string, servings = 4) => {
                // TODO: Implement recipe to cart functionality
                console.log('Adding recipe to cart:', recipeId, servings);
            },
            saveCartForLater: () => {
                const cartData = {
                    items: state.items,
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem('freshcart_saved_cart', JSON.stringify(cartData));
            },
            loadSavedCart: () => {
                const savedCart = localStorage.getItem('freshcart_saved_cart');
                if (savedCart) {
                    try {
                        const { items } = JSON.parse(savedCart);
                        dispatch({ type: 'LOAD_CART', items });
                        localStorage.removeItem('freshcart_saved_cart');
                    } catch (error) {
                        console.error('Failed to load saved cart:', error);
                    }
                }
            },
        };
    }, [state]);

    return (
        <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
