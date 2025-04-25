'''
## important note
this module install some objects into __builtins__ in order to get access to some own global scope without the need of imports, althought this is not recommended, 
it's practical, so i've done it this way just because this is an isolated module that aims to run inside an executable with a embebbed python runtime
'''

from strevee import window_manager, util

import strevee.builtins.logger as _l, strevee.builtins.globals as _g, strevee.builtins.constants as _c

__builtins__.stv_logger= _l
__builtins__.stv_globals= _g
__builtins__.stv_const= _c

from sys import argv as cmd_args
import os

import tempfile

print(f"\n---- starting sTrevee ----\n")

def main():

  args= cmd_args

  stv_logger.logm(f"got {len(args)} args:", *[f"  arg{i}: {e}" for i,e in enumerate(args)])

  root= os.path.dirname(args[0])
  root_pack= os.path.dirname(__file__)
  root_mode= stv_const.ROOT_DEFAULT
  dev_mode= False
  dev_traceback= False
  show_splash= True

  path_temp= os.path.join(tempfile.gettempdir(), "strevee")

  if args[0].endswith(".exe"):
    dev_environment= False
    path_web= ("data", "app")
    path_plugins= os.path.join(stv_globals.root_pack, "plugins")
  
  else:
    dev_environment= True
    path_web= ("output", "vite")
    path_plugins= ("pack", "plugins")

  for e in args:
    if e == '--devmode': dev_mode= True
    elif e == '--traceback': dev_traceback= True
    elif e == '--nosplash': show_splash= False

    if dev_environment and root_mode == stv_const.ROOT_DEFAULT:

      if e == '--folder':
        root= os.path.join(os.path.abspath("."), "root")
        root_pack= os.path.abspath(".")
        root_mode= stv_const.ROOT_FOLDER

      elif e == '--localhost': 
        root= os.path.join(os.path.abspath("."), "root")
        root_pack= ""
        path_plugins= os.path.join(os.path.abspath("."), "pack", "plugins")
        root_mode= stv_const.ROOT_LOCALHOST

  path_web= os.path.join(root_pack, *path_web) if root_mode != stv_const.ROOT_LOCALHOST else root_pack
  path_plugins= os.path.join(root_pack, *path_plugins) if root_mode != stv_const.ROOT_LOCALHOST else os.path.join(os.path.abspath("."), "pack", "plugins")

  url_index= os.path.join(path_web, "main.html")
  url_splash= os.path.join(path_web, "splash.html")

  if not stv_globals.dev_mode:
    stv_logger.dev= stv_logger.devm= stv_const.void_with_args
  else:
    import logging
    logging.basicConfig(level=logging.DEBUG)

  stv_globals.dev_environment= dev_environment
  stv_globals.dev_traceback= dev_traceback
  stv_globals.dev_mode= dev_mode
  
  stv_globals.root= root
  stv_globals.root_pack= root_pack

  stv_globals.root_mode= root_mode

  # paths
  stv_globals.path_temp= path_temp
  if not os.path.exists(path_temp): os.mkdir(path_temp)
  stv_globals.path_defaults= os.path.join(root_pack, "data", "defaults")
  stv_globals.path_web= path_web
  stv_globals.path_plugins= path_plugins

  stv_globals.show_splash= show_splash

  b= util.get_bool_tick
  stv_logger.log(f"setup: devenv{b(dev_environment)} dev{b(dev_mode)} splash={b(show_splash)} root_mode[{('DEFAULT','CUSTOM','LOCALHOST')[root_mode]}]")

  stv_logger.logm("app locations:", *(
    root, root_pack, stv_globals.path_temp, path_web, stv_globals.path_plugins,
  ))
  
  window_manager.create_window(url_index)
  if stv_globals.show_splash: window_manager.create_splash(url_splash)

  window_manager.start()

if __name__ == "__main__":
  main()