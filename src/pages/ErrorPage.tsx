import React from "react";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();

    return (
        <div>
            <p className="h1">This page does not exist</p>
            <p>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</p>
        </div>
    )
}

export default ErrorPage;