# 📚 MANUAL COMPLETO: Configuración de Admin CMS con GitHub y Decap CMS

**Proyecto:** Bachillerato General Estatal "Héroes de la Patria"  
**Autor:** Samuel Cruz Interial  
**Email:** samuelci6377@gmail.com  
**Fecha:** Agosto 2025  

---

## 🎯 **ÍNDICE**

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Git Local](#configuración-de-git-local)
3. [Creación del Repositorio en GitHub](#creación-del-repositorio-en-github)
4. [Configuración del CMS (Decap CMS)](#configuración-del-cms-decap-cms)
5. [Configuración de GitHub Pages](#configuración-de-github-pages)
6. [Configuración de OAuth para Admin](#configuración-de-oauth-para-admin)
7. [Prueba del Panel de Administración](#prueba-del-panel-de-administración)
8. [Uso del Panel Admin](#uso-del-panel-admin)
9. [Solución de Problemas](#solución-de-problemas)
10. [Mejoras Futuras](#mejoras-futuras)

---

## 🔧 **REQUISITOS PREVIOS**

### **Software Necesario:**
- ✅ Git instalado en el sistema
- ✅ Cuenta de GitHub activa
- ✅ Navegador web moderno
- ✅ Editor de código (opcional pero recomendado)

### **Conocimientos Básicos:**
- Uso básico de línea de comandos
- Navegación en GitHub
- Conceptos básicos de Git

---

## 🚀 **PASO 1: CONFIGURACIÓN DE GIT LOCAL**

### **1.1 Configurar Identidad Global**
```bash
# Configura tu email (usa el mismo de GitHub)
git config --global user.email "tu-email@gmail.com"

# Configura tu nombre
git config --global user.name "Tu Nombre Completo"
```

**Ejemplo real:**
```bash
git config --global user.email "samuelci6377@gmail.com"
git config --global user.name "Samuel Cruz Interial"
```

### **1.2 Inicializar Repositorio Local**
```bash
# Navega a la carpeta de tu proyecto
cd "C:\ruta\a\tu\proyecto"

# Inicializa Git
git init
```

### **1.3 Crear .gitignore**
Crear archivo `.gitignore` en la raíz del proyecto:
```
# Archivos del sistema
.DS_Store
Thumbs.db

# Carpetas de backup
backup_inicial/

# Logs
*.log

# Archivos temporales
*.tmp
*.temp

# Node modules si usas Node.js
node_modules/

# Archivos de entorno
.env
.env.local

# Archivos de editor
.vscode/
.idea/
*.swp
*.swo

# Archivos de cache
.cache/
```

### **1.4 Primer Commit**
```bash
# Agregar todos los archivos
git add .

# Crear el commit inicial
git commit -m "Initial commit: Nombre de tu proyecto"
```

---

## 📁 **PASO 2: CREACIÓN DEL REPOSITORIO EN GITHUB**

### **2.1 Crear Repositorio**
1. **Ve a:** https://github.com/new
2. **Llena los campos:**
   - **Repository name:** `nombre-de-tu-proyecto` (sin espacios, usa guiones)
   - **Description:** Descripción breve del proyecto
   - **Visibility:** Public (para GitHub Pages gratuito)
   - ✅ **Add a README file**
   - **Gitignore template:** None (ya tienes el tuyo)
   - **License:** Opcional
3. **Click "Create repository"**

### **2.2 Conectar Repositorio Local con GitHub**
```bash
# Conectar con tu repositorio (cambia por tu URL real)
git remote add origin https://github.com/TU-USUARIO/tu-repositorio.git

# Subir archivos por primera vez
git push -u origin main
```

**Ejemplo real:**
```bash
git remote add origin https://github.com/sci6377/web-bachillerato-heroes.git
git push -u origin main
```

---

## ⚙️ **PASO 3: CONFIGURACIÓN DEL CMS (DECAP CMS)**

### **3.1 Crear Carpeta Admin**
Crear la siguiente estructura en tu proyecto:
```
proyecto/
├── admin/
│   ├── index.html
│   └── config.yml
└── data/
    ├── config.json
    ├── testimonios.json
    ├── noticias.json
    ├── docentes.json
    ├── eventos_calendario_pwa.json
    ├── avisos_pwa.json
    └── recursos_pwa.json
```

### **3.2 Archivo admin/index.html**
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Panel de Contenido</title>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</head>
<body>
  <!-- El panel de Decap CMS se cargará aquí -->
</body>
</html>
```

### **3.3 Archivo admin/config.yml**
```yaml
backend:
  name: github
  repo: TU-USUARIO/TU-REPOSITORIO  # ¡CAMBIAR POR TU REPO!
  branch: main
  auth_type: implicit
  app_id: TU_CLIENT_ID_AQUI  # Se configurará más adelante
  commit_messages:
    create: "Crear {{collection}} \"{{slug}}\""
    update: "Actualizar {{collection}} \"{{slug}}\""
    delete: "Eliminar {{collection}} \"{{slug}}\""
    uploadMedia: "Subir \"{{path}}\""
    deleteMedia: "Eliminar \"{{path}}\""

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "avisos"
    label: "Avisos"
    file: "data/avisos_pwa.json"
    description: "Gestiona la lista de avisos para la PWA."
    fields:
      - name: "avisos"
        label: "Lista de Avisos"
        widget: "list"
        fields:
          - { label: "Título", name: "title", widget: "string" }
          - { label: "Fecha", name: "date", widget: "datetime" }
          - { label: "Contenido", name: "content", widget: "text" }

  - name: "eventos"
    label: "Eventos del Calendario"
    file: "data/eventos_calendario_pwa.json"
    description: "Gestiona los eventos que aparecen en el calendario."
    fields:
      - name: "eventos"
        label: "Lista de Eventos"
        widget: "list"
        fields:
          - { label: "Título", name: "title", widget: "string" }
          - { label: "Fecha de Inicio", name: "start", widget: "datetime" }
          - { label: "Fecha de Fin", name: "end", widget: "datetime", optional: true }
          - { label: "Descripción", name: "description", widget: "text" }

  - name: "recursos"
    label: "Recursos PWA"
    file: "data/recursos_pwa.json"
    description: "Gestiona la lista de recursos educativos."
    fields:
      - name: "recursos"
        label: "Lista de Recursos"
        widget: "list"
        fields:
          - { label: "Título", name: "title", widget: "string" }
          - { label: "URL del Recurso", name: "url", widget: "string" }
          - { label: "Descripción", name: "description", widget: "text" }

  - name: "testimonios"
    label: "Testimonios de Egresados"
    file: "data/testimonios.json"
    description: "Gestiona los testimonios que aparecen en la página."
    fields:
      - name: "testimonios"
        label: "Lista de Testimonios"
        widget: "list"
        fields:
          - { label: "Nombre del Autor", name: "author_name", widget: "string" }
          - { label: "Testimonio", name: "quote", widget: "text" }
          - { label: "Foto del Autor", name: "author_image", widget: "image", optional: true }

  - name: "configuracion"
    label: "Configuración General"
    files:
      - name: "general"
        label: "Información General"
        file: "data/config.json"
        description: "Configuración general del sitio."
        fields:
          - { label: "Nombre de la Institución", name: "institution_name", widget: "string" }
          - { label: "CCT", name: "cct", widget: "string" }
          - { label: "Dirección", name: "address", widget: "text" }
          - { label: "Teléfono", name: "phone", widget: "string" }
          - { label: "Email", name: "email", widget: "string" }
          - { label: "Horario de Atención", name: "schedule", widget: "string" }
          - { label: "Misión", name: "mission", widget: "text" }
          - { label: "Visión", name: "vision", widget: "text" }
          - { label: "Valores", name: "values", widget: "text" }

  - name: "noticias"
    label: "Noticias y Comunicados"
    file: "data/noticias.json" 
    description: "Gestiona las noticias y comunicados oficiales."
    fields:
      - name: "noticias"
        label: "Lista de Noticias"
        widget: "list"
        fields:
          - { label: "Título", name: "title", widget: "string" }
          - { label: "Fecha de Publicación", name: "date", widget: "datetime" }
          - { label: "Imagen Destacada", name: "image", widget: "image", optional: true }
          - { label: "Resumen", name: "summary", widget: "text" }
          - { label: "Contenido Completo", name: "content", widget: "markdown" }
          - { label: "Autor", name: "author", widget: "string" }
          - { label: "Categoría", name: "category", widget: "select", options: ["Comunicado", "Evento", "Aviso", "Reconocimiento"] }

  - name: "docentes"
    label: "Personal Docente"
    file: "data/docentes.json"
    description: "Información del personal docente y administrativo."
    fields:
      - name: "docentes"
        label: "Lista de Docentes"
        widget: "list"
        fields:
          - { label: "Nombre Completo", name: "name", widget: "string" }
          - { label: "Cargo", name: "position", widget: "string" }
          - { label: "Materias que Imparte", name: "subjects", widget: "list" }
          - { label: "Foto", name: "photo", widget: "image", optional: true }
          - { label: "Email", name: "email", widget: "string", optional: true }
          - { label: "Especialización", name: "specialization", widget: "string", optional: true }
```

### **3.4 Crear Archivos JSON Base**

**data/config.json:**
```json
{
  "institution_name": "Tu Institución",
  "cct": "TU_CCT",
  "address": "Tu dirección completa",
  "phone": "Tu teléfono",
  "email": "tu-email@ejemplo.com",
  "schedule": "Horario de atención",
  "mission": "Misión de la institución",
  "vision": "Visión de la institución",
  "values": "Valores institucionales"
}
```

**data/testimonios.json:**
```json
[
    {
        "nombre": "Nombre del Egresado",
        "texto": "Testimonio del egresado...",
        "imagen": "images/testimonios/foto.jpg",
        "infoExtra": "Información adicional"
    }
]
```

**data/noticias.json:**
```json
{
  "noticias": [
    {
      "title": "Primera Noticia",
      "date": "2025-01-01T00:00:00.000Z",
      "image": "images/noticias/noticia1.jpg",
      "summary": "Resumen de la noticia",
      "content": "# Contenido completo\n\nAquí va el contenido...",
      "author": "Nombre del Autor",
      "category": "Comunicado"
    }
  ]
}
```

**data/docentes.json:**
```json
{
  "docentes": [
    {
      "name": "Nombre del Docente",
      "position": "Cargo",
      "subjects": ["Materia 1", "Materia 2"],
      "photo": "images/docentes/foto.jpg",
      "email": "docente@email.com",
      "specialization": "Especialización"
    }
  ]
}
```

### **3.5 Subir Configuración Inicial**
```bash
git add .
git commit -m "Configurar sistema CMS con Decap CMS"
git push
```

---

## 🌐 **PASO 4: CONFIGURACIÓN DE GITHUB PAGES**

### **4.1 Habilitar GitHub Pages**
1. **Ve a tu repositorio:** https://github.com/TU-USUARIO/TU-REPOSITORIO
2. **Click en "Settings"** (pestaña superior)
3. **Scroll down hasta "Pages"** (menú lateral izquierdo)
4. **En "Source":** 
   - Selecciona: **"Deploy from a branch"**
   - Branch: **"main"**
   - Folder: **"/ (root)"**
5. **Click "Save"**

### **4.2 Esperar Despliegue**
- Espera 2-5 minutos para el primer despliegue
- Tu sitio estará en: `https://TU-USUARIO.github.io/TU-REPOSITORIO/`
- **Ejemplo:** https://sci6377.github.io/web-bachillerato-heroes/

### **4.3 Verificar Funcionamiento**
- **Sitio principal:** https://TU-USUARIO.github.io/TU-REPOSITORIO/
- **Panel admin:** https://TU-USUARIO.github.io/TU-REPOSITORIO/admin/

---

## 🔐 **PASO 5: CONFIGURACIÓN DE OAUTH PARA ADMIN**

### **5.1 Crear OAuth App en GitHub**
1. **Ve a:** https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Llena los campos:**
   - **Application name:** `Nombre de tu proyecto Admin`
   - **Homepage URL:** `https://TU-USUARIO.github.io/TU-REPOSITORIO/`
   - **Authorization callback URL:** `https://TU-USUARIO.github.io/TU-REPOSITORIO/admin/`
4. **Click "Register application"**
5. **Copia el "Client ID"** que aparece

### **5.2 Actualizar config.yml con Client ID**
Editar `admin/config.yml`:
```yaml
backend:
  name: github
  repo: TU-USUARIO/TU-REPOSITORIO
  branch: main
  auth_type: implicit
  app_id: TU_CLIENT_ID_REAL  # Pegar aquí tu Client ID
```

### **5.3 Subir Configuración Final**
```bash
git add admin/config.yml
git commit -m "Configurar OAuth con Client ID para panel admin"
git push
```

---

## ✅ **PASO 6: PRUEBA DEL PANEL DE ADMINISTRACIÓN**

### **6.1 Acceder al Admin Panel**
1. **Ve a:** https://TU-USUARIO.github.io/TU-REPOSITORIO/admin/
2. **Deberías ver:** Pantalla de login con "Login with GitHub"
3. **Click "Login with GitHub"**
4. **Autoriza la aplicación** si GitHub lo solicita
5. **¡Ya puedes editar contenido!**

### **6.2 Verificar Funcionalidades**
- ✅ Login funciona
- ✅ Se muestran las colecciones configuradas
- ✅ Puedes crear/editar/eliminar contenido
- ✅ Los cambios se guardan en GitHub
- ✅ Los archivos JSON se actualizan automáticamente

---

## 📖 **PASO 7: USO DEL PANEL ADMIN**

### **7.1 Navegación Principal**
- **Lateral izquierdo:** Lista de colecciones (Avisos, Eventos, etc.)
- **Panel central:** Editor de contenido
- **Panel derecho:** Vista previa (si disponible)

### **7.2 Crear Contenido Nuevo**
1. **Selecciona una colección** (ej: "Noticias")
2. **Click "New Noticias"**
3. **Llena los campos** requeridos
4. **Click "Publish"**
5. **¡El contenido se guarda automáticamente en GitHub!**

### **7.3 Editar Contenido Existente**
1. **Selecciona la colección**
2. **Click en el elemento** que quieres editar
3. **Modifica los campos**
4. **Click "Publish"**

### **7.4 Gestión de Imágenes**
1. **En campos de imagen:** Click "Choose an image"
2. **Upload:** Sube nuevas imágenes
3. **Las imágenes se guardan** en `images/uploads/`

---

## 🔧 **PASO 8: SOLUCIÓN DE PROBLEMAS**

### **8.1 Admin Panel no Carga**
- **Verifica:** GitHub Pages está habilitado
- **Verifica:** La URL es correcta (`/admin/` al final)
- **Espera:** 5-10 minutos después de cambios en config.yml

### **8.2 Error de Login**
- **Verifica:** Client ID es correcto en config.yml
- **Verifica:** URLs del OAuth App coinciden exactamente
- **Verifica:** Repository es público
- **Intenta:** Borrar cookies y volver a intentar

### **8.3 Los Cambios no se Guardan**
- **Verifica:** Tienes permisos de escritura en el repositorio
- **Verifica:** Las rutas en config.yml son correctas
- **Verifica:** Los archivos JSON existen en las rutas especificadas

### **8.4 Errores de Configuración**
- **Revisa:** Sintaxis YAML en config.yml (indentación correcta)
- **Verifica:** Nombres de archivos y rutas son correctos
- **Consulta:** Logs del navegador (F12 → Console)

---

## 🚀 **PASO 9: MEJORAS FUTURAS**

### **9.1 Funcionalidades Adicionales**
- **Workflow Actions:** Automatizar despliegues
- **Custom Domain:** Usar tu propio dominio
- **CDN:** Implementar Cloudflare
- **Analytics:** Agregar Google Analytics

### **9.2 Colecciones Personalizadas**
- **Galería de Imágenes:** Para fotos del plantel
- **Documentos:** Para PDFs descargables
- **Eventos Especiales:** Para fechas importantes
- **Personal Administrativo:** Separar de docentes

### **9.3 Integraciones**
- **Email Marketing:** Conectar con Mailchimp
- **Redes Sociales:** Auto-posteo en Facebook
- **Calendario:** Sincronizar con Google Calendar
- **Analytics:** Dashboard de métricas

---

## 📋 **COMANDO COMPLETO DE REFERENCIA RÁPIDA**

```bash
# Configuración inicial
git config --global user.email "tu-email@gmail.com"
git config --global user.name "Tu Nombre"

# Inicializar proyecto
cd "ruta/a/tu/proyecto"
git init
git add .
git commit -m "Initial commit: Tu Proyecto"

# Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main

# Actualizaciones posteriores
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 📚 **RECURSOS ÚTILES**

### **Documentación Oficial:**
- **Decap CMS:** https://decapcms.org/docs/
- **GitHub Pages:** https://docs.github.com/en/pages
- **Git:** https://git-scm.com/doc

### **Tutoriales:**
- **YAML Syntax:** https://yaml.org/
- **Markdown:** https://www.markdownguide.org/
- **OAuth Apps:** https://docs.github.com/en/developers/apps

### **Herramientas:**
- **YAML Validator:** https://yamlchecker.com/
- **JSON Validator:** https://jsonlint.com/
- **Markdown Editor:** https://stackedit.io/

---

## ✅ **CHECKLIST FINAL**

### **Pre-configuración:**
- [ ] Git instalado y configurado
- [ ] Cuenta de GitHub activa
- [ ] Proyecto local listo

### **Configuración GitHub:**
- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos correctamente
- [ ] GitHub Pages habilitado

### **Configuración CMS:**
- [ ] Carpeta `/admin/` creada
- [ ] Archivo `admin/index.html` configurado
- [ ] Archivo `admin/config.yml` configurado
- [ ] Archivos JSON base creados en `/data/`

### **Configuración OAuth:**
- [ ] OAuth App creado en GitHub
- [ ] Client ID copiado
- [ ] `config.yml` actualizado con Client ID
- [ ] Configuración subida a GitHub

### **Pruebas:**
- [ ] Sitio principal carga correctamente
- [ ] Admin panel es accesible
- [ ] Login con GitHub funciona
- [ ] Colecciones se muestran correctamente
- [ ] Crear/editar contenido funciona
- [ ] Cambios se guardan en GitHub

---

**🎉 ¡FELICIDADES! Tu sistema CMS está completamente configurado y funcionando.**

**Desarrollado por:** Samuel Cruz Interial  
**Email:** samuelci6377@gmail.com  
**Fecha:** Agosto 2025  

---

## 📞 **SOPORTE**

Si tienes problemas con esta configuración:
1. Revisa la sección "Solución de Problemas"
2. Consulta la documentación oficial de Decap CMS
3. Verifica que todos los pasos se siguieron correctamente
4. Contacta al desarrollador: samuelci6377@gmail.com

**¡Guarda este manual para futuros proyectos!**