from .base import *

# Por defecto usa development
try:
    from .development import *
except ImportError:
    pass
