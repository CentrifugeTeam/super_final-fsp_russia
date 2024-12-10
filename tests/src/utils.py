from fastapi.testclient import TestClient
from backend.src.web.app.app import app
from backend.src.service_calendar.app.app import app as calendar_app

web_api_client = TestClient(app)

calendar_api_client = TestClient(calendar_app)
