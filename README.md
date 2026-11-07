# BodegaPro — Sistema Web de Control de Inventario y Reabastecimiento

Aplicación web interactiva desarrollada con **HTML5, CSS3 y JavaScript puro (Vanilla JS)** sin frameworks ni librerías externas, diseñada para digitalizar el control de existencias, cálculo de valorización de inventario y alertas de punto de reorden en pequeños comercios y distribuidoras.

## Características e Implementación Académica (Clases 6, 7 y 8)

1. **Fundamentos de JavaScript (Clase 6)**:
   - Gestión de estado en memoria mediante arrays de objetos (`inventario`), variables tipadas, operadores aritméticos/lógicos, condicionales (`if/else`) y ciclos `for`.
   - Más de tres funciones propias con responsabilidades diferenciadas:
     - `validarDatosProducto(datos, idActual)`: Valida expresiones regulares, rangos numéricos y unicidad de SKU.
     - `calcularMetricasInventario(listaProductos)`: Calcula unidades físicas totales, valor patrimonial acumulado (`Precio × Stock`), alertas de reorden y desglose por categoría.
     - `filtrarCatalogoProductos(termino, categoria, estado)`: Filtra en tiempo real combinando criterios múltiples.
     - `renderizarInterfazDOM()`: Construye y actualiza la tabla y tarjetas KPI dinámicamente.
2. **Manipulación Dinámica del DOM (Clase 7)**:
   - Creación (`document.createElement`), actualización y eliminación de filas `<tr>`, etiquetas de estado y chips estadísticos sin recargar la página.
3. **Formularios y Captura de Datos (Clase 8)**:
   - Formulario estructurado con **7 campos relacionados con el negocio**: Código SKU, Categoría, Nombre Comercial, Precio Unitario, Stock Actual, Stock Mínimo (Punto de Reorden) y Correo del Proveedor.
4. **Eventos e Interactividad (Clases 7 y 8)**:
   - Eventos `submit` (crear/actualizar), `input` (cálculo en vivo del subtotal del lote y búsqueda instantánea), `change` (filtros por categoría y estado de stock) y `click` (`+1 Stock`, `Editar`, `Eliminar`, `Restablecer`).
5. **Validaciones del Negocio (Clase 8)**:
   - Validación de formato SKU (`AAA-000`), prevención de códigos SKU duplicados, validación de correo electrónico, precios positivos (`$0.01` a `$50,000`) y cantidades enteras no negativas.

## Estructura del Repositorio

```text
bodegapro-inventario/
├── index.html   # Estructura semántica HTML5, tarjetas KPI, formulario y tabla
├── styles.css   # Diseño responsivo, variables CSS, estados de validación y badges
├── app.js       # Lógica de negocio en JavaScript puro, manipulación del DOM y eventos
└── README.md    # Documentación e instrucciones de ejecución y despliegue en GitHub
```

## Instrucciones para Ejecutar el Proyecto Localmente

1. Clona o descarga este repositorio en tu computadora:
   ```bash
   git clone https://github.com/tu-usuario/bodegapro-inventario.git
   cd bodegapro-inventario
   ```
2. Abre el archivo `index.html` haciendo doble clic sobre él para ejecutarlo directamente en cualquier navegador web moderno (Google Chrome, Firefox, Edge o Safari), o utiliza la extensión **Live Server** en Visual Studio Code.
3. No requiere instalación de paquetes (`npm`), servidor backend ni base de datos externa.

## Cómo Publicar en GitHub y Activar GitHub Pages

```bash
git init
git add index.html styles.css app.js README.md
git commit -m "feat: sistema interactivo de control de inventario BodegaPro en JS puro"
git branch -M main
git remote add origin https://github.com/tu-usuario/bodegapro-inventario.git
git push -u origin main
```
