import os
from locust import HttpUser, task, between

TOKEN = os.environ.get("GATEWAY_TOKEN", "")

class GatewayUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def cached_request(self):
        self.client.post(
            "/v1/chat/completions",
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": "What is machine learning?"}]
            },
            headers={"Authorization": f"Bearer {TOKEN}"},
            stream=True
        )

    @task(1)
    def health_check(self):
        self.client.get("/health")