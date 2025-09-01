/**
 * Service Worker para Bachillerato Héroes de la Patria
 * Versión: 4.0.0
 * Estrategia de Caché: Cache First con actualización en segundo plano
 * Tamaño máximo de caché: 50MB
 */

// Configuración
const CONFIG = {
  // Nombre y versión del caché
  CACHE_NAME: 'heroes-patria-cache-v4',
  // Tamaño máximo de la caché en bytes (50MB)
  MAX_CACHE_SIZE: 50 * 1024 * 1024,
  // Tiempo máximo de vida de los recursos en caché (en días)
  MAX_AGE_DAYS: 30,
  // Rutas que siempre deben ir a la red primero
  NETWORK_FIRST_PATTERNS: [
    /\/api\//,        // Todas las llamadas a APIs
    /\/auth\//,      // Rutas de autenticación
    /\/notifications/, // Notificaciones
    /\/data\//        // Datos dinámicos
  ],
  // Rutas que deben usar la estrategia de solo caché
  CACHE_ONLY_PATTERNS: [
    /\/static\//,     // Recursos estáticos
    /\.(?:png|jpg|jpeg|webp|svg|gif|ico|woff2?|eot|ttf|otf)$/ // Archivos estáticos
  ],
  // Rutas que deben usar la estrategia de red primero
  NETWORK_FIRST_PATHS: [
    '/',
    '/index.html',
    '/contacto',
    '/servicios',
    '/oferta-educativa'
  ]
};

// Lista de archivos a cachear durante la instalación
const PRECACHE_ASSETS = [
  // HTML
  '/',
  '/index.html',
  // CSS
  '/css/style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  // JS
  '/js/script.js',
  // Imágenes y recursos estáticos
  '/images/logo-bachillerato-HDLP.webp',
  '/images/logo/logo-bachillerato-HDLP2.webp',
  '/images/logo/logo-bachillerato-HDLP.webp',
  // Fachadas
  '/images/hero/fachada1.webp',
  '/images/hero/fachada2.webp',
  '/images/hero/fachada3.webp',
  '/images/hero/fachada4.webp',
  '/images/hero/fachada5.webp',
  '/images/hero/fachada6.webp',
  '/images/hero/fachada7.webp',
  // Video poster
  '/images/video_poster.webp',
  // Testimonios
  '/images/testimonios/ana_perez.jpeg',
  '/images/testimonios/carlos_lopez.jpeg',
  '/images/testimonios/sofia_ramirez.jpeg',
  '/images/testimonios/luis_hernandez.jpeg',
  '/images/testimonios/elena_torres.jpeg',
  // Evento día del estudiante
  '/images/eventos/dia_estudiante/evento_dia_estudiante1.webp',
  '/images/eventos/dia_estudiante/evento_dia_estudiante2.webp',
  '/images/eventos/dia_estudiante/evento_dia_estudiante3.webp',
  // Solo archivos realmente presentes
  'images/fachada_placeholder.jpg', // corregido
  'data/recursos_pwa.json', // corregido
  '/images/app_icons/icon-192x192.png',
  '/images/app_icons/icon-512x512.png',
  '/images/app_icons/favicon.ico', // corregido
];

// Versión de caché para limpieza
const CURRENT_CACHES = {
  precache: CONFIG.CACHE_NAME,
  runtime: 'runtime-cache-v1',
  images: 'images-cache-v1',
  api: 'api-cache-v1'
};

/**
 * Evento 'install': Se dispara cuando se instala el Service Worker
 */
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  // Forzar la activación inmediata del nuevo Service Worker
  self.skipWaiting();
  
  // Precachar recursos esenciales
  event.waitUntil(
    caches.open(CONFIG.CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precachando recursos esenciales');
        // Precarga robusta: solo agrega recursos que respondan correctamente
return Promise.all(
  PRECACHE_ASSETS.map(async asset => {
    try {
      const response = await fetch(asset, {cache: 'no-store'});
      if (!response.ok) throw new Error('No se pudo obtener: ' + asset);
      await cache.put(asset, response.clone());
      return asset;
    } catch (e) {
      console.warn('[SW] No se pudo precachear:', asset, e);
      return null;
    }
  })
);
      })
      .then(() => {
        console.log('[SW] Recursos precacheados exitosamente');
        // Precargar recursos adicionales en segundo plano
        return precacheAdditionalResources();
      })
      .catch(error => {
        console.error('[SW] Error durante la instalación:', error);
      })
  );
});

