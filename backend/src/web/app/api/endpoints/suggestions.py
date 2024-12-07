from ...utils.crud import PermissionCrudAPIRouter
# from shared.storage.db.models import Suggestion
from ...schemas.suggestions import UpdateSuggestion, ReadSuggestion
from ...managers import BaseManager

#
# manager = BaseManager()
#
# class Router(PermissionCrudAPIRouter):
#
#
#     def __init__(self, schema: Type[BaseModel], manager: ModelManager, create_schema: Type[BaseModel],
#                  update_schema: Type[BaseModel], **kwargs: Any):
#         super().__init__(schema, manager, create_schema, update_schema, **kwargs)