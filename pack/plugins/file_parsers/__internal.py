from strevee import util, constants as __CONST__

from strevee.plugin import constants as __PLUGIN_CONST__
from strevee.plugin.types import FileParserPlugin

import os

'''
This is just a simple fileparser for read/write the internal .ini files, such as the ones in ./root/
'''

class __PLUGIN__(FileParserPlugin):

  # TODO: make it internally packed instead of plugin
  # TODO: file writer

  def register(self)->dict:
    return {
      "id": "__internal",
      "version": "0.1.0",
      "parsers_data": [
        {
          "mode": __PLUGIN_CONST__.FILEPARSER_MODE_READ,
          "func": self.read
        },
        {
          "mode": __PLUGIN_CONST__.FILEPARSER_MODE_WRITE,
          "func": self.write
        }
      ],
      
    }

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

  def write(self)-> bytes:
    return b'hello_world'