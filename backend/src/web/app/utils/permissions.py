from fastapi import Depends
from fastapi_permissions import Authenticated, Everyone, Allow, configure_permissions
from .users import authenticator


async def get_user_principals(user=Depends(authenticator.get_user(active=True))):
    principals = await user.principals()
    principals = principals + [Authenticated, Everyone]
    return principals


AclBatchPermission = [(Allow, 'role:admin', 'view')]

Permission = configure_permissions(get_user_principals)