/**
 * Calcula el tamaño total de la caché
 * @param {Array<string>} cacheKeys - Lista de claves de caché
 * @returns {Promise<number>} Tamaño total en bytes
 */
async function calculateCacheSize(cacheKeys) {
  let totalSize = 0;
  
  for (const key of cacheKeys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const headers = response.headers;
        const contentLength = headers.get('content-length');
        
        if (contentLength) {
          totalSize += parseInt(contentLength, 10);
        } else if (response.blob) {
          // Para respuestas sin content-length, leer el blob
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
  }
  
  return totalSize;
}

/**
 * Precarga recursos adicionales en segundo plano
 * @returns {Promise<void>}
 */
async function precacheAdditionalResources() {
  if (!('caches' in self)) {
    console.log('[SW] Cache API no soportada, omitiendo precarga de recursos adicionales');
    return;
  }

  try {
    const cache = await caches.open(CURRENT_CACHES.images);
    const additionalResources = [
  // (Vacío, ya que el usuario no utiliza recursos adicionales de galería, equipo o campus)
];
    
    console.log('[SW] Iniciando precarga de recursos adicionales...');
    
    // Precargar recursos adicionales con manejo de errores individual
    const precachePromises = additionalResources.map(async (resource) => {
      try {
        const response = await fetch(resource, {
          cache: 'no-store', // Evitar caché del navegador
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response && response.ok) {
          // Clonar la respuesta antes de usarla
          const responseToCache = response.clone();
          await cache.put(resource, responseToCache);
          console.log(`[SW] Recurso adicional cacheado: ${resource}`);
          return { resource, success: true };
        } else {
          console.warn(`[SW] Respuesta no válida para ${resource}:`, response.status);
          return { resource, success: false, error: `Status: ${response.status}` };
        }
      } catch (error) {
        console.warn(`[SW] No se pudo cachear recurso adicional ${resource}:`, error);
        return { resource, success: false, error: error.message };
      }
    });
    
    // Esperar a que todas las precargas terminen
    const results = await Promise.allSettled(precachePromises);
    
    // Resumen de la precarga
    const summary = {
      total: results.length,
      success: results.filter(r => r.status === 'fulfilled' && r.value.success).length,
      failed: results.filter(r => r.status === 'rejected' || !r.value.success).length
    };
    
    console.log(`[SW] Precarga de recursos completada: ${summary.success}/${summary.total} exitosas`, summary);
    
    // Limpiar caché si es necesario
    await cleanupOldCaches();
    
  } catch (error) {
    console.error('[SW] Error en precarga de recursos adicionales:', error);
  }
}

/**
 * Limpia las cachés antiguas que ya no están en uso
 * @returns {Promise<void>}
 */
async function cleanupOldCaches() {
  try {
    const cacheKeys = await caches.keys();
    const currentCacheNames = Object.values(CURRENT_CACHES);
    const cachesToDelete = cacheKeys.filter(key => !currentCacheNames.includes(key));
    
    if (cachesToDelete.length === 0) {
      console.log('[SW] No hay cachés obsoletas para limpiar');
      return;
    }
    
    console.log(`[SW] Limpiando ${cachesToDelete.length} cachés obsoletas`);
    
    await Promise.all(
      cachesToDelete.map(cacheName => {
        console.log(`[SW] Eliminando caché obsoleta: ${cacheName}`);
        return caches.delete(cacheName)
          .then(success => {
            if (success) {
              console.log(`[SW] Caché eliminada: ${cacheName}`);
            } else {
              console.warn(`[SW] No se pudo eliminar la caché: ${cacheName}`);
            }
            return success;
          })
          .catch(error => {
            console.error(`[SW] Error al eliminar la caché ${cacheName}:`, error);
            return false;
          });
      })
    );
    
    console.log('[SW] Limpieza de cachés obsoletas completada');
  } catch (error) {
    console.error('[SW] Error en la limpieza de cachés obsoletas:', error);
  }
}

/**
 * Limpia los datos de caché antiguos según la configuración MAX_AGE_DAYS
 * @returns {Promise<void>}
 */
async function cleanOldCacheData() {
  try {
    const cache = await caches.open(CURRENT_CACHES.precache);
    const requests = await cache.keys();
    const now = Date.now();
    const maxAgeMs = CONFIG.MAX_AGE_DAYS * 24 * 60 * 60 * 1000; // Convertir días a milisegundos
    
    const cleanupPromises = requests.map(async request => {
      try {
        const response = await cache.match(request);
        if (!response) return;
        
        const dateHeader = response.headers.get('date');
        if (!dateHeader) return;
        
        const resourceDate = new Date(dateHeader).getTime();
        if (now - resourceDate > maxAgeMs) {
          await cache.delete(request);
          console.log(`[SW] Recurso expirado eliminado: ${request.url}`);
        }
      } catch (error) {
        console.warn(`[SW] Error al limpiar recurso ${request.url}:`, error);
      }
    });
    
    await Promise.all(cleanupPromises);
    console.log('[SW] Limpieza de recursos expirados completada');
  } catch (error) {
    console.error('[SW] Error en la limpieza de recursos expirados:', error);
  }
}

/**
 * Evento 'activate': Se dispara cuando el Service Worker se activa.
 * Se encarga de limpiar cachés antiguas y reclamar el control de las pestañas.
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  
  // Mantener el SW activo hasta que se complete la limpieza
  event.waitUntil(
    (async () => {
      try {
        // Habilitar la navegación precargada si está disponible
        if (self.registration.navigationPreload) {
          console.log('[SW] Habilitando preload de navegación');
          await self.registration.navigationPreload.enable();
        }
        
        // Obtener todas las claves de caché
        const cacheKeys = await caches.keys();
        console.log('[SW] Cachés encontradas:', cacheKeys);
        
        // Filtrar las cachés que no están en CURRENT_CACHES
        const cachesToDelete = cacheKeys.filter(
          key => !Object.values(CURRENT_CACHES).includes(key)
        );
        
        // Eliminar cachés antiguas
        const deletionPromises = cachesToDelete.map(cacheName => {
          console.log(`[SW] Eliminando caché obsoleta: ${cacheName}`);
          return caches.delete(cacheName)
            .then(success => {
              if (success) {
                console.log(`[SW] Caché eliminada: ${cacheName}`);
              } else {
                console.warn(`[SW] No se pudo eliminar la caché: ${cacheName}`);
              }
              return success;
            })
            .catch(error => {
              console.error(`[SW] Error al eliminar la caché ${cacheName}:`, error);
              return false;
            });
        });
        
        // Esperar a que se completen las eliminaciones
        await Promise.all(deletionPromises);
        
        // Limpiar caché de datos antiguos
        await cleanOldCacheData();
        
        // Reclamar el control de las pestañas abiertas inmediatamente
        console.log('[SW] Reclamando control de clientes...');
        await self.clients.claim();
        
        // Notificar a todas las pestañas controladas que el SW está listo
        const clients = await self.clients.matchAll({ includeUncontrolled: true });
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_READY',
            message: 'Service Worker activado y listo',
            version: '4.0.0',
            timestamp: new Date().toISOString()
          });
        });
        
        console.log('[SW] Activación completada');
        return true;
      } catch (error) {
        console.error('[SW] Error durante la activación:', error);
        throw error;
      }
    })()
  );
});

/**
 * Limpia datos de caché antiguos según la configuración de tiempo de vida
 */
async function cleanOldCacheData() {
  try {
    const cache = await caches.open(CURRENT_CACHES.runtime);
    const requests = await cache.keys();
    const now = Date.now();
    
    const cleanupPromises = requests.map(async request => {
      const response = await cache.match(request);
      if (!response) return;
      
      // Obtener la fecha de la cabecera de la respuesta o usar la actual
      const dateHeader = response.headers.get('date');
      const responseDate = dateHeader ? new Date(dateHeader).getTime() : now;
      
      // Calcular la antigüedad en días
      const ageInDays = (now - responseDate) / (1000 * 60 * 60 * 24);
      
      // Si es más antiguo que el máximo permitido, eliminarlo
      if (ageInDays > CONFIG.MAX_AGE_DAYS) {
        console.log(`[SW] Eliminando recurso expirado: ${request.url} (${Math.floor(ageInDays)} días)`);
        await cache.delete(request);
      }
    });
    
    await Promise.all(cleanupPromises);
  } catch (error) {
    console.error('[SW] Error al limpiar caché antigua:', error);
  }
}

/**
 * Maneja mensajes del hilo principal
 */
self.addEventListener('message', event => {
  if (!event.data) return;
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CLEAR_CACHE':
      // Limpiar caché específica o todas
      clearCache(payload?.cacheName);
      break;
      
    case 'GET_CACHE_INFO':
      // Devolver información sobre las cachés
      getCacheInfo().then(info => {
        event.ports[0]?.postMessage(info);
      });
      break;
      
    case 'UPDATE_AVAILABLE':
      // Nueva versión disponible
      console.log('[SW] Nueva versión de la aplicación disponible');
      self.skipWaiting(); // Activar el nuevo SW inmediatamente
      break;
      
    case 'SKIP_WAITING':
      // Saltar la fase de espera
      self.skipWaiting();
      break;
  }
});

/**
 * Limpia una caché específica o todas las cachés
 * @param {string} [cacheName] - Nombre de la caché a limpiar (opcional)
 */
async function clearCache(cacheName) {
  try {
    if (cacheName) {
      // Limpiar una caché específica
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      await Promise.all(requests.map(request => cache.delete(request)));
      console.log(`[SW] Caché '${cacheName}' limpiada`);
    } else {
      // Limpiar todas las cachés
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));
      console.log('[SW] Todas las cachés limpiadas');
    }
    
    // Notificar a los clientes que la caché fue limpiada
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_CLEARED',
        cacheName: cacheName || 'all',
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('[SW] Error al limpiar la caché:', error);
  }
}

