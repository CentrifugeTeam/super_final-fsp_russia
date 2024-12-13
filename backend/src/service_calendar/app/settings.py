from pathlib import Path
from typing import Optional
from pydantic import FieldValidationInfo, PostgresDsn, field_validator
from pydantic_settings import SettingsConfigDict
from shared.settings import Settings as _Settings

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent.parent.parent


class Settings(_Settings):
    pass

settings = Settings()