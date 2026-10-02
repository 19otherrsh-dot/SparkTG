import requests

# Send message to LLM to test tool calling
response = requests.post("http://localhost:8000/api/chat", json={
    "messages": [
        {"role": "user", "content": "Can you categorize my recent uncategorized transactions?"}
    ]
})

print(response.json())
