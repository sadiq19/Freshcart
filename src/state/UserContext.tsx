import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { User, DeliveryAddress, PaymentMethod, Order, ShoppingList } from '../types/user';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    orders: Order[];
    shoppingLists: ShoppingList[];
    isLoading: boolean;
    error: string | null;
}

type UserAction =
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_ADDRESS'; payload: DeliveryAddress }
    | { type: 'UPDATE_ADDRESS'; payload: DeliveryAddress }
    | { type: 'REMOVE_ADDRESS'; payload: string }
    | { type: 'ADD_PAYMENT_METHOD'; payload: PaymentMethod }
    | { type: 'UPDATE_PAYMENT_METHOD'; payload: PaymentMethod }
    | { type: 'REMOVE_PAYMENT_METHOD'; payload: string }
    | { type: 'ADD_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER'; payload: Order }
    | { type: 'SET_ORDERS'; payload: Order[] }
    | { type: 'ADD_SHOPPING_LIST'; payload: ShoppingList }
    | { type: 'UPDATE_SHOPPING_LIST'; payload: ShoppingList }
    | { type: 'REMOVE_SHOPPING_LIST'; payload: string }
    | { type: 'SET_SHOPPING_LISTS'; payload: ShoppingList[] }
    | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<User['preferences']> };

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    orders: [],
    shoppingLists: [],
    isLoading: false,
    error: null,
};

function userReducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                orders: [],
                shoppingLists: [],
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'ADD_ADDRESS':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    addresses: [...state.user.addresses, action.payload],
                },
            };
        case 'UPDATE_ADDRESS':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    addresses: state.user.addresses.map(addr =>
                        addr.id === action.payload.id ? action.payload : addr
                    ),
                },
            };
        case 'REMOVE_ADDRESS':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    addresses: state.user.addresses.filter(addr => addr.id !== action.payload),
                },
            };
        case 'ADD_PAYMENT_METHOD':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    paymentMethods: [...state.user.paymentMethods, action.payload],
                },
            };
        case 'UPDATE_PAYMENT_METHOD':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    paymentMethods: state.user.paymentMethods.map(pm =>
                        pm.id === action.payload.id ? action.payload : pm
                    ),
                },
            };
        case 'REMOVE_PAYMENT_METHOD':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    paymentMethods: state.user.paymentMethods.filter(pm => pm.id !== action.payload),
                },
            };
        case 'ADD_ORDER':
            return {
                ...state,
                orders: [action.payload, ...state.orders],
            };
        case 'UPDATE_ORDER':
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.id ? action.payload : order
                ),
            };
        case 'SET_ORDERS':
            return {
                ...state,
                orders: action.payload,
            };
        case 'ADD_SHOPPING_LIST':
            return {
                ...state,
                shoppingLists: [...state.shoppingLists, action.payload],
            };
        case 'UPDATE_SHOPPING_LIST':
            return {
                ...state,
                shoppingLists: state.shoppingLists.map(list =>
                    list.id === action.payload.id ? action.payload : list
                ),
            };
        case 'REMOVE_SHOPPING_LIST':
            return {
                ...state,
                shoppingLists: state.shoppingLists.filter(list => list.id !== action.payload),
            };
        case 'SET_SHOPPING_LISTS':
            return {
                ...state,
                shoppingLists: action.payload,
            };
        case 'UPDATE_USER_PREFERENCES':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    preferences: {
                        ...state.user.preferences,
                        ...action.payload,
                    },
                },
            };
        default:
            return state;
    }
}