/**
 * Obtiene información sobre las cachés
 * @returns {Promise<Object>} Información de las cachés
 */
async function getCacheInfo() {
  try {
    const cacheKeys = await caches.keys();
    const cacheInfo = {};
    
    for (const key of cacheKeys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      
      // Calcular tamaño total de la caché
      let size = 0;
      const items = [];
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const contentLength = response.headers.get('content-length');
          const itemSize = contentLength ? parseInt(contentLength, 10) : 0;
          size += itemSize;
          
          items.push({
            url: request.url,
            size: itemSize,
            date: response.headers.get('date') || new Date().toISOString()
          });
        }
      }
      
      cacheInfo[key] = {
        size: formatBytes(size),
        count: requests.length,
        items: items
      };
    }
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      caches: cacheInfo,
      totalSize: formatBytes(
        Object.values(cacheInfo).reduce((sum, info) => 
          sum + parseFloat(info.size), 0)
      )
    };
  } catch (error) {
    console.error('[SW] Error al obtener información de la caché:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Formatea bytes a un string legible
 * @param {number} bytes - Tamaño en bytes
 * @param {number} decimals - Número de decimales
 * @returns {string} Tamaño formateado
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Evento 'install': Se dispara cuando se instala el Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  // Forzar la activación inmediata del nuevo Service Worker
  self.skipWaiting();
  
  // Precachar recursos esenciales
  event.waitUntil(
    caches.open(CONFIG.CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precachando recursos esenciales');
        // Precarga robusta: solo agrega recursos que respondan correctamente
return Promise.all(
  PRECACHE_ASSETS.map(async asset => {
    try {
      const response = await fetch(asset, {cache: 'no-store'});
      if (!response.ok) throw new Error('No se pudo obtener: ' + asset);
      await cache.put(asset, response.clone());
      return asset;
    } catch (e) {
      console.warn('[SW] No se pudo precachear:', asset, e);
      return null;
    }
  })
);
      })
      .then(() => {
        console.log('[SW] Recursos precacheados exitosamente');
        // Precargar recursos adicionales en segundo plano
        return precacheAdditionalResources();
      })
      .catch(error => {
        console.error('[SW] Error durante la instalación:', error);
      })
  );
});

