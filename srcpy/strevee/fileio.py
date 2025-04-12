from strevee import logger, util, globals as __GLOBALS__, constants as __CONST__
from strevee.types import DictObject

from strevee.exceptions import *

import os
from io import BytesIO, StringIO

def get_file_as_module(path):
  import importlib.util as iu
  name= f"module_{os.path.basename(path)[:-3]}"
  s = iu.spec_from_file_location(name, path)
  m = iu.module_from_spec(s)
  s.loader.exec_module(m)
  return m

def resolve_path(path:str):
  return os.path.join(__GLOBALS__.root, path[2:]) if (path.startswith('.\\') or path.startswith('./')) else os.path.abspath(path)

def load_file_internal(path:str):
  try: return load_file("__internal__:ft_internal", path, '_internal', {}), 200
  except Exception as e: 
    logger.err(e)
    if __GLOBALS__.dev_traceback:
      import traceback
      traceback.print_exc()
    return None, 404 if isinstance(e, (FileNotFoundError, FileHandlerNotFoundError)) else 400

def load_file(filetype_id:str, path:str, trigger, settings): # RAISEABLE

  filepath= resolve_path(path)
  if not os.path.exists(filepath): raise FileNotFoundError(f"File not found: {filepath}")

  pid, fid= filetype_id.split(':')
  if not pid in __GLOBALS__.file_handlers: raise FileHandlerNotFoundError(f"No registered file handler with id '{filetype_id}', file: {filepath}") 

  package= __GLOBALS__.file_handlers[pid]

  # get filetype
  filetype_list= tuple(e for e in package.filetypes if e.id == fid and e.reader)
  if not filetype_list: raise FileHandlerError(f"file handler with id '{pid}' has no filetype with id '{fid}', file: {filepath}") 
  if len(filetype_list) > 1: raise FileHandlerError(f"file handler with id '{pid}' has ambiguous filetypes under same id: '{fid}', file: {filepath}") 

  filetype= filetype_list[0]
  hid= filetype.reader

  # get handler
  handler_list= tuple(e for e in package.handlers if e.id == hid and e.type=='read')
  if not handler_list: raise FileHandlerError(f"file handler with id '{pid}' has no 'read' handler with id '{fid}', file: {filepath}") 
  if len(handler_list) > 1: raise FileHandlerError(f"file handler with id '{pid}' has ambiguous 'read' handlers under same id: '{hid}', file: {filepath}") 

  handler= handler_list[0]

  if not handler.passes: raise FileHandlerError(f"file handler with id '{pid}' has ambiguous 'read' handlers under same id: '{hid}', file: {filepath}") 

  logger.log(f"reading: {filepath}, handler: {pid}:{hid}@{fid}")

  # setup

  id_str= f"{pid}:{hid} ({fid})"

  f= os.path.basename(filepath)
  dot= f.rfind('.')
  f= f[:dot] if dot != -1 else f
  ext= f[dot+1:] if dot != -1 else None

  pass_fstream:StringIO | BytesIO= None
  pass_context= DictObject({
    "id": { 'package':pid, 'filetype':fid, 'handler':hid },
    "file": { 'filename': f, 'extension': ext, 'size': os.path.getsize(filepath) },
    "trigger": trigger,
    "settings": { "__KEEPDICT__":None, **settings },
    "filetype": filetype,
    "passes": tuple(handler.passes),
    "active_pass": None,
    "drop": None,
    "data": None
  })

  mode_switch_allowed= True
  times_passes_overriden= 0
  is_last_pass= False
  active_mode= 'stv_bytes'

  i= pi= 0

  js_result= DictObject({
    'success': False,
    'message': None,
    'content': None
  })

  # get file as bytes

  with open(filepath, 'rb') as fb:
    pass_fstream= BytesIO(fb.read())
    fb.close()

  # execute passes

  while pi < len(pass_context.passes):
    
    p= pass_context.passes[pi]
    pass_context.active_pass= DictObject({ 'index': i, 'name': p.name, 'mode': p.mode })
    
    exception_data= (id_str, pi, p, times_passes_overriden)

    is_last_pass= pi == len(pass_context.passes)-1

    if mode_switch_allowed:
      new_mode= 'utf-8' if p.mode == 'stv_text' else p.mode

      if active_mode != new_mode:
        if active_mode == 'stv_bytes': pass_fstream= StringIO(pass_fstream.read().decode(new_mode))
        elif new_mode != 'stv_bytes': pass_fstream= StringIO(pass_fstream.read().encode(active_mode).decode(new_mode))
        else: pass_fstream= BytesIO(pass_fstream.read().encode(active_mode))
        active_mode= new_mode
      
    outdata= package.__INSTANCE__.read(pass_fstream, pass_context)

    # simple bool result
    if isinstance(outdata, bool):
      if outdata: continue
      else: break

    # pass data result
    if isinstance(outdata, dict) and util.check_dict_surface(outdata, _dictsurface_pass_readwrite_out, False, True):

      skip= False

      if 'passes' in outdata:
        pass_context.passes= _get_passes(outdata['passes'], exception_data) # ---- raises if fail
        pi= 0
        times_passes_overriden+=1
        is_last_pass= False
        skip= True

      if 'data' in outdata: pass_context.data= outdata['data']
      if 'filedata' in outdata: 
        pass_fstream= outdata['filedata']
        mode_switch_allowed= False

      if 'result' in outdata:
        result= outdata['result']
        if 'error' in result: 
          js_result.message= result['error']
          js_result.success= False
          logger.err(result['error'])
        else:
          js_result.success= True
          if 'message' in result: js_result.message= result['message']
          if 'data' in result: js_result.content= result['data']
        break
      elif is_last_pass:
        if not filetype.domain == 'user': raise FileHandlerInvalidPassReturnError("last pass must return the resulting data")

      if skip: continue
        
    elif is_last_pass:
      if not filetype.domain == 'user': raise FileHandlerInvalidPassReturnError("last pass must return the resulting data")
      else: return outdata # return user-defined thing
  
    i+=1
    pi+=1

    if i > __CONST__.FILEHANDLER_MAX_ITERATIONS: raise FileHandlerTooManyPassIterationsError(*exception_data)

  return js_result.dict() # return intentional js_object to be used in frontend

