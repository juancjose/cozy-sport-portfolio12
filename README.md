# Cozy Sport · Portfolio 12

Versión interactiva del sitio de Cozy Sport: animaciones sutiles al entrar cada sección, carrusel de deportes y un selector de kit que lleva directo a la tienda.

**Sitio en vivo:** https://juancjose.github.io/cozy-sport-portfolio12/

Tienda online: https://tiendacozy.com/

## Qué tiene

- Hero a pantalla completa con animación de entrada al cargar. El scroll es natural, sin secciones fijadas.
- Manifiesto que se enciende palabra por palabra y contadores animados.
- Carrusel de deportes con flechas, arrastre (PC) o deslizar (celular).
- "Tu kit": elegís tu deporte y ves prendas y el link a esa categoría de la tienda.
- Taller en 6 pasos, del diseño al despacho, que aparecen al bajar.
- WhatsApp con selector de vendedoras.
- Respeta `prefers-reduced-motion`: sin movimiento, todo el contenido visible.

## Desarrollo

Sitio estático, HTML/CSS/JS sin dependencias. Se edita `src/index.html` y se genera `index.html` con:

```
python3 tools/build.py
```

Los números de WhatsApp de las vendedoras están en `VENDEDORES`, al principio de `assets/js/main.js` (hoy son de ejemplo).

Fotos: Pexels y propias (créditos en el pie del sitio y en `assets/img/credits.json`).
