/*
SOLID (nivel básico)
- S: Una función = una responsabilidad
- O: Agregar sin romper
- D: Depender de una idea, no de una cosa fija
*/

// =======================
// S - Single Responsibility
// =======================

// ❌ MAL: hace dos cosas (guardar + imprimir)
function guardarUsuario_MAL(usuario) {
  console.log("Guardando usuario:", usuario.nombre);
  console.log("Usuario guardado ✅");
}

// ✅ BIEN: cada función hace UNA cosa
function guardarUsuario(usuario) {
  // Aquí "simulamos" guardar
  return { ...usuario, id: 1 };
}

function mostrarMensaje(texto) {
  console.log(texto);
}

// Flujo limpio
const user = { nombre: "Ana" };
const guardado = guardarUsuario(user);
mostrarMensaje("Usuario guardado con id: " + guardado.id);

// =======================
// O - Open/Closed
// =======================
// Queremos calcular el costo de envío.
// Hoy tenemos "normal", mañana agregamos "express" sin romper lo anterior.

function costoEnvio(tipo) {
  const reglas = {
    normal: () => 5000,
    // mañana agrego:
    express: () => 10000,
  };

  // Si no existe el tipo, usamos normal por defecto
  const calcular = reglas[tipo] || reglas.normal;
  return calcular();
}

mostrarMensaje("Envío normal: " + costoEnvio("normal"));
mostrarMensaje("Envío express: " + costoEnvio("express"));

// =======================
// D - Dependency Inversion
// =======================
// No depender de "Email" fijo. Depender de "notificador" (una idea).

function enviarBienvenida(usuario, notificador) {
  notificador.enviar("Bienvenido/a " + usuario.nombre);
}

const notificadorEmail = {
  enviar: (msg) => console.log("📧 Email:", msg),
};

const notificadorWhatsApp = {
  enviar: (msg) => console.log("💬 WhatsApp:", msg),
};

enviarBienvenida({ nombre: "Luis" }, notificadorEmail);
enviarBienvenida({ nombre: "Luis" }, notificadorWhatsApp);
