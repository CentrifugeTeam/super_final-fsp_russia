from pathlib import Path
from typing import Optional
from shared.settings import Settings as _Settings
from pydantic import FieldValidationInfo, PostgresDsn, field_validator


class Settings(_Settings):
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_PASSWORD: str
    SMTP_SENDER: str


settings = Settings()
