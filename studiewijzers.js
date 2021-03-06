function print(args) { console.log(args) }

var roundedDataSize = [30, 25, 25]
var selected = ["", ""];

// The main page is subdivided into the following regions:
// +--------------------------------------------------------------------------------+
// | +-----------+        +-----------------------------------+       +-----------+ |
// | |           |        |                                   |       |           | |
// | |	Hamburger |       |             Main logo             |       | Darktheme | |
// | |   Menu    |        |                                   |       |  Switch   | |
// | +-----------+        +-----------------------------------+       +-----------+ |
// +--------------------------------------------------------------------------------+
// +--------------------------------------------------------------------------------+
// |        Domains                    Subjects                   Modules           |
// | +--------------------+     +--------------------+     +--------------------+   |
// | |                    |     |                    |     |                    |   |
// | |                    |     |                    |     |                    |   |
// | |                    |     |                    |     |                    |   |
// | |                    |     |                    |     |                    |   |
// | |                    |     |                    |     |                    |   |
// | |                    |     |                    |     |                    |   |
// | +--------------------+     +--------------------+     +--------------------+   |
// +--------------------------------------------------------------------------------+

// This part sets up the main container objects

let topContainer = document.createElement("ul");
let domainContainer = document.createElement("li");
let subjectContainer = document.createElement("li");
let moduleContainer = document.createElement("li");

let domainList = document.createElement("ul");
let subjectList = document.createElement("ul");
let moduleList = document.createElement("ul");

domainContainer.appendChild(domainList);
subjectContainer.appendChild(subjectList);
moduleContainer.appendChild(moduleList);

var dataContainerItems = [domainList, subjectList, moduleList];
const dataContainers = [domainContainer, subjectContainer, moduleContainer]; 

topContainer.classList += "topContainer";

domainContainer.classList += "testContainer";
subjectContainer.classList += "testContainer";
moduleContainer.classList += "testContainer";
domainList.classList += "testList";
subjectList.classList += "testList";
moduleList.classList += "testList";

// This part sets up the seperators between the containers

topContainer.appendChild(domainContainer);
let sep1 = document.createElement("div");
sep1.classList = "seperator";
topContainer.appendChild(sep1);

topContainer.appendChild(subjectContainer);
let sep2 = document.createElement("div");
sep2.classList = "seperator";
topContainer.appendChild(sep2);

topContainer.appendChild(moduleContainer);
let sep3 = document.createElement("div");

// This part handles setting up all the navBar/hamburger menu items

let navEnabled = false;

userSettings = {};
starred = [];

function changeDomain(domain) {
    // First we loop over all the subjects in this domain
    // Excluding the displayName property
    var subjects = [];
    for (item in data[domain]) {
        if (item != "displayName") { subjects.push(item); }
    }

    // Then, for every subject, we push the displayNames to the container
    var displayNames = [];
    for (var i = 0; i < subjects.length; i++) {
        if (data[domain][subjects[i]]["displayName"] == undefined) { displayNames.push(subjects[i]); }
        else { displayNames.push(data[domain][subjects[i]]["displayName"]); }
    }
    
    fillList(displayNames, subjects, subjectList);

    selected[0] = domain;

    var firstSubjectName;
    for (prop in data[domain]) {
        if (prop != "displayName") {
            firstSubjectName = prop;
            break;
        }
    }

    // Recursively do the same for all other containers
    changeSubject(domain, firstSubjectName);

}

function changeSubject(domain, subject) {
    var modules = [];
    for (item in data[domain][subject]) {
        modules.push(item);
    }

    selected[0] = domain;
    selected[1] = subject;

    var displayNames = [];
    for (var i = 0; i < modules.length; i++) {
        item = modules[i];
        if (item == "displayName") {
            continue;
        }
        if (data[domain][subject][item] != "") {
            displayNames.push(data[domain][subject][item]);
        }
        else {
            displayNames.push(item);
        }
    }

    fillList(displayNames, modules, moduleList);

}

