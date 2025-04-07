from strevee.core import window_manager, globals as __GLOBALS__, constants as __CONST__
from strevee.logging import logger

print(f"\n---- starting sTrevee ----\n")

if __name__ == "__main__":
  import os, sys

  args= sys.argv

  logger.logm(f"got {len(args)} args:", *[f"  arg{i}: {e}" for i,e in enumerate(args)])

  root= os.path.dirname(__file__)
  root_mode= __CONST__.ROOT_DEFAULT
  dev_mode= False
  show_splash= True

  for e in args:
    if e == '--devmode': dev_mode= True
    elif e == '--nosplash': show_splash= False

    if root_mode== __CONST__.ROOT_DEFAULT:

      if e == '--folder': 
        root= os.abspath("..")
        root_mode= __CONST__.ROOT_FOLDER

      elif e == '--localhost': 
        root= ""
        root_mode= __CONST__.ROOT_LOCALHOST

  use_dist= root_mode != __CONST__.ROOT_LOCALHOST

  url_splash= os.path.join(root, *(("dist", "splash.html") if use_dist else ("splash.html",)))
  url_index= os.path.join(root, *(("dist", "index.html") if use_dist else ("index.html",)))

  if not __GLOBALS__.dev_mode:
    logger.dev= logger.devm= __CONST__.void_with_args
  else:
    import logging
    logging.basicConfig(level=logging.DEBUG)
  
  logger.log(f"root={root} [{('DEFAULT','CUSTOM','LOCALHOST')[root_mode]}], splash={__GLOBALS__.show_splash}, dev={__GLOBALS__.dev_mode}")

  __GLOBALS__.root= root
  __GLOBALS__.root_mode= root_mode
  __GLOBALS__.dev_mode= dev_mode
  __GLOBALS__.show_splash= show_splash

  window_manager.create_window(url_index)
  if __GLOBALS__.show_splash: window_manager.create_splash(url_splash)

  window_manager.start()