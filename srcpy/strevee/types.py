from strevee._reftypes import *
from typing import final, Any, TypeAlias, Literal

# enums

MenuRegionPlugin_Enum:TypeAlias= Literal['file', 'addon']

DropRegion_Enum:TypeAlias= Literal['any', 'document', 'hierarchy', 'toolbar', 'library', 'preset', 'settings', 'menu', 'statusbar']

FileDomain_Enum:TypeAlias= Literal['document', 'element', 'library', 'preset', 'style', 'custom', '__internal__']
FileMode_Enum:TypeAlias= Literal['stv_text', 'stv_bytes']

FileReadTrigger:TypeAlias= Literal['open', 'reopen', 'import', 'reimport', 'recent', 'drop', '__temp__']
FileWriteTrigger:TypeAlias= Literal['save', 'save_as', 'save_inc', 'export', 'export_last', 'export_inc', 'backup', 'autosave', '__temp__']

HandlerType_Enum:TypeAlias= Literal['read', 'write']

# general

@final
class IterType():
  def __init__(self, *types:type): self._types= types
  def __repr__(self): return f"iterable[{','.join(e.__name__ for e in self._types)}]"
  def test(self, list_):
    for t in self._types:
      if all(isinstance(e, t) for e in list_): return True
    return False

@final
class DictObject():
  def __init__(self, dict_:dict, *, recursion:int= 0x7FFFFFFF):
    d= dict_.copy()
    def a(v): return DictObject(v, recursion= recursion-1)
    def b(v): 
      if not isinstance(v, dict): return False
      if '__KEEPDICT__' in v:
        del v['__KEEPDICT__']
        return False
      return True
    def c(v): return isinstance(v, list) or isinstance(v, tuple)
    if recursion > 0:
      for k,v in d.items():
        if b(v): d[k]= a(v)
        elif c(v):
          for i, e in enumerate(v):
            if b(e): d[k][i]= a(d[k][i])
    self.__dict__= d

  def __str__(self, *, r:int= 0):
    return " "*(r*2)+f"\n{' '*(r*2)}".join( f"{k}: {v}" if not isinstance(v, DictObject) else f"{k}:\n{v.__str__(r=r+1)}" for k,v in self.__dict__.items() )

  def __repr__(self): 
    return f"{{{', '.join(self.__dict__.keys())}}}"

  def dict(self): return self.__dict__

# handlers

