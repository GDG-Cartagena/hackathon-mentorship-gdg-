import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
from contextlib import contextmanager

# Cargar variables de entorno
load_dotenv()

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT", 5432)
}

# ============================================================================
# MANEJO DE CONEXIÓN
# ============================================================================

@contextmanager
def get_db_connection():
    """Context manager para manejar conexiones a la BD"""
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()


def test_connection():
    """Probar conexión a la base de datos"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT version();")
            version = cur.fetchone()[0]
            print(f"✅ Conectado a PostgreSQL")
            print(f"   Versión: {version[:50]}...")
            cur.close()
            return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False


# ============================================================================
# OPERACIONES CRUD
# ============================================================================

# CREATE - Insertar usuario
def crear_usuario(nombre: str, email: str, edad: int):
    """Crear un nuevo usuario en la tabla usuarios"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            query = """
            INSERT INTO usuarios (nombre, email, edad)
            VALUES (%s, %s, %s)
            RETURNING id, nombre, email, edad, fecha_registro;
            """
            
            cur.execute(query, (nombre, email, edad))
            usuario = cur.fetchone()
            
            cur.close()
            print(f"✅ Usuario creado: {dict(usuario)}")
            return dict(usuario)
    except Exception as e:
        print(f"❌ Error al crear usuario: {e}")
        return None


# READ - Obtener todos los usuarios
def obtener_usuarios():
    """Obtener todos los usuarios de la tabla"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("SELECT * FROM usuarios ORDER BY id;")
            usuarios = cur.fetchall()
            
            cur.close()
            print(f"✅ {len(usuarios)} usuarios encontrados")
            return [dict(u) for u in usuarios]
    except Exception as e:
        print(f"❌ Error al obtener usuarios: {e}")
        return []


# READ - Obtener usuario por ID
def obtener_usuario_por_id(user_id: int):
    """Obtener un usuario específico por ID"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            query = "SELECT * FROM usuarios WHERE id = %s;"
            cur.execute(query, (user_id,))
            usuario = cur.fetchone()
            
            cur.close()
            
            if usuario:
                print(f"✅ Usuario encontrado: {dict(usuario)}")
                return dict(usuario)
            else:
                print(f"⚠️  Usuario con ID {user_id} no encontrado")
                return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# READ - Filtrar usuarios con condiciones
def obtener_usuarios_activos():
    """Obtener usuarios activos mayores de 18 años"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            query = """
            SELECT * FROM usuarios
            WHERE activo = TRUE AND edad >= %s
            ORDER BY fecha_registro DESC;
            """
            
            cur.execute(query, (18,))
            usuarios = cur.fetchall()
            
            cur.close()
            print(f"✅ {len(usuarios)} usuarios activos encontrados")
            return [dict(u) for u in usuarios]
    except Exception as e:
        print(f"❌ Error: {e}")
        return []


# UPDATE - Actualizar usuario
def actualizar_usuario(user_id: int, nombre: str = None, email: str = None):
    """Actualizar datos de un usuario"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            # Construir query dinámicamente
            updates = []
            params = []
            
            if nombre:
                updates.append("nombre = %s")
                params.append(nombre)
            if email:
                updates.append("email = %s")
                params.append(email)
            
            if not updates:
                print("⚠️  No hay datos para actualizar")
                return None
            
            params.append(user_id)
            
            query = f"""
            UPDATE usuarios
            SET {', '.join(updates)}
            WHERE id = %s
            RETURNING *;
            """
            
            cur.execute(query, params)
            usuario = cur.fetchone()
            
            cur.close()
            print(f"✅ Usuario actualizado: {dict(usuario)}")
            return dict(usuario)
    except Exception as e:
        print(f"❌ Error al actualizar: {e}")
        return None


