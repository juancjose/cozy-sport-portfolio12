# Cozy Sport · Portfolio 12

Versión interactiva del sitio de Cozy Sport: animaciones al scrollear, carrusel de deportes y un selector de kit que lleva directo a la tienda.

**Sitio en vivo:** https://juancjose.github.io/cozy-sport-portfolio12/

Tienda online: https://tiendacozy.com/

## Qué tiene

- Hero que se abre a pantalla completa al scrollear y cambia de mensaje.
- Manifiesto que se enciende palabra por palabra y contadores animados.
- Deportes en recorrido horizontal (PC) o swipe (celular).
- "Tu kit": elegís tu deporte y ves prendas y el link a esa categoría de la tienda.
- Taller paso a paso, del diseño al despacho.
- WhatsApp con selector de vendedoras.
- Respeta `prefers-reduced-motion`: sin movimiento, todo el contenido visible.

## Desarrollo

Sitio estático, HTML/CSS/JS sin dependencias. Se edita `src/index.html` y se genera `index.html` con:

```
python3 tools/build.py
```

Los números de WhatsApp de las vendedoras están en `VENDEDORES`, al principio de `assets/js/main.js` (hoy son de ejemplo).

Fotos: Pexels y propias (créditos en el pie del sitio y en `assets/img/credits.json`).
