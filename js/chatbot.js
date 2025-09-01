/**
 * Chatbot Inteligente - Bachillerato Héroes de la Patria
 * Sistema de respuestas automáticas con base de conocimiento completa
 */

// Comprehensive Knowledge Base - Base de conocimiento completa
const KNOWLEDGE_DATABASE = {
    // === INFORMACIÓN BÁSICA ===
    'horarios': {
        keywords: ['horario', 'hora', 'tiempo', 'cuando', 'abre', 'cierra', 'atencion', 'clases', 'entrada', 'salida'],
        response: '🕐 **HORARIOS:**\n• **Clases:** Lunes a Viernes de 8:00 AM a 1:30 PM\n• **Atención administrativa:** Lunes a Viernes de 8:00 AM a 1:30 PM\n• **Sábados:** Cerrado\n• **CCT:** 2IEBH0200X'
    },
    
    'ubicacion': {
        keywords: ['ubicacion', 'direccion', 'donde', 'lugar', 'ubicado', 'como llegar', 'domicilio', 'mapa'],
        response: '📍 **UBICACIÓN:**\nC. Manuel Ávila Camacho #7, Col. Centro\nCoronel Tito Hernández (María Andrea)\nVenustiano Carranza, Puebla\nC.P. 73030\n\n🗺️ Puedes encontrar nuestro mapa en la sección de contacto.'
    },
    
    'contacto': {
        keywords: ['telefono', 'contacto', 'comunicar', 'llamar', 'correo', 'email', 'escribir'],
        response: '📧 **CONTACTO:**\n• **Email:** 21ebh0200x.sep@gmail.com\n• **Facebook:** Héroes de la Patria\n• **Horario de atención:** Lunes a Viernes 8:00 AM - 1:30 PM\n\n💬 También puedes usar nuestros formularios de contacto en la página web.'
    },
    
    // === ADMISIONES E INSCRIPCIONES ===
    'admisiones': {
        keywords: ['admision', 'inscripcion', 'matricula', 'registro', 'ingreso', 'inscribir', 'cuando', 'proceso'],
        response: '📝 **ADMISIONES 2025-2026:**\n• **Fecha:** Agosto 2025\n• **Proceso:** Automático para estudiantes que cumplan requisitos\n• **Documentos necesarios:** Certificado de secundaria, CURP, acta de nacimiento, 6 fotos tamaño infantil, comprobante de domicilio\n\n⚠️ Si vienes de otro subsistema necesitas certificado parcial y equivalencia de la SEP.'
    },
    
    'requisitos': {
        keywords: ['requisito', 'documento', 'necesito', 'papeles', 'tramite', 'inscripcion'],
        response: '📋 **REQUISITOS DE INSCRIPCIÓN:**\n✅ Certificado de Secundaria\n✅ Acta de Nacimiento original\n✅ CURP actualizada\n✅ 6 fotografías tamaño infantil\n✅ Comprobante de domicilio reciente\n\n📄 **Documentos adicionales (si aplica):**\n• Kardex (cambios del mismo subsistema)\n• Certificado parcial + equivalencia (otros subsistemas)'
    },
    
    // === OFERTA EDUCATIVA ===
    'carreras': {
        keywords: ['carrera', 'especialidad', 'programa', 'estudios', 'capacitacion', 'formacion', 'que ofrecen', 'opciones'],
        response: '🎓 **OFERTA EDUCATIVA:**\n\n**BACHILLERATO GENERAL** + Formación Laboral:\n\n🎨 **Comunicación Gráfica**\n• Diseño, fotografía, medios digitales\n• Sublimado y vectorización\n• Composición, color y tipografía\n\n🍳 **Preparación de Alimentos Artesanales**\n• Cocina tradicional e higiene alimentaria\n• Conservas y fermentados\n• Panadería y repostería\n\n🏠 **Instalaciones Residenciales**\n• Electricidad básica y plomería\n• Instalaciones hidráulicas/sanitarias\n• Mantenimiento del hogar'
    },
    
    'plan_estudios': {
        keywords: ['plan', 'materias', 'asignaturas', 'curriculum', 'semestres', 'que estudian'],
        response: '📚 **PLAN DE ESTUDIOS - 6 SEMESTRES:**\n\n**CURRÍCULUM FUNDAMENTAL:**\n• Lengua y Comunicación\n• Pensamiento Matemático\n• Conciencia Histórica\n• Cultura Digital\n• Ciencias Naturales y Tecnología\n• Ciencias Sociales\n• Humanidades\n\n**CURRÍCULUM LABORAL:** (3°-6° semestre)\n• Especialización en área elegida\n• Prácticas profesionales\n• Proyectos CTIM\n\n**CURRÍCULUM AMPLIADO:**\n• Responsabilidad Social\n• Educación para la Salud\n• Actividades Artísticas y Deportivas'
    },
    
    // === BECAS Y COSTOS ===
    'becas': {
        keywords: ['beca', 'apoyo', 'descuento', 'ayuda', 'economico', 'benito juarez'],
        response: '🏆 **BECAS Y APOYOS:**\n\n💰 **Beca Universal Benito Juárez:**\n• TODOS los estudiantes inscritos la reciben automáticamente\n• Depósitos bimestrales\n• Sin trámite adicional requerido\n• Consultas: gob.mx/becasbenitojuarez\n\n📋 **Otros apoyos:**\n• Becas institucionales (consultar en Control Escolar)\n• Programas de apoyo académico\n• Asesorías gratuitas'
    },
    
    'costos': {
        keywords: ['costo', 'precio', 'cuanto', 'pagar', 'mensualidad', 'cuota', 'gratis'],
        response: '💰 **COSTOS:**\nLa educación pública es GRATUITA. Solo se requieren:\n• Materiales escolares básicos\n• Uniforme (sencillo y económico)\n• Gastos menores de laboratorio/talleres\n\n💡 **Beca Benito Juárez incluida automáticamente**\n\n📞 Para detalles específicos contacta Control Escolar.'
    },
    
    // === PERSONAL Y ORGANIZACIÓN ===
    'director': {
        keywords: ['director', 'samuel', 'cruz', 'responsable', 'quien dirige'],
        response: '👨‍💼 **DIRECTOR:**\n**Ing. Samuel Cruz Interial**\n• Más de 23 años en docencia\n• 7 años en liderazgo educativo\n• Ingeniero en Electrónica y Comunicaciones\n• Email: 21ebh0200x.sep@gmail.com\n\n💭 *"Formando líderes con propósito"*'
    },
    
    'docentes': {
        keywords: ['maestro', 'profesor', 'docente', 'personal', 'quien enseña', 'staff'],
        response: '👩‍🏫 **PERSONAL DOCENTE:**\n\n🧑‍🎓 **Algunos de nuestros profesores:**\n• Lic. Humberta Flores Martínez (Pedagogía - UV, 27 años experiencia)\n• Ing. José Alain Rosales García (Químico - UV, 16 años experiencia)\n• Lic. Roselia Estrada Lechuga (Pedagogía - ICEST, 22 años experiencia)\n• Ing. Tulia Villadiego Blanco (Sistemas - UANL, 25 años experiencia)\n\n👥 **Total:** 12 docentes especializados en diferentes áreas\n📧 Contacto general: 21ebh0200x.sep@gmail.com'
    },
    
    // === HISTORIA Y FILOSOFÍA ===
    'historia': {
        keywords: ['historia', 'fundacion', 'origen', 'cuando se fundo', 'inicio'],
        response: '📜 **NUESTRA HISTORIA:**\n\n🗓️ **Fundación: 1996-1997**\nFundado por maestros del Bachillerato "Juan Rulfo" que visualizaron crear una institución pública oficial.\n\n👥 **Fundadores principales:**\n• Profesora Hercilia Aburto Nadales\n• Profesor Toribio Bautista Hernández\n• Profesor Hidelgardo Montiel Aparicio\n• Profesor Moisés Flores Vásquez\n\n🏫 **Primera generación:** 70 estudiantes en 1997\n📍 **Ubicación:** Comunidad de María Andrea y alrededores'
    },
    
    'mision': {
        keywords: ['mision', 'objetivo', 'proposito', 'para que'],
        response: '🎯 **MISIÓN:**\n\n"Somos una institución educativa de nivel medio superior formadora de estudiantes integrales, analíticos, reflexivos y críticos con los conocimientos, habilidades y valores necesarios para poderse integrar al sector productivo o continuar sus estudios a nivel superior."\n\n✨ **Enfoque:** Formación integral con valores y competencias para la vida.'
    },
    
    'vision': {
        keywords: ['vision', 'futuro', 'hacia donde', 'meta'],
        response: '🌟 **VISIÓN:**\n\n"Ser una institución educativa de excelencia que logre la formación de seres humanos integrales con valores y aprendizajes significativos contextualizados que permitan contribuir al desarrollo regional, estatal y nacional de nuestro país."\n\n🏆 **Meta:** Excelencia educativa y desarrollo integral de estudiantes.'
    },
    
    'valores': {
        keywords: ['valores', 'principios', 'que promueven'],
        response: '⭐ **VALORES FUNDAMENTALES:**\n\n✅ **Compromiso** - Con la educación de calidad\n✅ **Respeto** - Hacia la diversidad y dignidad\n✅ **Responsabilidad** - En nuestras acciones\n✅ **Honestidad** - En todas nuestras relaciones\n✅ **Lealtad** - A nuestra comunidad educativa\n✅ **Confianza** - Base de nuestras interacciones'
    },
    
    // === SERVICIOS ESCOLARES ===
    'boleta': {
        keywords: ['boleta', 'calificaciones', 'sicep', 'notas', 'como descargar'],
        response: '📊 **DESCARGAR BOLETA (SICEP):**\n\n🔗 **Pasos:**\n1. Ingresa a: sisep.seppue.gob.mx/sicepconsulta/\n2. Ten a mano tu CURP y NIA\n3. Sigue las instrucciones del portal\n\n❓ **Problemas de acceso:**\nSolicita ayuda en Control Escolar del plantel\n\n📧 **Soporte:** 21ebh0200x.sep@gmail.com'
    },
    
    'certificado': {
        keywords: ['certificado', 'titulo', 'diploma', 'como tramitar', 'graduacion'],
        response: '🎓 **CERTIFICADO DE BACHILLERATO:**\n\n📋 **Requisitos:**\n• Identificación oficial\n• Comprobante de liberación de materias\n• 6 fotos tamaño infantil (b/n, papel mate)\n• Pago de derechos\n\n⏱️ **Tiempo de entrega:** 30 días hábiles\n📞 **Más información:** Control Escolar'
    },
    
    'cambio_escuela': {
        keywords: ['cambio', 'transferencia', 'kardex', 'cambiar de escuela'],
        response: '🔄 **CAMBIO DE ESCUELA:**\n\n📄 **Mismo subsistema (BGE):**\n• Solicita Kardex en Control Escolar\n• Debes estar al corriente en materias\n\n📄 **Otro subsistema:**\n• Certificado parcial requerido\n• Solicita equivalencia en la SEP\n\n📄 **Otro estado:**\n• Legalización de certificado necesaria\n\n💡 **Contacto:** Control Escolar del plantel'
    },
    
    // === ACTIVIDADES Y VIDA ESTUDIANTIL ===
    'talleres': {
        keywords: ['taller', 'extracurricular', 'actividades', 'que hay', 'deportes', 'arte'],
        response: '🎭 **ACTIVIDADES EXTRACURRICULARES:**\n\n🎨 **Arte y Cultura:**\n• Ballet folklórico\n• Danza contemporánea\n• Banda de guerra\n• Bastoneras\n• Artes plásticas\n\n⚽ **Deportes:**\n• Fútbol\n• Básquetbol\n• Voleibol\n\n🤖 **Clubes académicos:**\n• Robótica\n• Debate\n• Ciencia\n\n🏆 **Participaciones:**\n• Ferias académicas\n• Concursos estatales\n• Proyectos CTIM y PEC'
    },
    
    'uniforme': {
        keywords: ['uniforme', 'ropa', 'vestimenta', 'como vestirse'],
        response: '👔 **UNIFORME ESCOLAR:**\n\n**HOMBRES:**\n🏃 **Deportivo:** Playera blanca con logo + pantalón azul mezclilla\n👔 **Gala:** Camisa blanca con logo + pantalón gris Oxford\n\n**MUJERES:**\n🏃 **Deportivo:** Playera blanca con logo + pantalón azul mezclilla\n👗 **Gala:** Blusa blanca con logo + falda gris Oxford\n\n💡 **Nota:** Puede mandarse hacer donde guste o confeccionarse en casa'
    },
    
    // === REGLAMENTO Y POLÍTICAS ===
    'reprobacion': {
        keywords: ['reprobar', 'repruebo', 'materia', 'extraordinario', 'recuperar'],
        response: '📚 **SI REPRUEBAS UNA MATERIA:**\n\n✅ **Opciones disponibles:**\n• Exámenes extraordinarios (en periodos establecidos)\n• Proyectos prácticos para regularizar\n• Asesorías gratuitas con profesores\n\n📅 **Fechas:** Consulta calendario escolar\n👨‍🏫 **Asesorías:** Sin costo adicional\n📧 **Información:** 21ebh0200x.sep@gmail.com'
    },
    
    'reinscripcion': {
        keywords: ['reinscripcion', 'cada año', 'anual', 'proceso'],
        response: '📝 **REINSCRIPCIÓN ANUAL:**\n\n📋 **Proceso (Agosto):**\n• Actualización de la Cédula de Registro y Actualización de Datos (CRAD)\n• Actualización de datos en Control Escolar\n\n📅 **Cuándo:** Mes de Agosto del año en curso\n📞 **Más información:** Control Escolar'
    },
    
    // === CONVENIOS Y OPORTUNIDADES ===
    'universidades': {
        keywords: ['universidad', 'convenio', 'superior', 'continuar', 'despues'],
        response: '🏛️ **CONVENIOS UNIVERSITARIOS:**\n\n✅ **Beneficios para nuestros alumnos:**\n• Acceso a laboratorios y talleres universitarios\n• Descuentos en inscripciones (ITSVC, UTXJ)\n• Programas para alumnos de excelencia\n• Prácticas profesionales\n\n🎯 **Para alumnos destacados:** Oportunidades especiales\n📧 **Consultas:** 21ebh0200x.sep@gmail.com'
    },
    
    // === RAZONES PARA ELEGIR LA ESCUELA ===
    'porque_elegir': {
        keywords: ['porque elegir', 'ventajas', 'beneficios', 'que ofrece', 'por que'],
        response: '🌟 **¿POR QUÉ ELEGIR "HÉROES DE LA PATRIA"?**\n\n✅ **Educación práctica:** Habilidades para el trabajo, no solo teoría\n✅ **Inclusión total:** Sin barreras económicas\n✅ **Proyectos reales:** CTIM ganadores, vinculación comunitaria\n✅ **Formación integral:** Competencias + valores\n✅ **Beca automática:** Benito Juárez para todos\n✅ **Personal experimentado:** 23+ años promedio\n✅ **Tecnología responsable:** Herramienta de crecimiento\n\n💪 ¡Calidad educativa comprobada!'
    }
};

