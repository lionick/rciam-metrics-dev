from app.utils import configParser
from sqlmodel import create_engine, SQLModel, Session

# Initialize
# VOSINFOTABLE = configParser.getConfig('database_parameters')['database_url']  
url = configParser.getConfig('database_parameters')['database_url']
engine = create_engine(url)

def get_session():
    with Session(engine) as session:
        yield session

