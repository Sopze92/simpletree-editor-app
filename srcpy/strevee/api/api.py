import webview as wv
from strevee.core import globals as __GLOBALS__, constants as __CONST__

def response(status:int, message:str, *kwargs:any):
  return {"status": status, "message": message, "data": kwargs}

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