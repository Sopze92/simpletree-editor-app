from strevee import constants as __CONST__
from strevee.plugin.types import FileParserPlugin

class __PLUGIN__(FileParserPlugin):

  def register(self)->dict:
    return {
      "id": "strevee_filehandler"
    }