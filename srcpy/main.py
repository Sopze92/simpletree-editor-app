from strevee import window_manager, util, logger, globals as __GLOBALS__, constants as __CONST__

from os import path as os_path
from sys import argv as cmd_args

print(f"\n---- starting sTrevee ----\n")

def main():
  args= cmd_args

  logger.logm(f"got {len(args)} args:", *[f"  arg{i}: {e}" for i,e in enumerate(args)])

  root= os_path.dirname(args[0])
  root_pack= os_path.dirname(__file__)
  root_mode= __CONST__.ROOT_DEFAULT
  dev_mode= False
  show_splash= True

  if args[0].endswith(".exe"):
    dev_environment= False
    path_web= ("data", "app")
    path_plugins= os_path.join(__GLOBALS__.root_pack, "plugins")
  
  else:
    dev_environment= True
    path_web= ("output", "vite")
    path_plugins= ("pack", "plugins")

  for e in args:
    if e == '--devmode': dev_mode= True
    elif e == '--nosplash': show_splash= False

    if dev_environment and root_mode == __CONST__.ROOT_DEFAULT:

      if e == '--folder':
        root= os_path.join(os_path.abspath("."), "root")
        root_pack= os_path.abspath(".")
        root_mode= __CONST__.ROOT_FOLDER

      elif e == '--localhost': 
        root= os_path.join(os_path.abspath("."), "root")
        root_pack= ""
        path_plugins= os_path.join(os_path.abspath("."), "pack", "plugins")
        root_mode= __CONST__.ROOT_LOCALHOST

  path_web= os_path.join(root_pack, *path_web) if root_mode != __CONST__.ROOT_LOCALHOST else root_pack
  path_plugins= os_path.join(root_pack, *path_plugins) if root_mode != __CONST__.ROOT_LOCALHOST else os_path.join(os_path.abspath("."), "pack", "plugins")

  url_index= os_path.join(path_web, "main.html")
  url_splash= os_path.join(path_web, "splash.html")

  if not __GLOBALS__.dev_mode:
    logger.dev= logger.devm= __CONST__.void_with_args
  else:
    import logging
    logging.basicConfig(level=logging.DEBUG)

  __GLOBALS__.dev_environment= dev_environment
  __GLOBALS__.dev_mode= dev_mode
  
  __GLOBALS__.root= root
  __GLOBALS__.root_pack= root_pack
  __GLOBALS__.root_mode= root_mode

  __GLOBALS__.path_web= path_web
  __GLOBALS__.path_plugins= path_plugins

  __GLOBALS__.show_splash= show_splash

  b= util.get_bool_tick
  logger.log(f"setup: devenv{b(dev_environment)} dev{b(dev_mode)} splash={b(show_splash)} root_mode[{('DEFAULT','CUSTOM','LOCALHOST')[root_mode]}]")

  logger.logm("app locations:", *(
    root, root_pack, path_web, __GLOBALS__.path_plugins
  ))
  
  window_manager.create_window(url_index)
  if __GLOBALS__.show_splash: window_manager.create_splash(url_splash)

  window_manager.start()

if __name__ == "__main__":
  main()