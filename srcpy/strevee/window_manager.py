from strevee.api import app_api

import webview as wv

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