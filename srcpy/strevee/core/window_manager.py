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
  __GLOBALS__.win_main= wv.create_window("sTrevee Editor", hidden=__GLOBALS__.show_splash, url=file_url, width= 1280, height= 720, min_size= (480,512), js_api=app_api, background_color= "#000000")

def start():
  if __GLOBALS__.root_mode == __CONST__.ROOT_LOCALHOST:
    wv.start(http_port=5350, debug=__GLOBALS__.dev_mode, user_agent="strevee_agent; dev_agent")
  else:
    wv.start(debug=__GLOBALS__.dev_mode, user_agent="strevee_agent")

#def create_window_tkinter():
#  import tkinter as tk
#
#  root = tk.Tk()
#  root.title("sTrevee Editor")
#  root.geometry("1280x720+100+100")
#
#  root.minsize(480, 512)
#
#  try:
#      root.iconbitmap("icon.ico")
#  except Exception as e:
#      print(f"Icon could not be set: {e}")
#
#  # Remove window decorations (frameless window)
#  # root.overrideredirect(True)
#
#  root.resizable(True, True)
#
#  w_menubar = tk.Menu(root)
#
#  # file menu
#  _mch= lambda id: lambda: menu_click_handler(root, __CONST__.M_FILE, id)
#  m_file = tk.Menu(w_menubar, tearoff=0)
#  m_file.add_command(label="New",                       command=_mch(__CONST__.MI_FILE_NEW))
#  m_recent = tk.Menu(m_file, tearoff=0)
#  m_recent.add_command(label="No recent items",         command=None, state='disabled')
#  m_file.add_cascade(label="Recent", menu=m_recent)
#  m_file.add_command(label="Open",                      command=_mch(__CONST__.MI_FILE_OPEN))
#  m_file.add_command(label="Reload",                    command=_mch(__CONST__.MI_FILE_RELOAD),             state='disabled')
#  m_file.add_separator()
#  m_file.add_command(label="Save",                      command=_mch(__CONST__.MI_FILE_SAVE),               state='disabled')
#  m_file.add_command(label="Save as...",                command=_mch(__CONST__.MI_FILE_SAVEAS),             state='disabled')
#  m_file.add_separator()
#  m_file.add_command(label="Import",                    command=_mch(__CONST__.MI_FILE_SAVE),               state='disabled')
#  m_file.add_command(label="Export",                    command=_mch(__CONST__.MI_FILE_SAVEAS),             state='disabled')
#  m_file.add_separator()
#  m_file.add_command(label="Exit",                      command=_mch(__CONST__.MI_FILE_EXIT))
#  w_menubar.add_cascade(label ='File', menu= m_file)
#  
#  # edit menu
#  _mch= lambda id: lambda: menu_click_handler(root, __CONST__.M_EDIT, id)
#  m_edit = tk.Menu(w_menubar, tearoff= 0)
#  m_edit.add_command(label ='Undo',                     command=_mch(__CONST__.MI_EDIT_UNDO))
#  m_edit.add_command(label ='Redo',                     command=_mch(__CONST__.MI_EDIT_REDO))
#  m_edit.add_separator()
#  m_edit.add_command(label ='Select All',               command=_mch(__CONST__.MI_EDIT_SELECT_ALL))
#  m_edit.add_command(label ='Deselect All',             command=_mch(__CONST__.MI_EDIT_SELECT_NONE))
#  m_edit.add_command(label ='Invert Selection',         command=_mch(__CONST__.MI_EDIT_SELECT_INVERT))
#  m_edit.add_separator()
#  m_treeview = tk.Menu(m_edit, tearoff=0)
#  m_treeview.add_command(label ='Collapse All',         command=_mch(__CONST__.MI_TREEVIEW_COLLAPSE))
#  m_treeview.add_command(label ='Expand All',           command=_mch(__CONST__.MI_TREEVIEW_EXPAND))
#  m_treeview.add_separator()
#  m_treeview.add_command(label ='Collapse Selected',    command=_mch(__CONST__.MI_TREEVIEW_SELECT_COLLAPSE))
#  m_treeview.add_command(label ='Expand Selected',      command=_mch(__CONST__.MI_TREEVIEW_SELECT_EXPAND))
#  m_edit.add_cascade(label="Tree-view", menu=m_treeview)
#  m_edit.add_command(label ='Theme',                    command=_mch(__CONST__.MI_EDIT_THEME))
#  m_edit.add_command(label ='Presets',                  command=_mch(__CONST__.MI_EDIT_PRESETS))
#  m_edit.add_command(label ='Defaults',                 command=_mch(__CONST__.MI_EDIT_DEFAULTS))
#  m_edit.add_separator()
#  m_edit.add_command(label ='Preferences',              command=_mch(__CONST__.MI_EDIT_PREFERENCES))
#  w_menubar.add_cascade(label ='Edit', menu= m_edit)
#  
#  # view menu
#  _mch= lambda id: lambda: menu_click_handler(root, __CONST__.M_VIEW, id)
#  m_view = tk.Menu(w_menubar, tearoff= 0)
#  m_view.add_command(label ='Toolbar',                  command=_mch(__CONST__.MI_VIEW_TOOLBAR))
#  m_view.add_command(label ='Sidepanel',                command=_mch(__CONST__.MI_VIEW_SIDEPANEL))
#  m_view.add_separator()
#  m_view.add_command(label ='Language',                 command=_mch(__CONST__.MI_VIEW_LANGUAGE))
#  m_view.add_separator()
#  m_view.add_command(label ='Status bar',               command=_mch(__CONST__.MI_VIEW_STATUSBAR))
#  w_menubar.add_cascade(label ='View', menu= m_view)
#  
#  # help menu
#  _mch= lambda id: lambda: menu_click_handler(root, __CONST__.M_HELP, id)
#  m_help = tk.Menu(w_menubar, tearoff= 0)
#  m_help.add_command(label ='Documentation (Github)',   command=_mch(__CONST__.MI_HELP_DOCS))
#  m_help.add_command(label ='Check for Updates',        command=_mch(__CONST__.MI_HELP_CHECKUPDATES))
#  m_help.add_separator()
#  m_help.add_command(label ='Share Feedback / Issues',  command=_mch(__CONST__.MI_HELP_FEEDBACK))
#  m_help.add_command(label ='How to contribute',        command=_mch(__CONST__.MI_HELP_CONTRIBUTE))
#  m_help.add_separator()
#  m_help.add_command(label ='About sTrevee Editor',     command=_mch(__CONST__.MI_HELP_ABOUT))
#  w_menubar.add_cascade(label ='Help', menu= m_help)
#
#  root.config(menu=w_menubar)
#  root.mainloop()
#
#def menu_click_handler(window, menu, id):
#
#  if menu== __CONST__.M_FILE:
#
#    if   id==__CONST__.MI_FILE_NEW:
#      print("MI_FILE_NEW")
#    elif id==__CONST__.MI_FILE_OPEN:
#      print("MI_FILE_OPEN")
#    elif id==__CONST__.MI_FILE_RECENT:
#      print("MI_FILE_RECENT")
#    elif id==__CONST__.MI_FILE_RELOAD:
#      print("MI_FILE_REVERT")
#    elif id==__CONST__.MI_FILE_SAVE:
#      print("MI_FILE_SAVE")
#    elif id==__CONST__.MI_FILE_SAVEAS:
#      print("MI_FILE_SAVEAS")
#    elif id==__CONST__.MI_FILE_IMPORT:
#      print("MI_FILE_IMPORT")
#    elif id==__CONST__.MI_FILE_EXPORT:
#      print("MI_FILE_EXPORT")
#    elif id==__CONST__.MI_FILE_EXIT:
#      print("MI_FILE_EXIT")
#      window.quit
#
#  elif menu== __CONST__.M_EDIT:
#    ...
#
#  elif menu== __CONST__.M_VIEW:
#    ...
#
#  elif menu== __CONST__.M_HELP:
#    ...