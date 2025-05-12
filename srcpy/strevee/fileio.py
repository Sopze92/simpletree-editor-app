from strevee import util
from strevee.types import DictObject

from strevee.exceptions import *

import os
from io import BytesIO, StringIO

# ----------------------------------------------------------------------------------------------------------------------- general

def get_file_as_module(path):
  import importlib.util as iu
  name= f"module_{os.path.basename(path)[:-3]}"
  s = iu.spec_from_file_location(name, path)
  m = iu.module_from_spec(s)
  s.loader.exec_module(m)
  return m

# copy file without importing any lib
def file_copy(path_src, path_dst):
  with open(path_src, 'rb') as fsrc:
    with open(path_dst, 'wb') as fdst:
      fdst.write(fsrc.read())
      fdst.close()
    fsrc.close()

def try_copy_default(filepath):
  _f= os.path.basename(filepath)
  _df= os.listdir(stv_globals.path_defaults)
  if _f in _df: file_copy(os.path.join(_df, _f), filepath)

# ----------------------------------------------------------------------------------------------------------------------- read file

# should be only used internally
def file_read_internal(path:str, silent:bool):
  try: 
    return 200, file_read("__internal__:ft_internal", path, '_internal', {}, True)
  except Exception as e: 
    if not silent:
      stv_logger.err(e)
      if stv_globals.dev_traceback:
        import traceback
        traceback.print_exc()
    return 404 if isinstance(e, FileNotFoundError) else 400, {'success':False, 'message':str(e), 'content':None}
  
# general front-end file reader
def file_read_general(filetype_id:str, path:str, trigger:str, settings:dict={}):
  try: 
    return 200, file_read(filetype_id, path, trigger, settings, False)
  except Exception as e: 
    stv_logger.err(e)
    if stv_globals.dev_traceback:
      import traceback
      traceback.print_exc()
    return 404 if isinstance(e, FileNotFoundError) else 400, {'success':False, 'message':str(e), 'content':None}

# -------------------------------------------------------- READER

