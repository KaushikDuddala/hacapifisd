import { fetch } from "node-fetch-cookies";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

async function getGrades(stuff, cookies) {

    let returnDataArray = [];

    let pageParser
    await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", stuff).then(async (data) => pageParser = new JSDOM(await data.text()))
    const classesDiv = Object.values(pageParser.window.document.getElementsByClassName("AssignmentClass"))
    classesDiv.forEach(async (classDiv) => {
        let className;
        let lastUpdated;
        let grade;
        const headerDivs = Object.values(classDiv.getElementsByClassName("sg-header sg-header-square"))
        headerDivs.forEach(async (headerDiv) => {
            className = headerDiv.getElementsByClassName("sg-header-heading")[0].textContent.trim()
            lastUpdated = headerDiv.getElementsByClassName("sg-header-sub-heading")[0].textContent.trim().replace("(Last Updated: ", "").replace(")", "")
            grade = headerDiv.getElementsByClassName("sg-header-heading sg-right")[0].textContent.trim().replace("Student Grades ", "").replace("%", "")
            if (grade == "") {
                grade = "0.00"
            }
            if (lastUpdated == "") {
                lastUpdated = "n/a"
            }
        })
        let assignmentsArray = []
        const assignmentsDiv = Object.values(classDiv.getElementsByClassName("sg-content-grid"))
        assignmentsDiv.forEach(async (assignmentDiv) => {
            const assignments = Object.values(assignmentDiv.getElementsByClassName("sg-asp-table-data-row"))
            assignments.forEach(async (assignment) => {
                try {
                    let grade = assignment.getElementsByTagName("td")[4].textContent.replace("\n", "").trim()
                    if (grade == "") {
                        grade = "0.00"
                    }
                    const assignmentData = {
                        "assignmentName": assignment.getElementsByTagName("a")[0].textContent.replace("\n", "").trim(),
                        "assignmentType": assignment.getElementsByTagName("td")[3].textContent,
                        "assignmentGrade": grade,
                        "assignmentDueDate": assignment.getElementsByTagName("td")[0].textContent,
                        "assignmentAssignedDate": assignment.getElementsByTagName("td")[1].textContent.trim(),
                        "assignmentMaxScore": assignment.getElementsByTagName("td")[5].textContent.trim()
                    }
                    assignmentsArray.push(assignmentData)
                } catch (error) { }
            })
        })
        let classType = "On Level"
        if (className.includes("Adv")) {
            classType = "Advanced"
        }
        else if (className.includes("AP")) {
            classType = "AP"
        }
        let courseData = {
            "className": className,
            "classType": classType,
            "grade": grade,
            "lastUpdated": lastUpdated,
            "assignments": assignmentsArray
        }
        returnDataArray.push(courseData)
    })
    return returnDataArray
}


