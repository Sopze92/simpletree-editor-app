from strevee import logger, globals as __GLOBALS__, constants as __CONST__

import os

def load_file(parser, path):

  filepath= os.path.abspath(path)
  file_parser= __GLOBALS__.parsers[parser] if parser in __GLOBALS__.parsers else None
  
  if not file_parser: return (False, {"message": f"No registerd file parser for ({parser}), file: {filepath}"})

  logger.log(f"reading file: ({parser}) {filepath}")
  if not 'r' in file_parser.file_mode: return (False, {"message": f"File parser ({parser}) has no READ mode, file: {filepath}"})
  with open(filepath, mode='r' if file_parser.data_mode == 't' else 'rb') as filedata:
    try:
      result= file_parser.read(filedata)
      filedata.close()
      return (True, result)
    except Exception as e: 
      error= f"Error reading data from file: ({parser}) {filepath}"
      logger.err(error, e)
      return (False, {"message": error, "data": e})
  return (False, {"message": f"Unknwown error reading file: ({parser}) {filepath}"})

def save_file(parser, path, overwrite=False):

  filepath= os.path.abspath(path)
  file_parser= __GLOBALS__.parsers[parser] if parser in __GLOBALS__.parsers else None

  if not file_parser: return (False, {"message": f"No registerd file parser for ({parser}), file: {filepath}"})

  logger.log(f"saving file: ({parser}) {filepath}")

  if not 'w' in file_parser.file_mode: return (False, {"message": f"File parser ({parser}) has no SAVE mode, file: {filepath}"})
  
  # avoid overwriting if told
  if os.path.exists(filepath) and not overwrite:
    ext= filepath.split('.')[-1]
    filepath_no_ext= filepath[:-(len(ext)+1)]
    n= 1
    while os.path.exists(filepath):
      filepath= f"{filepath_no_ext}_{n}.{ext}"
      n+= 1
  
  with open(filepath, mode='w' if file_parser.data_mode == 't' else 'wb') as filedata:
    try:
      file_parser.write(filedata)
      filedata.flush()
      filedata.close()
    except Exception as e:
      error= f"Error parsing data for writing: ({parser}) {filepath}"
      logger.err(error, e)
      return (False, {"message": error, "data": e})
  return (False, {"message": f"Unknwown error writting file: ({parser}) {filepath}"})

def __register_file_parser(path, name, read, write):
  import importlib.util as iu
  try:
    s = iu.spec_from_file_location("module.name", path)
    m = iu.module_from_spec(s)
    s.loader.exec_module(m)

    parser= getattr(m, "__PARSER_NAME__")

    __GLOBALS__.parsers[parser]= getattr(m, "register")()

    logger.log("[parser]", f"registered file parser: {name} ({parser}), (r:{read}, w:{write})")
  except Exception as e:
    logger.err(f"Error registering file parser: {path}: {e}")

def register():
  path= os.path.join(os.path.dirname(__file__), "file_parsers")
  for f in os.listdir(path):
    if not f.endswith(".py") or not '_' in f: continue
    modes, name= f.split('_',1)
    __register_file_parser(os.path.join(path, f), f, 'r' in modes, 'w' in modes)
