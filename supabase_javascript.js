import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Conectado a Supabase usando supabase-js\n');

// ============================================================================
// OPERACIONES CRUD
// ============================================================================

// CREATE - Insertar usuario
async function crearUsuario(nombre, email, edad) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, edad }])
      .select();

    if (error) throw error;

    console.log('✅ Usuario creado:', data[0]);
    return data[0];
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    return null;
  }
}

// READ - Obtener todos los usuarios
async function obtenerUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    console.log(`✅ ${data.length} usuarios encontrados`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    return [];
  }
}

// READ - Obtener usuario por ID
async function obtenerUsuarioPorId(userId) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    console.log('✅ Usuario encontrado:', data);
    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// READ - Filtrar usuarios activos
async function obtenerUsuariosActivos() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('activo', true)
      .gte('edad', 18)
      .order('fecha_registro', { ascending: false });

    if (error) throw error;

    console.log(`✅ ${data.length} usuarios activos encontrados`);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

// UPDATE - Actualizar usuario
async function actualizarUsuario(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;

    console.log('✅ Usuario actualizado:', data[0]);
    return data[0];
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
    return null;
  }
}

// DELETE - Eliminar usuario
async function eliminarUsuario(userId) {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    console.log(`✅ Usuario con ID ${userId} eliminado`);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar:', error.message);
    return false;
  }
}

// JOIN - Obtener usuario con pedidos
async function obtenerUsuarioConPedidos(userId) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        email,
        edad,
        pedidos (
          id,
          producto,
          cantidad,
          precio,
          fecha_pedido
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    console.log(`✅ Usuario: ${data.nombre}`);
    console.log(`   Total pedidos: ${data.pedidos?.length || 0}`);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// AGGREGATION - Contar usuarios (manual)
async function contarUsuariosPorEdad() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('edad');

    if (error) throw error;

    // Agrupar manualmente
    const conteo = {};
    data.forEach(usuario => {
      const edad = usuario.edad;
      conteo[edad] = (conteo[edad] || 0) + 1;
    });

    console.log('✅ Conteo por edad:');
    Object.entries(conteo)
      .sort(([a], [b]) => a - b)
      .forEach(([edad, cantidad]) => {
        console.log(`   Edad ${edad}: ${cantidad} usuarios`);
      });

    return conteo;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return {};
  }
}

// RPC - Llamar función de PostgreSQL
async function llamarFuncionPersonalizada() {
  try {
    // Ejemplo: si tienes una función SQL llamada 'obtener_estadisticas'
    const { data, error } = await supabase.rpc('obtener_estadisticas', {});

    if (error) throw error;

    console.log('✅ Resultado de función:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al llamar función:', error.message);
    return null;
  }
}

// REALTIME - Suscribirse a cambios en tiempo real
function suscribirseACambios() {
  const channel = supabase
    .channel('usuarios-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'usuarios'
      },
      (payload) => {
        console.log('🔔 Cambio detectado:', payload);
      }
    )
    .subscribe();

  console.log('✅ Suscrito a cambios en tiempo real');
  return channel;
}

// ============================================================================
// EJECUCIÓN DE EJEMPLO
// ============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('PRUEBA DE OPERACIONES CON SUPABASE-JS');
  console.log('='.repeat(60) + '\n');

  let userId = null;

  try {
    // 1. Crear usuario
    console.log('1️⃣  CREAR USUARIO');
    const nuevoUsuario = await crearUsuario('Juan Pérez', 'juan@email.com', 25);
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
      await actualizarUsuario(userId, { nombre: 'Juan Carlos Pérez' });
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

    // 8. Eliminar usuario
    if (userId) {
      console.log('8️⃣  ELIMINAR USUARIO');
      await eliminarUsuario(userId);
      console.log();
    }

    console.log('='.repeat(60));
    console.log('✅ PRUEBA COMPLETADA');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
main();
