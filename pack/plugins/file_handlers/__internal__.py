from strevee import util

from strevee._reftypes import *

from strevee.plugins import constants as __PLUGIN_CONST__
from strevee.plugins.types import FileHandlerPlugin

import os
from io import IOBase

'''
Simple fileparser for read/write the internal .ini files, such as the ones in ./root/
'''

class __PLUGIN__(FileHandlerPlugin):

  # TODO: make it internally packed instead of plugin
  # TODO: file writer

  def register(self):
    return {
      'id': "__internal__",
      'author': "sTrevee",
      'version': "0.3.0",
      'filetypes': [
        {
          'id': "ft_internal",
          'domain': '__internal__',
          'tasks':{
            'read': "h_read",
            'write': "h_write"
          }
        }
      ],
      'handlers': [
        { 
          'id': "h_read", 
          'task': 'read', 
          'passes': [
            { 'name': "p_header", 'mode': 'stv_text' },
            { 'name': "p_read", 'mode': 'stv_text' }
          ]
        },
        {
          'id': "h_write", 
          'task': 'write',
          'passes': [
            { 'name': "p_write", 'mode': 'stv_text' }
          ]
        }
      ],
    }

  def read(self, filedata:IOBase, context:Ref_FhContext_R):

    pi= context.active_pass.index

    # pass 0: header
    if pi == 0:

      header= -1
      mode= None
      i=0

      while True:

        line= filedata.readline()
        if not line: break

        line= line.strip().replace('\n','').replace('\r','')
        if line[0]== '#' or len(line)==0: continue # comment / empty

        if header < 0:
          mode= line[1:-1] if len(line) > 2 else None
          if not mode: return (False, "bad file header")
          if not mode in ('settings', 'session', 'recents'): return {'result':{'error':f"header indicates an unknown file mode: {mode}"}}
          header= i
          return {'data': {'mode': mode}}
        
        i+=1
        
      return {'result':{'error':"unable to read file header: reached the end of the file"}}
    
    # pass 1: data
    elif pi == 1:

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

      result= {}
      line_parser= lambda l:...
      mode = context.data['mode']

      if mode in ('settings', 'session'): line_parser= parse_line_vars
      elif mode == 'recents': line_parser= parse_line_file
      else: return {'result':{'error':f"tried to read with an unknown file mode: {mode}"}}
      
      while True:

        line= filedata.readline()
        if not line: break

        line= line.strip().replace('\n','').replace('\r','')
        if line[0]== '#' or len(line)==0: continue # comment / empty

        line_parser(line)

      return {'result': {'data': result} }
    
    return {'result':{'error':f"pass index {pi} is not handled"}}

  def write(self, filedata, context:Ref_FhContext_W):
    return b'hello_world'