def file_read(filetype_id:str, path:str, trigger:str, settings:dict, search_default:bool): # RAISEABLE
  
  filepath= util.resolve_path(path)
  if not os.path.exists(filepath) and (not search_default or not try_copy_default(filepath)): raise FileNotFoundError(f"File not found: {filepath}")

  pid, fid, hid, fullid, package, filetype, handler = _get_filehandler(filetype_id, 'read')
  stv_logger.log(f"reading: {filepath}, handler: {fullid}")

  # setup

  file, ext= util.split_extension(os.path.basename(filepath))

  pass_fstream:StringIO | BytesIO= None
  pass_context= DictObject({
    "id": { 'package':pid, 'filetype':fid, 'handler':hid },
    "file": { 'filename': file, 'extension': ext, 'size': os.path.getsize(filepath) },
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
  active_mode= 'utf-8' if pass_context.passes[0].mode == 'stv_text' else pass_context.passes[0].mode

  i= pi= 0

  js_result= DictObject({
    'success': False,
    'message': None,
    'content': None
  })

  # get file as bytes

  fbytes= active_mode=='stv_bytes'

  with open(filepath, 'rb' if fbytes else 'r') as fb:
    pass_fstream= BytesIO(fb.read()) if fbytes else StringIO(fb.read())
    fb.close()

  # execute passes

  while pi < len(pass_context.passes):
    
    p= pass_context.passes[pi]
    pass_context.active_pass= DictObject({ 'index': i, 'name': p.name, 'mode': p.mode })
    
    exception_data= (fullid, pi, p, times_passes_overriden)

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
          stv_logger.err(result['error'])
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

    if i > stv_const.FILEHANDLER_MAX_ITERATIONS: raise FileHandlerTooManyPassIterationsError(*exception_data)

  return js_result.to_dict() # return intentional js_object to be used in frontend

# ----------------------------------------------------------------------------------------------------------------------- write file
  
# should be only used internally
def file_write_internal(path:str, silent:bool):
  try: 
    return 200, file_write("__internal__:ft_internal", path, '_internal', {}, True)
  except Exception as e: 
    if not silent:
      stv_logger.err(e)
      if stv_globals.dev_traceback:
        import traceback
        traceback.print_exc()
    return 400, {'success':False, 'message':str(e), 'content':None}
  
# general front-end file writer
def file_write_general(data, filetype_id:str, path:str, trigger:str, settings:dict, overwrite:bool):
  try: 
    return 200, file_write(data, filetype_id, path, trigger, settings, overwrite)
  except Exception as e: 
    stv_logger.err(e)
    if stv_globals.dev_traceback:
      import traceback
      traceback.print_exc()
    return 400, {'success':False, 'message':str(e), 'content':None}
  
# -------------------------------------------------------- WRITER

def file_write(data, filetype_id:str, path:str, trigger:str, settings:dict, overwrite:bool):
  
  filepath= util.resolve_path(path)
  dirpath= os.path.dirname(filepath)
  if not os.path.exists(dirpath): os.makedirs(dirpath)

  fn= os.path.basename(filepath)
  dot= fn.rfind('.')
  f= fn[:dot] if dot != -1 else f
  ext= fn[dot+1:] if dot != -1 else None

  if os.path.exists(filepath) and (not overwrite or trigger in ('save_inc','export_inc','backup')):
    n= 1
    while os.path.exists(filepath):
      nf= f"{f}_{n:03}"
      filepath= f"{nf}{f'.{ext}' if ext else ''}"
      n+= 1
    f= nf
    stv_logger.log(f"changed filename to avoid overwriting: {nf}")

  pid, fid, hid, fullid, package, filetype, handler = _get_filehandler(filetype_id, 'write')
  stv_logger.log(f"writing: {filepath}, handler: {fullid}")

  # setup

  file, ext= util.split_extension(os.path.basename(filepath))

  pass_data= data
  pass_context= DictObject({
    "id": { 'package':pid, 'filetype':fid, 'handler':hid },
    "file": { 'filename': file, 'extension': ext },
    "trigger": trigger,
    "settings": { "__KEEPDICT__":None, **settings },
    "filetype": filetype,
    "passes": tuple(handler.passes),
    "active_pass": None,
    "data": None
  })

  mode_switch_allowed= True
  times_passes_overriden= 0
  is_last_pass= False
  active_mode= None

  i= pi= 0

  js_result= DictObject({
    'success': False,
    'message': None,
    'content': None,
    'encoding': None,
  })

  # open temp file to write

  while pi < len(pass_context.passes):

    p= pass_context.passes[pi]
    pass_context.active_pass= DictObject({ 'index': i, 'name': p.name, 'mode': p.mode })
    
    exception_data= (fullid, pi, p, times_passes_overriden)
    
    is_last_pass= pi == len(pass_context.passes)-1

    if mode_switch_allowed or not active_mode:
      new_mode= 'utf-8' if p.mode == 'stv_text' else p.mode

      if active_mode != new_mode:
        #if active_mode == 'stv_bytes': pass_fstream= StringIO(pass_fstream.read().decode(new_mode))
        #elif new_mode != 'stv_bytes': pass_fstream= StringIO(pass_fstream.read().encode(active_mode).decode(new_mode))
        #else: pass_fstream= BytesIO(pass_fstream.read().encode(active_mode))
        active_mode= new_mode

    outdata= package.__INSTANCE__.write(pass_data, pass_context)
  
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
        pass_data= outdata['filedata']
        mode_switch_allowed= False

      if 'result' in outdata:
        result= outdata['result']
        if 'error' in result: 
          js_result.message= result['error']
          js_result.success= False
          stv_logger.err(result['error'])
        else:
          js_result.success= True
          if 'message' in result: js_result.message= result['message']
          if 'data' in result: 
            js_result.content= result['data']
            js_result.encoding= result['encoding'] if 'encoding' in result else active_mode
        break
      elif is_last_pass:
        if not filetype.domain == 'user': raise FileHandlerInvalidPassReturnError("last pass must return the resulting data")
      
      if skip: continue
        
    elif is_last_pass:
      if not filetype.domain == 'user': raise FileHandlerInvalidPassReturnError("last pass must return the resulting data")
      else: return outdata # return user-defined thing
  
    i+=1
    pi+=1

    if i > stv_const.FILEHANDLER_MAX_ITERATIONS: raise FileHandlerTooManyPassIterationsError(*exception_data)

  if js_result.success:

    wb= js_result.encoding=='stv_bytes'

    with open(filepath, 'wb' if wb else "w") as fb:
      fb.write(js_result.content)
      fb.close()

  return js_result.to_dict() # return intentional js_object to be used in frontend

# ----------------------------------------------------------------------------------------------------------------------- plugin registry

def register_plugins():
  from strevee.plugins import constants, types as ptypes

  plugin_summary= {}

  # plugin types
  for t in ptypes.registry():
    path= os.path.join(stv_globals.path_plugins, t.folder)

    if not os.path.exists(path): os.mkdir(path)
    if not hasattr(stv_globals, t.folder): setattr(stv_globals, t.folder, {})

    plugins_info=[]
    plugins_count=0
    
    # plugins of type
    for f in os.listdir(path):

      filepath= os.path.join(path, f)

      if not f.endswith(".py"): continue
      try:
        m= get_file_as_module(filepath)

        if not hasattr(m, "__PLUGIN__"): 
          stv_logger.wrn(f"skipping file: {os.path.basename(filepath)}, reason: no __PLUGIN__ defined, if its a helper file, please consider placing it on a subfolder")
          continue

        if t.is_subclass(m.__PLUGIN__) and t.is_legit(m.__PLUGIN__):
          plugin= m.__PLUGIN__()

          regdata= plugin.__stv_reg__()
          if not regdata: raise Exception("plugin didn't provide any registry data")

          metadata= t.create_metadata(regdata, plugin)
          stv_globals.__dict__[t.folder][regdata['id']]= DictObject(metadata)

          plugins_info.append(f"    [success] {f} [ {regdata['author']} - {regdata['id']} | {regdata["version"]} ] ({os.path.getsize(filepath)}b)")
          plugins_count+=1
        else: 
          raise Exception("plugin class mismatch")
      except Exception as e:
        stv_logger.err(f"error registering plugin {f} ({t.category}): {e}")
        plugins_info.append(f"    [failed] not registered: {t.folder} -- {f} | {e}")

        if stv_globals.dev_traceback:
          import traceback
          traceback.print_exc()

    plugin_summary[t.folder]= {
      "entry": f"  {t.category} ({t.folder})",
      "list": [*plugins_info],
      "count": plugins_count
    }
    
  plugin_count= sum([v["count"] for v in plugin_summary.values()])

  if plugin_count > 0: stv_logger.logm(f"registered {plugin_count} {'plugin' if plugin_count == 1 else 'plugins'}:", *[ e for pi in plugin_summary.values() for e in (f"{pi['entry']} [{pi['count']}]:", *pi['list'])  ])
  else: stv_logger.log("no plugins registered")

# ----------------------------------------------------------------------------------------------------------------------- helpers

def _get_package_filehandler(package_id):
  pid= package_id
  if not pid in stv_globals.file_handlers: raise FileHandlerNotFoundError(f"No registered file handler with id '{package_id}'") 
  return stv_globals.file_handlers[pid]

def _get_filehandler_filetype(package, fid, task=None):
  filetype_list= tuple(e for e in package.filetypes if e.id == fid and (task in e.tasks if task else True))
  if not filetype_list: raise Exception(f"no filetypes found with id '{package.id}@{fid}' and a '{task}' task") 
  if len(filetype_list) > 1: raise Exception(f"found {len(filetype_list)} filetypes with id '{package.id}@{fid}' and a '{task}' task, please make the ids unique")
  ft= filetype_list[0]
  return ft, ft.tasks[task]

def _get_filehandler_handler(package, fid, hid, task=None):
  handler_list= tuple(e for e in package.handlers if e.id == hid and (e.task==task if task else True))
  if not handler_list: raise Exception(f"filehandler with id '{package.id}:{hid}@{fid}' requires a '{task}' task that doesn't exist") 
  if len(handler_list) > 1: raise Exception(f"filehandler with id '{package.id}:{hid}@{fid}' requires a '{task}' task but there's {len(handler_list)} tasks registered under that id, please make the ids unique") 
  handler= handler_list[0]
  if not handler.passes: raise Exception(f"handler '{fid}' defined no passes") 
  return handler
  
def _get_filehandler(filetype_id, task):
  pid, fid= filetype_id.split(':')
  package= _get_package_filehandler(pid)
  filetype, hid= _get_filehandler_filetype(package, fid, task)
  handler= _get_filehandler_handler(package, fid, hid, task)
  return (pid, fid, hid, f"{pid}:{hid}@{fid}-{task}", package, filetype, handler)

def _get_passes(new_passes, exception_data):
  if not (isinstance(new_passes, list) or isinstance(new_passes, tuple)): raise FileHandlerPassError(*exception_data, "the provided passlist is not either a list or tuple")
  if len(new_passes) == 0: raise FileHandlerPassError(*exception_data, "provided empty passlist as override")
  _pt= (e for e in new_passes if not isinstance(e, dict) or (not e.hasattr['name'] or not type(e['name']==str)) or (not e.hasattr['mode'] or not type(e['mode']==str)) or len(e.keys()) > 2)
  if len(_pt) > 0: raise FileHandlerPassListError(*exception_data, _pt)
  return tuple(DictObject(e) for e in new_passes)

# ----------------------------------------------------------------------------------------------------------------------- other

_dictsurface_pass_drop_out= ('error', 'settings', 'data', 'result')
_dictsurface_pass_readwrite_out= ('error', 'passes', 'filedata', 'data', 'result')
