// Asegurarse de que el DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar el contenedor de categorías
    const filterContainer = document.querySelector(".gallery__categories") as HTMLElement;

    // Seleccionar todos los elementos de la galería
    const galleryItems = document.querySelectorAll(".project__card") as NodeListOf<HTMLElement>;

    // Asegurarse de que filterContainer exista antes de agregar el evento
    if (filterContainer) {
        filterContainer.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;

            // Verificar si el elemento clickeado tiene la clase "filter-item"
            if (target && target.classList.contains("filter-item")) {
                // Remover la clase "active" del elemento que la tiene
                const activeItem = filterContainer.querySelector(".active") as HTMLElement;
                if (activeItem) {
                    activeItem.classList.remove("active");
                }

                // Agregar la clase "active" al elemento clickeado
                target.classList.add("active");

                // Obtener el valor del filtro (data-filter)
                const filterValue = target.getAttribute("data-filter") || "all";

                // Filtrar los elementos de la galería
                galleryItems.forEach((item) => {
                    if (item.classList.contains(filterValue) || filterValue === "all") {
                        item.classList.remove("hide");
                        item.classList.add("show");
                    } else {
                        item.classList.remove("show");
                        item.classList.add("hide");
                    }
                });
            }
        });
    } else {
        console.error("El elemento .gallery__categories no se encontró en el DOM");
    }

    // Función para desplazarse a una sección
    function scrollToSection(sectionId: string): void {
        const section = document.getElementById(sectionId) as HTMLElement;
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            console.error(`No se encontró la sección con ID: ${sectionId}`);
        }
    }

    // Agregar eventos de desplazamiento a los elementos con data-section
    document.querySelectorAll('[data-section]').forEach((element) => {
        const sectionId = element.getAttribute('data-section');
        if (sectionId) {
            element.addEventListener('click', () => {
                scrollToSection(sectionId);
            });
        }
    });

    // Agregar evento al logo
    const logo = document.querySelector('.logo') as HTMLElement;
    if (logo) {
        logo.addEventListener('click', () => {
            scrollToSection('home');
        });
    }
});