/**
 * Offline-First Service Worker para Bachillerato Héroes de la Patria
 * Versión: 5.0.0 - PWA Avanzada Offline-First
 * Estrategia: Offline-First con sincronización en segundo plano
 */

const CACHE_VERSION = 'v5.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const FRAGMENTS_CACHE = `fragments-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Assets críticos que SIEMPRE deben estar disponibles offline
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/chatbot.js',
    '/fragments/perfil_egreso.html',
    '/fragments/comunicacion_grafica.html',
    '/fragments/alimentos_artesanales.html',
    '/fragments/instalaciones_residenciales.html',
    '/fragments/extracurriculares.html',
    '/fragments/financieros.html',
    '/fragments/actividades.html',
    '/manifest.json'
];

// Assets importantes pero no críticos
const IMPORTANT_ASSETS = [
    '/images/logo-bachillerato-HDLP.webp',
    '/images/hero/fachada1.webp',
    '/images/hero/fachada2.webp',
    '/images/hero/fachada3.webp'
];

// Configuración de timeouts
const TIMEOUTS = {
    navigation: 3000,
    fragment: 2000,
    asset: 4000,
    image: 5000,
    external: 8000
};

/**
 * INSTALACIÓN - Estrategia Offline-First
 */
self.addEventListener('install', event => {
    console.log('[SW Offline-First] Installing...');
    self.skipWaiting(); // Activar inmediatamente
    
    event.waitUntil(
        Promise.all([
            cacheStaticAssets(),
            createOfflineResources(),
            precacheImportantAssets()
        ])
    );
});

async function cacheStaticAssets() {
    console.log('[SW] Caching critical assets...');
    const cache = await caches.open(STATIC_CACHE);
    
    // Cachar assets críticos de forma robusta
    const cachePromises = CRITICAL_ASSETS.map(async (asset) => {
        try {
            const response = await fetch(asset, { cache: 'reload' });
            if (response.ok) {
                await cache.put(asset, response);
                console.log(`[SW] ✓ Cached: ${asset}`);
                return { asset, success: true };
            } else {
                console.warn(`[SW] ⚠ Failed to cache (${response.status}): ${asset}`);
                return { asset, success: false, status: response.status };
            }
        } catch (error) {
            console.error(`[SW] ✗ Error caching ${asset}:`, error);
            return { asset, success: false, error: error.message };
        }
    });
    
    const results = await Promise.allSettled(cachePromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`[SW] Critical assets cached: ${successful}/${CRITICAL_ASSETS.length}`);
}

async function precacheImportantAssets() {
    console.log('[SW] Pre-caching important assets in background...');
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Precargar assets importantes en segundo plano sin bloquear
    setTimeout(async () => {
        for (const asset of IMPORTANT_ASSETS) {
            try {
                const response = await fetch(asset, { cache: 'no-cache' });
                if (response.ok) {
                    await cache.put(asset, response);
                    console.log(`[SW] Background cached: ${asset}`);
                }
            } catch (error) {
                console.log(`[SW] Background cache failed: ${asset}`);
            }
        }
    }, 1000);
}

