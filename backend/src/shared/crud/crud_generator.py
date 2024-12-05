from abc import ABC, abstractmethod
from typing import Any, Callable, Generic, List, Optional, Type, Union, TypeVar, TypedDict

from fastapi import APIRouter, HTTPException, status
from fastapi.params import Depends
from fastapi.types import DecoratedCallable
from fastapi_sqlalchemy_toolkit import ModelManager
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from .openapi_responses import not_found_response


class CRUDTemplate(APIRouter):

    def __init__(
            self,
            schema: Type[BaseModel],
            manager: ModelManager,
            get_session: Callable,
            create_schema: Type[BaseModel],
            update_schema: Type[BaseModel],
            **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)

        self.schema = schema
        self.create_schema = create_schema
        self.update_schema = update_schema
        self.manager = manager
        self.get_session = get_session

        for route in self._register_routes():
            route()

    @abstractmethod
    def _get_all(self) -> Callable[..., Any]:
        raise NotImplementedError

    @abstractmethod
    def _get_one(self) -> Callable[..., Any]:
        raise NotImplementedError

    @abstractmethod
    def _create(self) -> Callable[..., Any]:
        raise NotImplementedError

    @abstractmethod
    def _update(self) -> Callable[..., Any]:
        raise NotImplementedError

    @abstractmethod
    def _delete_one(self) -> Callable[..., Any]:
        raise NotImplementedError

    @abstractmethod
    def _delete_all(self) -> Callable[..., Any]:
        raise NotImplementedError



    def _register_routes(self) -> list[Callable[..., Any]]:
        return [
            self._get_all, self._get_one, self._create, self._update, self._delete_one, self._delete_all
        ]
