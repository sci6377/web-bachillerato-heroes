/**
 * Chatbot con IA - Bachillerato Héroes de la Patria
 * Sistema de respuestas automáticas basado en FAQ
 */

// FAQ Database - Preguntas frecuentes
const FAQ_DATABASE = {
    'horarios': {
        keywords: ['horario', 'hora', 'tiempo', 'cuando', 'abre', 'cierra', 'atencion'],
        response: 'Nuestros horarios de atención son de Lunes a Viernes de 7:00 AM a 2:00 PM. Los sábados estamos cerrados. 📅'
    },
    'admisiones': {
        keywords: ['admision', 'inscripcion', 'matricula', 'registro', 'ingreso', 'inscribir'],
        response: 'Las inscripciones para el ciclo escolar 2025-2026 estarán abiertas en Agosto. Puedes encontrar más información en la sección "Convocatorias" de nuestra página. 📝'
    },
    'ubicacion': {
        keywords: ['ubicacion', 'direccion', 'donde', 'lugar', 'ubicado', 'como llegar'],
        response: 'Nos encontramos en C. Manuel Ávila Camacho #7, Col. Centro, Coronel Tito Hernández, Venustiano Carranza, Puebla. C.P. 73030 📍'
    },
    'contacto': {
        keywords: ['telefono', 'contacto', 'comunicar', 'llamar', 'correo', 'email'],
        response: 'Puedes contactarnos por correo electrónico o visitarnos en nuestras instalaciones. También puedes usar los formularios de contacto en nuestra página web. 📞'
    },
    'carreras': {
        keywords: ['carrera', 'especialidad', 'programa', 'estudios', 'capacitacion', 'formacion'],
        response: 'Ofrecemos formación laboral en: 🎨 Comunicación Gráfica, 🍳 Preparación de Alimentos Artesanales e 🏠 Instalaciones Residenciales, además del Bachillerato General. 🎓'
    },
    'requisitos': {
        keywords: ['requisito', 'documento', 'necesito', 'papeles', 'tramite'],
        response: 'Los requisitos principales son: Certificado de Secundaria, Acta de Nacimiento, CURP, 6 fotografías tamaño infantil y comprobante de domicilio. 📋'
    },
    'costos': {
        keywords: ['costo', 'precio', 'cuanto', 'pagar', 'mensualidad', 'inscripcion'],
        response: 'Para información sobre costos y mensualidades, te recomiendo contactar directamente a la institución o revisar la sección de convocatorias. 💰'
    },
    'becas': {
        keywords: ['beca', 'apoyo', 'descuento', 'ayuda', 'economico'],
        response: 'Contamos con diferentes programas de becas y apoyos económicos. Te sugerimos consultar en control escolar para conocer los requisitos específicos. 🏆'
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
 * Procesar mensaje del usuario y generar respuesta
 */
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Normalize text (remove accents, etc.)
    const normalizedMessage = lowerMessage
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    // Check FAQ database
    for (const [topic, data] of Object.entries(FAQ_DATABASE)) {
        if (data.keywords.some(keyword => 
            normalizedMessage.includes(keyword) || 
            lowerMessage.includes(keyword)
        )) {
            return data.response;
        }
    }
    
    // Greeting responses
    if (/\b(hola|buenos|buenas|hi|hello)\b/.test(lowerMessage)) {
        const greetings = [
            '¡Hola! 😊 Me da mucho gusto saludarte. ¿En qué puedo ayudarte hoy?',
            '¡Buenos días! 🌅 ¿Cómo puedo asistirte?',
            '¡Hola! Bienvenido/a al Bachillerato Héroes de la Patria. ¿Qué información necesitas? 🏫'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Gratitude responses
    if (/\b(gracias|thanks|grazie)\b/.test(lowerMessage)) {
        const thanks = [
            '¡De nada! 😊 Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?',
            '¡Un placer ayudarte! ¿Necesitas información sobre algún otro tema? 🤗',
            '¡Me da mucho gusto haber sido útil! ¿Te puedo ayudar con algo más? ✨'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // Farewell responses
    if (/\b(adios|bye|chau|hasta)\b/.test(lowerMessage)) {
        const farewells = [
            '¡Hasta luego! 👋 Que tengas un excelente día.',
            '¡Nos vemos! Espero haberte ayudado. 😊',
            '¡Adiós! Recuerda que estoy aquí cuando me necesites. 🌟'
        ];
        return farewells[Math.floor(Math.random() * farewells.length)];
    }
    
    // Default response with suggestions
    const suggestions = [
        'No estoy seguro de cómo responder a eso específicamente, pero puedo ayudarte con información sobre: 📚 horarios, admisiones, ubicación, contacto, carreras, requisitos, costos y becas.',
        'Disculpa, no entiendo completamente tu pregunta. ¿Te interesa información sobre alguno de estos temas? 🤔 Horarios, admisiones, ubicación, carreras o requisitos.',
        'No tengo una respuesta específica para eso, pero puedo ayudarte con preguntas sobre nuestro bachillerato. ¿Qué te gustaría saber? 🎓'
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
    
    // Add some example quick replies after initial message
    setTimeout(() => {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer && messagesContainer.children.length === 1) {
            addMessage('Puedes preguntarme sobre: horarios, admisiones, ubicación, carreras disponibles, requisitos o costos. 💡', 'bot');
        }
    }, 2000);
});