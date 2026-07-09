#!/usr/bin/env python
import os
import sys

def main():
    # Añadimos la carpeta 'backend' al path de Python
    sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
    
    # Ahora apuntamos al módulo de configuración dentro de 'backend'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_maiz.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()