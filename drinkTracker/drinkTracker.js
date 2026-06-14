var modal = document.getElementById("addGroupModal");
var modalOn = document.getElementById("modalOn");
var span = document.getElementsByClassName("close")[0];
var groupID = 0
var groupName = ""

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

    if (event.target == document.getElementById("enterPassModal")) {
        document.getElementById("enterPassModal").style.display = "none";
    }
}

async function awaitServer(func) {
    const loading = document.getElementById('serverRunning');
    loading.style.display = "block";
    try {
        return await func
    } finally {
        loading.style.display = "none";
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

    const groupList = document.getElementById("groupList")
    for (const group of [...groupList]) {
        if (group.id != "modalOn") {
            group.remove();
        }
    }
    getGroups()
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
        document.getElementById("enterPassModal").style.display = "none";
        openPeoplePage()
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
    console.log("test to see if this is being called");
    groups_json = await res.json();
    for (const group of groups_json) { 
        let id = group.id;
        let name = group.name;
        console.log("test before name")
        console.log(name);
        const newLi = document.createElement("li");
        newLi.textContent = name;
        newLi.id = name;
        newLi.class = "groupSelection";
        groupList.appendChild(newLi);
        let newModal = document.getElementById("enterPassModal");
        let passModalOn = document.getElementById(group.name);
        passModalOn.onclick = function() {
            newModal.style.display = "flex";
            groupID = id;
            groupName = name;
        }
        window.onclick = function(event) {
            if (event.target == newModal) {
              newModal.style.display = "none";
            }
        }
    }
    document.getElementById("submitPass").addEventListener("click", function() {submitPassword(groupID)});
}

function openPeoplePage() {
    document.getElementById("groups").style.display = "none";
    document.getElementById("members").style.display = "flex";
    const newHeader = document.createElement("h2");
    newHeader.textContent = groupName;
    displayGroupMembers(groupID);
}

async function displayGroupMembers() {
    const res = await fetch(`https://ehaeseler-github-io.onrender.com/get_group_members?group_id=${groupID}`,
    {
        method: "GET", headers: {"Content-Type": "application/json"}
    });
    members_json = await res.json();
    for (const member of members_json) {
        let id = member.id;
        let username = member.name;
        const newLi = document.createElement("li");
        newLi.textContent = username;
        newLi.id = username + "-" + id;
        members.appendChild(newLi);
    }
}

async function addGroupMember() {
    const username = document.getElementById("username").value;

    const res = await fetch("https://ehaeseler-github-io.onrender.com/add_member",
    {
        method: "POST", headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            group_id: groupID,
            username: username
        })
    });

    const data = await res.json();
    console.log(data);

    const memberList = document.getElementById("memberList")
    for (const member of [...memberList]) {
        if (member.id != "memberModalOn") {
            member.remove();
        }
    }
    displayGroupMembers()
}

window.onload = async function() {
    await awaitServer(() => getGroups())
};