import * as http from 'http';
import { toggleWindow } from '../utils/wintoggle';

// only for linux, is a workaround for wayland windowing systems
// this code provides service that exposes a http server to switch between show/hide application window
export const Service = {
    run: () => {
        
    const hostname: string = '127.0.0.1';
    const port: number = 7500;

    const server: http.Server = http.createServer((req, res) => {
        toggleWindow();
        res.end();
    });

    server.listen(port, hostname, () => {
        console.log(`[INFO][SERVICE] exposing service to toggle window at http://${hostname}:${port}/`);
    });
    }
}