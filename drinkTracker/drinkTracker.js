var modal = document.getElementById("addGroupModal").value;
var modalOn = document.getElementById("modalOn");
var span = document.getElementsByClassName("close")[0];

modalOn.onclick = function() {
    modal.style.display = "flex";
}
  
span.onclick = function() {
    modal.style.display = "none";
}
  
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

async function addGroup() {
    const groupName = document.getElementById("groupName").value;
    const groupPass = document.getElementById("password").value;
    
    const res = await fetch("https://ehaeseler-github-io.onrender.com/add_group",
    {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: groupName,
            password: groupPass
        })
    });

    const data = await res.json();
    console.log(data);
}

document.getElementById("submit").addEventListener("click", addGroup);

async function getGroups() {
    const groupList = document.getElementById("groupList");
    const res = await fetch("https://ehaeseler-github-io.onrender.com/get_groups",
    {
        method: "GET", headers: {"Content-Type": "application/json"}
    });
    groups_json = await res.json();
    for (const group of groups_json) { //fix this
        const newLi = document.createElement("li");
        newLi.textContent = group;
        newLi.id = group;
        document.getElementById(group).addEventListener("click", openPeoplePage(group));
    }
}

function openPeoplePage(group) {
    document.getElementById(groups).style.display = none;
    document.getElementById(members).style.display = flex;
    const newHeader = document.createElement("h2")
    newHeader.textContent = group
    
}

async function displayGroupMembers() {
    const res = await fetch("https://ehaeseler-github-io.onrender.com/get_groups",
        {
            method: "GET", headers: {"Content-Type": "application/json"}
        });
        groups_json = await res.json();
}