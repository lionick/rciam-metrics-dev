from app.utils import configParser
from sqlmodel import create_engine, SQLModel, Session
from app.utils.globalMethods import g

def get_session():
    # Initialize
    # VOSINFOTABLE = configParser.getConfig('database_parameters')['database_url']
    config_file = 'config.' + g.tenant + '.' + g.environment + '.py'

    url = configParser.getConfig('database_parameters', config_file)['database_url']
    engine = create_engine(url)

    with Session(engine) as session:
        yield session

