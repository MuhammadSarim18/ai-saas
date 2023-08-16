"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("188c7e9e-9266-4386-a0b5-fb5d90390480");
    }, []);

    return null;
}