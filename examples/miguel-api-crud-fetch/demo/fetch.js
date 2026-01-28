/*
API + Fetch (nivel básico)
Usaremos JSONPlaceholder (API de prueba)
https://jsonplaceholder.typicode.com/
*/

async function traerUsuarios() {
  console.log("1) Pidiendo usuarios al servidor...");

  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  console.log("2) Respuesta recibida. Convirtiendo a JSON...");

  const users = await res.json();

  console.log("3) Lista de usuarios (nombres):");
  users.forEach((u) => console.log("- " + u.name));
}

traerUsuarios().catch((e) => console.log("Error:", e));
