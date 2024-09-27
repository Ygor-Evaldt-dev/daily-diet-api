import { app } from "./app";
import { env } from "./env";

try {
    app.listen({ port: env.PORT }, () => {
        console.log(`HTTP server running on port ${env.PORT}`);
    });
} catch (error) {
    console.error(error);
}
