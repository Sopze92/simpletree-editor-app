from typing import final, Any

# datatypes (reference only)

@final 
class Ref_fh_filetype():
  '''filetype registry info'''
  id:str                    
  '''unique string ID within the file handler'''
  domain:str              
  '''one of FileDomain_Enum ( document | element | library | preset | style | user )'''
  label:str|None
  '''label for system's file dialog dropdown'''
  types:str|list[str]|None
  '''extensions to include, for file dialog dropdown + filtering, dnd awareness (if any)'''
  drop:bool|str|None
  '''True if drop is enabled for this filetype, or a UI region str from DropRegion_Enum if domain==user'''
  reader:str|None      
  '''reader id'''
  writer:str|None               
  '''writer id'''

@final 
class Ref_fh_pass():
  '''pass registry info'''
  name:str              
  '''name of the pass, must be unique within the current handler'''
  mode:str|None
  '''one of FileMode_Enum ( stv_text | stv_bytes ) stv_text is 'utf-8', python encoders also allowed, see: https://docs.python.org/3/library/codecs.html#standard-encodings'''

# context datatypes (reference only)
@final 
class Ref_FhContext_id():
  package:str
  filetype:str
  handler:str

@final 
class Ref_fhContext_file_RD():
  filename:str
  extension:str|None
  filesize:int

@final 
class Ref_fhContext_file_W():
  filename:str
  extension:str|None

@final 
class Ref_fhContext_activepass():
  '''filetype registry info'''
  index:int                    
  '''index of this pass in the current passlist'''
  name:str              
  '''name of the pass, must be unique within the current handler'''
  mode:str|None
  '''one of FileMode_Enum ( stv_text | stv_bytes ) stv_text is 'utf-8', python encoders also allowed, see: https://docs.python.org/3/library/codecs.html#standard-encodings'''

@final
class Ref_FhContext_D():
  '''reference class for drop context available attributes'''
  file:Ref_fhContext_file_RD
  '''file info'''
  modifiers:list 
  '''list of currently active control keys (include all left + right Ctrl, Cmd, Shift, Alt)'''
  settings:dict
  '''user setting values from UI, if defined, or `{}`, never `None`'''
  filetype:Ref_fh_filetype
  '''the filetype that invoked the drop proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code'''
  region:str
  '''where the file was dropped in the UI, one of DropRegion_Enum'''

@final
class Ref_FhContext_R():
  '''reference class for read context available attributes'''
  id:Ref_FhContext_id
  '''ids of the file handler objects that invoked the read proccess'''
  file:Ref_fhContext_file_RD
  '''file info'''
  trigger:str 
  '''one of FileWriteTrigger `( save | save_as | export | autosave )`'''
  settings:dict
  '''user setting values from UI, if defined, or `{}`, never `None`'''
  filetype:Ref_fh_filetype
  '''the filetype that invoked the read proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code'''
  passes:tuple[Ref_fh_pass]
  '''current passlist tuple'''
  active_pass:Ref_fhContext_activepass
  '''current pass data'''
  drop:Any|None
  '''`data` object returned by drop function (if any), or `None`'''
  data:Any|None
  '''object returned by last pass, or `None`'''

@final
class Ref_FhContext_W():
  '''reference class for write context available attributes'''
  id:Ref_FhContext_id
  '''ids of the file handler objects that invoked the write proccess'''
  file:Ref_fhContext_file_W
  '''file info'''
  trigger:str 
  '''one of FileReadTrigger `( open | reopen | import | reimport | recent | drop )`'''
  settings:dict
  '''user setting values from UI, if defined, or `{}`, never `None`'''
  filetype:Ref_fh_filetype
  '''the filetype (as object) that invoked the write proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code'''
  passes:tuple[Ref_fh_pass]
  '''current passlist tuple'''
  active_pass:Ref_fhContext_activepass
  '''current pass data'''
  data:Any|None
  '''object returned by last pass, or `None`'''