async function createOfflineResources() {
    console.log('[SW] Creating offline resources...');
    const cache = await caches.open(STATIC_CACHE);
    
    // Página offline personalizada
    const offlineHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔌 Sin conexión - Bachillerato Héroes de la Patria</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            color: #333; padding: 20px;
        }
        .container {
            background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
            padding: 40px; border-radius: 20px; text-align: center; max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } }
        .icon {
            width: 80px; height: 80px; background: #f8f9fa; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px; font-size: 40px;
        }
        h1 { color: #2c3e50; margin-bottom: 10px; font-weight: 600; }
        p { color: #555; line-height: 1.6; margin-bottom: 25px; }
        .status { background: #e8f4f8; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .button {
            background: linear-gradient(135deg, #667eea, #764ba2); color: white;
            border: none; padding: 15px 30px; border-radius: 25px; cursor: pointer;
            font-size: 16px; font-weight: 500; transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
        .features { text-align: left; margin-top: 25px; }
        .features h3 { color: #2c3e50; margin-bottom: 10px; }
        .features ul { list-style: none; }
        .features li { padding: 5px 0; }
        .features li:before { content: "✓ "; color: #27ae60; font-weight: bold; }
        @media (prefers-color-scheme: dark) {
            .container { background: rgba(30,30,30,0.95); color: #f8f9fa; }
            h1 { color: #e74c3c; }
            p { color: #bdc3c7; }
            .status { background: rgba(52, 73, 94, 0.3); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>Sin conexión a Internet</h1>
        <p>No te preocupes, muchas funciones siguen disponibles sin conexión gracias a nuestra tecnología PWA.</p>
        
        <div class="status">
            <strong>Estado:</strong> <span id="status">Verificando conexión...</span>
        </div>
        
        <button class="button" onclick="location.reload()">🔄 Reintentar conexión</button>
        
        <div class="features">
            <h3>Disponible offline:</h3>
            <ul>
                <li>Información de carreras y programas</li>
                <li>Requisitos de admisión</li>
                <li>Datos de contacto y ubicación</li>
                <li>Chat bot con respuestas frecuentes</li>
                <li>Navegación por toda la página</li>
            </ul>
        </div>
    </div>
    
    <script>
        // Detector de conexión
        function updateStatus() {
            const status = document.getElementById('status');
            if (navigator.onLine) {
                status.textContent = '🟢 Conexión detectada - Recargando...';
                status.style.color = '#27ae60';
                setTimeout(() => location.reload(), 1500);
            } else {
                status.textContent = '🔴 Sin conexión - Modo offline activo';
                status.style.color = '#e74c3c';
            }
        }
        
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        
        // Auto-retry cada 30 segundos
        setInterval(() => {
            if (navigator.onLine) {
                console.log('Connection detected, reloading...');
                location.reload();
            }
        }, 30000);
    </script>
</body>
</html>`;

    // Imagen placeholder para offline
    const placeholderSVG = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#f8f9fa"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <circle cx="200" cy="120" r="30" fill="#dee2e6"/>
    <text x="200" y="170" text-anchor="middle" font-family="system-ui" font-size="16" fill="#6c757d">
        📷 Imagen no disponible
    </text>
    <text x="200" y="200" text-anchor="middle" font-family="system-ui" font-size="12" fill="#adb5bd">
        Se cargará cuando haya conexión
    </text>
</svg>`;

    await Promise.all([
        cache.put('/offline.html', new Response(offlineHTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        })),
        cache.put('/images/placeholder-offline.svg', new Response(placeholderSVG, {
            headers: { 'Content-Type': 'image/svg+xml' }
        }))
    ]);
    
    console.log('[SW] ✓ Offline resources created');
}

/**
 * ACTIVACIÓN - Limpieza y reclamación
 */
self.addEventListener('activate', event => {
    console.log('[SW Offline-First] Activating...');
    
    event.waitUntil(
        Promise.all([
            cleanOldCaches(),
            self.clients.claim(),
            enableNavigationPreload()
        ])
    );
});

async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name !== STATIC_CACHE && 
        name !== DYNAMIC_CACHE && 
        name !== FRAGMENTS_CACHE &&
        name !== RUNTIME_CACHE &&
        (name.includes('static-') || name.includes('dynamic-') || name.includes('fragments-') || name.includes('runtime-'))
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    console.log(`[SW] ✓ Cleaned ${oldCaches.length} old caches`);
}

async function enableNavigationPreload() {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
        console.log('[SW] ✓ Navigation preload enabled');
    }
}

/**
 * FETCH - Estrategias Offline-First por tipo de recurso
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;
    
    const url = new URL(request.url);
    
    // Estrategias por tipo de contenido
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationOfflineFirst(request));
    } else if (url.pathname.startsWith('/fragments/')) {
        event.respondWith(handleFragmentOfflineFirst(request));
    } else if (url.pathname.match(/\.(css|js)$/)) {
        event.respondWith(handleAssetOfflineFirst(request));
    } else if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)) {
        event.respondWith(handleImageOfflineFirst(request));
    } else if (url.origin !== location.origin) {
        event.respondWith(handleExternalOfflineFirst(request));
    } else {
        event.respondWith(handleGenericOfflineFirst(request));
    }
});

/**
 * Navegación - Offline First con fallback inteligente
 */
async function handleNavigationOfflineFirst(request) {
    try {
        // 1. Intentar cache primero
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] 📄 Navigation served from cache:', request.url);
            
            // Actualizar en segundo plano
            updateInBackground(request, DYNAMIC_CACHE);
            return cachedResponse;
        }
        
        // 2. Si no hay cache, ir a red con timeout
        const networkResponse = await fetchWithTimeout(request, TIMEOUTS.navigation);
        
        if (networkResponse.ok) {
            // Guardar en cache para próximas visitas
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] 📄 Navigation served from network and cached');
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('[SW] 📄 Navigation failed, serving offline page');
        
        // 3. Fallback a página offline
        return await caches.match('/offline.html') || 
               createEmergencyResponse('🔌 Sin conexión', 'No se pudo cargar la página');
    }
}

/**
 * Fragmentos - Offline First con mensaje contextual
 */
async function handleFragmentOfflineFirst(request) {
    try {
        // 1. Cache primero
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] 📄 Fragment served from cache:', request.url);
            updateInBackground(request, FRAGMENTS_CACHE);
            return cachedResponse;
        }
        
        // 2. Red con timeout corto
        const networkResponse = await fetchWithTimeout(request, TIMEOUTS.fragment);
        
        if (networkResponse.ok) {
            const cache = await caches.open(FRAGMENTS_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] 📄 Fragment served from network and cached');
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('[SW] 📄 Fragment not available, serving offline message');
        
        // Mensaje contextual para fragments
        return new Response(`
            <div style="
                padding: 30px; text-align: center; 
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 15px; margin: 20px;
                border: 2px dashed #dee2e6;
                color: #6c757d;
            ">
                <div style="font-size: 48px; margin-bottom: 15px;">📱</div>
                <h3 style="color: #495057; margin-bottom: 10px;">Contenido temporalmente no disponible</h3>
                <p style="margin-bottom: 15px; line-height: 1.6;">
                    Este contenido se cargará automáticamente cuando se restablezca la conexión a internet.
                </p>
                <div style="
                    background: #fff; padding: 10px 20px; border-radius: 25px;
                    display: inline-block; font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    🔄 Modo offline activo
                </div>
            </div>
        `, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
}

/**
 * Assets estáticos (CSS/JS) - Cache First con fallback
 */
async function handleAssetOfflineFirst(request) {
    try {
        // 1. Cache primero (assets estáticos cambian poco)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] 🎨 Asset served from cache:', request.url);
            return cachedResponse;
        }
        
        // 2. Red con timeout
        const networkResponse = await fetchWithTimeout(request, TIMEOUTS.asset);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] 🎨 Asset served from network and cached');
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('[SW] 🎨 Asset not available:', request.url);
        
        // Fallback mínimo según tipo
        const contentType = request.url.endsWith('.css') ? 'text/css' : 'application/javascript';
        const fallbackContent = contentType === 'text/css' 
            ? '/* Archivo CSS no disponible offline */' 
            : '// Archivo JS no disponible offline';
            
        return new Response(fallbackContent, {
            headers: { 'Content-Type': contentType }
        });
    }
}

/**
 * Imágenes - Cache First con placeholder inteligente
 */
async function handleImageOfflineFirst(request) {
    try {
        // 1. Cache primero
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] 🖼️ Image served from cache:', request.url);
            return cachedResponse;
        }
        
        // 2. Red con timeout más largo
        const networkResponse = await fetchWithTimeout(request, TIMEOUTS.image);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] 🖼️ Image served from network and cached');
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('[SW] 🖼️ Image not available, serving placeholder');
        
        // Placeholder offline
        return await caches.match('/images/placeholder-offline.svg') ||
               new Response('Image not available offline', { status: 503 });
    }
}

/**
 * Recursos externos - Cache First con timeout largo
 */
async function handleExternalOfflineFirst(request) {
    try {
        // 1. Cache primero para recursos externos
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] 🌐 External resource served from cache:', request.url);
            return cachedResponse;
        }
        
        // 2. Red con timeout largo
        const networkResponse = await fetchWithTimeout(request, TIMEOUTS.external);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] 🌐 External resource served from network and cached');
            return networkResponse;
        }
        
        throw new Error('External resource not available');
        
    } catch (error) {
        console.log('[SW] 🌐 External resource failed:', request.url);
        return new Response('External resource not available offline', { status: 503 });
    }
}

