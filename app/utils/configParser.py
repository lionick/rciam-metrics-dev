import os
from configparser import RawConfigParser
from app.utils.fastapiGlobals import g

# TODO: We need to cache the content of the file
def getConfig(section='source_database', config_file='config.py'):

  # create a parser
  parser = RawConfigParser()

  # XXX Since Entitlement contain both colons(:) and equal signs
  #     we will configure the semi colon (;) as a delimiter for
  #     the case of authorize configuration.
  #     Which means that we have to modify the comment prefix as well
  if "authorize" in config_file:
    parser = RawConfigParser(delimiters=';', comment_prefixes='%%', )
  # print(sys.argv[0])
  # print(os.path.dirname(os.path.abspath(sys.argv[0])))
  # read config file
  file_dir = os.path.dirname(os.path.realpath('__file__'))
  parser.read(os.path.join(file_dir, config_file))

  # get section, default to source_database
  config = {}

  if parser.has_section(section):

    params = parser.items(section)
    for param in params:
      config[param[0]] = param[1]

  else:
    raise Exception(
      'Section {0} not found in the {1} file'.format(section, config_file))

  return config
