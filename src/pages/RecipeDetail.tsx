import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface Recipe {
    id: number,
    title: string,
    image: string,
    extendedIngredients: {
        id: number,
        name: string,
        measures: {
            metric: { amount: number, unitLong: string, unitShort: string },
            us: { amount: number, unitLong: string, unitShort: string },
        }
    }[],
    analyzedInstructions: {
        steps?: {
            step: string
        }[]
    }[]
}

function RecipeDetail() {
    const params = useParams();
    const recipeId = params?.id || "";

    const {
        data: recipeData,
        isError,
        isLoading
    } = useQuery<Recipe>({
        queryKey: ["recipe"],
        queryFn: () => fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`)
                            .then((resp) => resp.json()),
    });


    if(isLoading) return (
        <div>
            <h1 className="h6">...loading</h1>
        </div>
    )

    function displayIngredients(recipeData?: Recipe) {
        return recipeData?.extendedIngredients.map((ingredient: Recipe["extendedIngredients"][0]) => {
            const name = ingredient.name;

            return (
                <>
                    <li>{name}</li>
                    <li>
                        metric: {ingredient.measures.metric?.amount} {ingredient.measures.metric?.unitShort}
                    </li>
                    <li>
                        us: {ingredient.measures.us?.amount} {ingredient.measures.us?.unitShort}
                    </li>
                </>
            )
        })
    }

    return (
        <div>
            <div>
                <img src={recipeData?.image} />
                <p className="h3">Name: {recipeData?.title}</p>
                <p className="h3">Ingredients</p>
                <ul>
                    {displayIngredients(recipeData)}
                </ul>
                <ol>
                    {recipeData?.analyzedInstructions[0]?.steps?.map((instr: any) => (
                        <li>{instr.step}</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}

export default RecipeDetail;