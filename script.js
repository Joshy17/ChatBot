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
        if (event.key === "Enter") {
            event.preventDefault(); 
            enviarMensaje();
        }
    });
});

function toggleChat() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.classList.toggle("hidden");
}

async function enviarMensaje() {
    const userMessage = document.getElementById("mensaje").value;
    if (!userMessage.trim()) return; // Evita enviar mensajes vacíos

    agregarMensaje("user", userMessage); // ✅ Muestra el mensaje del usuario en el chat
    document.getElementById("mensaje").value = ""; // Limpia el input

    try {
        const response = await fetch("http://localhost:3000/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        console.log("📥 Respuesta del servidor:", data); // ✅ Verifica la respuesta en consola

        agregarMensaje("bot", data.reply); // ✅ Muestra la respuesta en el chat
    } catch (error) {
        console.error("❌ Error al conectar con el servidor:", error);
        agregarMensaje("bot", "Error al conectar con el servidor.");
    }
}

function agregarMensaje(tipo, mensaje) {
    const chatBody = document.getElementById("chatBody");
    const msgElement = document.createElement("p");

    msgElement.textContent = mensaje;
    msgElement.classList.add(tipo === "user" ? "user-message" : "bot-message");

    chatBody.appendChild(msgElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll hacia abajo
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