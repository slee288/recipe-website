import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../components/Dropdown";
import { DropdownOption, SearchResult } from "../lib/types";

const cuisines = [
    "African", "Asian", "American", "British","Cajun","Caribbean","Chinese","Eastern European","European","French","German"
    ,"Greek","Indian","Irish","Italian","Japanese","Jewish","Korean","Latin American","Mediterranean"
    ,"Mexican","Middle Eastern","Nordic","Southern","Spanish","Thai","Vietnamese"
]

function Home() {
    const [searchInput, setSearchInput] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        page: Number(searchParams.get("page")) || 1,
        search: searchParams.get("search"),
        cuisine: searchParams.get("cuisine") || "",
    });

    const {
        data: searchResult,
        error,
        isLoading: resultsLoading,
        isError,
        refetch,
    } = useQuery<SearchResult, Error>({
        queryKey: ["search", params],
        queryFn: async () => {
                const data = await fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/complexSearch`
                                        + `?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`
                                        + `&query=${params.search}`
                                        + `&number=5`
                                        + `&offset=${(params.page - 1) * 5}`
                                        + (params.cuisine && `&cuisine=${params.cuisine}`))
                                    .then(resp => resp.json())

                // error handling
                if(data.status === "failure") throw data;

                return data;
            },
        enabled: false,
        refetchOnWindowFocus: false   // this avoids unnecessary api calls when focus back to the window
    });

    // detect the changes for search parameters
    useEffect(() => {
        setParams({
            page: Number(searchParams.get("page")) || 1,
            search: searchParams.get("search"),
            cuisine: searchParams.get("cuisine") || "",
        });
    }, [searchParams]);

    // detect the changes for parameters themselves, and then retrieve the results based on the queries
    useEffect(() => {
        const { page, search, cuisine } = params;
        if(search) refetch();
    }, [params]);

    // only sets the search input parameter - resets the rest of the queries
    function formSubmit(event: SyntheticEvent) {
        event.preventDefault();
        setSearchParams(
            `search=${searchInput}`
        )
    }

    function getPaginationDropdown() {
        const totalResults = searchResult?.["totalResults"] || 0;
        const totalPages = Math.min(
            Math.ceil(totalResults / 5),
            180
        );
        const totalPagesArray: DropdownOption[] = [...Array(totalPages)].map((_, index) => {
            return {
                value: String(index + 1),
                key: String(index),
                label: String(index + 1)
            }
        });

        return (
            <Dropdown 
                name="page"
                value={String(params.page)}
                options={totalPagesArray}
                onChange={changePage}
            />
        )
    }

    // updates the query for page - rest of the queries are unchanged
    function changePage(event: ChangeEvent<HTMLSelectElement>) {
        const selectedPage = Number(event.target.value);
        setSearchParams(
            `search=${params.search}`
            + (selectedPage > 1 ? `&page=${selectedPage}` : "")
            + (params.cuisine && `&cuisine=${params.cuisine}`)
        );
    }

    function getCuisinesDropdown() {
        const cuisineOptions: DropdownOption[] = [
            { value: "", key: "empty", label: "No Cuisine" },
            ...cuisines.map((cuisine) => {
                return {
                    value: cuisine.toLowerCase(),
                    key: cuisine,
                    label: cuisine
                }
            })
        ];

        return (
            <Dropdown 
                name="cuisine"
                value={params.cuisine}
                options={cuisineOptions}
                onChange={changeCuisine}
            />
        )
    }

    // updates the query for cuisine - rest of the queries are unchanged (except for page, resets the page query to the beginning)
    function changeCuisine(event: ChangeEvent<HTMLSelectElement>) {
        const selectedCuisine = event.target.value;
        setSearchParams(
            `search=${params.search}`
            + (selectedCuisine && `&cuisine=${selectedCuisine}`)
        );
    }

    function getResultsList() {
        if(resultsLoading) return <></>

        return (searchResult?.results && searchResult?.results?.length) ? (
            <ul className="recipe-listing grid grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {
                    searchResult?.results.map((result: SearchResult["results"][0]) => (
                        <li className="block card max-w-80" key={result.id}>
                            <a className="group w-full h-full inline-flex flex-col rounded-md shadow-md overflow-hidden transition-all hover:shadow-xl" href={`/recipes/${result.id}`}>
                                <div className="w-full h-52 overflow-hidden">
                                    <img className="w-full object-cover transition-all duration-500 group-hover:scale-110" src={result["image"]} alt={result["title"]} />
                                </div>
                                <div className="card-description py-4 px-6 flex flex-1 flex-col justify-between gap-y-8">
                                    <p className="text-xl ml-1">{result["title"]}</p>
                                    <button 
                                        className="
                                            rounded-full border border-[#db0c64] max-w-max px-6 py-1.5 text-[#db0c64] font-semibold transition
                                            hover:bg-[#db0c64] hover:text-white
                                        "
                                    >
                                        Recipe Details
                                    </button>
                                </div>
                            </a>
                        </li>
                    ))
                }
            </ul>
        ) : (
            <div className="text-center">
                <p className="text-xl sm:text-2xl">No Results to Display</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <div className="page-header relative">
                <img className="object-cover h-96 md:h-120 w-full" src="https://spoonacular.com/application/frontend/images/wallpaper1.jpg" alt="spoonacular sample banner" />
                <div className="absolute top-2/4 w-full h-full bg-[#33333385] translate-y-[-50%] flex justify-center items-center">
                    <div className="px-4 max-w-full">
                        <p className="text-3xl sm:text-4xl md:text-5xl text-center text-white font-medium mb-8">Find Your Favorite Recipe</p>
                        <form id="recipeSearch" className="w-full flex gap-x-2 sm:gap-x-4" onSubmit={formSubmit}>
                            <input 
                                className="text-sm sm:text-base min-w-20 bg-white border border-gray-300 rounded-md py-2.5 px-3 flex-1"
                                placeholder="Search for Recipe..."
                                type="text" aria-label="recipe-input" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} 
                            />
                            <button 
                                className="
                                    text-sm sm:text-base font-semibold bg-[#db0c64] border border-[#db0c64] rounded-md py-1.5 px-4 sm:min-w-28 font-medium text-white
                                    transition hover:bg-[#b90a42] hover:border-[#b90a42]
                                "
                                type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                    
                </div>
            </div>
            
            
            <div className="w-full max-w-5xl mx-auto mt-16 mb-8 px-4 md:px-8 flex flex-col gap-y-12">
                <div className="flex gap-x-8 w-full max-w-5xl items-center justify-end">
                    {getCuisinesDropdown()}
                </div>
                {getResultsList()}
                {
                    (searchResult && searchResult?.results?.length) ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="flex gap-x-4 items-center">
                                <p>Page: </p>
                                {getPaginationDropdown()}
                            </div>
                        </div>
                    ) : <></>
                }
                
            </div>
            
            

            
        </div>
    )
}

export default Home;