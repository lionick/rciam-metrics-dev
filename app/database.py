from app.utils import configParser
from sqlmodel import create_engine, Session


def get_session():
    # Initialize
    config_file = 'config.global.py'

    url = configParser.getConfig('database_parameters', config_file)['database_url']
    engine = create_engine(url)

    with Session(engine) as session:
        yield session
