let url = window.location.href;
if (!url.includes("am_farm")) {
    let id = window.game_data.village.id;
    window.location.href = "https://hu60.klanhaboru.hu/game.php?village=" + id.toString() + "&screen=am_farm";
}
const loadingTime = 6000;
const skipWait = 10000;
const wait = 20000;
const duration = 1250000;
const errorThreshold = 10;
let skippable = [];
let storage = window.localStorage.getItem('IDs');
if (storage) {
    skippable = storage.split(':').map(x=>+x);
}

let FAvillas;
let avoidStuck = 0;
let sent = 0;
let nextVilla = false;
let doNotReport = false;


let laeUltimateProContext=
`<div id="lae_ultimate_pro_context">
    <tr>
        <label for="villageIDs"><b>Villages to skip:</b></label>
        <tr class="tooltip">
        </tr>
        <style>
            .tooltip .tooltiptext { 
                visibility: hidden; 
                width: 200px; 
                background: linear-gradient(to bottom, #e3c485 0%,#ecd09a 100%); 
                color: black; 
                text-align: center; 
                padding: 5px 10px; 
                border-radius: 6px; 
                border: 1px solid #804000; 
                position: absolute; 
                z-index: 1; 
            } 
            .tooltip:hover .tooltiptext { 
                visibility: visible; 
            }
        </style> 
        <span class="tooltip"><img src="https://tribalwarsplayer.github.io/newscripts//tooltip_icon2.png" style="max-width:13px"/><span class="tooltiptext"><b>Add villages in the following format: <em>'villageID:villageID:...'</em></b> To get village ID Run <b><em>window.game_data.village.id</em></b></span></span>
        <input type="text" id="villageIDs" name="villageIDs">
        <input type="button" id="saveButton" value="Save">
    </tr>
    <tr>
        <label for=addNew"><b>Add new ID:</b></label>
        <input type=text" id="newID" name="newID">
        <input type="button" id="addButton" value="Add">
    </tr>
    <tr>
        <a id="startButton" class="btn" style="cursor:pointer;">Start LA Ultimate Pro</a>
    </tr>
</div>`;

let settingsTable = document.getElementById("content_value");
settingsTable .insertAdjacentHTML("afterbegin", laeUltimateProContext);

document.getElementById("saveButton").onclick = function() {
    let IDs = document.getElementById("villageIDs").value;
    window.localStorage.setItem('IDs', IDs);
    alert("Currently skipping: " + window.localStorage.getItem('IDs').split(':').map(x=>+x));
}

document.getElementById("addButton").onclick = function() {
    let newID = document.getElementById("newID").value;
    if (newID == 0 || skippable.includes(newID)) {
        alert('Value already in set or invalid');
        return;
    }
    let exists = window.localStorage.getItem('IDs');
    let data = exists ? exists + ":" + newID : newID;
    window.localStorage.setItem('IDs', data);
    alert("Currently skipping: " + window.localStorage.getItem('IDs').split(':').map(x=>+x));
}

document.getElementById("startButton").onclick = function() {
    $("#lae_ultimate_pro_context").remove();
    let skips = window.localStorage.getItem('IDs');
    skippable = skips.split(':').map(x=>+x);
    FAvillas = skippable.length;
    console.log(FAvillas);
    alert("Currently skipping: " + skippable);
    run();
}

function enhancer() {
  console.log('get script');
  $.get('https://tribalwarsplayer.github.io/newscripts/lae_ultimate_base.js');
}

function hasLightC() {
  return window.top.Accountmanager.farm.current_units["light"] != 0;
}

function lightCAmount() {
  return window.top.Accountmanager.farm.current_units["light"];
}

function click() {
    let t = window.top.$("#plunder_list tr").filter(":visible").eq(1);
    var hasVisible = t.html();
    if (!hasVisible) {
        console.log("All rows hidden...");
        return false;
    }
    selectMasterButton(t);
    return true;
}

function resetStuckCounter() {
    avoidStuck = 0;
}

function avoidGettingStuck() {
    if (lightCAmount() == 1) {
        ++avoidStuck;
        doNotReport = true;
        console.log('Warning: ' + avoidStuck + '/' + errorThreshold);
        if (avoidStuck == errorThreshold) {
            console.log('Avoiding stuck...');
            nextVilla = true;
        }
    } else {
        doNotReport = false;
        resetStuckCounter();
    }
}

function timestamps(ms=0) {
    let gTime = getCurrentGameTime().getTime() + ms;
    let gameTime = new Date(gTime)
    return String("@ " + gameTime.getHours() + ':' + gameTime.getMinutes() + ':' + gameTime.getSeconds());
}

async function nextVillage() {
    resetStuckCounter();
    await new Promise(r => setTimeout(r, 300));
    console.log('Leaving from: ' + window.top.game_data.village.display_name + timestamps());
    getNewVillage("n");
    await new Promise(r => setTimeout(r, skipWait));
    console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamps());
}

async function run() {    
    await enhancer();
    await new Promise(r => setTimeout(r, loadingTime));
    console.log('loaded, enchanced');
    
    let couldNotSend = 0;
    let start = getCurrentGameTime().getTime();
    let diff;
    let requestThreshold;
    let maybeRequests = 0;
    
    while (true) {
        if (nextVilla) {
            await nextVillage();
            maybeRequests = 0;
            if (!skippable.includes(window.top.game_data.village.id)) {
                nextVilla = false;
                if (lightCAmount() < 5 && lightCAmount() != 0) {
                    console.log('Waiting 20...');
                    await new Promise(r => setTimeout(r, wait));
                }
            } 
        }
        requestThreshold = window.top.$("#plunder_list tr").filter(":visible").length;
        if (skippable.includes(window.top.game_data.village.id)) {
            console.log('Skipping ' + window.top.game_data.village.display_name + timestamps());
            nextVilla = true;
        } else if (!hasLightC() || !click()) {
            nextVilla = true;
            ++couldNotSend;
        } else {
            avoidGettingStuck();
            couldNotSend = 0;
            if (!doNotReport) {
                console.log('Farming @' + window.top.game_data.village.display_name);
                ++sent;
                ++maybeRequests;
                console.log('Request: ' + maybeRequests + '/' + requestThreshold);
            }
            if (maybeRequests == requestThreshold) {
                nextVilla = true;
            }
            await new Promise(r => setTimeout(r, 300));
        }
        if (couldNotSend > FAvillas*2) {
            let end = getCurrentGameTime().getTime();
            diff = duration - (end - start);
            console.log('Nothing to farm, retrying ' + timestamps(diff));
            console.log('Benchmark ' + timestamps() + '  total(approx) => '+ sent);
            couldNotSend = 0;
            if (diff > 0) {
                await new Promise(r => setTimeout(r, diff));
            }
            start = getCurrentGameTime().getTime();
        }
    }
}