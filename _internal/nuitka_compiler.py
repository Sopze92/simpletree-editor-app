
APP_VERSION='undefined'

with open('_internal/version.txt', "r+") as fstream:
  line= fstream.readline().strip().replace('\n',''.replace('\r',''))
  APP_VERSION= f"v{line}"

MODE_STANDALONE= 0
MODE_ONEFILE= 1

MODES= ["standalone", "app"]

import os, sys, shutil

args= sys.argv[1:]
mode= [i for i,e in enumerate(MODES) if e in args[0]][0] 

root_from= "root"

if mode == MODE_STANDALONE and os.path.exists("./output/nautki_standalone"): 
  shutil.rmtree("output/nautki_standalone")
  root_to= "output/nautki_standalone/main.dist"

if mode == MODE_ONEFILE in args[0] and os.path.exists("./output/nautki_onefile"): 
  shutil.rmtree("output/nautki_onefile")
  root_to= "output/nautki_onefile"
  
icon_file= None

config=[
  *args,
  #"--mode=standalone"

  "--main=srcpy/main.py",
  #"--output-dir=output/nautki_standalone",
  "--output-filename=strevee",

  "--include-raw-dir=output/vite=data/app",
  "--include-raw-dir=pack/plugins=plugins",
  "--include-raw-dir=pack/data=data/default",

  "--windows-console-mode=force",
  #f"--windows-icon-from-ico={icon_file}",
  #f"--linux-icon={icon_file}",

  "--show-anti-bloat-changes",
  #"--noinclude-default-mode=NOINCLUDE_DEFAULT_MODE",

  "--onefile-tempdir-spec=\"{CACHE_DIR}/stved-{VERSION}\""

  "--company-name=\"Mindside Games\"",
  "--product-name=\"sTrevee Editor\"",
  f"--product-version={APP_VERSION}",
  "--file-description=\"tree-view document editor\"",
  "--copyright=\"Sergio 'sopze' del Pino @ 2025\""
]

os.system(f".\\_pyenv\\scripts\\python.exe -m nuitka {' '.join(config)}")

shutil.copytree(root_from, root_to, dirs_exist_ok=True)