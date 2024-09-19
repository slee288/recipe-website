import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Recipe } from "../lib/types";
import ErrorPage from "../components/ErrorPage";
import { SyntheticEvent } from "react";

function RecipeDetail() {
    const params = useParams();
    const navigate = useNavigate();
    const recipeId = params?.id || "";

    const {
        data: recipeData,
        error,
        isError,
        isLoading
    } = useQuery<Recipe, Error>({
        queryKey: ["recipe"],
        queryFn: async () => {
            const data = await fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`)
                            .then((resp) => resp.json()).catch(err => {throw err});
            
            // error handling within the data 
            if(data.status === "failure") throw data;

            return data;
        },
        retry: 2,
        refetchOnWindowFocus: false   // this avoids unnecessary api calls when focus back to the window
    });

    // nothing displays while the data loads
    if(isLoading) return (
        <div></div>
    )

    // display the error page when the data is not available
    if(isError) return <ErrorPage />

    function displayDietaryTags(recipeData?: Recipe) {
        const dietaryPropertiesArray = [
            { label: "Cheap", value: recipeData?.cheap || false },
            { label: "Dairy Free", value: recipeData?.dairyFree || false },
            { label: "Gluten Free", value: recipeData?.glutenFree || false },
            { label: "Ketogenic", value: recipeData?.ketogenic || false },
            { label: "Low FODMAP", value: recipeData?.lowFodmap || false },
            { label: "Sustainable", value: recipeData?.sustainable || false },
            { label: "Vegan", value: recipeData?.vegan || false },
            { label: "Vegetarian", value: recipeData?.vegetarian || false },
            { label: "Very Healthy", value: recipeData?.veryHealthy || false },
            { label: "Very Popular", value: recipeData?.veryPopular || false },
            { label: "Whole 30", value: recipeData?.whole30 || false }
        ];

        return dietaryPropertiesArray.map(({ label, value }: { label: string; value: boolean; }) => {
            return value ? (
                <span key={label} className="rounded-full text-xs sm:text-sm bg-[#fd4f64] text-white font-semibold py-1 px-4">
                    {label}
                </span>
            ) : (<span key={label} className="hidden"></span>)
        })
    }

    function displayIngredients(recipeData?: Recipe) {
        return recipeData?.extendedIngredients.map((ingredient: Recipe["extendedIngredients"][0], index: number) => {
            return (
                <li key={`${ingredient.id}-${index}`} className="grid grid-cols-3 items-center gap-x-8 sm:gap-x-4">
                    <img 
                        className="inline-block col-span-1"
                        src={`${process.env.REACT_APP_SPOONACULAR_IMG_URL}/${ingredient.image}`} 
                        alt={ingredient.name} 
                        onError={(evt: SyntheticEvent<HTMLImageElement, Event>) => evt.currentTarget.src = "https://transpower.ca/wp-content/themes/consultix/images/no-image-found-360x250.png"}
                    />
                    <div className="flex flex-col col-span-2 gap-y-1 ingredient-details text-sm md:text-base">
                        <p>{ingredient.name}</p>
                        <p>metric: {ingredient.measures.metric?.amount} {ingredient.measures.metric?.unitShort}</p>
                        <p>us: {ingredient.measures.us?.amount} {ingredient.measures.us?.unitShort}</p>
                    </div>
                </li>
            )
        })
    }

    return (
        <div className="w-full h-full">
            <div className="px-4 mt-8 max-w-6xl mx-auto">
                <button className="rounded-lg border border-[#db0c64] px-2.5 py-1.1 text-[#db0c64]" onClick={() => navigate(-1)}>Go Back</button>
            </div>
            <div className="w-full max-w-5xl mx-auto mt-8 mb-8 px-4 sm:px-8 flex flex-col gap-y-8">
                <div className="header">
                    <p className="text-2xl sm:text-3xl mb-2">{recipeData?.title}</p>
                    <div className="tags flex flex-wrap gap-x-2 gap-y-2 items-center">
                        {displayDietaryTags(recipeData)}
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <img className="block w-full sm:w-max sm:max-w-11/12 md:max-w-9/12" src={recipeData?.image} alt={recipeData?.title} 
                        onError={(evt: SyntheticEvent<HTMLImageElement, Event>) => evt.currentTarget.src = "https://transpower.ca/wp-content/themes/consultix/images/no-image-found-360x250.png"}
                    />
                </div>
                <div className="ingredients">
                    <p className="text-lg sm:text-xl mb-4">Recipe Ingredients </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
                        {displayIngredients(recipeData)}
                    </ul>
                </div>
                {(recipeData?.analyzedInstructions && recipeData?.analyzedInstructions.length) ? <div className="instructions">
                    <p className="text-lg sm:text-xl mb-4">Cooking Instructions</p>
                    <ol className="list-decimal list-inside flex flex-col gap-y-6 bg-[#f2f2f2] rounded-xl px-6 sm:px-12 py-8">
                        {recipeData?.analyzedInstructions[0]?.steps?.map((instr: { step: string; }, index: number) => (
                            <li key={index}>{instr.step}</li>
                        ))}
                    </ol>
                </div>: <></>}
            </div>
        </div>
    )
}

export default RecipeDetail;