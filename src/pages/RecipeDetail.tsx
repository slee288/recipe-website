import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function RecipeDetail() {
    const params = useParams();
    const recipeId = params?.id || "";

    const {
        data: recipeData,
        isError,
        isLoading
    } = useQuery({
        queryKey: ["recipe"],
        queryFn: () => fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`)
                            .then((resp) => resp.json()),
    });


    if(isLoading) return (
        <div>
            <h1 className="h6">...loading</h1>
        </div>
    )

    function displayIngredients(recipeData: any) {
        return recipeData?.extendedIngredients.map((ingredient: any) => {
            const measureKeys = Object.keys(ingredient["measures"]);
            const name = ingredient["name"];

            return (
                <>
                    <li>{name}</li>
                    <li>
                        {measureKeys.map((key) => (`${key}: ${ingredient["measures"][key]["amount"]} ${ingredient["measures"][key]["unitShort"]}`))}
                    </li>
                </>
            )
        })
    }

    return (
        <div>
            <p className="h1">Bluecross Assessment - Recipe Details Page</p>
            <div>
                <img src={recipeData?.image} />
                <p className="h3">Name: {recipeData?.title}</p>
                <p className="h3">Ingredients</p>
                <ul>
                    {displayIngredients(recipeData)}
                </ul>
                <ol>
                    {recipeData?.["analyzedInstructions"][0]["steps"].map((instr: any) => (
                        <li>{instr.step}</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}

export default RecipeDetail;