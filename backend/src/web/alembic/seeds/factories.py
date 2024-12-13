from faker import Faker
from polyfactory import Ignore, Use, AsyncPersistenceProtocol
from shared.storage.db.models import Team, District, SportEvent, EventType, User, TeamSolution, Location, \
    TeamParticipation, Area, UserTeams
from web.app.schemas.users import CreateUser
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from polyfactory.factories.pydantic_factory import ModelFactory, T

faker = Faker('ru_RU')


class BaseFactory(SQLAlchemyFactory):
    id = Ignore()
    __set_foreign_keys__ = False
    __is_base_factory__ = True


class UserFactory(BaseFactory):
    __model__ = User
    id = Ignore()
    username = Use(faker.unique.user_name)
    first_name = Use(faker.first_name)
    middle_name = Use(faker.middle_name)
    last_name = Use(faker.last_name)
    email = Use(faker.unique.email)
    photo_url = None
    area_id = Ignore()
    team_id = Ignore()


class TeamSolutionFactory(BaseFactory):
    __model__ = TeamSolution
    id = Ignore()
    score = Use(faker.pyint, min_value=0, max_value=100, step=1)


class LocationFactory(BaseFactory):
    __model__ = Location
    id = Ignore()
    city = Use(faker.unique.city)
    country = Use(lambda: "Россия")
    region = Use(faker.unique.region)


class SportFactory(BaseFactory):
    __model__ = SportEvent
    id = Ignore()
    name = Use(faker.unique.word)
    format = Use(LocationFactory.__random__.choice, ['офлайн', 'онлайн', 'оба'])
    type_event_id = Ignore()
    location_id = Ignore()


class Factory(BaseFactory):
    __model__ = Team
    name = Use(faker.unique.word)
    photo_url = None
    id = Ignore()
    area_id = Ignore()


class UserModelFactory(ModelFactory):
    __model__ = CreateUser
    about = None
    photo_url = None
    email = Use(faker.unique.email)


class DistrictFactory(BaseFactory):
    __model__ = District
    id = Ignore()
    name = Use(faker.address)


class AreaFactory(BaseFactory):
    __model__ = Area
    id = Ignore()
    name = Use(faker.city)
    photo_url = None
    contacts = None
    district_id = Ignore()
