from strevee import util, constants as __CONST__
from strevee.types import FileParser

import os

__PARSER_NAME__= "internal"

class __PARSER__(FileParser):

  def read(self, data:str) -> tuple[int, dict]:
    lines= data.readlines()

    result= {}
    header= -1
    mode= None
    line_parser= lambda l: ...

    for i, line in enumerate(lines):

      line= line.strip().replace('\n','').replace('\r','')
      if line[0]== '#' or len(line)==0: continue # comment / empty

      if header < 0:
        mode= line[1:-1] if len(line) > 2 else None
        if not mode: return (False, "bad file header")
        if not mode in ('settings', 'session', 'recents'): return (False, f"unrecognised file mode: {mode} on line 0")
        header= i
        break

    # -- helpers

    def parse_line_vars(line):
      k, v= line.split('=',1)
      t, k= k.lower().split(':',1)
      result[k]= util.get_typed_value_from_str(t, v)

    def parse_line_file(line):
      m, fp= line.split('=',1)
      i, p= m.split(':')
      result[int(i)]= { "parser":p, "path":fp, "exists":os.path.exists(fp), "dirname":os.path.dirname(fp), "name":os.path.basename(fp) }

    # --

    if mode in ('settings', 'session'): line_parser= parse_line_vars
    elif mode == 'recents': line_parser= parse_line_file
    
    for line in lines[header+1:]:

      line= line.strip().replace('\n','').replace('\r','')
      if line[0]== '#' or len(line)==0: continue # comment / empty

      line_parser(line)

    return (True, result)

def register():
  return __PARSER__(
      file_mode= 'rw', data_mode= 't',
      open_mode= __CONST__.OPENMODE_INTERNAL,
      save_mode= __CONST__.SAVEMODE_NONE,
    )