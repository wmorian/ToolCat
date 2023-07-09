import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin

# Tool categories and associated keywords
categories = [
    { "name": "Development", "keywords": ["code", "programming", "developer", "software", "debug", "api", "library", "libraries", "development", "backend", "frontend"] },
    { "name": "Design", "keywords": ["design", "UX", "UI", "graphics", "illustration", "typography"] },
    { "name": "Graphics", "keywords": ["graphic", "design", "illustration", "3D", "photo editing", "animation"] },
    { "name": "Productivity", "keywords": ["productivity", "task", "management", "organize", "efficiency", "time tracking"] },
    { "name": "Organization", "keywords": ["organize", "schedule", "manage", "task", "project", "team"] },
    { "name": "Utilities", "keywords": ["tool", "utility", "software", "application", "optimize", "system"] },
    { "name": "Security", "keywords": ["security", "protection", "encryption", "VPN", "malware", "privacy"] },
    { "name": "Communication", "keywords": ["communication", "chat", "messaging", "email", "video call", "collaborate"] },
    { "name": "Collaboration", "keywords": ["collaboration", "team", "project", "share", "document", "task"] },
    { "name": "Data Analysis", "keywords": ["data", "analysis", "statistics", "database", "big data", "machine learning"] },
    { "name": "Mobile Development", "keywords": ["mobile", "app", "iOS", "android", "UI"] },
    { "name": "Cloud", "keywords": ["cloud", "storage", "SaaS", "IaaS", "PaaS", "database"] },
    { "name": "Infrastructure", "keywords": ["infrastructure", "server", "network", "data center", "virtualization", "cloud"] },
    { "name": "Web Development", "keywords": ["web", "HTML", "CSS", "JavaScript", "frontend", "backend"] },
    { "name": "Artificial Intelligence", "keywords": ["AI", "LLM", "Prompt", "ChatGPT", "GPT", "OpenAI", "Bard", "machine learning", "neural network", "data science", "robotics", "automation"] },
    { "name": "Blockchain", "keywords": ["blockchain", "cryptocurrency", "bitcoin", "ethereum", "smart contract", "token"] },
]



def get_metas(url):
    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.text, 'html.parser')

        title = soup.find('title').text if soup.find('title') else ''

        description_tag = soup.find('meta', attrs={'name': 'description'})
        description = description_tag.get('content') if description_tag else ''

        og_image_tag = soup.find('meta', attrs={'property': 'og:image'})
        og_image = og_image_tag.get('content') if og_image_tag else ''
        
        # Check if ogImage is not present
        if not og_image:
            favicon_tag = soup.find('link', attrs={'rel': 'icon'})
            if favicon_tag:
                favicon = favicon_tag.get('href')
                if favicon:
                    og_image = urljoin(url, favicon)

        return {
            'title': title,
            'description': description,
            'ogImage': og_image,
        }
    except Exception as e:
        print(f"Error while processing URL {url}: {str(e)}")
        return None 

def find_categories(description, title):
    relevant_categories = []
    for category in categories:
        if description and any(keyword.lower() in description.lower() for keyword in category["keywords"]) or \
           title and any(keyword.lower() in title.lower() for keyword in category["keywords"]):
            relevant_categories.append(category["name"])
    return relevant_categories


def process_urls(urls):
    results_with_cat = []
    results_without_cat = []
    for url in urls:
        metas = get_metas(url)
        if metas:
            if metas['description'] or metas['title']:
                relevant_categories = find_categories(metas['description'], metas['title'])
                result = {"URL": url, "Title": metas['title'], "Description": metas['description'], "Image": metas['ogImage'], "Categories": relevant_categories}
                if len(relevant_categories) > 0:
                    results_with_cat.append(result)
                else:
                    results_without_cat.append(result)
            else:
                result = {"URL": url, "Title": metas['title'], "Description": metas['description'], "Image": metas['ogImage'], "Categories": []}
                results_without_cat.append(result)

    with open('results_with_cat.json', 'w') as f:
        json.dump(results_with_cat, f, ensure_ascii=False, indent=4)

    with open('results_without_cat.json', 'w') as f:
        json.dump(results_without_cat, f, ensure_ascii=False, indent=4)



# Open the JSON file
with open('discord_tools.json', 'r') as file:
    data = json.load(file)

urls = []

# Loop over each entry in the data
for key in data.keys():
    # Check if the entry has an 'e' key
    if 'e' in data[key]:
        # Loop over each entry in the 'e' list
        for e_entry in data[key]['e']:
            # Check if the entry has a 'url' key
            if 'url' in e_entry:
                # Add the 'url' value to the urls list
                urls.append(e_entry['url'])

process_urls(urls)