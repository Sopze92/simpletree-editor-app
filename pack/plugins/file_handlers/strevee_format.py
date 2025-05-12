from strevee import util

from strevee._reftypes import *

from strevee.api import DictObject
from strevee.plugins import constants as __PLUGIN_CONST__
from strevee.plugins.types import FileHandlerPlugin

import os
import json
from io import IOBase, StringIO

'''
Main sTrevee fileparser for read/write its own files
'''

class __PLUGIN__(FileHandlerPlugin):

  # TODO: make it internally packed instead of plugin
  # TODO: file writer

  def register(self):
    return {
      'id': "__strevee__",
      'author': "sTrevee",
      'version': "0.1.0",
      'filetypes': [
        {
          'id': "ft_strevee_doc",
          'label': "sTrevee Document",
          'types': ["stv"],
          'domain': 'document',
          'drop': True,
          'tasks':{
            'read': "h_read_doc",
            'write': "h_write_doc"
          }
        },
        {
          'id': "ft_strevee_lib",
          'label': "sTrevee Document (Library)",
          'types': ["stv"],
          'domain': 'library',
          'tasks':{
            'read': "h_read_lib",
            'write': "h_write_lib"
          }
        }
      ],
      'handlers': [
        { 
          'id': "h_read_doc", 
          'task': 'read', 
          'passes': [
            { 'name': "p_header", 'mode': 'stv_bytes' },
            { 'name': "p_read", 'mode': 'stv_bytes' }
          ]
        },
        {
          'id': "h_write_doc", 
          'task': 'write',
          'passes': [
            { 'name': "p_write", 'mode': 'stv_bytes' }
          ]
        },
        { 
          'id': "h_read_lib", 
          'task': 'read', 
          'passes': [
            { 'name': "p_header", 'mode': 'stv_bytes' },
            { 'name': "p_read", 'mode': 'stv_bytes' }
          ]
        },
        {
          'id': "h_write_lib",
          'task': 'write',
          'passes': [
            { 'name': "p_write", 'mode': 'stv_bytes' }
          ]
        }
      ]
    }
  
  def read(self, filedata:IOBase, context:Ref_FhContext_R):

    _pi= context.active_pass.index
    if _pi== 0:
    
      jdata= json.loads(filedata.read())

      attrs= {str(i):{'name':v[0], 'cid': v[1], 'config': v[2] } for i,v in enumerate(jdata['attrs']) }
      types= {str(i):{'name':v[0], 'cid': v[1], 'config': v[2], 'attrs': v[3]} for i,v in enumerate(jdata['types']) }

      tree= {str(i):v for i,v in enumerate(jdata['tree']) }
      tree['root']= {**jdata['root']}

      meta= {
        **jdata['meta'],
        'name': f"{context.file.filename}.{context.file.extension}",
        'rtime': util.current_time_millis()
      }

      meta['rnum']= meta['rnum']+1 if 'rnum' in meta else 1

      return {'result':{'data':{ 'meta':meta, 'attrs':attrs, 'types':types, 'tree':tree }}}
    
    return {'result':{'error':f"pass index {_pi} is not handled"}}

  def write(self, filedata, context:Ref_FhContext_W):

    _pi= context.active_pass.index
    if _pi== 0:

      clen= 0

      oattr, oattr_k2i, nattr= (filedata['attrs'], {}, [])

      for i, (k, v) in enumerate(oattr.items()):
        oattr_k2i[k]=i
        nattr.append([v['name'], v['cid'], v['config']])

      otype, otype_k2i, ntype= (filedata['types'], {}, [])

      for i, (k, v) in enumerate(otype.items()):
        otype_k2i[k]=i
        ntype.append([v['name'], v['cid'], v['config'], v['attrs']])
        clen= len(v['attrs']) if 'attrs' in v else 0
        if clen > 0:
          for i in range(clen): 
            v['attrs'][i]= oattr_k2i[str(v['attrs'][i])]

      oroot, nroot= ({**filedata['tree']['root']}, {})
      del filedata['tree']['root']
      otree, otree_k2i, ntree= (filedata['tree'], {}, [])

      for i, (k, v) in enumerate(otree.items()):
        otree_k2i[k]=i
        ntree.append(v)

      clen= len(oroot['body']) if 'body' in oroot else 0
      if clen > 0:
        nroot['body']= [-1]*clen
        for i in range(clen):
          nroot['body'][i]= otree_k2i[str(oroot['body'][i])]

      for e in ntree:
        e['type']= otype_k2i[str(e['type'])]
        clen= len(e['body']) if 'body' in e else 0
        if clen > 0:
          for i in range(clen): 
            e['body'][i]= otree_k2i[str(e['body'][i])]

      filedata['attrs']= nattr
      filedata['types']= ntype
      filedata['tree']= ntree
      filedata['root']= nroot

      m= filedata['meta']
      m['wtime']= util.current_time_millis()
      m['wnum']= m['wnum']+1 if 'wnum' in m else 1

      return {'result':{'encoding':'stv_text', 'data': json.dumps(filedata, indent=2)}}
  
    return {'result':{'error':f"pass index {_pi} is not handled"}}