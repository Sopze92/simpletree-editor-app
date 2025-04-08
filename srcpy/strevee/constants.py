
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

# fileio

OPENMODE_NONE=            0x00
OPENMODE_INTERNAL=        0x01
OPENMODE_OPEN=            0x02
OPENMODE_IMPORT=          0x03

SAVEMODE_NONE=            0x00
SAVEMODE_INTERNAL=        0x01
SAVEMODE_SAVE=            0x02
SAVEMODE_EXPORT=          0x03