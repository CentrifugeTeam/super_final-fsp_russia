from .teams import TeamsRouter
from .team_solutions import TeamSolutionsRouter


r = TeamsRouter()
r.include_router(TeamSolutionsRouter(), prefix='/solutions', tags=['solutions'])