import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react({
            include: "src/**/*.ts",
        }),
    ],
    server: {
        port: 8080,
        watch: {
            usePolling: true,
        },
    },
});

