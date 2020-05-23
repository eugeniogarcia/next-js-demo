---
title: 'Para demostrar fallback'
date: '2020-05-23'
---

Con esta página demostramos el uso de __fallback__ pages. Con una página de tipo fallback, lo que hacemos es:

- en `getStaticPaths` no retornaremos todas las rutas, por ejemplo, retornaremos una muestra. Tenemos que retornar `failback:true`
- en `getStaticProps` lo dejamos todo preparado para recuperar los datos de cualquier página, incluso las no incluidas en el muestreo anterior
- en el renderizado dinámico de las páginas usamos el `Router` para mostrar una página de failback mientras se construye nuestra página
