import { fetch } from "node-fetch-cookies";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export const getSchedule = async(cookies) => {
  let returnDataArray = [];
  let pageParser
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Classes.aspx").then(async (data) => pageParser = new JSDOM(await data.text()))
  let courses = Object.values(pageParser.window.document.getElementsByClassName("sg-asp-table-data-row"))
  courses.forEach(async (row) => {
    try{
      const returnData = {
        "className": row.getElementsByTagName("a")[0].textContent,
        "teacherEmail": row.getElementsByTagName('a')[1].href.match(/mailto:(.*)/)[1],
        "classRoom": row.getElementsByTagName("td")[4].textContent.trimEnd(),
        "teacherName": row.getElementsByTagName("td")[3].textContent.trimEnd(),
        "classDays": row.getElementsByTagName("td")[5].textContent,
        "classQuarters": row.getElementsByTagName("td")[6].textContent,
        "building": row.getElementsByTagName("td")[7].textContent.trimEnd(),
        "periods": row.getElementsByTagName("td")[2].textContent.trimEnd(),
        "status": row.getElementsByTagName("td")[8].textContent.trimEnd()
      }
      returnDataArray.push(returnData)
    }catch(error){}
  })
  return returnDataArray
}