// Estrategias de caché disponibles
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'CACHE_FIRST',
  NETWORK_FIRST: 'NETWORK_FIRST',
  NETWORK_ONLY: 'NETWORK_ONLY',
  CACHE_ONLY: 'CACHE_ONLY',
  STALE_WHILE_REVALIDATE: 'STALE_WHILE_REVALIDATE'
};

/**
 * Maneja una solicitud con estrategia Cache First
 */
async function cacheFirst(request) {
  try {
    // Intentar obtener de la caché primero
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Si está en caché, devolverlo
      return cachedResponse;
    }
    
    // Si no está en caché, ir a la red
    return networkFirst(request);
  } catch (error) {
    console.error('[SW] Error en estrategia Cache First:', error);
    throw error;
  }
}

/**
 * Maneja una solicitud con estrategia Network First
 */
async function networkFirst(request) {
  try {
    // Intentar obtener de la red primero
    const networkResponse = await fetch(request);
    
    // Si la respuesta es exitosa, guardar en caché y devolver
    if (networkResponse && networkResponse.status < 400) {
      // Clonar la respuesta para poder usarla dos veces
      const responseToCache = networkResponse.clone();
      
      // Guardar en caché en segundo plano
      caches.open(CURRENT_CACHES.runtime).then(cache => {
        cache.put(request, responseToCache).catch(console.error);
      }).catch(console.error);
      
      return networkResponse;
    }
    
    // Si falla la red, intentar obtener de la caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay respuesta en caché, devolver la respuesta de red (aunque sea un error)
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error en estrategia Network First:', error);
    
    // Si hay un error de red, intentar obtener de la caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay respuesta en caché, lanzar el error
    throw error;
  }
}

