let inactivityTimer;
let warningCount = 0;
let sessionClosed = false;

document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Página cargada correctamente");

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("menu");
    const menuItems = document.querySelectorAll(".menu-item > a");
    const subMenus = document.querySelectorAll(".submenu");

    // ✅ Abrir y cerrar el menú en móviles
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            nav.classList.toggle("menu-open");
            menuToggle.innerHTML = nav.classList.contains("menu-open") ? "✖" : "☰";
        });
    }

    // ✅ Función para mostrar/ocultar submenús
    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // Evita la redirección

            let subMenu = this.nextElementSibling; // Obtiene el submenú asociado

            if (subMenu && subMenu.classList.contains("submenu")) {
                // 🔥 Si ya está abierto, lo cierra
                if (subMenu.classList.contains("show")) {
                    subMenu.classList.remove("show");
                } else {
                    // 🔥 Cierra los demás submenús antes de abrir uno nuevo
                    subMenus.forEach(menu => menu.classList.remove("show"));
                    subMenu.classList.add("show");
                }
            }
        });
    });

    // ✅ Cerrar todo si se hace clic fuera del menú
    document.addEventListener("click", function (event) {
        let isMenuClick = nav.contains(event.target); // ¿Hizo clic dentro del menú?

        if (!isMenuClick) {
            subMenus.forEach(menu => menu.classList.remove("show"));
        }
    });

    // ✅ Evita que el menú principal se cierre al hacer clic dentro del submenú
    subMenus.forEach(menu => {
        menu.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que el clic cierre el menú
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    console.log("Página cargada");

    // Detectar cuando el usuario presiona "Enter" en el input
    document.getElementById("mensaje").addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !sessionClosed) {
            event.preventDefault();
            enviarMensaje();
        }
    });

    startInactivityTimer();
});

function toggleChat() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.classList.toggle("hidden");
}

const BACKEND_URL = "/api/send-message"; // Usa ruta relativa en Vercel

let sessionId = localStorage.getItem("chatbotSessionId");
if (!sessionId) {
    sessionId = self.crypto.randomUUID();  // Genera un UUID único
    localStorage.setItem("chatbotSessionId", sessionId);  // Lo guarda para futuras solicitudes
}

async function enviarMensaje() {
    if (sessionClosed) return; //  Evita enviar mensajes si la sesión está cerrada

    const userMessage = document.getElementById("mensaje").value;
    if (!userMessage.trim()) return;

    agregarMensaje("user", userMessage);
    document.getElementById("mensaje").value = "";

    // Detectar si el usuario quiere cerrar la sesión con una despedida
    const despedidas = ["adios", "hasta luego", "fin", "bye", "nos vemos"];
    if (despedidas.includes(userMessage.toLowerCase().trim())) {
        agregarMensaje("bot", "😊 Un gusto haberte ayudado. ¡Hasta luego!");
        closeSession(); // Bloquear input y cerrar sesión
        return;
    }

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage, sessionId }),
        });

        console.log("Esta es mi id de session: ", sessionId);
        const data = await response.json();
        agregarMensaje("bot", data.reply);
    } catch (error) {
        console.error("❌ Error al conectar con el servidor:", error);
        agregarMensaje("bot", "Error al conectar con el servidor.");
    }
}


function agregarMensaje(tipo, mensaje) {
    const chatBody = document.getElementById("chatBody");
    const msgElement = document.createElement("p");

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Reemplaza los enlaces detectados con enlaces clickeables
    let mensajeConEnlaces = mensaje.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" class="chat-link">${url}</a>`;
    });

    // 🔹 Reemplaza los saltos de línea por <br> para formatear correctamente
    mensajeConEnlaces = mensajeConEnlaces.replace(/\n/g, "<br>");

    msgElement.innerHTML = mensajeConEnlaces; // Usar innerHTML para renderizar el formato
    msgElement.classList.add(tipo === "user" ? "user-message" : "bot-message");

    chatBody.appendChild(msgElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll hacia abajo
}


//  Función para reiniciar el temporizador cuando el usuario interactúa
function resetInactivityTimer() {
    if (!sessionClosed) {
        clearTimeout(inactivityTimer); //  Limpia cualquier timeout previo
        warningCount = 0;
        startInactivityTimer();
    }
}

//  Función para iniciar el temporizador de inactividad
function startInactivityTimer() {
    clearTimeout(inactivityTimer); //  Asegurar que no haya múltiples temporizadores corriendo
    inactivityTimer = setTimeout(() => {
        handleInactivity();
    }, 30000); // 30 segundos sin actividad
}

//  Función para manejar la inactividad en el frontend
function handleInactivity() {
    if (sessionClosed) return; // No hacer nada si la sesión ya está cerrada

    if (warningCount === 0) {
        agregarMensaje("bot", "⚠ ¿Te puedo ayudar en algo más?");
        warningCount++;
        startInactivityTimer();
    } else if (warningCount === 1) {
        agregarMensaje("bot", "⏳ Parece que sigues inactivo. ¿Necesitas ayuda?");
        warningCount++;
        startInactivityTimer();
    } else if (warningCount === 2) {
        agregarMensaje("bot", "🔴 Sesión cerrada por inactividad. Espero haberte ayudado.");
        closeSession();
    }
}

function closeSession() {
    sessionClosed = true;
    document.getElementById("mensaje").disabled = true; //  Bloquear campo de entrada
    document.getElementById("chatContainer").classList.add("hidden"); //  Cerrar chat
    clearTimeout(inactivityTimer);
}

// 🔹 CARRUSEL AUTOMÁTICO
let currentIndex = 0;
function moveSlide(step) {
    const slides = document.querySelector('.carousel-slide');
    const images = slides ? slides.querySelectorAll('img') : [];

    if (slides && images.length > 0) {
        currentIndex = (currentIndex + step + images.length) % images.length;
        slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }
}

// 🔹 Desplazamiento automático del carrusel cada 5 segundos
setInterval(() => moveSlide(1), 5000);


document.getElementById("menu-trigger").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el enlace se active
    this.parentElement.classList.toggle("active");
});

// Menú móvil
document.querySelector(".menu-toggle").addEventListener("click", function() {
    document.querySelector("nav ul").classList.toggle("show");
});

//  Eventos para detectar actividad y reiniciar el temporizador
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);

//  Iniciar el temporizador cuando se carga la página
document.addEventListener("DOMContentLoaded", startInactivityTimer);