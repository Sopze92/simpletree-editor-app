from strevee import logger, globals as __GLOBALS__, constants as __CONST__
from strevee.types import Response, Response200, Response400, Response404

import os

def resolve_path(path:str):
  return os.path.join(__GLOBALS__.root, path[2:]) if (path.startswith('.\\') or path.startswith('./')) else os.path.abspath(path)

def load_file(parser:str, path:str):

  filepath= resolve_path(path)
  if not parser in __GLOBALS__.parsers: return Response400(f"No registerd file parser for ({parser}), file: {filepath}")
  
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

def __register_file_parser(path, name, read, write):
  import importlib.util as iu
  try:
    s = iu.spec_from_file_location("module.name", path)
    m = iu.module_from_spec(s)
    s.loader.exec_module(m)

    parser= getattr(m, "__PARSER_NAME__")

    __GLOBALS__.parsers[parser]= getattr(m, "register")()

    return f"  [success] {name} ({parser}), {'read' if read else ""} {'write' if write else ''}"
  except Exception as e:
    print(f"error registering parser {name}: ", e)
    return f"  [failed] not registered: {name}"

def register():
  path= os.path.join(__GLOBALS__.path_plugins, "file_parsers")
  logger.log(f"gathering file parsers from: {path}")
  if not os.path.exists(path):
    logger.log(f"no user file parsers directory")
    return
  
  parser_info= []
  for f in os.listdir(path):
    if not f.endswith(".py") or not '_' in f: continue
    modes= f.split('_',1)[0]
    r= 'r' in modes
    w= 'w' in modes
    if not (r or w):
      logger.wrn("found a parser without read nor write abilities, skipped") 
      continue
    info= __register_file_parser(os.path.join(path, f), f, 'r' in modes, 'w' in modes)
    parser_info.append(info)
  logger.logm(f"registered {len(__GLOBALS__.parsers)} file parsers:", *parser_info)
