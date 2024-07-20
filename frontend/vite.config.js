import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/

export default ({ command, mode }) => {
    // Load app-level env vars to node-level env vars.
    // const env = loadEnv(mode, process.cwd(), "");

    process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/..`) };

    return defineConfig({
        define: {
            plugins: [react()],
            __APP_ENV__: process.env.VITE_VERCEL_ENV,
        },
    });
};
