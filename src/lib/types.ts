interface DropdownOption {
    value: string;
    key: string;
    label: string;
}

interface SearchResult {
    results: {
        id: number;
        title: string;
        image: string;
        imageType: string;
    }[];
    offset: number;
    number: number;
    totalResults: number;
}

interface Recipe {
    id: number;
    title: string;
    image: string;
    extendedIngredients: {
        id: number;
        name: string;
        image: string;
        measures: {
            metric: { amount: number; unitLong: string; unitShort: string; };
            us: { amount: number; unitLong: string; unitShort: string; };
        };
    }[];
    analyzedInstructions: {
        steps?: {
            step: string;
        }[];
    }[];
    // dietary properties
    cheap?: boolean;
    dairyFree?: boolean;
    glutenFree?: boolean;
    ketogenic?: boolean;
    lowFodmap?: boolean;
    sustainable?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
    veryHealthy?: boolean;
    veryPopular?: boolean;
    whole30?: boolean;
}

export type { 
    DropdownOption,
    Recipe,
    SearchResult,
}