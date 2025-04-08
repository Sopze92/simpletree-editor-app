from strevee import util, constants as __CONST__
from strevee.types import FileParser

__PARSER_NAME__= "internal"

class __PARSER__(FileParser):

  def read(self, data:str) -> tuple[bool, dict]:
    result= {}
    for l in data.readlines():
      l= l.replace('\n','').replace('\r','')
      t, d= l.split(':',1)
      k, v= d.split('=',1)
      t= t.lower()
      k= k.lower()
      result[k]= util.getTypedValueStr(t, v)
    return (True, result)

def register():
  return __PARSER__(
      file_mode= 'rw', data_mode= 't',
      open_mode= __CONST__.OPENMODE_INTERNAL,
      save_mode= __CONST__.SAVEMODE_NONE,
    )