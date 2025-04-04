
__PRODUCT_NAME__= "\033[1;92msTrevee\033[0m"

__LOG_STR__= f"[{__PRODUCT_NAME__}]"
__DEV_STR__= f"[{__PRODUCT_NAME__}:\033[1;95mDEV\033[0m]"
__WRN_STR__= f"[{__PRODUCT_NAME__}:\033[1;33mWRN\033[0m]"
__ERR_STR__= f"[{__PRODUCT_NAME__}:\033[1;31mERR\033[0m]"

def log(*args): print(__LOG_STR__, *args)
def logm(*args):
  log(args[0])
  for e in args[1:]: print(e)

def dev(*args): print(__DEV_STR__, *args)
def devm(*args):
  dev(args[0])
  for e in args[1:]: print(e)

def wrn(*args): print(__WRN_STR__, *args)
def wrnm(*args):
  wrn(args[0])
  for e in args[1:]: print(e)

def err(*args): print(__ERR_STR__, *args)
def errm(*args):
  err(args[0])
  for e in args[1:]: print(e)