export class Loader {
    static show(container, message = 'Carregando...') {
        container.innerHTML = `
            <div class="loader-container">
                <div class="loader-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    static hide(container) {
        const loader = container.querySelector('.loader-container');
        if (loader) {
            loader.remove();
        }
    }
}