let chatbotOpen = false;

/**
 * Alternar la visibilidad del chatbot
 */
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        container.style.display = 'flex';
        toggle.style.display = 'none';
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 100);
    } else {
        container.style.display = 'none';
        toggle.style.display = 'block';
    }
}

/**
 * Enviar mensaje del usuario
 */
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
        const response = processMessage(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    }, 800 + Math.random() * 1200); // Random delay for realism
}

/**
 * Agregar mensaje al chat
 */
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    messagesContainer.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Mostrar indicador de escritura
 */
function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    const messagesContainer = document.getElementById('chatbotMessages');
    
    indicator.style.display = 'block';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Ocultar indicador de escritura
 */
function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

/**
 * Procesar mensaje del usuario y generar respuesta inteligente
 */
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Normalize text (remove accents, etc.)
    const normalizedMessage = lowerMessage
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    // Check knowledge database with improved matching
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [topic, data] of Object.entries(KNOWLEDGE_DATABASE)) {
        let score = 0;
        const matchedKeywords = [];
        
        // Count keyword matches with different weights
        for (const keyword of data.keywords) {
            const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            
            // Exact match (highest weight)
            if (normalizedMessage.includes(normalizedKeyword) || lowerMessage.includes(keyword)) {
                score += 3;
                matchedKeywords.push(keyword);
            }
            // Partial match with word boundaries
            else if (normalizedMessage.includes(normalizedKeyword.substring(0, Math.min(normalizedKeyword.length, 4)))) {
                score += 1;
                matchedKeywords.push(keyword);
            }
        }
        
        // Bonus for multiple keyword matches
        if (matchedKeywords.length > 1) {
            score += matchedKeywords.length;
        }
        
        // Update best match if this score is higher
        if (score > bestScore) {
            bestScore = score;
            bestMatch = data;
        }
    }
    
    // Return best match if score is high enough
    if (bestMatch && bestScore >= 2) {
        return bestMatch.response;
    }
    
    // Greeting responses
    if (/\b(hola|buenos|buenas|hi|hello|saludo)\b/.test(lowerMessage)) {
        const greetings = [
            '¡Hola! 😊 Soy el asistente virtual del Bachillerato "Héroes de la Patria". ¿En qué puedo ayudarte hoy?',
            '¡Buenos días! 🌅 Bienvenido/a. Tengo toda la información sobre nuestro bachillerato. ¿Qué necesitas saber?',
            '¡Hola! 👋 Me da mucho gusto saludarte. Estoy aquí para resolver tus dudas sobre "Héroes de la Patria". 🏫',
            '¡Qué tal! 😄 Soy tu asistente virtual. Pregúntame sobre admisiones, carreras, horarios, o cualquier cosa del bachillerato.'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Gratitude responses
    if (/\b(gracias|thanks|grazie|muchas gracias)\b/.test(lowerMessage)) {
        const thanks = [
            '¡De nada! 😊 Fue un placer ayudarte. ¿Hay algo más sobre el bachillerato que quieras saber?',
            '¡Con mucho gusto! 🤗 ¿Necesitas información sobre algún otro tema de "Héroes de la Patria"?',
            '¡Me alegra haber sido útil! ✨ Estoy aquí para cualquier duda sobre nuestro bachillerato.',
            '¡Para eso estoy! 👨‍🎓 Siempre es un gusto compartir información sobre nuestra institución.'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // Farewell responses
    if (/\b(adios|bye|chau|hasta|nos vemos|me voy)\b/.test(lowerMessage)) {
        const farewells = [
            '¡Hasta luego! 👋 Gracias por visitarnos. ¡Esperamos verte pronto en "Héroes de la Patria"!',
            '¡Nos vemos! 😊 Recuerda que siempre estoy aquí para ayudarte con información del bachillerato.',
            '¡Que tengas un excelente día! 🌟 No olvides que estamos en C. Manuel Ávila Camacho #7.',
            '¡Adiós! 🎓 Espero haberte ayudado a conocer más sobre nuestro bachillerato.'
        ];
        return farewells[Math.floor(Math.random() * farewells.length)];
    }
    
    // Help or menu requests
    if (/\b(ayuda|help|menu|que puedes|opciones|temas)\b/.test(lowerMessage)) {
        return '🤖 **¿EN QUÉ PUEDO AYUDARTE?**\n\n' +
               '📚 **Temas disponibles:**\n' +
               '• **Admisiones:** Inscripciones, requisitos, fechas\n' +
               '• **Carreras:** Comunicación Gráfica, Alimentos, Instalaciones\n' +
               '• **Información:** Horarios, ubicación, contacto\n' +
               '• **Personal:** Director, docentes, staff\n' +
               '• **Historia:** Fundación, misión, visión, valores\n' +
               '• **Servicios:** Boletas, certificados, trámites\n' +
               '• **Actividades:** Talleres, deportes, extracurriculares\n' +
               '• **Becas:** Benito Juárez y otros apoyos\n\n' +
               '💬 Solo escribe tu pregunta y te ayudo al instante.';
    }
    
    // Default response with comprehensive suggestions
    const suggestions = [
        '🤔 No estoy seguro de entender esa consulta específica. ¿Podrías ser más específico?\n\n' +
        '📌 **Algunos temas populares:**\n' +
        '• "¿Cuándo son las inscripciones?"\n' +
        '• "¿Qué carreras ofrecen?"\n' +
        '• "¿Cuáles son los horarios?"\n' +
        '• "¿Cómo llego al bachillerato?"\n' +
        '• "¿Qué documentos necesito?"\n' +
        '• Escribe "ayuda" para ver todos los temas disponibles.',
        
        '❓ No tengo una respuesta exacta para eso. ¿Te refieres a alguno de estos temas?\n\n' +
        '🎯 **Consultas frecuentes:**\n' +
        '• Admisiones y requisitos\n' +
        '• Formación laboral (3 especialidades)\n' +
        '• Becas y costos\n' +
        '• Personal docente\n' +
        '• Actividades extracurriculares\n' +
        '• Servicios escolares\n\n' +
        'Escribe tu pregunta de otra forma o más específica.',
        
        '💭 Parece que necesitas información más específica. \n\n' +
        '✨ **¿Sabías que puedo ayudarte con?**\n' +
        '• Historia del bachillerato (fundado en 1996)\n' +
        '• Información del director Ing. Samuel Cruz\n' +
        '• Detalles de nuestras 3 formaciones laborales\n' +
        '• Proceso de inscripción paso a paso\n' +
        '• Todo sobre la beca Benito Juárez\n\n' +
        '🗣️ Pregúntame algo específico sobre "Héroes de la Patria".'
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
}

/**
 * Manejar tecla Enter en el input
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    // Add comprehensive welcome message and examples
    setTimeout(() => {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer && messagesContainer.children.length === 1) {
            addMessage('🎓 ¡Hola! Soy el asistente virtual del Bachillerato "Héroes de la Patria". Conozco toda la información de nuestra institución.', 'bot');
            
            setTimeout(() => {
                addMessage('📝 **Ejemplos de preguntas:**\n• ¿Cuándo son las inscripciones?\n• ¿Qué especialidades ofrecen?\n• ¿Cuáles son los horarios?\n• ¿Quién es el director?\n• ¿Cómo descargo mi boleta?\n• ¿Hay becas disponibles?\n\n💬 Escribe "ayuda" para ver todos los temas disponibles.', 'bot');
            }, 1500);
        }
    }, 2000);
});