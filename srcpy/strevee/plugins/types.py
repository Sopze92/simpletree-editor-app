from strevee import util
from strevee.builtins import constants as stv_const
from strevee.exceptions import MissingAttributeError, AttributeTypeError
from strevee.types import FileHandler, IterType

from typing import final

__all__= ['FileHandlerPlugin', 'registry']

# util functions

def _test_attributes(attributes, data, name):
  for attr in attributes:
    _p= attr[0] in data
    if not _p: 
      if attr[1]: raise MissingAttributeError(name, attr[0])
      else: continue
    _o= data[attr[0]]
    _t= type(_o)

    if _t in attr[2]: 
      if _t == dict and len(attr) > 3: _test_attributes(attr[3], _p, f"{name}.{attr[0]}")

    elif isinstance(_o, list) or isinstance(_o, tuple):
      _it= tuple(e for e in attr[2] if type(e) == IterType)
      if len(_it) == 0 or not _it[0].test(_o): raise AttributeTypeError(name, _t, attr[2])
      if type(_o[0]) == dict and len(attr) == 4:
        for i, e in enumerate(_o): _test_attributes(attr[3], e, f"{name}.{attr[0]}[{i}]")

    else: 
      raise AttributeTypeError(f"{name}.{attr[0]}", _t, attr[2])
    
  return True

# plugin classes

class PluginBase():

  _STV_REGISTRY= (
    ('id',        True,   (str,) ), 
    ('author',    True,   (str, IterType(str)) ), 
    ('version',   True,   (str, IterType(int)) )
  )

  @final
  def __init__(self):
    if type(self) == PluginBase: raise Exception("PluginBase class cannot be instantiated, please use any of the subclasses")
  @final
  def __del__(self):...
  def __stv_reg__(self)-> dict: 
    _d= self.register()
    if _d == None or type(_d) != dict: raise TypeError(f"-register- method must return a dict, got: {type(_d)}")
    return _d
  def __stv_rem__(self)-> None: self.unregister()
  @classmethod
  def __stv_meta__(cls, regdata:dict, instance:type['PluginBase'])-> dict:
    import re
    _test_attributes(__class__._STV_REGISTRY, regdata, "[registry]")
    if re.search(r"[s|5][t|7]r[e|3]{1,4}v[e|3]{1,4}", regdata['author']): regdata['author']= "INVALID_AUTHOR_NAME"
    regdata['__INSTANCE__']= instance
    regdata['__ISPLUGIN__']= True
    return regdata

  def register(self)-> dict:
    '''called upon plugin activation, must return a dict with the required data for the type of plugin being registered'''
    raise Exception("plugin is missing -register- method")
  def unregister(self)-> None: '''called upon plugin desactivation'''

@final
class FileHandlerPlugin(PluginBase, FileHandler):
  '''Plugin base class for file handlers, can implement virtually any amount of filetype readers and writers
  
  Note that DND system can lead to conflicts if multiple filetypes define the same extensions and their domain or drop region overlaps,
  in those cases a popup will let the user select which one to use, option names are {plugin_name} - ({filetype_domain}) {filetype_label} ({extensions}),
  in example: "My first plugin - (document) my program filetype (.mpf, .mpy)" or "Webp Loader - (element) Webp image format (.webp)" so be
  concise with the names
  '''

  _STV_REGISTRY= (
    ('filetypes',   True,   (IterType(dict),), (
      ('id',          True,   (str,)),                      # unique string ID within the plugin, for internal use and ui binding
      ('domain',      True,   (str,)),                      # one of FileDomain_Enum ( document | element | library | preset | style | user )
      ('label',      False,   (str)),                       # label for system's file dialog dropdown
      ('types',      False,   (str, IterType(str))),        # extensions to include, for file dialog dropdown + filtering, dnd awareness (if any)
      ('drop',       False,   (bool, str)),                 # True to allow drop for this filetype, drop region is defined by 'type' unless set to 'user', then this must be a DNDRegion_Enum
      ('tasks',       True,   (dict,))                      # tasks to perform defined as: { 'name':'handlerid', 'name2':'otherhandler', ...}, note that task name must be 'read' or 'write' for implement common IO functionality
    )),
    ('handlers',    True,   (IterType(dict),), (
      ('id',          True,   (str,)),                      # unique string ID within the plugin, for filetype binding
      ('task',        True,   (str,)),                      # name of the task to be performed, must be the same as the key in filetype.tasks that calls it, used for control
      ('passes',      True,   (IterType(dict),), (          # list of passes for this handler, max 16
        ('name',        True,   (str,)),                    # name of the pass, must be unique within the current reader, is up to you how you use it
        ('mode',        True,   (str,))                     # one of FileMode_Enum ( stv_text | stv_bytes ) stv_text is 'utf-8', python encoders also allowed, see: https://docs.python.org/3/library/codecs.html#standard-encodings
      ))
    )),
    ('ui',         False,   (IterType(dict),), (
      ('label',       True,   (str,)),                      # menu entry name
      ('region',     False,   (str,)),                      # where to place the menu entry, one of MenuRegionPlugin_Enum ( file | addon )
      ('filetypes',   True,   (str, IterType(str))),        # filetype id(s) to be used in the file dialog (within the plugin)
      ('strict',     False,   (bool,))                      # default True, set to False to include the 'All files (.*)' option in file dialog, which require implementing the all() method
    ))
  ) 

  def __stv_reg__(self) -> dict:
    _d= super().__stv_reg__() # call register
    return _d
    
  @classmethod
  def __stv_meta__(cls, regdata:dict, instance:type['FileHandlerPlugin'])-> dict:
    meta= super().__stv_meta__(regdata, instance)
    if 'filetypes' in regdata:
      for ft in regdata['filetypes']: ft['tasks']['__KEEPDICT__']= None
    _test_attributes(__class__._STV_REGISTRY, regdata, "[registry]")
    return meta

@final
class _PluginType():

  @final
  def __init__(self, category_name, base_class, folder:str):
    self._category_name= category_name
    self._base_class= base_class
    self._folder= folder

  @final
  def __del__(self)->None:...

  @property
  def category(self)->str: return self._category_name

  @property
  def folder(self)->str: return self._folder

  def is_subclass(self, other)->bool: return issubclass(other, self._base_class)
  def is_legit(self, other)->bool: return util._get_signature_plugin(other) == _FILEHANDLER_SIGNATURE

  def create_metadata(self, regdata, instance)->dict: return self._base_class.__stv_meta__(regdata, instance)
  
# data

_PLUGINTYPE_SIGNATURE= util._get_signature(_PluginType.__init__, _PluginType.__del__, _PluginType.is_subclass, _PluginType.is_legit, _PluginType.create_metadata)
_FILEHANDLER_SIGNATURE= util._get_signature_plugin(FileHandlerPlugin)

def registry(): return [*__TYPE_LIST__]

__TYPE_LIST__= (
  _PluginType('File Handlers', FileHandlerPlugin, 'file_handlers'),
)