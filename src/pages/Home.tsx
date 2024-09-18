import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function Home() {
    const [search, setSearch] = useState("");

    const {
        data: searchResult,
        refetch,
    } = useQuery({
        queryKey: ["search"],
        queryFn: () => fetch(`${process.env.REACT_APP_SPOONACULAR_URL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&query=${search}&number=5`)
                        .then(resp => resp.json()),
        enabled: false,
    });

    function formSubmit(event: any) {
        event.preventDefault();
        refetch();
    }

    useEffect(() => {
        console.log("search results", searchResult);
    }, [searchResult])

    return (
        <div>
            <form onSubmit={formSubmit}>
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
                <button type="submit">Search</button>
            </form>
        </div>
    )
}

export default Home;