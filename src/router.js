import { Router } from 'itty-router';

let getSession, getSchedule, getStudentInfo, getClasses, getStudentGpa;
async function loadModules() {
  await import("../FISDHac/login.mjs").then(x => getSession = x.getSession)
  //await import("../FISDHac/classes.mjs").then(x => getClasses = x.getClasses)
  await import("../FISDHac/schedule.mjs").then(x => getSchedule = x.getSchedule)
  await import("../FISDHac/studentinfo.mjs").then(x => getStudentInfo = x.getStudentInfo)
  await import("../FISDHac/gpa.mjs").then(x => getStudentGpa = x.getStudentGpa)
}


const router = Router();

//router.get('/api', () => new Response('Todos Index!'));

router.get('/login', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    return new Response(token);
});

router.get('/schedule', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const schedule = await getSchedule(token);
    return new Response(schedule);
});

router.get('/studentinfo', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const studentInfo = await getStudentInfo(token);
    return new Response(studentInfo);
});
/*
router.get('/classes', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const classes = await getClasses(token);
    return new Response(classes);
});*/

router.get('/gpa', async (request) => {
    const { user, pass } = request.query
    const token = await getSession(user, pass)
    const gpa = await getStudentGpa(token)
    return new Response(gpa)
})

router.all('*', () => new Response('Not Found.', { status: 404 }));

loadModules();

export default router;
