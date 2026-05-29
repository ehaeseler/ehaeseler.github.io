// async function getGroups() {
//     const res = await fetch('https://ehaeseler-github-io.onrender.com/get_groups');
//     groups_json = res.json();
// }

var modal = document.getElementById('addGroupModal').value;
var modalOn = document.getElementById('modalOn').value;
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
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
    const groupName = document.getElementById('groupName');
    const groupPass = document.getElementById('password');
    
    const res = await fetch('https://ehaeseler-github-io.onrender.com/add_group',
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

document.getElementById('submit').addEventListener("click", addGroup)