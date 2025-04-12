from strevee import constants as __CONST__
from typing import final

# file handlers

@final
class FileHandlerNotFoundError(FileNotFoundError):...
class FileHandlerError(Exception):
  def __init__(self, invoker):
    self._invoker= invoker

  def backstr(self):
    return f"file handler {self._invoker}"

  def __str__(self):
    return f"{self.backstr()} raised a generic error"

class FileHandlerPassError(FileHandlerError):
  def __init__(self, invoker, passindex, passinfo, overriden, message=None):
    super.__init__()
    self._invoker= id
    self._pass= passinfo
    self._index= passindex
    self._overriden= overriden
    self._message= message

  def times_overriden_str(self):
    return f"(overriden {self._overriden} times)" if self._overriden > 0 else ""

  def backstr(self):
    return f"{super().backstr()} pass {self._pass.name}:{self._pass.mode} (index {self._index}) {self.times_overriden_str()}"

  def __str__(self):
    return f"{self.backstr()}, {self._message if self._message else 'missing additional info'}"
  
@final
class FileHandlerPassListError(FileHandlerPassError):
  def __init__(self, invoker, passindex, passinfo, overriden, bad_passes):
    super().__init__(invoker, passindex, passinfo, overriden)
    self._issues= bad_passes

  def __str__(self):
    return f"{self.backstr()} -> {len(self._issues)} pass(es) were invalid: {', '.join(':'.join(e) for p in self._issues for e in p)}"

@final
class FileHandlerTooManyPassIterationsError(FileHandlerPassError):
  def __init__(self, invoker, passindex, passinfo, overriden):
    super().__init__(invoker, passindex, passinfo, overriden)

  def __str__(self):
    return f"Too many iterations (+{__CONST__.FILEHANDLER_MAX_ITERATIONS}) for file handler: {self._invoker}. Last pass: {self._pass.name}:{self._pass.mode} (index {self._index}) {self.times_overriden_str()}"

@final
class FileHandlerInvalidPassReturnError(Exception):...

# registry

@final
class MissingAttributeError(Exception):
  def __init__(self, name:str, attribute:str):
    super().__init__()
    self._name= name
    self._attribute= attribute

  def __str__(self):
    return f"Missing required registry attribute '{self._attribute}' at {self._name}"
  
@final
class AttributeTypeError(Exception):
  def __init__(self, name:str, type_in:type, types_req:tuple[type]):
    super().__init__()
    self._name= name
    self._types_r= types_req
    self._type_i= type_in

  def __str__(self):
    return f"Wrong registry attribute value type '{self._type_i.__name__}' at {self._name}, must be:{','.join(e.__name__ if type(e) == type else e.__repr__() for e in self._types_r)}"
