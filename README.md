# Sitio Web Gaspel

## Enfoque General
- **Concepto**: Plataforma e-commerce mobile first para una empresa de artículos para construcción y sanitarios.
- **Estética**: Moderna, limpia y confiable, basada en la identidad de Gaspel (paleta neutra, acentos azules y grises cálidos).
- **Objetivo**: Optimizar navegación y conversión (CRO) con flujos simples y claros.

## Arquitectura de Información
1. **Home Institucional**
   - Hero con slogan "Donde la construcción encuentra soluciones".
   - Resumen de la empresa, pilares (Calidad, Variedad, Asesoría Técnica).
   - CTA principal "Ir a la Tienda" y CTA secundario "Solicitar Asesoría".
   - Destacados de categorías (Baños, Cocinas, Revestimientos, Instalaciones Sanitarias).
   - Testimonios de clientes (carrusel responsive).
   - Footer con datos de contacto, redes sociales, horarios y FAQs.
2. **PLP (Product List Page)**
   - Grid de productos con tarjetas (foto, nombre, precio, cuotas, rating).
   - Filtros persistentes por Categoría, Rango de Precio (slider), Marca.
   - Ordenar por relevancia, precio, popularidad.
   - Barra de búsqueda con autocompletado.
   - Tag de promociones ("Envío gratis", "Cuotas sin interés").
3. **PDP (Product Detail Page)**
   - Galería de imágenes zoomable y vista 360° opcional.
   - Nombre, marca, disponibilidad, precio contado y cuotas.
   - Botón "Agregar al carrito" fijo en mobile.
   - Descripción completa, usos, ventajas.
   - Ficha técnica descargable (PDF) y tabla expandible.
   - Reviews verificadas con puntuación y filtros.
   - Productos relacionados / complementarios.
4. **Checkout**
   - Flujo de 3 pasos: Dirección ➜ Método de pago ➜ Confirmación.
   - Progress bar clara, resumen lateral del carrito.
   - Validaciones inline y autofill de datos.
   - Opciones de pago: tarjetas, transferencia, billeteras digitales.
   - Confirmación con número de pedido y CTA a "Seguir Comprando".

## Componentes Clave
- Header sticky con logo, buscador, icono carrito y menú hamburguesa en mobile.
- Menú desplegable por categorías y servicios.
- Breadcrumbs en PLP/PDP.
- Carruseles para promos y testimonios.
- Formularios optimizados con teclado numérico en campos de monto.

## UX/CRO Recomendaciones
- Implementar onboarding inicial con popup de bienvenida y beneficios.
- Usar microinteracciones (hover, feedback) para reforzar acciones.
- Ofrecer chat de asesoramiento en horario comercial.
- Mostrar stock en tiempo real y estimación de entrega.
- Habilitar "Comprar de nuevo" y lista de favoritos para fidelización.
- Integrar programa de puntos y comunicaciones personalizadas.
- Email marketing post-compra con recomendaciones y contenido útil.
- Optimizar tiempos de carga (lazy loading, imágenes comprimidas).

## Contenidos de Producto (Ejemplos PLP)
- Vanitory — $418.099
- Inodoro — $286.388
- Grifería — $132.231
- Cerámico — $10.608/m²

## Accesibilidad
- Contrastes AA, tipografía legible, tamaños escalables.
- Navegación por teclado y etiquetas ARIA en componentes clave.
- Mensajes de error claros y descriptivos.

## Métricas a Monitorear
- Tasa de conversión y abandono en cada paso del checkout.
- Uso del buscador y filtros.
- Tiempo en página y scroll depth en PDP.
- Recompra y uso del programa de fidelización.