/**
 * Recursos genéricos - Cache First
 */
async function handleGenericOfflineFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            updateInBackground(request, RUNTIME_CACHE);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
        
    } catch (error) {
        return new Response('Resource not available offline', { status: 503 });
    }
}

/**
 * UTILIDADES
 */

// Fetch con timeout
async function fetchWithTimeout(request, timeout) {
    return Promise.race([
        fetch(request),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Actualización en segundo plano
async function updateInBackground(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, response);
            console.log('[SW] 🔄 Updated in background:', request.url);
        }
    } catch (error) {
        console.log('[SW] 🔄 Background update failed:', request.url);
    }
}

// Respuesta de emergencia
function createEmergencyResponse(title, message) {
    const html = `
        <html><head><title>${title}</title></head>
        <body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h1>${title}</h1><p>${message}</p>
            <button onclick="location.reload()">Reintentar</button>
        </body></html>
    `;
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

/**
 * MENSAJES Y EVENTOS ADICIONALES
 */
self.addEventListener('message', event => {
    const { type, payload } = event.data || {};
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'CLAIM_CLIENTS':
            self.clients.claim();
            break;
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0]?.postMessage({ success: true });
            });
            break;
        case 'CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0]?.postMessage(status);
            });
            break;
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[SW] 🧹 All caches cleared');
}

async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        status[name] = keys.length;
    }
    
    return {
        version: CACHE_VERSION,
        caches: status,
        timestamp: new Date().toISOString()
    };
}

console.log('[SW] 🚀 Offline-First Service Worker loaded');