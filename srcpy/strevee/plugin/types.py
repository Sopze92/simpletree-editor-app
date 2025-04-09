from strevee import constants as __CONST__

def get_plugin_signature(plugin_class): 
  print(
    type(plugin_class),
    type(plugin_class.__init__),
    type(plugin_class.__del__),
    type(plugin_class.__stv_register__),
    type(plugin_class.__stv_unregister__)
  )
  return \
    hash(plugin_class.__init__.__code__) + \
    hash(plugin_class.__del__.__code__) + \
    hash(plugin_class.__stv_register__.__code__) + \
    hash(plugin_class.__stv_unregister__.__code__)

class PluginBase():

  def __init__(self):super()
  def __del__(self):super()
  def __stv_register__(self)-> dict:...
  def register(self):
    '''called upon plugin activation, must return a dict with the required data for the type of plugin being registered'''
    ...
  def __stv_unregister__(self):...
  def unregister(self):
    '''called upon plugin desactivation'''
    ...

class FileParserPlugin(PluginBase):

  def __stv_register__(self) -> dict:
    data= self.register()
    data['_plugin_type']= __CONST__.PLUGINTYPE_FILEPARSER
    return data

__PLUGINBASE_SIGNATURE= get_plugin_signature(PluginBase)
__FILEPARSER_SIGNATURE= get_plugin_signature(FileParserPlugin)

class _PluginType():
  def __init__(self, category_name, base_class, folder:str, signature:int):
    self.__category_name= category_name
    self.base_class= base_class
    self.__folder= folder
    self.__signature= signature

  @property
  def category(self)->str: return self.__category_name

  @property
  def folder(self)->str: return self.__folder

  def baseclass(self): return self.__base_class

  def is_subclass(self, other)->bool: return issubclass(other, self.base_class)
  def is_legit(self, other)->bool: return get_plugin_signature(other) == self.__signature

_TYPES= (
  _PluginType('File Parsers', FileParserPlugin, 'file_parsers', __FILEPARSER_SIGNATURE),
)