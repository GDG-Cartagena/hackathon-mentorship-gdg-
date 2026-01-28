import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

// Cargar variables de entorno
dotenv.config();

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// ============================================================================
// TEST DE CONEXIÓN
// ============================================================================

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version();');
    console.log('✅ Conectado a PostgreSQL');
    console.log(`   Versión: ${result.rows[0].version.substring(0, 50)}...`);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// ============================================================================
// OPERACIONES CRUD
// ============================================================================

// CREATE - Insertar usuario
async function crearUsuario(nombre, email, edad) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO usuarios (nombre, email, edad)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, edad, fecha_registro;
    `;

    const result = await client.query(query, [nombre, email, edad]);
    const usuario = result.rows[0];

    console.log('✅ Usuario creado:', usuario);
    return usuario;
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    return null;
  } finally {
    client.release();
  }
}

// READ - Obtener todos los usuarios
async function obtenerUsuarios() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios ORDER BY id;');
    const usuarios = result.rows;

    console.log(`✅ ${usuarios.length} usuarios encontrados`);
    return usuarios;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    return [];
  } finally {
    client.release();
  }
}

// READ - Obtener usuario por ID
async function obtenerUsuarioPorId(userId) {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM usuarios WHERE id = $1;';
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log('✅ Usuario encontrado:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log(`⚠️  Usuario con ID ${userId} no encontrado`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  } finally {
    client.release();
  }
}

// READ - Filtrar usuarios activos
async function obtenerUsuariosActivos() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM usuarios
      WHERE activo = TRUE AND edad >= $1
      ORDER BY fecha_registro DESC;
    `;

    const result = await client.query(query, [18]);
    const usuarios = result.rows;

    console.log(`✅ ${usuarios.length} usuarios activos encontrados`);
    return usuarios;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  } finally {
    client.release();
  }
}

// UPDATE - Actualizar usuario
async function actualizarUsuario(userId, updates) {
  const client = await pool.connect();
  try {
    // Construir query dinámicamente
    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (updates.nombre) {
      setClauses.push(`nombre = $${paramCount++}`);
      values.push(updates.nombre);
    }
    if (updates.email) {
      setClauses.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }

    if (setClauses.length === 0) {
      console.log('⚠️  No hay datos para actualizar');
      return null;
    }

    values.push(userId);

    const query = `
      UPDATE usuarios
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await client.query(query, values);
    const usuario = result.rows[0];

    console.log('✅ Usuario actualizado:', usuario);
    return usuario;
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
    return null;
  } finally {
    client.release();
  }
}

// DELETE - Eliminar usuario
async function eliminarUsuario(userId) {
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM usuarios WHERE id = $1;';
    await client.query(query, [userId]);

    console.log(`✅ Usuario con ID ${userId} eliminado`);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar:', error.message);
    return false;
  } finally {
    client.release();
  }
}

// JOIN - Obtener usuario con pedidos
async function obtenerUsuarioConPedidos(userId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.edad,
        p.id as pedido_id,
        p.producto,
        p.cantidad,
        p.precio,
        p.fecha_pedido
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      WHERE u.id = $1;
    `;

    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      const usuario = {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre,
        email: result.rows[0].email,
        edad: result.rows[0].edad,
        pedidos: []
      };

      result.rows.forEach(row => {
        if (row.pedido_id) {
          usuario.pedidos.push({
            id: row.pedido_id,
            producto: row.producto,
            cantidad: row.cantidad,
            precio: parseFloat(row.precio),
            fecha_pedido: row.fecha_pedido
          });
        }
      });

      console.log(`✅ Usuario: ${usuario.nombre}`);
      console.log(`   Total pedidos: ${usuario.pedidos.length}`);
      return usuario;
    }
    return null;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  } finally {
    client.release();
  }
}

// AGGREGATION - Contar usuarios por edad
async function contarUsuariosPorEdad() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT edad, COUNT(*) as cantidad
      FROM usuarios
      GROUP BY edad
      ORDER BY edad;
    `;

    const result = await client.query(query);

    console.log('✅ Conteo por edad:');
    result.rows.forEach(row => {
      console.log(`   Edad ${row.edad}: ${row.cantidad} usuarios`);
    });

    return result.rows;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  } finally {
    client.release();
  }
}

// TRANSACTION - Crear usuario y pedido en una transacción
async function crearUsuarioConPedido(nombre, email, edad, producto, precio) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insertar usuario
    const userQuery = `
      INSERT INTO usuarios (nombre, email, edad)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const userResult = await client.query(userQuery, [nombre, email, edad]);
    const userId = userResult.rows[0].id;

    // Insertar pedido
    const pedidoQuery = `
      INSERT INTO pedidos (usuario_id, producto, precio)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const pedidoResult = await client.query(pedidoQuery, [userId, producto, precio]);
    const pedidoId = pedidoResult.rows[0].id;

    await client.query('COMMIT');

    console.log(`✅ Usuario ${userId} y pedido ${pedidoId} creados en transacción`);
    return { userId, pedidoId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en transacción:', error.message);
    return null;
  } finally {
    client.release();
  }
}

// ============================================================================
// EJECUCIÓN DE EJEMPLO
// ============================================================================

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('PRUEBA DE OPERACIONES CON NODE-POSTGRES (PG)');
  console.log('='.repeat(60) + '\n');

  let userId = null;

  try {
    // 0. Test de conexión
    console.log('0️⃣  TEST DE CONEXIÓN');
    await testConnection();
    console.log();

    // 1. Crear usuario
    console.log('1️⃣  CREAR USUARIO');
    const nuevoUsuario = await crearUsuario('María García', 'maria@email.com', 30);
    userId = nuevoUsuario?.id;
    console.log();

    // 2. Obtener todos los usuarios
    console.log('2️⃣  OBTENER TODOS LOS USUARIOS');
    const usuarios = await obtenerUsuarios();
    usuarios.slice(0, 3).forEach(u => {
      console.log(`   - ${u.nombre} (${u.email})`);
    });
    console.log();

    // 3. Obtener usuario por ID
    if (userId) {
      console.log('3️⃣  OBTENER USUARIO POR ID');
      await obtenerUsuarioPorId(userId);
      console.log();
    }

    // 4. Filtrar usuarios activos
    console.log('4️⃣  USUARIOS ACTIVOS');
    await obtenerUsuariosActivos();
    console.log();

    // 5. Actualizar usuario
    if (userId) {
      console.log('5️⃣  ACTUALIZAR USUARIO');
      await actualizarUsuario(userId, { nombre: 'María Fernanda García' });
      console.log();
    }

    // 6. Obtener con pedidos (JOIN)
    if (userId) {
      console.log('6️⃣  USUARIO CON PEDIDOS');
      await obtenerUsuarioConPedidos(userId);
      console.log();
    }

    // 7. Agrupar por edad
    console.log('7️⃣  CONTAR POR EDAD');
    await contarUsuariosPorEdad();
    console.log();

    // 8. Transacción
    console.log('8️⃣  CREAR CON TRANSACCIÓN');
    await crearUsuarioConPedido('Carlos López', 'carlos@email.com', 28, 'Laptop', 1500.00);
    console.log();

    // 9. Eliminar usuario
    if (userId) {
      console.log('9️⃣  ELIMINAR USUARIO');
      await eliminarUsuario(userId);
      console.log();
    }

    console.log('='.repeat(60));
    console.log('✅ PRUEBA COMPLETADA');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar
main();
