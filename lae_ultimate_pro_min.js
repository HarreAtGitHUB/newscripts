let url=window.location.href;if(!url.includes("am_farm")){let t=window.game_data.village.id;window.location.href="https://"+window.location.host+"/game.php?village="+t.toString()+"&screen=am_farm"}const loadingTime=6e3,skipWait=15e3,wait=2e4,errorThreshold=10;let FAvillas,skippable=[],storage=window.localStorage.getItem("IDs");storage&&(skippable=storage.split(",").map(t=>+t));let duration,avoidStuck=0,sent=0,nextVilla=!1,doNotReport=!1;function getCookie(t){for(var e=t+"=",n=decodeURIComponent(document.cookie).split(";"),i=0;i<n.length;i++){for(var o=n[i];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(e))return o.substring(e.length,o.length)}return""}let laeUltimateProContext='<div id="lae_ultimate_pro_context">\n    <tr>\n        <label for="villageIDs"><b>Villages to skip:</b></label>\n        <tr class="tooltip">\n        </tr>\n        <style>\n            .tooltip .tooltiptext { \n                visibility: hidden; \n                width: 200px; \n                background: linear-gradient(to bottom, #e3c485 0%,#ecd09a 100%); \n                color: black; \n                text-align: center; \n                padding: 5px 10px; \n                border-radius: 6px; \n                border: 1px solid #804000; \n                position: absolute; \n                z-index: 1; \n            } \n            .tooltip:hover .tooltiptext { \n                visibility: visible; \n            }\n        </style> \n        <span class="tooltip"><img src="https://tribalwarsplayer.github.io/newscripts//tooltip_icon2.png" style="max-width:13px"/><span class="tooltiptext"><b>Add villages in the following format: <em>\'villageID,villageID,...\'</em></b> To get village ID Run <b><em>window.game_data.village.id</em></b></span></span>\n        <input type="text" id="villageIDs" name="villageIDs">\n        <input type="button" id="saveButton" value="Save">\n    </tr>\n    <tr>\n        <label for=addNew"><b>Add new ID:</b></label>\n        <input type=text" id="newID" name="newID">\n        <input type="button" id="addButton" value="Add">\n    </tr>\n</div>\n<div>\n    <tr>\n        <label for=timeinterval"><b>Time interval:</b></label>\n        <input type=text" id="interval" name="interval">\n        <input type="button" id="btn-interval" value="Set Interval">\n    </tr>\n    <tr>\n        <a id="startButton" class="btn" style="cursor:pointer;">Start LA Ultimate Pro</a>\n    </tr>\n</div>',settingsTable=document.getElementById("content_value");function enhancer(){console.log("get script"),$.get("https://tribalwarsplayer.github.io/newscripts/lae_ultimate_base.js")}function hasLightC(){return 0!=window.top.Accountmanager.farm.current_units.light}function lightCAmount(){return window.top.Accountmanager.farm.current_units.light}function click(){let t=window.top.$("#plunder_list tr").filter(":visible").eq(1);return t.html()?(selectMasterButton(t),!0):(console.log("All rows hidden..."),!1)}function resetStuckCounter(){avoidStuck=0}function avoidGettingStuck(){lightCAmount()<5?(++avoidStuck,doNotReport=!0,console.log("Warning: "+avoidStuck+"/"+errorThreshold),avoidStuck==errorThreshold&&(console.log("Avoiding stuck..."),nextVilla=!0)):(doNotReport=!1,resetStuckCounter())}function timestamps(t=0){let e=getCurrentGameTime().getTime()+t,n=new Date(e);return String("@ "+n.getHours()+":"+n.getMinutes()+":"+n.getSeconds())}async function nextVillage(){resetStuckCounter(),await new Promise(t=>setTimeout(t,300)),console.log("Leaving from: "+window.top.game_data.village.display_name+timestamps()),await getNewVillage("n"),await new Promise(t=>setTimeout(t,skipWait)),console.log("Welcome in: "+window.top.game_data.village.display_name+timestamps())}async function run(){await enhancer(),await new Promise(t=>setTimeout(t,loadingTime)),console.log("loaded, enchanced");let t,e=0,n=getCurrentGameTime().getTime(),i=window.top.$("#plunder_list tr").filter(":visible").length,o=0,l=parseInt(window.localStorage.getItem("interval"));for(duration=60*l*1e3,console.log(duration);;){let l=getCookie("mode");if("lae"!=l)""==l?document.cookie="mode=lae":(console.log("thread is inactive..."),await new Promise(t=>setTimeout(t,12e4)));else if(nextVilla&&(await nextVillage(),console.log("Request: "+o+"/"+i),o=0,skippable.includes(window.top.game_data.village.id)||(nextVilla=!1,i=window.top.$("#plunder_list tr").filter(":visible").length,lightCAmount()<5&&0!=lightCAmount()&&(console.log("Waiting 20..."),await new Promise(t=>setTimeout(t,wait))))),skippable.includes(window.top.game_data.village.id)?(console.log("Skipping "+window.top.game_data.village.display_name+timestamps()),nextVilla=!0):hasLightC()&&click()?(avoidGettingStuck(),e=0,doNotReport||(console.log("Farming @"+window.top.game_data.village.display_name),++sent,++o),o==i&&(nextVilla=!0),await new Promise(t=>setTimeout(t,250))):(nextVilla=!0,++e),e>FAvillas){document.cookie="mode=scavenging";let i=getCurrentGameTime().getTime();t=duration-(i-n),console.log("Nothing to farm, retrying "+timestamps(t)),console.log("Benchmark "+timestamps()+"  total(approx) => "+sent),e=0,t>0&&await new Promise(e=>setTimeout(e,t)),n=getCurrentGameTime().getTime()}}}settingsTable.insertAdjacentHTML("afterbegin",laeUltimateProContext),document.getElementById("saveButton").onclick=function(){let t=document.getElementById("villageIDs").value;window.localStorage.setItem("IDs",t),alert("Currently skipping: "+window.localStorage.getItem("IDs").split(",").map(t=>+t))},document.getElementById("addButton").onclick=function(){let t=document.getElementById("newID").value;if(0==t||skippable.includes(t))return void alert("Value already in set or invalid");let e=window.localStorage.getItem("IDs"),n=e?e+","+t:t;window.localStorage.setItem("IDs",n),alert("Currently skipping: "+window.localStorage.getItem("IDs").split(",").map(t=>+t))},document.getElementById("btn-interval").onclick=function(){let t=document.getElementById("interval").value;window.localStorage.setItem("interval",t)},document.getElementById("startButton").onclick=function(){$("#lae_ultimate_pro_context").remove();let t=window.localStorage.getItem("IDs");skippable=t.split(",").map(t=>+t),FAvillas=skippable.length,console.log(FAvillas),alert("Currently skipping: "+skippable),run()};