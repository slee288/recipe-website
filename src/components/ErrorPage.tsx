import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    console.log(error);
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="text-center">
                <div className="text-[#db0c64] font-semibold pb-8">
                    <p className="text-8xl">{(error as { status: number; })?.status}</p>
                    <p className="text-4xl">{(error as Error)?.message || (error as { statusText?: string })?.statusText}</p>
                </div>
                <p className="text-lg mb-6">{
                    (error as { status: number; })?.status === 404 ? "The page you're looking for does not exist" : "Looks like something has gone wrong..."
                }</p>
                <button className="bg-white rounded-lg border border-[#db0c64] text-[#db0c64] py-1.5 px-3 text-lg" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div>
    )
}

export default ErrorPage;