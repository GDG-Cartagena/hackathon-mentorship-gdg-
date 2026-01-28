from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Anon/Public Key

# Crear cliente de Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("✅ Conectado a Supabase usando supabase-py")

# ============================================================================
# OPERACIONES CRUD
# ============================================================================

# CREATE - Insertar un usuario
def crear_usuario(nombre: str, email: str, edad: int):
    """Crear un nuevo usuario en la tabla usuarios"""
    try:
        response = supabase.table("usuarios").insert({
            "nombre": nombre,
            "email": email,
            "edad": edad
        }).execute()
        
        print(f"✅ Usuario creado: {response.data[0]}")
        return response.data[0]
    except Exception as e:
        print(f"❌ Error al crear usuario: {e}")
        return None


# READ - Obtener todos los usuarios
def obtener_usuarios():
    """Obtener todos los usuarios de la tabla"""
    try:
        response = supabase.table("usuarios").select("*").execute()
        print(f"✅ {len(response.data)} usuarios encontrados")
        return response.data
    except Exception as e:
        print(f"❌ Error al obtener usuarios: {e}")
        return []


# READ - Obtener usuario por ID
def obtener_usuario_por_id(user_id: int):
    """Obtener un usuario específico por ID"""
    try:
        response = supabase.table("usuarios").select("*").eq("id", user_id).execute()
        
        if response.data:
            print(f"✅ Usuario encontrado: {response.data[0]}")
            return response.data[0]
        else:
            print(f"⚠️  Usuario con ID {user_id} no encontrado")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# READ - Filtrar usuarios activos mayores de edad
def obtener_usuarios_activos():
    """Obtener usuarios activos mayores de 18 años"""
    try:
        response = (supabase.table("usuarios")
                    .select("*")
                    .eq("activo", True)
                    .gte("edad", 18)
                    .order("fecha_registro", desc=True)
                    .execute())
        
        print(f"✅ {len(response.data)} usuarios activos encontrados")
        return response.data
    except Exception as e:
        print(f"❌ Error: {e}")
        return []


# UPDATE - Actualizar usuario
def actualizar_usuario(user_id: int, nombre: str = None, email: str = None):
    """Actualizar datos de un usuario"""
    try:
        datos_actualizar = {}
        if nombre:
            datos_actualizar["nombre"] = nombre
        if email:
            datos_actualizar["email"] = email
        
        response = (supabase.table("usuarios")
                    .update(datos_actualizar)
                    .eq("id", user_id)
                    .execute())
        
        print(f"✅ Usuario actualizado: {response.data[0]}")
        return response.data[0]
    except Exception as e:
        print(f"❌ Error al actualizar: {e}")
        return None


# DELETE - Eliminar usuario
def eliminar_usuario(user_id: int):
    """Eliminar un usuario por ID"""
    try:
        response = supabase.table("usuarios").delete().eq("id", user_id).execute()
        print(f"✅ Usuario con ID {user_id} eliminado")
        return True
    except Exception as e:
        print(f"❌ Error al eliminar: {e}")
        return False


# JOIN - Obtener usuarios con sus pedidos
def obtener_usuario_con_pedidos(user_id: int):
    """Obtener usuario junto con todos sus pedidos"""
    try:
        response = (supabase.table("usuarios")
                    .select("*, pedidos(*)")
                    .eq("id", user_id)
                    .execute())
        
        if response.data:
            usuario = response.data[0]
            print(f"✅ Usuario: {usuario['nombre']}")
            print(f"   Total pedidos: {len(usuario.get('pedidos', []))}")
            return usuario
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# AGGREGATION - Contar usuarios por edad
def contar_usuarios_por_edad():
    """Agrupar y contar usuarios por edad"""
    try:
        # Nota: Supabase-py no tiene GROUP BY directo, 
        # para esto es mejor usar RPC o PostgreSQL directo
        response = supabase.table("usuarios").select("edad").execute()
        
        # Agrupar manualmente
        conteo = {}
        for usuario in response.data:
            edad = usuario['edad']
            conteo[edad] = conteo.get(edad, 0) + 1
        
        print("✅ Conteo por edad:")
        for edad, cantidad in sorted(conteo.items()):
            print(f"   Edad {edad}: {cantidad} usuarios")
        
        return conteo
    except Exception as e:
        print(f"❌ Error: {e}")
        return {}


# ============================================================================
# FUNCIONES RPC (Stored Procedures/Functions)
# ============================================================================

def llamar_funcion_personalizada():
    """Ejemplo de llamar una función de PostgreSQL en Supabase"""
    try:
        # Ejemplo: si tienes una función SQL llamada 'obtener_estadisticas'
        response = supabase.rpc("obtener_estadisticas", {}).execute()
        print(f"✅ Resultado de función: {response.data}")
        return response.data
    except Exception as e:
        print(f"❌ Error al llamar función: {e}")
        return None


# ============================================================================
# EJECUCIÓN DE EJEMPLO
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("PRUEBA DE OPERACIONES CON SUPABASE-PY")
    print("="*60 + "\n")
    
    # 1. Crear usuario
    print("1️⃣  CREAR USUARIO")
    nuevo_usuario = crear_usuario("Juan Pérez", "juan@email.com", 25)
    user_id = nuevo_usuario['id'] if nuevo_usuario else None
    print()
    
    # 2. Obtener todos los usuarios
    print("2️⃣  OBTENER TODOS LOS USUARIOS")
    usuarios = obtener_usuarios()
    for usuario in usuarios[:3]:  # Mostrar solo primeros 3
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
        actualizar_usuario(user_id, nombre="Juan Carlos Pérez")
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
    
    # 8. Eliminar usuario
    if user_id:
        print("8️⃣  ELIMINAR USUARIO")
        eliminar_usuario(user_id)
        print()
    
    print("="*60)
    print("✅ PRUEBA COMPLETADA")
    print("="*60)
