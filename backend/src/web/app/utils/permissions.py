from fastapi import Depends
from fastapi_permissions import Authenticated, Everyone, Allow, configure_permissions
from .users import authenticator


async def get_user_principals(user=Depends(authenticator.get_user())):
    principals = await user.get_principals()
    return principals


AclBatchPermission = [(Allow, 'role:superuser', 'view')]

Permission = configure_permissions(get_user_principals)
