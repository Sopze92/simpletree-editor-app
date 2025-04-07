import webview as wv
from strevee.core import util, globals as __GLOBALS__, constants as __CONST__
from strevee.logging import logger

import os

def response(status:int, message:str, data:any): return {"status": status, "message": message, "data": data}

class app_api():

  maximized:bool= False
  saved_location:tuple[int,int]
  saved_dimensions:tuple[int,int]

  def healthcheck(self):
    print("ok")
    return response(200, 'ok')
  
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
    else: return response(400, 'invalid')
    return response(200, 'ok')
  
  def set_decorated(self, state):
    # not yet supported in pywebview, let me some time to implement it there
    print("unsupported")
    return response(400, 'unsupported')
  
  def open_url(self, url):
    import webbrowser
    result= webbrowser.open(url, new=0, autoraise=True)
    return response(200, 'ok') if result else response(400, 'failed')
  
  def toggle_settings_window(self):
    if not __GLOBALS__.win_settings:
      use_dist= __GLOBALS__.root_mode != __CONST__.ROOT_LOCALHOST
      url_settings= os.path.join(__GLOBALS__.root, *(("dist", "settings.html") if use_dist else ("settings.html",)))
      logger.log(f"creating settings window: {url_settings}")
      __GLOBALS__.win_settings= wv.create_window("sTrevee Editor Settings", url=url_settings, width= 512, height= 640, resizable=False, background_color= "#000000", easy_drag= False)
    else:
      __GLOBALS__.win_settings.destroy()
      __GLOBALS__.win_settings= None
    return response(200, 'ok')
  
  def load_settings(self, path):
    with open(path, mode='r') as fi:
      data= {}
      for l in fi.readlines():
        l= l.replace('\n','').replace('\r','')
        t, d= l.split(':',1)
        k, v= d.split('=',1)
        t= t.lower()
        k= k.lower()
        data[k]= util.getTypedValue(t, v)
      return response(200, 'ok', data)
    return response(400, 'failed')