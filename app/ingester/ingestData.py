from .communityIngester import CommunityDataIngester
from .usersIngester import UserDataIngester
from .membeshipIngester import MembershipDataIngester
from .loginsIngester import LoginDataIngester

# Ingest Communities
CommunityDataIngester.ingestCommunityData()
# Ingest Users
UserDataIngester.ingestUserData()
# Ingest Memberships
MembershipDataIngester.ingestMembershipData()
# Ingest Logins
LoginDataIngester.ingestLoginData()
