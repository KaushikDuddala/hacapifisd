import { Router } from 'itty-router';

const router = Router();

router.get('/api', () => new Response('Todos Index!'));

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
