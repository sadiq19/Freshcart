export interface InspirationMeal {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

export const inspirationMeals: InspirationMeal[] = [
    {
        id: '1',
        title: 'Rask kremet kyllingpanne',
        description: 'Med parmesan og pasta - klar på 20 minutter',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop',
        link: '/recipes',
    },
    {
        id: '2',
        title: 'Fisk til middag?',
        description: 'Fersk laks med grønnsaker og ris',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
        link: '/recipes',
    },
    {
        id: '3',
        title: 'Når middagen ikke er i fokus',
        description: 'Enkle og raske løsninger for hverdagen',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop',
        link: '/recipes',
    },
    {
        id: '4',
        title: 'Pasta di manzo',
        description: 'Hjemmelaget pasta med kjøttsaus',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop',
        link: '/recipes',
    },
];

