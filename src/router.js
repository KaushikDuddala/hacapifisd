import { Router } from 'itty-router';

let getSession, getSchedule, getStudentInfo, getClasses, getStudentGpa;
async function loadModules() {
  await import("../FISDHac/login.mjs").then(x => getSession = x.getSession)
  await import("../FISDHac/classes.mjs").then(x => getClasses = x.getClasses)
  await import("../FISDHac/schedule.mjs").then(x => getSchedule = x.getSchedule)
  await import("../FISDHac/studentinfo.mjs").then(x => getStudentInfo = x.getStudentInfo)
  await import("../FISDHac/gpa.mjs").then(x => getStudentGpa = x.getStudentGpa)
}


const router = Router();

async function validateUserAndPass(reqBody) {
    let user
    let pass
    try {
      user = reqBody.username
      pass = reqBody.password
    } catch (error) {
      return [400, error]
    }
    if (!/[0-9][0-9][0-9][0-9][0-9][0-9]/.test(user)) {
      return [400, "username does not match XXXXXX"]
    }
    return [user, pass]
  }


router.get('/login', async (request) => {
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    return new Response(token);
});

router.get('/schedule', async (request) => {
    const checkPass = await validateUserAndPass(request.query)
    if(!checkPass) return new Response("Invalid username or password", { status: 400 })
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const schedule = await getSchedule(token);
    return new Response(schedule);
});

router.get('/studentinfo', async (request) => {
    const checkPass = await validateUserAndPass(request.query)
    if(!checkPass) return new Response("Invalid username or password", { status: 400 })
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const studentInfo = await getStudentInfo(token);
    return new Response(studentInfo);
});

router.get('/classes', async (request) => {
    const checkPass = await validateUserAndPass(request.query)
    if(!checkPass) return new Response("Invalid username or password", { status: 400 })
    const { user, pass } = request.query;
    const token = await getSession(user, pass);
    const classes = await getClasses(token);
    return new Response(classes);
});

router.get('/gpa', async (request) => {
    const checkPass = await validateUserAndPass(request.query)
    if(!checkPass) return new Response("Invalid username or password", { status: 400 })
    const { user, pass } = request.query
    const token = await getSession(user, pass)
    const gpa = await getStudentGpa(token)
    return new Response(gpa)
})

router.get('/all', async (request) => {
    const checkPass = await validateUserAndPass(request.query)
    if(!checkPass) return new Response("Invalid username or password", { status: 400 })
    const { user, pass } = request.query
    const token = await getSession(user, pass)
    return new Response({
        schedule: await getSchedule(token),
        studentInfo: await getStudentInfo(token),
        classes: await getClasses(token),
        gpa: await getStudentGpa(token)
    })
})

router.all('*', () => new Response('Not Found.', { status: 404 }));

loadModules();

export default router;
