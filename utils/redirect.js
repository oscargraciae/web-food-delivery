import Router from "next/router";

const redirect = (target, ctx = {}) => {
  if (ctx.res) {
    // Si el rediccionamiento se produce en el servidor,
    // usamos la respuesta HTTP 303 con la cabecera "Location".
    // Esto producirá el redireccionamiento.
    ctx.res.writeHead(303, { Location: target });
    ctx.res.end();
  } else {
    // En el navegador, usamos el componente router de Next.js
    // para reemplazar la ubicación actual por el destino
    // de redireccionamiento.
    Router.replace(target);
  }
};

export default redirect;
