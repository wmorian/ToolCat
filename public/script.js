class SearchComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
        <input type="text" id="searchInput" />
        <button id="searchButton">Search <i class="gg-search"></i></button>
        <table id="searchResult">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody id="data-output">
            <!-- Products from JavaScript file in here. -->
          </tbody>
        </table>
      `;
    }

    setupEventListeners() {
        this.querySelector('#searchButton').addEventListener('click', this.performSearch.bind(this));
        this.querySelector('#searchInput').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    performSearch() {
        const showTable = () => {
            const x = this.querySelector("#searchResult");
            if (x.style.display !== "flex") {
                x.style.display = "flex";
            }
        };
        showTable();
        const searchText = this.querySelector('#searchInput').value;

        fetch('/api/tools/search?query=' + searchText)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let out = "";
                let tools = data;
                for (let tool of tools) {
                    out += `
              <tr>
                <td><a target="_blank" rel="noopener noreferrer" href="${tool.link}">${tool.name}</a></td>
                <td>${tool.description}</td>
              </tr>
            `;
                }

                this.querySelector("#data-output").innerHTML = out;
            });
    }
}

customElements.define('search-component', SearchComponent);



document.getElementById('addButton').addEventListener('click', function () {
    document.getElementById('webLink').value = "";

    var elements = document.getElementsByClassName('hideInput');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
        elements[i].value = "";
    }

    var modal = document.getElementById("myModal");
    modal.style.display = "block";
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('addToolForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var categoryList = document.getElementById('categories').value.split(',');
    var tagList = document.getElementById('tags').value.split(',');

    var categories = categoryList.map(function (category) {
        return { name: category.trim() }
    });
    var tags = tagList.map(function (tag) {
        return { name: tag.trim() }
    });

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
            modal.style.display = "none";
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

document.getElementById('categories').addEventListener('input', function (e) {
    let query = e.target.value;

    // TODO: empty the suggestion list

    if (query.length >= 2) {
        fetch(`/api/categories/search?query=${query}`)
            .then(response => response.json())
            .then(data => {

                // TODO: How to show the category suggestions
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        // TODO: empty the suggestion list
    }
});

document.getElementById('tags').addEventListener('input', function (e) {
    let query = e.target.value;

    // TODO: empty the suggestion list

    if (query.length >= 2) {
        fetch(`/api/tags/search?query=${query}`)
            .then(response => response.json())
            .then(data => {

                // TODO: how to show the tag suggestions
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        // TODO: empty the suggestion list
    }
});
