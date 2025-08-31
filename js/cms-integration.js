/**
 * Integración con Decap CMS - Cargar contenido dinámico
 * Este archivo carga datos de los archivos JSON editados via CMS
 */

// Configuración base
const CMS_CONFIG = {
    dataPath: './data/',
    fallbackData: true
};

/**
 * Cargar datos de configuración general
 */
async function loadSiteConfig() {
    try {
        const response = await fetch(`${CMS_CONFIG.dataPath}config.json`);
        if (!response.ok) throw new Error('No se pudo cargar la configuración');
        
        const config = await response.json();
        
        // Actualizar elementos del DOM con la configuración
        updateElementById('institution-name', config.institution_name);
        updateElementById('institution-cct', config.cct);
        updateElementById('institution-address', config.address);
        updateElementById('institution-phone', config.phone);
        updateElementById('institution-email', config.email);
        updateElementById('institution-schedule', config.schedule);
        updateElementById('institution-mission', config.mission);
        updateElementById('institution-vision', config.vision);
        updateElementById('institution-values', config.values);
        
        console.log('✅ Configuración cargada correctamente');
        
    } catch (error) {
        console.warn('⚠️ Error cargando configuración:', error);
    }
}

/**
 * Cargar testimonios dinámicamente
 */
async function loadTestimonios() {
    try {
        const response = await fetch(`${CMS_CONFIG.dataPath}testimonios.json`);
        if (!response.ok) throw new Error('No se pudieron cargar los testimonios');
        
        const testimonios = await response.json();
        
        // Contenedor donde insertar testimonios
        const container = document.getElementById('testimonios-container');
        if (!container) return;
        
        container.innerHTML = ''; // Limpiar contenido existente
        
        testimonios.forEach(testimonio => {
            const testimonioElement = createTestimonioElement(testimonio);
            container.appendChild(testimonioElement);
        });
        
        console.log(`✅ ${testimonios.length} testimonios cargados`);
        
    } catch (error) {
        console.warn('⚠️ Error cargando testimonios:', error);
    }
}

/**
 * Cargar noticias dinámicamente
 */
async function loadNoticias() {
    try {
        const response = await fetch(`${CMS_CONFIG.dataPath}noticias.json`);
        if (!response.ok) throw new Error('No se pudieron cargar las noticias');
        
        const data = await response.json();
        const noticias = data.noticias || [];
        
        // Contenedor donde insertar noticias
        const container = document.getElementById('noticias-container');
        if (!container) return;
        
        container.innerHTML = ''; // Limpiar contenido existente
        
        // Mostrar solo las 3 noticias más recientes
        const noticiasRecientes = noticias
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        noticiasRecientes.forEach(noticia => {
            const noticiaElement = createNoticiaElement(noticia);
            container.appendChild(noticiaElement);
        });
        
        console.log(`✅ ${noticiasRecientes.length} noticias cargadas`);
        
    } catch (error) {
        console.warn('⚠️ Error cargando noticias:', error);
    }
}

/**
 * Cargar personal docente dinámicamente
 */
async function loadDocentes() {
    try {
        const response = await fetch(`${CMS_CONFIG.dataPath}docentes.json`);
        if (!response.ok) throw new Error('No se pudo cargar el personal docente');
        
        const data = await response.json();
        const docentes = data.docentes || [];
        
        // Contenedor donde insertar docentes
        const container = document.getElementById('docentes-container');
        if (!container) return;
        
        container.innerHTML = ''; // Limpiar contenido existente
        
        docentes.forEach(docente => {
            const docenteElement = createDocenteElement(docente);
            container.appendChild(docenteElement);
        });
        
        console.log(`✅ ${docentes.length} docentes cargados`);
        
    } catch (error) {
        console.warn('⚠️ Error cargando docentes:', error);
    }
}

/**
 * Cargar eventos dinámicamente
 */