# DELETE - Eliminar usuario
def eliminar_usuario(user_id: int):
    """Eliminar un usuario por ID"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            
            query = "DELETE FROM usuarios WHERE id = %s;"
            cur.execute(query, (user_id,))
            
            cur.close()
            print(f"✅ Usuario con ID {user_id} eliminado")
            return True
    except Exception as e:
        print(f"❌ Error al eliminar: {e}")
        return False


# JOIN - Obtener usuarios con pedidos
def obtener_usuario_con_pedidos(user_id: int):
    """Obtener usuario junto con todos sus pedidos"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            query = """
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
            WHERE u.id = %s;
            """
            
            cur.execute(query, (user_id,))
            resultados = cur.fetchall()
            
            cur.close()
            
            if resultados:
                usuario = {
                    "id": resultados[0]["id"],
                    "nombre": resultados[0]["nombre"],
                    "email": resultados[0]["email"],
                    "edad": resultados[0]["edad"],
                    "pedidos": []
                }
                
                for row in resultados:
                    if row["pedido_id"]:
                        usuario["pedidos"].append({
                            "id": row["pedido_id"],
                            "producto": row["producto"],
                            "cantidad": row["cantidad"],
                            "precio": float(row["precio"]),
                            "fecha_pedido": row["fecha_pedido"]
                        })
                
                print(f"✅ Usuario: {usuario['nombre']}")
                print(f"   Total pedidos: {len(usuario['pedidos'])}")
                return usuario
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# AGGREGATION - Contar usuarios por edad
def contar_usuarios_por_edad():
    """Agrupar y contar usuarios por edad"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            query = """
            SELECT edad, COUNT(*) as cantidad
            FROM usuarios
            GROUP BY edad
            ORDER BY edad;
            """
            
            cur.execute(query)
            resultados = cur.fetchall()
            
            cur.close()
            
            print("✅ Conteo por edad:")
            for row in resultados:
                print(f"   Edad {row['edad']}: {row['cantidad']} usuarios")
            
            return [dict(r) for r in resultados]
    except Exception as e:
        print(f"❌ Error: {e}")
        return []


# TRANSACTION - Crear usuario y pedido en una transacción
def crear_usuario_con_pedido(nombre: str, email: str, edad: int, producto: str, precio: float):
    """Crear usuario y pedido en una sola transacción"""
    try:
        with get_db_connection() as conn:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            # Insertar usuario
            cur.execute(
                "INSERT INTO usuarios (nombre, email, edad) VALUES (%s, %s, %s) RETURNING id;",
                (nombre, email, edad)
            )
            user_id = cur.fetchone()["id"]
            
            # Insertar pedido
            cur.execute(
                """
                INSERT INTO pedidos (usuario_id, producto, precio)
                VALUES (%s, %s, %s)
                RETURNING id;
                """,
                (user_id, producto, precio)
            )
            pedido_id = cur.fetchone()["id"]
            
            cur.close()
            
            print(f"✅ Usuario {user_id} y pedido {pedido_id} creados en transacción")
            return {"user_id": user_id, "pedido_id": pedido_id}
    except Exception as e:
        print(f"❌ Error en transacción: {e}")
        return None


# ============================================================================
# EJECUCIÓN DE EJEMPLO
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("PRUEBA DE OPERACIONES CON PSYCOPG2")
    print("="*60 + "\n")
    
    # 0. Test de conexión
    print("0️⃣  TEST DE CONEXIÓN")
    test_connection()
    print()
    
    # 1. Crear usuario
    print("1️⃣  CREAR USUARIO")
    nuevo_usuario = crear_usuario("María García", "maria@email.com", 30)
    user_id = nuevo_usuario['id'] if nuevo_usuario else None
    print()
    
    # 2. Obtener todos los usuarios
    print("2️⃣  OBTENER TODOS LOS USUARIOS")
    usuarios = obtener_usuarios()
    for usuario in usuarios[:3]:
        print(f"   - {usuario['nombre']} ({usuario['email']})")
    print()
    
    # 3. Obtener usuario por ID
    if user_id:
        print("3️⃣  OBTENER USUARIO POR ID")
        obtener_usuario_por_id(user_id)
        print()
    
    # 4. Filtrar usuarios activos
    print("4️⃣  USUARIOS ACTIVOS")
    obtener_usuarios_activos()
    print()
    
    # 5. Actualizar usuario
    if user_id:
        print("5️⃣  ACTUALIZAR USUARIO")
        actualizar_usuario(user_id, nombre="María Fernanda García")
        print()
    
    # 6. Obtener con pedidos (JOIN)
    if user_id:
        print("6️⃣  USUARIO CON PEDIDOS")
        obtener_usuario_con_pedidos(user_id)
        print()
    
    # 7. Agrupar por edad
    print("7️⃣  CONTAR POR EDAD")
    contar_usuarios_por_edad()
    print()
    
    # 8. Transacción
    print("8️⃣  CREAR CON TRANSACCIÓN")
    crear_usuario_con_pedido("Carlos López", "carlos@email.com", 28, "Laptop", 1500.00)
    print()
    
    # 9. Eliminar usuario
    if user_id:
        print("9️⃣  ELIMINAR USUARIO")
        eliminar_usuario(user_id)
        print()
    
    print("="*60)
    print("✅ PRUEBA COMPLETADA")
    print("="*60)