interface UserContextValue extends UserState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
    updateAddress: (address: DeliveryAddress) => void;
    removeAddress: (addressId: string) => void;
    addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
    updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
    removePaymentMethod: (paymentMethodId: string) => void;
    createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
    getOrder: (orderId: string) => Order | undefined;
    addShoppingList: (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateShoppingList: (list: ShoppingList) => void;
    removeShoppingList: (listId: string) => void;
    updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // Load user data from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('freshcart_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                dispatch({ type: 'SET_USER', payload: user });
                // Load user's orders and shopping lists
                const savedOrders = localStorage.getItem(`freshcart_orders_${user.id}`);
                if (savedOrders) {
                    dispatch({ type: 'SET_ORDERS', payload: JSON.parse(savedOrders) });
                }
                const savedLists = localStorage.getItem(`freshcart_lists_${user.id}`);
                if (savedLists) {
                    dispatch({ type: 'SET_SHOPPING_LISTS', payload: JSON.parse(savedLists) });
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        }
    }, []);

    // Save user data to localStorage when user changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('freshcart_user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('freshcart_user');
        }
    }, [state.user]);

    // Save orders to localStorage when they change
    useEffect(() => {
        if (state.user && state.orders.length > 0) {
            localStorage.setItem(`freshcart_orders_${state.user.id}`, JSON.stringify(state.orders));
        }
    }, [state.orders, state.user]);

    // Save shopping lists to localStorage when they change
    useEffect(() => {
        if (state.user && state.shoppingLists.length > 0) {
            localStorage.setItem(`freshcart_lists_${state.user.id}`, JSON.stringify(state.shoppingLists));
        }
    }, [state.shoppingLists, state.user]);

    const login = async (email: string, _password: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // Mock login - in real app this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data
            const mockUser: User = {
                id: '1',
                email,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+1234567890',
                preferences: {
                    dietaryRestrictions: [],
                    allergens: [],
                    preferredDeliveryTime: 'afternoon',
                    sustainabilityFocus: true,
                    organicPreference: false,
                    localProductsPreference: true,
                    packagingPreference: 'recyclable',
                    communicationPreferences: {
                        email: true,
                        sms: false,
                        pushNotifications: true,
                    },
                },
                addresses: [],
                paymentMethods: [],
                createdAt: new Date().toISOString(),
            };
            
            dispatch({ type: 'SET_USER', payload: mockUser });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // Mock registration - in real app this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newUser: User = {
                ...userData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            
            dispatch({ type: 'SET_USER', payload: newUser });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('freshcart_user');
        if (state.user) {
            localStorage.removeItem(`freshcart_orders_${state.user.id}`);
            localStorage.removeItem(`freshcart_lists_${state.user.id}`);
        }
    };

    const updateProfile = async (userData: Partial<User>): Promise<void> => {
        if (!state.user) return;
        
        const updatedUser: User = {
            ...state.user,
            ...userData,
        };
        
        dispatch({ type: 'SET_USER', payload: updatedUser });
    };

    const addAddress = (address: Omit<DeliveryAddress, 'id'>) => {
        const newAddress: DeliveryAddress = {
            ...address,
            id: Date.now().toString(),
        };
        dispatch({ type: 'ADD_ADDRESS', payload: newAddress });
    };

    const updateAddress = (address: DeliveryAddress) => {
        dispatch({ type: 'UPDATE_ADDRESS', payload: address });
    };

    const removeAddress = (addressId: string) => {
        dispatch({ type: 'REMOVE_ADDRESS', payload: addressId });
    };

    const addPaymentMethod = (paymentMethod: Omit<PaymentMethod, 'id'>) => {
        const newPaymentMethod: PaymentMethod = {
            ...paymentMethod,
            id: Date.now().toString(),
        };
        dispatch({ type: 'ADD_PAYMENT_METHOD', payload: newPaymentMethod });
    };

    const updatePaymentMethod = (paymentMethod: PaymentMethod) => {
        dispatch({ type: 'UPDATE_PAYMENT_METHOD', payload: paymentMethod });
    };

    const removePaymentMethod = (paymentMethodId: string) => {
        dispatch({ type: 'REMOVE_PAYMENT_METHOD', payload: paymentMethodId });
    };

    const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
        const now = new Date().toISOString();
        const newOrder: Order = {
            ...orderData,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now,
        };
        
        dispatch({ type: 'ADD_ORDER', payload: newOrder });
        return newOrder;
    };

    const getOrder = (orderId: string): Order | undefined => {
        return state.orders.find(order => order.id === orderId);
    };

    const addShoppingList = (listData: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newList: ShoppingList = {
            ...listData,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now,
        };
        dispatch({ type: 'ADD_SHOPPING_LIST', payload: newList });
    };

    const updateShoppingList = (list: ShoppingList) => {
        const updatedList: ShoppingList = {
            ...list,
            updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'UPDATE_SHOPPING_LIST', payload: updatedList });
    };

    const removeShoppingList = (listId: string) => {
        dispatch({ type: 'REMOVE_SHOPPING_LIST', payload: listId });
    };

    const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
        dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
    };

    const value: UserContextValue = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        addPaymentMethod,
        updatePaymentMethod,
        removePaymentMethod,
        createOrder,
        getOrder,
        addShoppingList,
        updateShoppingList,
        removeShoppingList,
        updateUserPreferences,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}