function fillList(input, realNames, funcList) {
    var inputLength = input.length;
    var offset = 0;
    for (var x = 0 ; x < funcList.childNodes.length; x++) {
        if (x < inputLength) {
            if (realNames[x] == "displayName") {
                offset = 1;
            }
            if (input[x] != realNames[x]) {
                funcList.childNodes[x].innerText = input[x];
                funcList.childNodes[x].setAttribute("realName", realNames[x]);
            }
            else{
                funcList.childNodes[x].innerText = input[x];
                funcList.childNodes[x].setAttribute("realName", "");
            }
            if (funcList == moduleList) {
                var s0 = selected[0].split(" ").join("");
                var s1 = selected[1].split(" ").join("");
                var s2 = realNames[x + offset].split(" ").join("");
                var fin = s0 + "/" + s1 + "/" + s2;
                //y = "window.open('https://coornhert.sharepoint.com/sites/liber/" + fin + "')";
                y = "window.open('" + s2 + "')";
            
                funcList.childNodes[x].setAttribute("onclick", y);
            }
            funcList.childNodes[x].classList = "occupied";
        }
        else {
            funcList.childNodes[x].innerText = "";
            funcList.childNodes[x].classList = "empty";
        }
    }
    highlightSelected();
}

function highlightSelected() {
    for (var i = 0; i < 2; i++) {
        for (var x = 0; x < dataContainerItems[i].childNodes.length; x++) {
            if (dataContainerItems[i].childNodes[x].classList != "empty") {
                var toCheck = dataContainerItems[i].childNodes[x];
                if (toCheck.innerText == selected[i] || toCheck.getAttribute("realName") == selected[i]) {
                    toCheck.classList += " active";
                }
                else {
                    toCheck.classList = "occupied";
                }
            }
        }
    }
}

function onLoadMain() {

    userSettings = JSON.parse(localStorage.getItem("RetroLiberUser"));

    classNames = ["domain", "subject", "module"]
    // Create the divs that will be filled later
    for (var i = 0; i < 3; i++) {
        for (var x = 0; x < this.roundedDataSize[i]; x++) {
            if (i < 2) {
                var item = document.createElement("button");
            }
            else {
                var item = document.createElement("button");
                item.setAttribute("target", "_blank")
            }
            item.id = classNames[i];
            item.classList = "dataItem";
            item.onclick = test;
            dataContainerItems[i].appendChild(item);
        }
    }

    if (userSettings == undefined) {
        userSettings = {}
    }

    var domains = [];
    var starred = [];
    for (item in data) {
        if (userSettings[item] != undefined) {
            if (userSettings[item]["hidden"] == false || userSettings[item]["hidden"] == undefined) {
                if (userSettings[item]["starred"]) { starred.push(item) }
                else {domains.push(item);}
            }
        }
        else {
            domains.push(item);
        }
    }
    print(starred);
    domains = starred.concat(domains);
    print(domains);

    var domainLength = domains.length;
    for (var x = 0 ; x < domainList.childNodes.length; x++) {
        if (x < domainLength) {
            if (data[domains[x]]["displayName"] != undefined) {
                domainList.childNodes[x].innerText = data[domains[x]]["displayName"];
                domainList.childNodes[x].setAttribute("realName", domains[x]);
            }
            else {
                domainList.childNodes[x].innerText = domains[x];
                domainList.childNodes[x].setAttribute("realName", "");
            }
            if (userSettings[domains[x]] == undefined) {
                domainList.childNodes[x].classList = "hidden";
            }
            else {
                print(domains[x]);
                domainList.childNodes[x].classList = userSettings[domains[x]]["hidden"] ? "hidden" : "hidden";
            }
        }
        else {
            domainList.childNodes[x].innerText = "";
            domainList.childNodes[x].classList = "empty";
        }
    }
    this.changeDomain(domains[0]);

    domDataContainer = document.getElementById("dataContainer");
    domDataContainer.appendChild(topContainer);

}

function test() {
    if (this.id == "domain") {
        var domain = "";
        if (this.getAttribute("realName") == "") {
            domain = this.innerText;
        }
        else {
            domain = this.getAttribute("realName");
        }
        changeDomain(domain);
    }
    else if (this.id == "subject") {
        var subject = "";
        if (this.getAttribute("realName") == "") {
            subject = this.innerText;
        }
        else {
            subject = this.getAttribute("realName");
        }
        changeSubject(selected[0], subject);
    }
    else if (this.id == "module") {
       }
}


if(window.addEventListener){
    window.addEventListener('load',onLoadMain,false);
}else{
    window.attachEvent('onload',onLoadMain);
}