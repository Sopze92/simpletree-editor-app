from strevee import fileio, util
from strevee.api import app_api

import webview as wv

from strevee.types import DictObject

def create_splash(file_url):
  stv_logger.log(f"creating splash window: {file_url}")
  stv_globals.win_splash= wv.create_window("sTrevee Editor Welcome", url=file_url, on_top=True, width= 512, height= 512, resizable=False, shadow=False, transparent=True, frameless=True, background_color= "#000000")
  stv_globals.win_splash.expose(*(destroy_splash,))

def destroy_splash():
  stv_globals.win_splash.destroy()
  stv_globals.win_splash= None
  stv_globals.win_main.show()

def create_window(file_url):
  stv_logger.log(f"creating main window: {file_url}")
  stv_globals.win_main= wv.create_window("sTrevee Editor", hidden=stv_globals.show_splash, url=file_url, width= 1280, height= 720, min_size= (480,512), js_api=app_api(), background_color= "#000000", easy_drag= False)
  stv_globals.win_main.events.before_show += on_before_show_main
  stv_globals.win_main.events.closing += on_closing_main

def on_before_show_main(window):
  from strevee import fileio
  print(type(window.native), window.native)
  fileio.register_plugins()

def on_closing_main():
  window= stv_globals.win_main
  return True

def start():

  ua= "strevee_agent"
  if stv_globals.dev_mode: ua+= ";dev_agent"

  if stv_globals.root_mode == stv_const.ROOT_LOCALHOST:
    wv.start(http_port=5350, debug=stv_globals.dev_mode, user_agent=ua)
  else:
    wv.start(debug=stv_globals.dev_mode, user_agent=ua)

# TEMPORARY, will be replaced by a front-end file explorer for the sake of customization and integration
def dialog_open_file(path, pid:str, filetypes:list[str], wildcard:bool):
  package= fileio._get_package_filehandler(pid)
  types= []
  data= []

  for e in filetypes:
    filetype, hid= fileio._get_filehandler_filetype(package, e, 'read')
    types.append(f"{filetype.label} ({';'.join([f'*.{e}' for e in filetype.types])})")
    data.append(DictObject({ 'data': filetype, 'hid': hid }, recursion=1))

  if wildcard: types.append('All files (*.*)')

  filepath= stv_globals.win_main.create_file_dialog(wv.OPEN_DIALOG, directory=path, allow_multiple=False, file_types=tuple(types))
  if not filepath: return None, None

  _, ext= util.split_extension(filepath[0])
  filetype= [e for e in data if ext in e.data.types]

  if not filetype[0]: return None, None

  return filepath[0], f"{pid}:{filetype[0].data.id}"
