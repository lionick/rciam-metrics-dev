from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .country_hashed_user_model import Statistics_Country_Hashed

# TenenvInfo
class TenenvInfoBase(SQLModel):
    name: str
    description: str

class TenenvInfo(TenenvInfoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    #idps: List["Statistics_Country_Hashed"] = Relationship(back_populates="identityprovider_info")

class TenenvInfoRead(TenenvInfoBase):
    id: int

