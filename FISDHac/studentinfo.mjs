import { fetch } from "node-fetch-cookies";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export const getStudentInfo = async (cookies) => {
  let doc
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx").then(async (data) => doc = new JSDOM(await data.text()).window.document)
  const pushBack = {
    "studentName": doc.getElementById("plnMain_lblRegStudentName").textContent,
    "studentId": doc.getElementById("plnMain_lblRegStudentID").textContent,
    "studentBirthday": doc.getElementById("plnMain_lblBirthDate").textContent,
    "studentCounselor": doc.getElementById("plnMain_lblCounselor").textContent,
    "studentCounselorEmail": doc.getElementsByTagName("a")[0].href.match(/mailto:(.*)/)[1],
    "studentGrade": doc.getElementById("plnMain_lblGrade").textContent,
    "studentSchool": doc.getElementById("plnMain_lblBuildingName").textContent,
  }
  return pushBack
}