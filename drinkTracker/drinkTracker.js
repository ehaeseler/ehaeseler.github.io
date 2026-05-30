var modal = document.getElementById("addGroupModal");
var modalOn = document.getElementById("modalOn");
var span = document.getElementsByClassName("close")[0];
var groupID = 0

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

async function submitPassword(groupID) {
    const groupPass = document.getElementById("groupPass").value;

    const res = await fetch (`https://ehaeseler-github-io.onrender.com/check_pass?group_id=${groupID}&group_pass=${groupPass}`,
    {
        method: "GET", headers: {"Content-Type": "application/json"}
    });
    passCheck = await res.json();
    if (passCheck.success) {
        displayGroupMembers(groupID)
    }
    else {
        console.log("Wrong password");
    }
}

async function getGroups() {
    const groupList = document.getElementById("groupList");
    const res = await fetch("https://ehaeseler-github-io.onrender.com/get_groups",
    {
        method: "GET", headers: {"Content-Type": "application/json"}
    });
    groups_json = await res.json();
    for (const group of groups_json) { 
        let id = group.id;
        let name = group.name;
        const newLi = document.createElement("li");
        newLi.textContent = name;
        newLi.id = name;
        newLi.class = "groupSelection";
        groupList.appendChild(newLi);
        groupID = id;
        let newModal = document.getElementById("enterPassModal");
        let passModalOn = document.getElementById(group.name);
        passModalOn.onclick = function() {
            newModal.style.display = "flex";
        }
        span.onclick = function() {
            newModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == newModal) {
              newModal.style.display = "none";
            }
        }
    }
    document.getElementById("submitPass").addEventListener("click", function() {submitPassword(id)});
}

function openPeoplePage(group) {
    document.getElementById(group).style.display = none;
    document.getElementById("members").style.display = flex;
    const newHeader = document.createElement("h2")
    newHeader.textContent = group
    
}

async function displayGroupMembers(groupId) {
    const res = await fetch(`https://ehaeseler-github-io.onrender.com/get_group_members?group_id=${groupId}`,
    {
        method: "GET", headers: {"Content-Type": "application/json"}
    });
    members_json = await res.json();

}