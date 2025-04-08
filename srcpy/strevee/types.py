
class FileParser():

  def __init__(self, *, file_mode:str, data_mode:str, open_mode:int, save_mode:int, ui_data:dict | None= None):
    self._file_mode= file_mode
    self._data_mode= data_mode
    self._open_mode= open_mode
    self._save_mode= save_mode
    self._ui_data= ui_data

  @property
  def file_mode(self) -> int: return self._file_mode
  @property
  def data_mode(self) -> int: return self._data_mode
  @property
  def open_mode(self) -> int: return self._open_mode
  @property
  def save_mode(self) -> int: return self._save_mode

  def read(self, data:str | bytes) -> dict: ...
  def write(self, data:str | bytes) -> dict: ...

  def ui_data(self) -> dict: return self._ui_data