def save_file(parser:str, path:str, overwrite:bool=False):
  ...

def register_plugins():
  from strevee.plugins import types as ptypes

  plugin_summary= {}

  # plugin types
  for t in ptypes.registry():
    path= os.path.join(__GLOBALS__.path_plugins, t.folder)

    if not os.path.exists(path): os.mkdir(path)
    if not hasattr(__GLOBALS__, t.folder): setattr(__GLOBALS__, t.folder, {})

    plugins_info=[]
    plugins_count=0
    
    # plugins of type
    for f in os.listdir(path):

      filepath= os.path.join(path, f)

      if not f.endswith(".py"): continue
      try:
        m= get_file_as_module(filepath)

        if not hasattr(m, "__PLUGIN__"): 
          logger.wrn(f"skipping file: {os.path.basename(filepath)}, reason: no __PLUGIN__ defined, if its a helper file, please consider placing it on a subfolder")
          continue

        if t.is_subclass(m.__PLUGIN__) and t.is_legit(m.__PLUGIN__):
          plugin= m.__PLUGIN__()

          regdata= plugin.__stv_reg__()
          if not regdata: raise Exception("plugin didn't provide any registry data")

          metadata= t.create_metadata(regdata, plugin)
          __GLOBALS__.__dict__[t.folder][regdata['id']]= DictObject(metadata)

          plugins_info.append(f"    [success] {f} [ {regdata['author']} - {regdata['id']} | {regdata["version"]} ] ({os.path.getsize(filepath)}Kb)")
          plugins_count+=1
        else: 
          raise Exception("plugin class mismatch")
      except Exception as e:
        logger.err(f"error registering plugin {f} ({t.category}): {e}")
        plugins_info.append(f"    [failed] not registered: {t.folder} -- {f} | {e}")

        if __GLOBALS__.dev_traceback:
          import traceback
          traceback.print_exc()

    plugin_summary[t.folder]= {
      "entry": f"  {t.category} ({t.folder})",
      "list": [*plugins_info],
      "count": plugins_count
    }
    
  plugin_count= sum([v["count"] for v in plugin_summary.values()])

  if plugin_count > 0: logger.logm(f"registered {plugin_count} {'plugin' if plugin_count == 1 else 'plugins'}:", *[ e for pi in plugin_summary.values() for e in (f"{pi['entry']} [{pi['count']}]:", *pi['list'])  ])
  else: logger.log("no plugins registered")

# helpers
def _get_passes(new_passes, exception_data):
  if not (isinstance(new_passes, list) or isinstance(new_passes, tuple)): raise FileHandlerPassError(*exception_data, "the provided passlist is not either a list or tuple")
  if len(new_passes) == 0: raise FileHandlerPassError(*exception_data, "provided empty passlist as override")
  _pt= (e for e in new_passes if not isinstance(e, dict) or (not e.hasattr['name'] or not type(e['name']==str)) or (not e.hasattr['mode'] or not type(e['mode']==str)) or len(e.keys()) > 2)
  if len(_pt) > 0: raise FileHandlerPassListError(*exception_data, _pt)
  return tuple(DictObject(e) for e in new_passes)

# other

_dictsurface_pass_drop_out= ('error', 'settings', 'data', 'result')
_dictsurface_pass_readwrite_out= ('error', 'passes', 'filedata', 'data', 'result')