/**
 * Maneja una solicitud con estrategia Stale While Revalidate
 */
async function staleWhileRevalidate(request) {
  try {
    // Intentar obtener de la caché primero (puede ser obsoleto)
    const cachedResponse = await caches.match(request);
    
    // Si hay una respuesta en caché, devolverla inmediatamente (aunque sea obsoleta)
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay respuesta en caché, esperar por la red
    return fetch(request);
  } catch (error) {
    console.error('[SW] Error en estrategia Stale While Revalidate:', error);
    throw error;
  }
}

/**
 * Maneja una solicitud con estrategia Cache Only
 */
async function cacheOnly(request) {
  const cache = await caches.open(CONFIG.CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    // Fallback a la red si no está en caché
    try {
      const networkResponse = await fetch(request);
      if (networkResponse && networkResponse.ok) {
        return networkResponse;
      }
    } catch (e) {}
    // Si tampoco está disponible en red, responde con mensaje claro
    return new Response('Recurso no disponible en caché ni en red', {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Maneja una solicitud con estrategia Network Only
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * Maneja una solicitud de navegación (página HTML)
 */
async function handleNavigationRequest(request) {
  try {
    // Intentar obtener de la red primero
    return await networkFirst(request);
  } catch (error) {
    console.error('[SW] Error al cargar la página:', error);
    
    // Si hay un error de red, intentar obtener de la caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay respuesta en caché, mostrar página de error offline
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Si no hay página offline, devolver una respuesta de error genérica
    return new Response(
      '<h1>Sin conexión</h1><p>No se pudo cargar la página y no hay una versión en caché disponible.</p>',
      { 
        status: 503, 
        statusText: 'Sin conexión',
        headers: { 'Content-Type': 'text/html' } 
      }
    );
  }
}

/**
 * Evento 'fetch': Intercepta todas las solicitudes de red
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // No manejar solicitudes que no sean GET
  if (request.method !== 'GET') {
    return;
  }
  
  // No manejar solicitudes de extensiones o chrome-extension://
  if (url.protocol === 'chrome-extension:' || 
      url.hostname === 'chrome-extension' ||
      url.hostname === '') {
    return;
  }
  
  // Estrategias de caché disponibles
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'CACHE_FIRST',
  NETWORK_FIRST: 'NETWORK_FIRST',
  STALE_WHILE_REVALIDATE: 'STALE_WHILE_REVALIDATE',
  CACHE_ONLY: 'CACHE_ONLY',
  NETWORK_ONLY: 'NETWORK_ONLY'
};

// Determina la estrategia de caché a usar para una solicitud
function getCacheStrategy(request) {
  const url = new URL(request.url);
  // Prioridad: patrones explícitos de configuración
  if (CONFIG.CACHE_ONLY_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.CACHE_ONLY;
  }
  if (CONFIG.NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  if (CONFIG.NETWORK_FIRST_PATHS.includes(url.pathname)) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  // Por defecto: Cache First
  return CACHE_STRATEGIES.CACHE_FIRST;
}

// Para solicitudes de navegación, usar el manejador específico
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Determinar la estrategia de caché a utilizar
  const strategy = getCacheStrategy(request);
  
  // Manejar la solicitud según la estrategia
  try {
    let responsePromise;
    
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        responsePromise = cacheFirst(request);
        break;
        
      case CACHE_STRATEGIES.NETWORK_FIRST:
        responsePromise = networkFirst(request);
        break;
        
      case CACHE_STRATEGIES.NETWORK_ONLY:
        responsePromise = networkOnly(request);
        break;
        
      case CACHE_STRATEGIES.CACHE_ONLY:
        responsePromise = cacheOnly(request);
        break;
        
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        responsePromise = staleWhileRevalidate(request);
        break;
        
      default:
        responsePromise = cacheFirst(request);
    }
    
    // Responder con la promesa de respuesta
    event.respondWith(responsePromise);
  } catch (error) {
    console.error(`[SW] Error al manejar la solicitud ${request.url}:`, error);
    
    // Si hay un error, intentar devolver una respuesta de error apropiada
    if (request.mode === 'navigate') {
      event.respondWith(
        caches.match('/offline.html')
          .then(offlineResponse => offlineResponse || 
            new Response(
              '<h1>Error</h1><p>No se pudo cargar la página.</p>',
              { status: 500, headers: { 'Content-Type': 'text/html' } }
            )
          )
      );
    } else {
      // Para otros recursos, dejar que el navegador maneje el error
      event.respondWith(fetch(request));
    }
  }
});

// --- Configuración de notificaciones push ---
const NOTIFICATION_DEFAULTS = {
  title: 'Bachillerato Héroes',
  icon: '/images/icon-192x192.png',
  badge: '/images/badge-72x72.png',
  vibrate: [200, 100, 200, 100, 200, 100, 400],
  data: {
    timestamp: Date.now(),
    url: '/',
    // Otros datos por defecto
  },
  // Tiempo en segundos para que la notificación se cierre automáticamente (0 = no cerrar)
  requireInteraction: false,
  // Acciones disponibles (máx 2 en la mayoría de navegadores)
  actions: [
    // { action: 'ver-detalles', title: 'Ver detalles', icon: '/images/eye-24x24.png' },
    // { action: 'descartar', title: 'Descartar', icon: '/images/close-24x24.png' }
  ]
};

/**
 * Muestra una notificación push
 * @param {Object} options - Opciones de la notificación
 * @returns {Promise<Notification>}
 */
async function showNotification(options) {
  // Combinar con los valores por defecto
  const notificationOptions = {
    ...NOTIFICATION_DEFAULTS,
    ...options,
    data: {
      ...NOTIFICATION_DEFAULTS.data,
      ...(options.data || {})
    },
    // Mantener las acciones por defecto a menos que se sobrescriban explícitamente
    actions: options.actions !== undefined ? options.actions : NOTIFICATION_DEFAULTS.actions
  };
  
  // Asegurarse de que la URL sea absoluta
  if (notificationOptions.data.url && !notificationOptions.data.url.startsWith('http')) {
    notificationOptions.data.url = new URL(notificationOptions.data.url, self.location.origin).href;
  }
  
  // Mostrar la notificación
  return self.registration.showNotification(
    notificationOptions.title,
    notificationOptions
  );
}

/**
 * Maneja el evento de recepción de una notificación push
 */
self.addEventListener('push', event => {
  console.log('[SW] Evento push recibido');
  
  // Procesar los datos de la notificación
  let notificationData = {};
  
  try {
    // Intentar parsear como JSON
    notificationData = event.data ? event.data.json() : {};
  } catch (error) {
    console.warn('[SW] No se pudo parsear el payload push como JSON, usando texto plano');
    // Si falla, usar el texto plano
    notificationData = {
      title: 'Nueva notificación',
      body: event.data ? event.data.text() : 'Tienes una nueva notificación'
    };
  }
  
  console.log('[SW] Datos de la notificación push:', notificationData);
  
  // Mostrar la notificación
  event.waitUntil(
    showNotification(notificationData)
      .catch(error => {
        console.error('[SW] Error al mostrar la notificación:', error);
      })
  );
});

/**
 * Maneja el evento de clic en una notificación
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] Clic en notificación:', event.notification);
  
  // Cerrar la notificación
  event.notification.close();
  
  // Obtener los datos de la notificación
  const notificationData = event.notification.data || {};
  const action = event.action || 'default';
  
  // Manejar acciones personalizadas
  switch (action) {
    case 'ver-detalles':
      // Ejemplo: Abrir una página de detalles
      notificationData.url = notificationData.detailsUrl || '/notificaciones/detalles';
      break;
      
    case 'descartar':
      // No hacer nada, solo cerrar la notificación
      console.log('[SW] Notificación descartada');
      return;
      
    case 'default':
    default:
      // Acción por defecto (clic en el cuerpo de la notificación)
      console.log('[SW] Clic en notificación (acción por defecto)');
      break;
  }
  
  // Construir la URL a abrir
  let urlToOpen = notificationData.url || '/';
  
  // Asegurarse de que la URL sea absoluta
  try {
    const url = new URL(urlToOpen, self.location.origin);
    urlToOpen = url.href;
  } catch (error) {
    console.error('[SW] URL inválida:', urlToOpen, error);
    urlToOpen = '/';
  }
  
  // Abrir o enfocar la ventana
  event.waitUntil(
    (async () => {
      // Obtener todas las ventanas abiertas controladas por este service worker
      const clientsList = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });
      
      // Buscar una ventana existente que ya tenga esta URL
      const targetUrl = new URL(urlToOpen);
      const existingWindow = clientsList.find(client => {
        try {
          const clientUrl = new URL(client.url);
          return clientUrl.pathname === targetUrl.pathname && 'focus' in client;
        } catch (e) {
          return false;
        }
      });
      
      if (existingWindow) {
        // Si existe una ventana con la misma ruta, enfocarla
        console.log('[SW] Enfocando ventana existente:', urlToOpen);
        return existingWindow.focus();
      } else if (clients.openWindow) {
        // Si no existe, abrir una nueva ventana
        console.log('[SW] Abriendo nueva ventana:', urlToOpen);
        return clients.openWindow(urlToOpen);
      }
      
      console.warn('[SW] No se pudo abrir la ventana');
    })()
  );
});

/**
 * Maneja el cierre de una notificación
 */
self.addEventListener('notificationclose', event => {
  console.log('[SW] Notificación cerrada:', event.notification);
  // Aquí podrías registrar estadísticas sobre notificaciones cerradas
});

/**
 * Maneja el evento de suscripción a notificaciones push
 */
self.addEventListener('pushsubscriptionchange', event => {
  console.log('[SW] La suscripción push ha cambiado');
  
  event.waitUntil(
    // Aquí deberías implementar la lógica para actualizar la suscripción en tu servidor
    self.registration.pushManager.getSubscription()
      .then(subscription => {
        if (!subscription) {
          console.log('[SW] El usuario canceló la suscripción');
          return;
        }
        
        console.log('[SW] Nueva suscripción:', subscription);
        // Enviar la nueva suscripción al servidor
        // return fetch('/api/update-subscription', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(subscription)
        // });
      })
      .catch(error => {
        console.error('[SW] Error al manejar el cambio de suscripción:', error);
      })
  );
});

// ===== NOTIFICACIONES PUSH =====

/**
 * Manejo de notificaciones push
 */
self.addEventListener('push', event => {
  console.log('[SW] Notificación push recibida:', event);
  
  let notificationData = {
    title: 'Bachillerato Héroes de la Patria',
    body: 'Tienes una nueva notificación',
    icon: '/images/logo/logo-bachillerato-HDLP.webp',
    badge: '/images/logo/logo-bachillerato-HDLP.webp',
    tag: 'heroes-notification',
    data: {
      url: '/'
    }
  };
  
  if (event.data) {
    try {
      notificationData = Object.assign(notificationData, event.data.json());
    } catch (error) {
      console.error('[SW] Error parsing notification data:', error);
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/images/icons/open.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/images/icons/close.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

/**
 * Manejo de clicks en notificaciones
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] Click en notificación:', event);
  
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'close') {
    return;
  }
  
  // Abrir o enfocar la aplicación
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

/**
 * Manejo del cierre de notificaciones
 */
self.addEventListener('notificationclose', event => {
  console.log('[SW] Notificación cerrada:', event);
  
  // Opcional: reportar al servidor que la notificación fue cerrada
  // fetch('/api/notification-closed', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ 
  //     tag: event.notification.tag,
  //     timestamp: Date.now()
  //   })
  // });
});