from strevee.core import constants as __CONST__, globals as __GLOBALS__
from strevee.logging import logger

from strevee.api.api import app_api

import webview as wv

def create_splash(file_url):
  logger.log(f"creating splash window: {file_url}")
  __GLOBALS__.win_splash= wv.create_window("sTrevee Editor Welcome", url=file_url, on_top=True, width= 512, height= 512, resizable=False, shadow=False, transparent=True, frameless=True, background_color= "#000000")
  __GLOBALS__.win_splash.expose(*(destroy_splash,))

def destroy_splash():
  __GLOBALS__.win_splash.destroy()
  __GLOBALS__.win_splash= None
  __GLOBALS__.win_main.show()

def create_window(file_url):
  logger.log(f"creating main window: {file_url}")
  __GLOBALS__.win_main= wv.create_window("sTrevee Editor", hidden=__GLOBALS__.show_splash, url=file_url, width= 1280, height= 720, min_size= (480,512), js_api=app_api(), background_color= "#000000")

def start():

  ua= "strevee_agent"
  if __GLOBALS__.dev_mode: ua+= ";dev_agent"

  if __GLOBALS__.root_mode == __CONST__.ROOT_LOCALHOST:
    wv.start(http_port=5350, debug=__GLOBALS__.dev_mode, user_agent=ua)
  else:
    wv.start(debug=__GLOBALS__.dev_mode, user_agent=ua)