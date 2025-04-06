
def void(*args): ...
def void_with_args(*args): ...
def void_with_kwargs(**kwargs): ...

# root modes

ROOT_DEFAULT=     0x00
ROOT_FOLDER=      0x01
ROOT_LOCALHOST=   0x02

# window actions

WINDOW_ACTION_CLOSE=      0x00
WINDOW_ACTION_MAXIMIZE=   0x01
WINDOW_ACTION_MINIMIZE=   0x02

# menubar

M_FILE=           0x00
M_EDIT=           0x01
M_VIEW=           0x02
M_HELP=           0x03

# menu items

MI_FILE_EXIT=                   0x01
MI_FILE_NEW=                    0x02
MI_FILE_OPEN=                   0x03
MI_FILE_SAVE=                   0x04
MI_FILE_SAVEAS=                 0x05
MI_FILE_RECENT=                 0x06
MI_FILE_IMPORT=                 0x07
MI_FILE_EXPORT=                 0x08
MI_FILE_RELOAD=                 0x09

MI_EDIT_UNDO=                   0x0A
MI_EDIT_REDO=                   0x0B
MI_EDIT_SELECT_ALL=             0x0C
MI_EDIT_SELECT_NONE=            0x0D
MI_EDIT_SELECT_INVERT=          0x0E
MI_EDIT_THEME=                  0x0F
MI_EDIT_PRESETS=                0x10
MI_EDIT_DEFAULTS=               0x11
MI_EDIT_PREFERENCES=            0x12

MI_TREEVIEW_COLLAPSE=           0x13
MI_TREEVIEW_EXPAND=             0x14
MI_TREEVIEW_SELECT_COLLAPSE=    0x15
MI_TREEVIEW_SELECT_EXPAND=      0x16

MI_VIEW_SIDEPANEL=              0x17
MI_VIEW_TOOLBAR=                0X18
MI_VIEW_LANGUAGE=               0x19
MI_VIEW_STATUSBAR=              0X1A

MI_HELP_DOCS=                   0x1B
MI_HELP_CHECKUPDATES=           0x1C
MI_HELP_FEEDBACK=               0x1D
MI_HELP_CONTRIBUTE=             0x1E
MI_HELP_ABOUT=                  0x1F