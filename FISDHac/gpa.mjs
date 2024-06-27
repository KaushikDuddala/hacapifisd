import { fetch } from "node-fetch-cookies";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export const getStudentGpa = async(cookies) => {
  let pushBack
  let doc
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx").then(async (data) => doc = new JSDOM(await data.text()).window.document)
  try{
    pushBack = {
      "weighted": doc.getElementById("plnMain_rpTranscriptGroup_lblGPACum1").textContent,
      "unweighted": doc.getElementById("plnMain_rpTranscriptGroup_lblGPACum2").textContent
    }
  }catch(error){
    pushBack={
      "weighted":"N/A",
      "unweighted":"N/A"
    }
  }
  if (pushBack.unweighted == null){
    pushBack={
      "weighted":"N/A",
      "unweighted":"N/A"
    }
  }
  return pushBack
}