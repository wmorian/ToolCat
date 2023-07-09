import json
import requests

with open('/home/wahid/Projects/ekbatan/ToolCat/seeds/results_with_cat.json', 'r') as f:
    tools = json.load(f)

url = 'http://localhost:5000/api/tools'
headers = {'Content-Type': 'application/json'}

for tool in tools:
    data = {
        "name": tool["Title"],
        "link": tool["URL"],
        "description": tool["Description"],
        "image": tool["Image"],
        "creator": "admin",
        "categories": [{"name": cat} for cat in tool["Categories"]],
        "tags": []
        # Assuming you also have tags in your JSON objects, add them here. If not, you can comment or remove this line.
        #"tags": tool["Tags"]
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # This is to check if the POST request was successful
    if response.status_code == 200:
        print(f"Successfully posted tool: {tool['Title']}")
    else:
        print(f"Failed to post tool: {tool['Title']}")
