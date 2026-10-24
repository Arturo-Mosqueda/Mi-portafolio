# Media Sprinter

Aplicación de escritorio para Windows que permite analizar enlaces públicos de YouTube, Instagram y X, y guardar contenido autorizado como MP4 o MP3. Incluye selección de calidad, pistas de audio de YouTube cuando están disponibles, progreso por etapas, cola, cancelación, reintentos e historial local.

## Ejecutar desde el código fuente

Requisitos: Python 3.10 o posterior. Para algunas funciones de YouTube se recomienda Node.js 22 o posterior.

```powershell
.\\install.ps1
.\\run.ps1
```

El destino se puede cambiar desde la aplicación. La disponibilidad de calidades y pistas depende de cada plataforma y puede variar con el tiempo.

## Alcance de esta publicación

Esta carpeta contiene código fuente, recursos de interfaz y dependencias de Python fijadas con hashes SHA-256. No incluye el ejecutable, videos descargados, historial, registros, cookies, credenciales, configuración local ni componentes binarios auxiliares de terceros. Por eso no es una distribución de un clic ni permite reconstruir exactamente el ejecutable empaquetado sin obtener y verificar aparte esos componentes.

## Privacidad y seguridad

- El servidor de la aplicación escucha únicamente en el equipo local y exige solicitudes del mismo origen.
- La aplicación no importa cookies ni sesiones del navegador. El historial se almacena localmente y no guarda enlaces multimedia.
- Se aceptan enlaces HTTPS de las plataformas compatibles; se validan las rutas y ubicaciones de archivos.
- El instalador usa PyPI y verifica los hashes de las dependencias fijadas.
- La comprobación con Microsoft Defender depende de que esté disponible en Windows; si no lo está, no se debe interpretar como un análisis realizado.

Usa la aplicación solo con contenido que tengas derecho a guardar. No está destinada a acceder a publicaciones privadas ni a eludir DRM o controles de acceso. Ningún análisis puede prometer riesgo cero.

## Limitaciones

Los extractores pueden dejar de funcionar temporalmente si cambian las plataformas. Contenido privado, eliminado, restringido por región o protegido por DRM puede no estar disponible. La publicación contiene fuente, no un instalador ni el ejecutable empaquetado.
