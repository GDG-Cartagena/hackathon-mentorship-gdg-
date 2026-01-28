/*
CRUD (simulado) en memoria
No requiere servidor, solo explica la idea
*/

let usuarios = []; // nuestra "mini base de datos"

// CREATE
function crearUsuario(nombre) {
  const nuevo = { id: Date.now(), nombre };
  usuarios.push(nuevo);
  return nuevo;
}

// READ
function verUsuarios() {
  return usuarios;
}

// UPDATE
function actualizarUsuario(id, nuevoNombre) {
  const u = usuarios.find((x) => x.id === id);
  if (!u) return null;
  u.nombre = nuevoNombre;
  return u;
}

// DELETE
function borrarUsuario(id) {
  usuarios = usuarios.filter((x) => x.id !== id);
}

// Demo del CRUD
const a = crearUsuario("Ana");
const b = crearUsuario("Luis");

console.log("READ:", verUsuarios());

actualizarUsuario(a.id, "Ana Maria");
console.log("UPDATE:", verUsuarios());

borrarUsuario(b.id);
console.log("DELETE:", verUsuarios());
