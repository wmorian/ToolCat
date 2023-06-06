document.getElementById('searchButton').addEventListener('click', function () {
    var searchText = document.getElementById('searchInput').value;

    fetch('/api/tools/search?query=' + searchText)
        .then(response => response.json())
        .then(data => {
            // Clear the search input
            // document.getElementById('searchInput').value = '';

            // Display the results
            console.log(data);
            // Here you can add code to display the data on the page
        });
});

document.getElementById('addButton').addEventListener('click', function () {
    document.getElementById('name').value = "";
    document.getElementById('webLink').value = "";
    document.getElementById('description').value = "";
    document.getElementById('categories').value = "";
    document.getElementById('tags').value = "";

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

document.getElementById('addToolForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var categoryList = document.getElementById('categories').value.split(',');
    var tagList = document.getElementById('tags').value.split(',');

    var categories = categoryList.map(function(category) {
        return { name: category.trim() }
    });
    var tags = tagList.map(function(tag) {
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

document.getElementById('webLink').addEventListener('input', function(e) {
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

