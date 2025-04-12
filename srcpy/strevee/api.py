from strevee import fileio, logger, globals as __GLOBALS__, constants as __CONST__
from strevee.util import Response, Response200, Response400

import webview as wv

import os

class app_api():

  maximized:bool= False
  saved_location:tuple[int,int]
  saved_dimensions:tuple[int,int]

  def healthcheck(self):
    print("ok")
    return Response200()
  
  def window_action(self, action):

    w= __GLOBALS__.win_main

    if action== __CONST__.WINDOW_ACTION_MINIMIZE: w.minimize()
    elif action== __CONST__.WINDOW_ACTION_MAXIMIZE:
      if not self.maximized:
        self.saved_location= (w.x, w.y)
        self.saved_dimensions= (w.width, w.height)
        self.maximized= True
        w.maximize()
      else:
        w.move(*self.saved_location)
        w.resize(*self.saved_dimensions)
        w.restore()
        self.maximized= False
    elif action== __CONST__.WINDOW_ACTION_CLOSE: w.destroy()
    else: return Response400("invalid")
    return Response200()
  
  def set_decorated(self, state):
    # not yet supported in pywebview, let me some time to implement it there
    print("unsupported")
    return Response400("unsupported")
  
  def open_url(self, url):
    import webbrowser
    result= webbrowser.open(url, new=0, autoraise=True)
    return Response200() if result else Response400('failed')
  
  def toggle_settings_window(self):
    if not __GLOBALS__.win_settings:
      use_dist= __GLOBALS__.root_mode != __CONST__.ROOT_LOCALHOST
      url_settings= os.path.join(__GLOBALS__.root_pack, *(("dist", "settings.html") if use_dist else ("settings.html",)))
      logger.log(f"creating settings window: {url_settings}")
      __GLOBALS__.win_settings= wv.create_window("sTrevee Editor Settings", url=url_settings, width= 512, height= 640, resizable=False, background_color= "#000000", easy_drag= False)
    else:
      __GLOBALS__.win_settings.destroy()
      __GLOBALS__.win_settings= None
    return Response200()
  
  def load_internal(self, path):
    js_result, status= fileio.load_file_internal(path)
    return Response200({**js_result}) if status==200 else Response(status, "couldn't read, see python output for more info")