export async function getClasses(cookies) {
    let quarters = []
    for (let i = 1; i < 5; i++) {
        const stuff = {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "Referer": "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `__EVENTTARGET=ctl00%24plnMain%24btnRefreshView&__VIEWSTATE=izE0bU531pACyhgVVnbEHJkW%2BpPy4i4ZvpKe7bSEP5HQwQ%2FfYbGJH37Lvlkaaxsf929y7%2BK%2F3DJmn0AbQPb6djXhUEVzFkqBU%2FZHZRHdVaORVHwZi%2FLHnNgkD0kJ3hWYjvNFAcXq3PyrU0t4bEUxze%2FBjn9%2BMxDrZej50bQ4ecx2TEjuog0ZUiFGW001TD8XUP9n8stMIsZ7ibLk5J4oB7kTekGxVBO9SkDi4RBGjkDTsc2UYCY9I6EYU2qS7IadCRQM0S4WWl4GFzlPJ6gDPJtICOmpMnRx1gw25kTt3kUu4Rp88B8AgRncFwxzar35zF%2BOCC%2FSJVZ6eWszwrvhuHYDQDHjc6iX%2B68Skb4YvP3x%2BTOo%2FBBXQRpJ1JH7w5hLKz1KrocHKgNLSn%2F%2BrSIv0%2BwsLA5qKERn9PT1oVj72kBd489KzIDdK3ZjjbKI04Dr%2BSjfVsqVcR%2BpvDi3tSijLAY7%2FnSvVKkR%2B1wYzwZhCGnV3lKUCcwQo5mnLSVau3lJfSG6qpBOGhIHdeBLdpLiebja1MHQAIm2BJHPzjQNR62%2Fj9CleCyvExvr6bl%2BQEHsSun5N0ewujK29KBWj%2FQwm1IRz7%2FSd4Iiadbgv85HYlNXYdEcuHjnmgKedmosC5ds1CkdSHioAZhIHjtJOpX4ctUSmSL963yXwQAtB4ljZScFc8PgvHri9JV7NjIqMczRBlcnGkENvzPLkwFZWv3O0WDUo0M9DpPBjskYGzAImzkdJpbE9GPzS0%2B4E2Swwr38v5kYjYdznUxMOPjlZmirsjaExIt2cVGWLFKB3O3hAJm7iKKGnX5UsSmC6ar3CPg3ru%2BeBq6tAJ9BM1jDcsVAsKMnHYKXDIHdEwJMVvPbtdZt1aoufn%2B1c8oJjVCVD5fqZNaUK%2BOGf3YxOYi%2FYkQBJyXRnJOiHYjrM5i%2BBAMdAVObiScHA8gIlCXIVN%2FECdZbUyHsaEM4j5cne8FhY%2Bz0ZSgKKcLc0JX%2F0wdkF4wug4A0Ovngb6%2FonPfUTJ3TFqB0kTmTuZPwINF0YOM7SXMOJvbBaJwdBmH4nyzftHuCp27%2FQrjxq8UzGTlPFpYrBWBoJJCZIYJFjINWpgoQdmg5pBiqE8tSwWzyEC6m988egxT6FiIhz7a%2Fxw9fYBD6GxLUaKeUb%2F9YKpWtetIOHGyojZTJlSGkK3sFrg2jhEvTYBhhrEI7oI9MPeUiMOv%2By19wxDZFX1rAUYTuYgYGQGQzxAmr0Cr8yqIzgKQm%2FCxqE2t2VFq1%2B6VLDkPv3j9WoVszYtdbPhVSIXsVKpgnuB0aytVh4ErfQV0MVBagPytRGrq%2Fu%2FvzEu9vZtY2KmgN%2BdTEaxP5Mmj6VDry%2BsQ%2Fm3qZ%2B2mPCxR86uUVeF4YdPRvqf%2FLcCohhIq8qo7VkgyM%2BTWgMGrsg7YfI21Fb0P0eAYUvsul%2BBDN6MOfHyztOzZNso%2Fnjo%2BpFQx%2F2wCqYn4Ev8hbnffwMO5ajyeN63DgYKHXq6nY0gfeBoWBrzoSxFHgfHs%2BEPhQN%2F7ptrr10Iu%2BcoQWEDPzCMKiOnsTylOpDq%2F%2BsBpAYxVQZFVQqEqNoxNss8BqEeM1Uph2IW9rBPVLfSjQznG1%2F9fSPoLwuWA2SKxpEClND7RyJkGmzxSKA30KySqhODgB7ecJHUTdrjJt6DOZPOT5tJIWhIDEUhVvOVnkridJCr9LXZl8geVcRs1jnbE6p3G%2Bc9hboLIRXFwlpD8Yk%2Bhgy1YC66RjY%2F0YOOo6wkJaYF56%2Fm31v%2Bj9im6o787EW9NEUcJcpRhNEjnUttNGy42s0Doi9wjBAtgmWab6dC72Jgw78pp5UorsJPgR75fnNlk8TkYhzZZdw4AEywMVrTFX%2Bdi7k5pUKJYDsLQCmqdlvZliq3IsbQ33u2nQeqkoQ8e%2F0h8qW5guq%2FSJfFn7&__EVENTVALIDATION=9r1WuaAG%2BkAeC9tYBceOkX2GZnizVbBR%2Fodw4bCW6taOC9R1yXsbuoRX%2BD7qvptKB1fnFidmDPD6lc5k0ZoU2jBIPNWiRjyKtLMGD1C%2FVPgBYw3TlYEwrmdg7nBHAlvsS7JHDCgxS1bhscGZQhpQ5W0CetYJoaP3NLzKk5Org7jYArW2OLlv7wiu%2BItMIp988nany9O1V2n8AYmFJUhnDHoZP512XwTCWQE3tJ1%2BhsT3aEvhdAGHK2QA%2Bs68kbJlA3basUzRJRhk0QWs9wex9mRJb7F%2BCGeoyEFmVADSmw%2BQ7xAqHus3Duz%2BoPvFM9EQB8Q8c5gkrJxRzW3I9eiCIGucwrx1AxOcEGxtJvlbjTDqeXTE5Ew8PzOpGkp5ky4%2FS8ijsvraVEI0CDeRUGLW45UvfPGf2ePjKMSu8RQqBcOdBwUaS6agj57Qao%2BjPusfHvqkjjVWYr0CLDFNycQi0XgAE79d3xgNFMh0iMT%2FLLlJ4zuWXNkme1dMdafJIQmlZyZNuh5mZxWqJ%2F9IxTRs%2FntyqDYZN1Mc0rzJb%2Bd6%2F87O%2FePRqXu8mFprskgGaxCSKq%2FKFbn39aZYXGodDwh4tPo8ZoaOqQ6Gzw0nFH1KFhdcnQ2%2FUrYgaA2jy1pozncwTNOZnBA6cTHWPcudqWHKIi9WE759x4e6GMBByqDX%2BE%2FgWmbXs8sNDZXnZC3rdVy3%2F00wA7ziaPgt0tM0QTethJQyiApghZUugzoMkNJZktAXNWG%2B6sDjNkjpUPvEjiUER1HAR%2F87Ab8PvZ3WopenEfgzsD1j5rWo6CLypiyARUyBNbkCqdVSAZkplHY5MwwaKCq%2Fpi6mkIzo3K238QTUzvVMYkB3EuxnUh%2B%2F8ekH%2FNl%2BqMp6MxCawN4bLlXpq4c0KeYC1eV4cx4w0BJX16NOWkw2LBLvEj7T2OPNnl37clWAGbIwS6Y4CUKTUzC%2FGMopgmM8Ze2rR2x498p%2Bfputoqn135U%2BRC2B%2BGsG7rWr9JQWoPMGchHLhSMmpg%2FsVZLOIIMoEtP7akpPjITVhfOTMpGN5sQK3cXG8r3M%2FSeGLDDeIqSs9VhdYQVKtC56CttAFV%2F8RStTda0NlOqINgXDHwvKG5taoKV9NjYYroO6sY9w7nMX6TYzpv9wRh1vJEO8PF084WYUMWU5QQxT1Tq1%2BlKNkBLGwlhuqMLxT6fFrpAJMTNvxm%2F1YGa2%2BjAXjJ4QN54rBO99nXtzvOPIdXBldweMYVLS5E5k0aeDNFX5xfL4uXxEKuFi42iMUOX4T66UVj2lh7DPfZcQEN6CtnYgQbc4JelxFWkn4GSy5jTT3odrw6s3zgKrTKYjSfy2rjszYlTknznwznGzYq2%2FYtfvCNjZUblJHZ8h5VV%2BOvyISGaLaAhbyf%2FN5ofmf9GqdlU%2B5pFJ66KAbYolhK7lrLTZi2v3iQcjHwnA5KlG6mhi1I%2FzfPWpQ%2FCMHLUsLQP90sb8PMUJ2Plz4NIw7HQyl7FRHIyn4ok7JNXi1XX%2F1xkPlub%2FiK4Cri8QMLYzD0mhGfQNSK8Xvf4Np4iWX%2FWtidsMnk7L7sNLen%2FqrajVe98zgqjBUGs3OAKBS8URaznLe%2BBxxGwGpf%2FuDphATb7Z9rQFacRhvzC7QFDW7wAMPKU9TtvCM5NsuNTcdMgmQEVeDY9d&ctl00%24plnMain%24ddlReportCardRuns=${i}-2024&ctl00%24plnMain%24ddlOrderBy=Class`,
            "method": "POST"
        };
        const returnDataArray = await getGrades(stuff, cookies)
        quarters.push(returnDataArray)
    }
    const currentClass = await getGrades({}, cookies)
    let currentQuarter = 0
    for (let i = 1; i < 5; i++) {
        if (currentClass[0].lastUpdated == quarters[i - 1][0].lastUpdated) {
            currentQuarter = i
        }
    }
    return { "currentQuarter": currentQuarter, "quarters": quarters }
}