async function loadEventos() {
    try {
        const response = await fetch(`${CMS_CONFIG.dataPath}eventos_calendario_pwa.json`);
        if (!response.ok) throw new Error('No se pudieron cargar los eventos');
        
        const data = await response.json();
        const eventos = data.eventos || [];
        
        // Actualizar calendario si existe
        if (typeof updateCalendar === 'function') {
            updateCalendar(eventos);
        }
        
        // Mostrar próximos eventos
        const proximosEventos = eventos
            .filter(evento => new Date(evento.start) >= new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5);
        
        const container = document.getElementById('proximos-eventos-container');
        if (container) {
            container.innerHTML = '';
            proximosEventos.forEach(evento => {
                const eventoElement = createEventoElement(evento);
                container.appendChild(eventoElement);
            });
        }
        
        console.log(`✅ ${eventos.length} eventos cargados`);
        
    } catch (error) {
        console.warn('⚠️ Error cargando eventos:', error);
    }
}

// Funciones de utilidad para crear elementos HTML

function createTestimonioElement(testimonio) {
    const div = document.createElement('div');
    div.className = 'testimonio-card card-hover animate-on-scroll';
    div.innerHTML = `
        <div class="testimonio-content">
            <p class="testimonio-text">"${testimonio.texto}"</p>
            <div class="testimonio-author">
                ${testimonio.imagen ? `<img src="${testimonio.imagen}" alt="${testimonio.nombre}" class="testimonio-avatar">` : ''}
                <div class="testimonio-info">
                    <h4>${testimonio.nombre}</h4>
                    ${testimonio.infoExtra ? `<p class="testimonio-extra">${testimonio.infoExtra}</p>` : ''}
                </div>
            </div>
        </div>
    `;
    return div;
}

function createNoticiaElement(noticia) {
    const div = document.createElement('div');
    div.className = 'noticia-card card-hover';
    const fecha = new Date(noticia.date).toLocaleDateString('es-ES');
    div.innerHTML = `
        <div class="noticia-content">
            <span class="noticia-categoria">${noticia.category || 'General'}</span>
            <h3>${noticia.title}</h3>
            <p class="noticia-fecha">${fecha}</p>
            <p class="noticia-resumen">${noticia.summary}</p>
            <p class="noticia-autor">Por: ${noticia.author}</p>
        </div>
    `;
    return div;
}

function createDocenteElement(docente) {
    const div = document.createElement('div');
    div.className = 'docente-card card-hover';
    div.innerHTML = `
        <div class="docente-content">
            ${docente.photo ? `<img src="${docente.photo}" alt="${docente.name}" class="docente-foto">` : ''}
            <h4>${docente.name}</h4>
            <p class="docente-cargo">${docente.position}</p>
            ${docente.specialization ? `<p class="docente-especialization">${docente.specialization}</p>` : ''}
            ${docente.email ? `<p class="docente-email"><a href="mailto:${docente.email}">${docente.email}</a></p>` : ''}
        </div>
    `;
    return div;
}

function createEventoElement(evento) {
    const div = document.createElement('div');
    div.className = 'evento-card card-hover';
    const fechaInicio = new Date(evento.start).toLocaleDateString('es-ES');
    div.innerHTML = `
        <div class="evento-content">
            <h4>${evento.title}</h4>
            <p class="evento-fecha">${fechaInicio}</p>
            <p class="evento-descripcion">${evento.description}</p>
        </div>
    `;
    return div;
}

// Función de utilidad para actualizar elementos del DOM
function updateElementById(id, value) {
    const element = document.getElementById(id);
    if (element && value) {
        element.textContent = value;
    }
}

/**
 * Inicializar carga de datos del CMS
 */
function initCMSIntegration() {
    console.log('🚀 Iniciando integración con CMS...');
    
    // Cargar todos los datos de forma asíncrona
    Promise.all([
        loadSiteConfig(),
        loadTestimonios(), 
        loadNoticias(),
        loadDocentes(),
        loadEventos()
    ]).then(() => {
        console.log('✅ Integración CMS completada');
    }).catch(error => {
        console.error('❌ Error en integración CMS:', error);
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCMSIntegration);
} else {
    initCMSIntegration();
}

// Exportar funciones para uso manual
window.CMS = {
    loadSiteConfig,
    loadTestimonios,
    loadNoticias,
    loadDocentes,
    loadEventos,
    reload: initCMSIntegration
};