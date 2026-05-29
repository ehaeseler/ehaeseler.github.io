async function getGroups() {
    const res = await fetch('https://ehaeseler-github-io.onrender.com/get_groups');
    groups_json = res.json();
}