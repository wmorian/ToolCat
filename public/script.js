document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    function showTable() {
        const x = document.getElementById("searchResult");
        if (x.style.display !== "flex") {
            x.style.display = "flex";
        }
    }
    showTable();
    var searchText = document.getElementById('searchInput').value;

    fetch('/api/tools/search?query=' + searchText)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let placeholder = document.querySelector("#data-output");
            let out = "";
            let tools = data;
            for (let tool of tools) {
                out += `
            <tr class="row">
                <td>
                    <i>0</i>
                    <a target="_blank" rel="noopener noreferrer" href="${tool.link}">${tool.name}</a>
                    <span class="badge result">Web Development</span>
                    <span class="badge result">CSS</span>
                </td>
                <td>${tool.description}</td>
            </tr>
        `;
            }

            placeholder.innerHTML = out;
        });
}

document.getElementById('addButton').addEventListener('click', function () {

    // Reset all elements
    document.getElementById('webLink').value = "";

    var elements = document.getElementsByClassName('hideInput');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
        elements[i].value = "";
    }

    let catContainer = document.getElementById("categoryAutoCompleteContainer");
    catContainer.innerHTML = "";
    let tagContainer = document.getElementById("tagAutoCompleteContainer");
    tagContainer.innerHTML = "";

    // open modal
    var modal = document.getElementById("myModal");
    modal.showModal();
});

// Get the <span> element that closes the modal
var btn = document.getElementById("close-btn");

// When the user clicks on <span> (x), close the modal
btn.onclick = function () {
    var modal = document.getElementById("myModal");
    modal.close();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.close();
    }
}


document.getElementById('addToolForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let catContainer = document.getElementById("categoryBadgeContainer");
    let catBadges = Array.from(catContainer.getElementsByClassName("badge"));
    let categories = catBadges.map(badge => ({ name: badge.firstChild.textContent.trim() }));

    let tagContainer = document.getElementById("tagBadgeContainer");
    let tagBadges = Array.from(tagContainer.getElementsByClassName("badge"));
    let tags = tagBadges.map(badge => ({ name: badge.firstChild.textContent.trim() }));

    var tool = {
        name: document.getElementById('name').value,
        link: document.getElementById('webLink').value,
        description: document.getElementById('description').value,
        creator: "admin", // for now
        categories: categories,
        tags: tags
    };

    fetch('/api/tools', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tool),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            var modal = document.getElementById("myModal");
            modal.close();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

document.getElementById('webLink').addEventListener('change', function (e) {
    var url = e.target.value;

    fetch('/api/meta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
        .then(response => response.json())
        .then(data => {
            // display the other fields
            var elements = document.getElementsByClassName('hideInput');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }

            // populate the inputs with the response data
            document.getElementById('name').value = data.title || '';
            document.getElementById('description').value = data.description || '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


function autoComplete(type, query) {
    let container = document.getElementById(type + "AutoCompleteContainer");
    container.innerHTML = "";

    if (query.length >= 2) {
        fetch(`/api/${type}/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                data.forEach(item => {
                    let div = document.createElement("div");
                    div.className = "auto-complete-item";
                    div.onclick = function () {
                        addBadge(type, item);
                    };
                    div.innerHTML = item;
                    container.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// allow to add custom tags
document.getElementById("tagAutoCompleteInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (this.value.length > 2) {
            addBadge("tag", this.value);
        }
    }
});

function addBadge(type, value) {
    let container = document.getElementById(type + "BadgeContainer");
    let badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `<span>${value}</span><span class="remove" onclick="removeBadge(this, '${type}')">x</span>`;
    container.appendChild(badge);
    let autoCompleteInput = document.getElementById(type + "AutoCompleteInput");
    autoCompleteInput.value = "";
    autoCompleteInput.focus();
    document.getElementById(type + "AutoCompleteContainer").innerHTML = "";
}

function removeBadge(element, type) {
    let container = document.getElementById(type + "BadgeContainer");
    container.removeChild(element.parentElement);
}