from strevee import fileio, util, window_manager
from strevee.util import Response, Response200, Response400, Response404

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

    w= stv_globals.win_main

    if action== stv_const.WINDOW_ACTION_MINIMIZE: w.minimize()
    elif action== stv_const.WINDOW_ACTION_MAXIMIZE:
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
    elif action== stv_const.WINDOW_ACTION_CLOSE: w.destroy()
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
    if not stv_globals.win_settings:
      use_dist= stv_globals.root_mode != stv_const.ROOT_LOCALHOST
      url_settings= os.path.join(stv_globals.root_pack, *(("dist", "settings.html") if use_dist else ("settings.html",)))
      stv_logger.log(f"creating settings window: {url_settings}")
      stv_globals.win_settings= wv.create_window("sTrevee Editor Settings", url=url_settings, width= 512, height= 640, resizable=False, background_color= "#000000", easy_drag= False)
    else:
      stv_globals.win_settings.destroy()
      stv_globals.win_settings= None
    return Response200()
  
  def dialog_open(self, path, package, filetypes):
    # placeholder

    filepath, filetype_id= window_manager.dialog_open_file(util.resolve_path(path), package, filetypes, False)
    if not filepath: return Response(200, "cancelled")
  

    print(filepath, filetype_id)

    status, js_result= fileio.file_read_general(filetype_id, filepath, 'open')

    return Response(status, js_result['message'], js_result['content'])
    
  def load_internal(self, path):
    status, js_result= fileio.file_read_internal(path, not stv_globals.dev_mode)
    return Response(status, js_result['message'], js_result['content'])