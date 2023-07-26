import base64
import json
from fastapi import APIRouter, Depends, HTTPException, Response, Request, Body, Header, Security
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union
from app.utils import configParser, globalMethods
from app.database import get_session
from app.utils.globalMethods import AuthNZCheck
from fastapi.responses import PlainTextResponse
from app.logger import log
from fastapi.security import HTTPBearer
from starlette.responses import JSONResponse
from sqlalchemy.exc import NoResultFound
from app.utils.ipDatabase import geoip2Database
# from ..dependencies import get_token_header

router = APIRouter(
    tags=["ams"]
)

logger = log.get_logger("ams")


@router.get("/ams_stats/ams_verification_hash")
async def get_verification(response: Response):

    verification_hash = configParser.getConfig('ams', 'config.global.py')['verification_hash']
    response.status_code = 200
    response.headers["Content-Type"] = "plain/text"
    return PlainTextResponse(verification_hash)


async def verify_authorization_header(authorization: str = Security(HTTPBearer())):
    authkey = configParser.getConfig('ams', 'config.global.py')['auth_key']
    # check authorization
    if (authorization != authkey):
        HTTPException(status_code=401)
        # response.status_code = 401
        # return PlainTextResponse('Client Certificate Authentication Failure')
    return authorization


@router.post("/ams_stats")
async def get_ams_stats(*, 
                        session: Session = Depends(get_session),
                        request: Request, 
                        response: Response, 
                        body = Body(..., example={"name": "Item Name"}),
                        authorization: str = Depends(verify_authorization_header)):

    response.status_code = 200
    # Access the request data
    data = await request.json()
    logger.debug(data)
    print(data)
    for item in data.get("messages", []):
        try:
            decoded_data = base64.b64decode(item.get("message").get("data")).decode()
            logger.debug(decoded_data)
            # Process the data
            print(decoded_data)
            # Convert the JSON-formatted string to a Python dictionary
            data_dict = json.loads(decoded_data)
            process_data(data_dict, session)
        except Exception as e:
            return {"error": f"Error: {e}"}

    return JSONResponse({"message": "Endpoint called successfully"})


def process_data(data, session):
    print(data["date"])
    if ("tenenvId" not in data
        or "type" not in data
        or "eventIdentifier" not in data
        or "source" not in data
        or "tenenvId" not in data):

        raise MissingDataException("One or more required attributes are missing.")

    if "ipAddress" in data:
        # handler for ip databases
        ipDatabaseHandler = geoip2Database()
        countryData = ["", ""]
        # get country code/ name
        countryData[0] = 'UN'
        countryData[1] = 'Unknown'
        try:
            countryData = ipDatabaseHandler.getCountryFromIp(data["ipAddress"])
        except Exception:
            print("Unknown ip Address")
        data["countryCode"] = countryData[0]
        data["countryName"] = countryData[1]
        del data["ipAddress"]
    print(data)
    session.exec(
        """
        INSERT INTO statistics_raw(date, type, event_identifier, source,
        tenenv_id, jsondata)
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}','{5}')
        ON CONFLICT (event_identifier, source, tenenv_id)
        DO NOTHING
        """.format(
            data["date"],
            data["type"],
            data['eventIdentifier'],
            data['source'],
            data['tenenvId'],
            json.dumps(data)
        )
    )
    session.commit()
    
    return JSONResponse({"message": "Endpoint called successfully"})


class MissingDataException(Exception):
    pass