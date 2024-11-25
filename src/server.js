import Hapi from '@hapi/hapi';
import { routes } from './routes/index.js';

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server running on http://localhost:${server.info.port}`);
};

init();
