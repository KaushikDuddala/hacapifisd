import { Router } from 'itty-router';

let getSession, getSchedule, getStudentInfo, getClasses, getStudentGpa;
async function loadModules() {
  await import("../FISDHac/login.js").then(x => getSession = x.getSession)
}
const router = Router();

//router.get('/api', () => new Response('Todos Index!'));

router.get('/login', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    return new Response(token);
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
