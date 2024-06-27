import { fetch, CookieJar } from "node-fetch-cookies"; 

// Note - need to edit node-fetch-cookies to import in built node packages with node: prefix

export const getSession = async (user, passUnencoded) => {
  // Encode password for passing through URL
  const pass = encodeURIComponent(passUnencoded)

  // Initialize cookie jar for saving auth cookie
  const mainJar = await new CookieJar();
  
  // Get verification token for login
  let requestVerificationToken;
  await fetch(mainJar, "https://hac.friscoisd.org/HomeAccess/Account/LogOn").then(async (data) => requestVerificationToken = JSON.stringify(await data.text()).match(/type=\\"hidden\\" value=\\"(.*?)\\"/m)[1])

  // Login to HAC and return as cookie jar
  let login = await fetch(mainJar, "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
    "credentials": "include",
    "headers": {"Content-Type": "application/x-www-form-urlencoded"},
    "referrer": "https://hac.friscoisd.org/HomeAccess/Account/LogOn",
    "body": `__RequestVerificationToken=${requestVerificationToken}&LogOnDetails.UserName=${user}&LogOnDetails.Password=${pass}&Database=10`,
    "method": "POST",
    "mode": "cors"
  })
  return mainJar

};