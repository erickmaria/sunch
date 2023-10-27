
import { App } from "./server/app"

const port = process.env.PORT || 3080;

new App().server.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});