class FileHandler():

  def drop(self, context:Ref_FhContext_D) -> dict[str, Any]:
    '''called upon a file drop event

    # -- IMPLEMENTATION -- docstring

    ## arguments
    
    - context (DictObject) : A basic namespace object containing some context data that might be useful

        - file (tuple)          -- dropped file info with the fields: `( filename, extension, filesize )`
        - modifiers (list)      -- list of currently active control keys (include all left + right Ctrl, Cmd, Shift, Alt)
        - settings (dict)       -- user setting values from UI, if defined, or `{}`, never `None`
        - filetype              -- the filetype (as object) that triggered the read proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code
        - region (str)          -- where the file was dropped in the UI, one of DropRegion_Enum
      
    *Note: if the file is in document domain, reloading it via -file->menu->revert- will use the context that resulted from here, even the keypresses will be kept

    ## returns
    
    - dict : a dictionary with the following format:

        - error (str)         -- error feedback, if not `None` the message is shown to the user in a popup and the read process is cancelled
        - settings (dict)     -- override (additive) the settings for the context, not possible to add new entries, omit for no change
        - handler (str)       -- override the reader id for the upcoming file reader, omit for no change
        - result (Any)        -- a dictionary containing the final result in the format, file handling process will end if provided, provide `{}` to fail silently
            - error (str)         -- error feedback, if provided, the message is shown to the user in an alert popup, can be omited
            - data (Any)          -- object to be passed in the context to the first pass through `context.drop`, can be anything
    '''
  
  def read(self, filedata:Any, context:Ref_FhContext_R) -> bool | dict[str, Any] | tuple[tuple[int, dict], ...] :
    '''called for each reader pass

    # -- IMPLEMENTATION -- docstring

    ## arguments
    
    - filedata (Any) : On first pass and while not changed: the file data (StringIO | BytesIO) depending on pass' mode, in subsequent passes is up to implementation
    - context (DictObject) : A basic namespace object containing some context data that might be useful

        - id                    -- ids of the file handler objects that started the file read, fields: `( package, filetype, handler )`
        - file                  -- file info with the fields: `( filename, extension, filesize )`
        - trigger (str)         -- one of FileReadTrigger `( open | reopen | import | reimport | recent | drop )`
        - settings (dict)       -- user setting values from UI, if defined, or `{}`, never `None`
        - filetype              -- the filetype (as object) that invoked the read proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code
        - passes (tuple)        -- current passlist tuple, pass fields are `name, type`
        - active_pass           -- current pass data with the fields `index, name, mode`
        - drop (Any)            -- `data` object returned by drop function (if any), or `None`, attribute will always exist
        - data (Any)            -- object returned by last pass, or `None`, attribute will always exist
      
    *Note: if the file is in document domain, reloading it via -file->menu->revert- will keep the original context from first load, only `context.trigger` will be updated accordly

    ## exceptions
    
    - FileHandlerTooManyPassIterationsError :  if a handler exceeds `stv_constants.FILEHANDLER_MAX_ITERATIONS` pass iterations

    ## returns (one of) (intermediate passes)

    - bool : wether it succeeded or not, for cases wher you dont need any, returning False here will fail silently

    - dict : a dictionary with the following format:

        - passes (tuple)      -- override the current passlist, must follow the same format as `context.passes`, be aware that it will start from index 0 with this new list, omit for no change
        - data (Any)          -- object to be passed in the context to the next pass, if provided replaces any previous, can be anything, if not set, current `context.data` will be used (if any)
        - filedata (Any)      -- object to override the `filedata` parameter on the next pass, (if provided, reader will ignore further passes' str<->bytes switches for the rest of the proccess), omit to no override
        - result (Any)        -- a dictionary containing the final result in the format, file handling process will end if provided, provide `{}` to fail silently
            - error (str)         -- error feedback, if provided, the message is shown to the user in an alert popup, can be omited
            - message (str)       -- a message to be briefly shown in the user's statusbar+logs (if no 'error' defined), can be omited
            - data(tuple|Any)     -- Any for 'custom' domain only, otherwise a tuple containing the required data for its domaing
                - for document: list of elements in the format `tuple[int, dict]`, as: `( (id, {content}), (id, {content}), ... )`
                - for element: not implemented
                - for library: not implemented
                - for preset: not implemented
                - for style: not implemented

    ## returns (last/unique pass)

    - dict : the final result in the format described in the 'result' key from the above dict
    '''

  def write(self, filedata:Any, context:Ref_FhContext_W) -> Any:
    '''called for each writer pass

    # -- IMPLEMENTATION -- docstring

    ## arguments
    
    - filedata (Any) : In first pass and while not changed: the data to be parsed (tuple for most domains | Any for 'plugin' domain), in subsequent passes is up to implementation
    - context (DictObject) : class containing some context data that might be useful

        - id                    -- ids of the file handler objects that started the file write, fields: `( package, filetype, handler )`
        - file                  -- file info with the fields: `filename, extension`
        - trigger (str)         -- one of FileWriteTrigger `( save | save_as | export | autosave )`
        - settings (dict)       -- user setting values from UI, if defined, or `{}`, never `None`
        - filetype              -- the filetype (as object) that invoked the write proccess, or a placeholder filetype with id `"__all__"` if 'All files (.*)' or `"__script__"` if called from code
        - passes (tuple)        -- current passlist tuple, pass fields are `name, type`
        - active_pass           -- current pass data with the fields `index, name, mode`
        - data (Any)            -- object returned by last pass, or `{}`, never `None`
        
    ## returns (one of) (intermediate passes)

    - bool : wether it succeeded or not, for cases wher you dont need any, returning False here will fail silently
    
    - dict : a dictionary with the following format:

        - passes (tuple)      -- override the current passlist, must follow the same format as `context.passes`, be aware that it will start from index 0 with this new list, omit for no change
        - data (Any)          -- object to be passed in the context to the next pass, if provided replaces any previous, can be anything, if not set, current `context.data` will be used (if any)
        - filedata (Any)      -- object to override the `filedata` parameter on the next pass, (not recommended), omit to no override
        - result (Any)        -- a dictionary containing the final result in the format, file handling process will end if provided, provide `{}` to fail silently
            - error (str)         -- error feedback, if provided the message is shown to the user in an alert popup, can be omited
            - message (str)       -- a message to be briefly shown in the user's statusbar+logs (if no 'error' defined), can be omited
            - data(str|bytes)     -- the final result that will be written to disk

    ## returns (last/unique pass)

    - dict : the final result in the format described in the 'result' key from the above dict
    '''