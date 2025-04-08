from strevee import constants as __CONST__
from strevee.types import FileParser

__PARSER_AME__= "strevee"

class __PARSER__(FileParser):
  ...

def register():
  return __PARSER__(
      file_mode= 'rw', data_mode= 'b',
      open_mode= __CONST__.OPENMODE_OPEN,
      save_mode= __CONST__.SAVEMODE_SAVE,
    )