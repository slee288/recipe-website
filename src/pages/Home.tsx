import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function Home() {
    const [search, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;


    const {
        data: searchResult,
        refetch,
    } = useQuery({
        queryKey: ["search"],
        queryFn: () => fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&query=${search}&number=5&offset=${(currentPage - 1) * 5}`)
                        .then(resp => resp.json()),
        enabled: false,
    });

    function formSubmit(event: any) {
        event.preventDefault();
        setSearch("");
        setSearchParams("");
        refetch();
    }

    function getPaginationDropdown() {
        const totalResults = searchResult?.["totalResults"] || 0;
        const totalPages = Math.min(
            Math.ceil(totalResults / 5),
            180
        );
        return (
            <select>
                {[...Array(totalPages)].map((elm, index) => (
                    <option key={index}>{index + 1}</option>
                ))}
            </select>
        )
    }

    // handle pagination when search results change
    useEffect(() => {
        console.log(searchResult?.["totalResults"] / 5);
    }, [searchResult]);

    return (
        <div>
            <form onSubmit={formSubmit}>
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
                <button type="submit">Search</button>
            </form>

            <p className="h1">Search Results</p>
            <ul>
                {searchResult?.results.map((result: any) => (
                    <li key={result.id}>
                        <a href={`/recipes/${result.id}`}>
                            <img src={result["image"]} />
                            <p>{result["title"]}</p>
                        </a>
                    </li>
                ))}
            </ul>

            <div>
                <p>pagination</p>
                <ul className="flex gap-x-4">
                    {currentPage > 1 && <li><a href={`/${currentPage - 1 > 1 ? `?page=${currentPage-1}` : ""}`}></a></li>}
                    {getPaginationDropdown()}
                </ul>
            </div>
        </div>
    )
}

export default Home;