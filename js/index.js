document.addEventListener("DOMContentLoaded", function() {
    dropDownMenu();
    document.getElementById("github-form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (searchUser) {
        getUsers();
        }
        else {
            getRepostories()
        }
    });

let searchUser = true;    

function getUsers() {
    let userName = document.getElementById("search").value;
    fetch(`https://api.github.com/search/users?q=${userName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
        }
    })
    .then(res => res.json())
    .then(users => {
        listUsers(users.items)
    })
};

function listUsers(users) {
    let userList = document.getElementById("user-list");
    users.forEach(user => {
        let li = document.createElement("li");
        let name = document.createElement("p");
        let nameButton = document.createElement("button");
        nameButton.innerText = user.login;
        name.appendChild(nameButton);
        nameButton.addEventListener("click", () => {
            while (userList.firstChild) {
                userList.removeChild(userList.firstChild);
            } 
            fetch(`https://api.github.com/users/${user.login}/repos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github.v3+json",
                }
            })
            .then(res => res.json())
            .then(repos => {
                listUserRepos(repos)
            })
        });
        
        let userLink = document.createElement("p");
        let url = document.createElement("a");
        url.innerText = `${user.login} Repository`;
        url.href = user["html_url"];
        userLink.appendChild(url);

        let img = document.createElement("img");
        img.src = user.avatar_url;


        li.appendChild(name);
        li.appendChild(img);
        li.appendChild(userLink);
        userList.appendChild(li);
    })
}

function listUserRepos(repos) {
    let reposList = document.getElementById("repos-list");
    repos.forEach(repo => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.innerText = repo.name;
        link.href = repo.html_url;
        li.appendChild(link);
        reposList.appendChild(li);
    });
};
function dropDownMenu() {
    let form = document.getElementById("github-form")
    let dropdown = document.createElement("select");
    form.appendChild(dropdown);
    dropdown.setAttribute("id", "dropdown");
    let option1 = document.createElement("option");
    option1.value = "Search Username";
    option1.id = "username"
    option1.innerText = "Search Username";
    let option2 = document.createElement("option");
    option2.value = "Search Repository Name"
    option2.innerText = "Search Repository Name";
    dropdown.appendChild(option1);
    dropdown.appendChild(option2);
    dropdown.addEventListener("change", () => {
        toggleDropdown(dropdown.options[dropdown.selectedIndex].value)
    })
};

function toggleDropdown(selectedOption) {
    if (selectedOption === "Search Username") {
        searchUser = true;
    }
    else {
        searchUser = false;
    }
}

function getRepostories() {
    let repoName = document.getElementById("search").value;
    fetch(`https://api.github.com/search/repositories?q=${repoName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
        }
    })

    .then(res => res.json())
    .then(repos => {
        listRepostories(repos.items)
    })
}

function listRepostories(repos) {
    let reposList = document.getElementById("repos-list");
    repos.forEach((repo) => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        li.innerText = repo.name;
        link.innerText = repo.html_url;
        link.href = repo.html_url;
        reposList.appendChild(li);
        reposList.appendChild(link);
    })
};
});