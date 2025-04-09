from strevee import logger, util, globals as __GLOBALS__, constants as __CONST__
from strevee.util import Response, Response200, Response400, Response404

import os

def resolve_path(path:str):
  return os.path.join(__GLOBALS__.root, path[2:]) if (path.startswith('.\\') or path.startswith('./')) else os.path.abspath(path)

def load_file(parser:str, path:str):

  filepath= resolve_path(path)
  if not parser in __GLOBALS__.plugins['file_parsers']: return Response400(f"No registerd file parser for ({parser}), file: {filepath}")
  
  file_parser= __GLOBALS__.parsers[parser]
  logger.log(f"reading file: ({parser}) {filepath}")
  if not 'r' in file_parser.file_mode: return Response400(f"File parser ({parser}) has no READ mode, file: {filepath}")
  if not os.path.exists(filepath): return Response404(f"File not found: {filepath}")
  
  with open(filepath, mode='r' if file_parser.data_mode == 't' else 'rb') as filedata:
    try:
      result= file_parser.read(filedata)
      filedata.close()
      return Response200(result[1])
    except Exception as e: 
      error= f"Error reading data from file: ({parser}) {filepath}"
      logger.err(error, e)
      return Response400(error, {"exception": e})
  return Response400(f"Unknwown error reading file: ({parser}) {filepath}")

def save_file(parser:str, path:str, overwrite:bool=False):

  filepath= resolve_path(path)
  if not parser in __GLOBALS__.parsers: return Response400(f"No registerd file parser for ({parser}), file: {filepath}")
  
  file_parser= __GLOBALS__.parsers[parser]
  logger.log(f"writing file: ({parser}) {filepath}")
  if not 'w' in file_parser.file_mode: return Response400(f"File parser ({parser}) has no WRITE mode, file: {filepath}")
  
  # avoid overwriting if told
  if os.path.exists(filepath) and not overwrite:
    ext= filepath.split('.')[-1]
    filepath_no_ext= filepath[:-(len(ext)+1)]
    n= 1
    while os.path.exists(filepath):
      filepath= f"{filepath_no_ext}_{n}.{ext}"
      n+= 1
    logger.log(f"changed filename to avoid overwriting: {filepath}")
  
  with open(filepath, mode='w' if file_parser.data_mode == 't' else 'wb') as filedata:
    try:
      file_parser.write(filedata)
      filedata.flush()
      filedata.close()
      return Response200({"path": filepath })
    except Exception as e:
      error= f"Error parsing data for writing: ({parser}) {filepath}"
      logger.err(error, e)
      return Response400(error, {"exception": e})
  return Response400(f"Unknwown error writting file: ({parser}) {filepath}")

def register_plugins():
  from strevee.plugin import types as ptypes

  registry_info= {}

  for t in ptypes._TYPES:
    path= os.path.join(__GLOBALS__.path_plugins, t.folder)

    if not os.path.exists(path): os.mkdir(path)
    if not t.folder in __GLOBALS__.plugins: __GLOBALS__.plugins[t.folder]= {}

    plugins_info=[]
    plugins_count=0
    
    for f in os.listdir(path):

      filepath= os.path.join(path, f)

      if not f.endswith(".py"): continue
      try:
        m= util.get_file_as_module(filepath)

        if t.is_subclass(m.__PLUGIN__) and t.is_legit(m.__PLUGIN__):
          plugin= m.__PLUGIN__()
          regdata= plugin.__stv_register__()

          __GLOBALS__.plugins[t.folder][regdata['id']]= [regdata, plugin]

          version= f" | v{regdata['version']} " if 'version' in regdata else ""
          plugins_info.append(f"    [success] {f} | {regdata['id']}{version} -- {os.path.getsize(filepath)}Kb")
          plugins_count+=1
        else: 
          raise Exception("plugin class mismatch")
      except Exception as e:
        logger.err(f"error registering parser {f}:", e)
        plugins_info.append(f"    [failed] not registered: {f} ")

    registry_info[t.folder]= {
      "entry": f"  {t.category} ({t.folder})",
      "list": [*plugins_info],
      "count": plugins_count
    }
    
  plugin_count= sum([v["count"] for v in registry_info.values()])

  logger.logm(f"registered {plugin_count} plugins:", *[ e for pi in registry_info.values() for e in (f"{pi['entry']} [{pi['count']}]:", *pi['list'])  ])
