# Guía: Cómo Subir tu Portafolio a GitHub Pages

Dado que hemos organizado todos tus subproyectos dentro de la carpeta `proyectos/` usando rutas relativas, toda tu web funcionará a la perfección tanto localmente como en los servidores de GitHub de forma 100% gratuita.

Sigue estos sencillos pasos para publicarla en internet:

---

## Paso 1: Crear un nuevo repositorio en GitHub
1. Entra a tu cuenta en [GitHub](https://github.com/).
2. Haz clic en el botón **New** (Nuevo repositorio) en la esquina superior izquierda.
3. Configura el repositorio:
   - **Repository name:** Ponle un nombre, por ejemplo: `mi-portafolio` o tu nombre de usuario `Arturo-Mosqueda.github.io`.
     *(Si usas exactamente `nombreDeUsuario.github.io`, tu web se publicará directamente en esa dirección sin añadir carpetas al enlace).*
   - **Public/Private:** Debe ser **Public** (Público) para que la página de GitHub Pages sea accesible.
   - **Initialize this repository with:** Déjalo todo en blanco (sin añadir README, .gitignore o licencias) ya que subiremos tus archivos locales.
4. Haz clic en **Create repository**.

---

## Paso 2: Subir tus archivos a GitHub
Abre la terminal de comandos (PowerShell, Git Bash o Command Prompt) en la carpeta de tu proyecto (`c:\Users\jmosq\Desktop\Arturo\Proyectos\Pagina web personal`) y ejecuta los siguientes comandos:

1. **Inicializar Git localmente** (si aún no está inicializado):
   ```bash
   git init
   ```

2. **Añadir todos los archivos** (incluyendo la nueva carpeta de `proyectos` con los subproyectos):
   ```bash
   git add .
   ```

3. **Crear tu primer commit:**
   ```bash
   git commit -m "Estructura inicial del portafolio con proyectos vinculados"
   ```

4. **Renombrar la rama principal a `main`:**
   ```bash
   git branch -M main
   ```

5. **Vincular tu repositorio local con el de GitHub** (reemplaza la URL con la de tu repositorio recién creado):
   ```bash
   git remote add origin https://github.com/Arturo-Mosqueda/nombre-de-tu-repo.git
   ```

6. **Subir los archivos:**
   ```bash
   git push -u origin main
   ```

*(Si usas la aplicación de escritorio **GitHub Desktop**, simplemente arrastra la carpeta de tu portafolio, haz un commit y publícalo en GitHub como repositorio público).*

---

## Paso 3: Activar GitHub Pages
Una vez subidos los archivos a GitHub:
1. En la página web de tu repositorio en GitHub, ve a la pestaña **Settings** (Configuración) arriba a la derecha.
2. En la barra lateral izquierda, busca la sección **Code and automation** y haz clic en **Pages**.
3. En la sección **Build and deployment**:
   - **Source:** Asegúrate de que esté seleccionado `Deploy from a branch`.
   - **Branch:** Cambia `None` por **`main`** y la carpeta de al lado déjala en **`/ (root)`**.
4. Haz clic en **Save** (Guardar).

---

## Paso 4: ¡Tu sitio está en línea!
- Después de 1 o 2 minutos, refresca la página de configuración de **Pages**.
- Verás un recuadro verde arriba con el texto: *"Your site is live at: `https://Arturo-Mosqueda.github.io/mi-portafolio/`"*.
- Haz clic en ese enlace para abrir tu portafolio en internet.

### Cómo se verán tus proyectos:
Gracias a las rutas relativas que configuramos, tus subproyectos abrirán de inmediato en las siguientes direcciones relativas:
- **Simulador de Asteroides:** `https://Arturo-Mosqueda.github.io/mi-portafolio/proyectos/simulador-asteroides/index.html`
- **Controlador de Garra:** `https://Arturo-Mosqueda.github.io/mi-portafolio/proyectos/garra-servomotor/index.html`
- **Plan Nutricional:** `https://Arturo-Mosqueda.github.io/mi-portafolio/proyectos/plan-alimentacion.html`
- **Mapa de Calidad del Aire:** `https://Arturo-Mosqueda.github.io/mi-portafolio/proyectos/mapa-contaminacion-qro/index.html`
