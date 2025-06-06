from pathlib import Path
from typing import Optional
from pydantic import FieldValidationInfo, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env", case_sensitive=True, extra="allow"
    )
    # PostgreSQL Database Connection
    JWT_PRIVATE_KEY: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    REDIS_HOST: str
    REDIS_PORT: int
    SQLALCHEMY_DATABASE_URL: str | None = None
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_PASSWORD: str
    SMTP_SENDER: str
    DOMAIN_URI: str





    @field_validator("SQLALCHEMY_DATABASE_URL", mode="before")
    def assemble_db_connection_string(
        cls, value: PostgresDsn, info: FieldValidationInfo
    ) -> str:
        if isinstance(value, str):
            return value
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=info.data["POSTGRES_USER"],
                password=info.data["POSTGRES_PASSWORD"],
                host=info.data["POSTGRES_HOST"],
                port=info.data["POSTGRES_PORT"],
                path=info.data["POSTGRES_DB"],
            )
        )


