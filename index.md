**PROMPT PARA EL ARQUITECTO IA: OPTIMIZACIÓN DE MODALES - CARGA DE CONTENIDO BAJO DEMANDA**

**Asistente, necesito optimizar la página web index.html existente. Actualmente, el contenido de todos los modales está directamente en el HTML, lo que lo hace muy grande y pesado. Vamos a refactorizar esto para implementar una carga de contenido bajo demanda (lazy loading) para los modales extensos.**

**Objetivo:**\
Reducir el tamaño inicial del archivo index.html cargando el contenido de los modales solo cuando el usuario los solicita. Mejorar el rendimiento y la mantenibilidad del proyecto.

**Metodología a Seguir:**

1. **Crea una nueva estructura de carpetas** en la raíz del proyecto llamada /fragments/.
1. **Identifica los modales con contenido extenso** en el index.html. Estos incluyen, pero no se limitan a:
   1. #perfil-egreso-modal
   1. #comunicacion-grafica-modal
   1. #alimentos-artesanales-modal
   1. #instalaciones-residenciales-modal
   1. #extracurriculares-modal
   1. #financieros-modal
   1. #actividades-modal
1. **Mueve el contenido de estos modales** a sus propios archivos de fragmentos HTML dentro de la carpeta /fragments/.
   1. **Acción:** Corta el contenido que está DENTRO de <div class="modal-scrollable-content"> de cada modal identificado.
   1. **Acción:** Pega ese contenido en un nuevo archivo .html dentro de /fragments/. Nombra los archivos de forma lógica, por ejemplo:
      1. El contenido de #perfil-egreso-modal irá a /fragments/perfil\_egreso.html.
      1. El contenido de #comunicacion-grafica-modal irá a /fragments/comunicacion\_grafica.html.
      1. Y así sucesivamente.
1. **Actualiza el HTML del index.html** para preparar los modales para la carga dinámica.
   1. **Acción:** Deja el div.modal-scrollable-content de cada modal afectado **vacío**, pero añade dos elementos:

      1. Un atributo data-content-url con la ruta al archivo de fragmento correspondiente.
      1. Un placeholder de "Cargando..." o un spinner que se mostrará mientras se carga el contenido.
   1. **Ejemplo de cómo debe quedar el div.modal-scrollable-content en index.html:**

      codeHtml

      <div class="modal-scrollable-content" data-content-url="fragments/perfil\_egreso.html">

      `    `<div class="modal-loader" aria-label="Cargando contenido..."></div> 

      </div>

1. **Actualiza el archivo style.css** para añadir estilos para el modal-loader.
   1. **Acción:** Proporciona un estilo CSS para la clase .modal-loader. Debe ser un spinner de carga o un texto simple de "Cargando...". Debe estar centrado dentro del modal-scrollable-content mientras espera.
   1. **Ejemplo de CSS para el loader:**

      codeCss

      .modal-loader {

      `    `display: flex;

      `    `align-items: center;

      `    `justify-content: center;

      `    `min-height: 150px;

      `    `font-style: italic;

      `    `color: #888;

      }

      .modal-loader::after {

      `    `content: '';

      `    `width: 30px;

      `    `height: 30px;

      `    `border: 3px solid #ccc;

      `    `border-top-color: var(--primary-color);

      `    `border-radius: 50%;

      `    `animation: spin 1s linear infinite;

      }

      @keyframes spin {

      `    `to { transform: rotate(360deg); }

      }

1. **Refactoriza el archivo script.js** para manejar la nueva lógica de carga.
   1. **Acción:** Modifica la función que maneja la apertura de los modales. Esta función debe ser ahora async/await para manejar la petición fetch.
   1. **La nueva lógica debe ser:**

      1. Cuando se hace clic en un botón .open-modal-btn:
      1. Obtener el modalId del botón y encontrar el targetModal.
      1. Dentro del targetModal, encontrar el div.modal-scrollable-content.
      1. Obtener la url del contenido desde el atributo data-content-url. Si no tiene este atributo, significa que el contenido ya está en el HTML y no necesita cargarse.
      1. **Verificar si el contenido ya fue cargado previamente.** Se puede hacer añadiendo un atributo data-loaded="true" al contenedor de contenido después de la primera carga.
      1. **Si no ha sido cargado (!contentContainer.hasAttribute('data-loaded')):**
         1. Mostrar el modal-loader (si no es visible por defecto).
         1. Usar fetch para obtener el contenido de la url.
         1. Usar try...catch para manejar errores de red.
         1. Si el fetch es exitoso (response.ok):
            1. Obtener el texto (response.text()).
            1. Reemplazar el contenido del modal-scrollable-content con el texto HTML recibido (contentContainer.innerHTML = htmlContent).
            1. Marcar el contenedor como cargado (contentContainer.setAttribute('data-loaded', 'true');).
         1. Si el fetch falla:
            1. Mostrar un mensaje de error dentro del modal-scrollable-content.
      1. Una vez que el await fetch se complete (o si el contenido ya estaba cargado), **procede a mostrar el modal** como lo hacías antes (targetModal.style.display = 'block';, etc.).

**Proporcióname el código JavaScript completo y actualizado para el manejo de modales con esta nueva lógica de carga bajo demanda. Asegúrate de que siga manejando correctamente los modales que *no* usan carga dinámica (cuyo div.modal-scrollable-content no tendrá el atributo data-content-url).**

**Resumen de Entregables:**

1. Un ejemplo de un archivo de fragmento HTML (ej. /fragments/perfil\_egreso.html).
1. La estructura HTML modificada para un modal en index.html.
1. El CSS para el .modal-loader.
1. La función JavaScript async completa para manejar la apertura de modales, que incluya la lógica de fetch y cacheo simple.

