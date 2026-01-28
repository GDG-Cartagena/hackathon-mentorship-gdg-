# 🚀 Guía Completa: Setup de Supabase y Configuración de Proyecto

Esta guía te llevará paso a paso desde cero hasta tener tu proyecto de Supabase configurado y listo para conectar con Python y JavaScript.

---

## 📋 Índice

1. [Crear Proyecto en Supabase](#1-crear-proyecto-en-supabase)
2. [Crear Tablas de Ejemplo](#2-crear-tablas-de-ejemplo)
3. [Obtener Credenciales](#3-obtener-credenciales)
4. [Configurar Variables de Entorno](#4-configurar-variables-de-entorno)
5. [Instalación Python](#5-instalación-python)
6. [Instalación JavaScript](#6-instalación-javascript)
7. [Verificar Conexión](#7-verificar-conexión)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Crear Proyecto en Supabase

### Paso 1.1: Registro en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Click en **"Start your project"** o **"Sign up"**
3. Regístrate usando:
   - GitHub (recomendado)
   - Email y contraseña
4. Verifica tu email si es necesario

### Paso 1.2: Crear Nuevo Proyecto

1. Una vez dentro del dashboard, click en **"New Project"**
2. Completa el formulario:

   | Campo | Valor Recomendado | Descripción |
   |-------|-------------------|-------------|
   | **Name** | `mi-proyecto-db` | Nombre de tu proyecto |
   | **Database Password** | (genera una segura) | ⚠️ **IMPORTANTE**: Cópiala y guárdala |
   | **Region** | `South America (São Paulo)` | Selecciona la más cercana |
   | **Pricing Plan** | `Free` | Suficiente para desarrollo |

3. Click en **"Create new project"**
4. Espera 2-3 minutos mientras Supabase aprovisiona tu base de datos

> ⚠️ **MUY IMPORTANTE**: Guarda la **Database Password** inmediatamente. No podrás verla después.

---

## 2. Crear Tablas de Ejemplo

### Paso 2.1: Ir al SQL Editor

1. En el menú lateral izquierdo, click en **"SQL Editor"**
2. Click en **"New query"**

### Paso 2.2: Crear Tabla de Usuarios

Copia y pega este código SQL:

```sql
-- Crear tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  edad INTEGER CHECK (edad >= 18),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, edad) VALUES
  ('Juan Pérez', 'juan@email.com', 25),
  ('María García', 'maria@email.com', 30),
  ('Carlos López', 'carlos@email.com', 28);
```

Click en **"Run"** o presiona `Ctrl + Enter`

### Paso 2.3: Crear Tabla de Pedidos (Opcional)

```sql
-- Crear tabla pedidos
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto VARCHAR(200),
  cantidad INTEGER DEFAULT 1,
  precio DECIMAL(10,2),
  fecha_pedido TIMESTAMP DEFAULT NOW()
);

-- Insertar pedidos de ejemplo
INSERT INTO pedidos (usuario_id, producto, cantidad, precio) VALUES
  (1, 'Laptop', 1, 1500.00),
  (1, 'Mouse', 2, 25.50),
  (2, 'Teclado', 1, 80.00);
```

### Paso 2.4: Verificar Tablas

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver las tablas `usuarios` y `pedidos`
3. Click en cada tabla para ver los datos

---

## 3. Obtener Credenciales

### Paso 3.1: Credenciales para Supabase Client (JavaScript/Python)

1. Ve a **Settings** (⚙️ en el menú lateral)
2. Click en **"API"**
3. Copia las siguientes credenciales:

```
📋 PROJECT URL
https://abcdefghijklmnop.supabase.co

📋 ANON/PUBLIC KEY (anon key)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjE5MjAwMCwiZXhwIjoxOTI3NzY4MDAwfQ...
```

> 💡 **Nota**: Esta key es pública y segura para usar en frontend.

### Paso 3.2: Credenciales para Conexión Directa PostgreSQL

1. En **Settings** → **Database**
2. Desplázate hasta **"Connection string"**
3. Verás varios formatos, necesitas:

#### Opción A: Connection String (recomendado)

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

Reemplaza `[YOUR-PASSWORD]` con tu contraseña guardada.

#### Opción B: Parámetros individuales

```
Host: db.abcdefghijklmnop.supabase.co
Database: postgres
User: postgres
Password: [TU-PASSWORD-AQUÍ]
Port: 5432
```

### Paso 3.3: Tabla de Credenciales Completa

| Credencial | Para qué sirve | Dónde usarla |
|------------|----------------|--------------|
| `SUPABASE_URL` | URL del proyecto | Cliente Supabase (JS/Python) |
| `SUPABASE_KEY` | Anon key pública | Cliente Supabase (JS/Python) |
| `DB_HOST` | Host PostgreSQL | Conexión directa (psycopg2/pg) |
| `DB_NAME` | Nombre de BD | Conexión directa |
| `DB_USER` | Usuario | Conexión directa |
| `DB_PASSWORD` | Contraseña | Conexión directa |
| `DB_PORT` | Puerto | Conexión directa |

---

## 4. Configurar Variables de Entorno

### Paso 4.1: Crear archivo `.env`

En la raíz de tu proyecto, crea un archivo llamado `.env`:

```bash
# En la terminal (Linux/Mac)
touch .env

# En Windows
type nul > .env
```

### Paso 4.2: Agregar credenciales al `.env`

Abre el archivo `.env` con tu editor favorito y pega esto (reemplaza con tus valores):

```env
# ============================================================
# CREDENCIALES DE SUPABASE
# ============================================================

# Para usar con @supabase/supabase-js o supabase-py
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Para conexión directa a PostgreSQL (psycopg2 o pg)
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_super_secreto_aqui
DB_PORT=5432
```

### Paso 4.3: Agregar `.env` a `.gitignore`

**MUY IMPORTANTE**: Nunca subas el archivo `.env` a Git.

Crea o edita `.gitignore`:

```gitignore
# Variables de entorno
.env
.env.local
.env.*.local

# Dependencias Python
__pycache__/
*.py[cod]
venv/
env/

# Dependencias Node.js
node_modules/
package-lock.json
```

---

## 5. Instalación Python

### Paso 5.1: Verificar Python

```bash
python --version
# o
python3 --version
```

Deberías tener Python 3.8 o superior.

### Paso 5.2: Crear entorno virtual (recomendado)

```bash
# Crear entorno virtual
python -m venv venv

# Activar en Linux/Mac
source venv/bin/activate

# Activar en Windows
venv\Scripts\activate
```

### Paso 5.3: Instalar dependencias

```bash
pip install supabase psycopg2-binary python-dotenv
```

#### ¿Qué instala cada paquete?

| Paquete | Descripción | Para qué sirve |
|---------|-------------|----------------|
| `supabase` | Cliente oficial de Supabase | Conectar usando API de Supabase |
| `psycopg2-binary` | Adaptador PostgreSQL | Conexión directa a PostgreSQL |
| `python-dotenv` | Cargar variables de entorno | Leer archivo `.env` |

### Paso 5.4: Verificar instalación

```bash
pip list | grep -E "supabase|psycopg2|dotenv"
```

Deberías ver:

```
psycopg2-binary    2.9.9
python-dotenv      1.0.0
supabase          2.4.0
```

### Paso 5.5: Crear `requirements.txt`

```bash
pip freeze > requirements.txt
```

Esto te permite instalar todo de nuevo con:

```bash
pip install -r requirements.txt
```

---

## 6. Instalación JavaScript

### Paso 6.1: Verificar Node.js

```bash
node --version
npm --version
```

Deberías tener Node.js 16 o superior.

### Paso 6.2: Inicializar proyecto (si no existe)

```bash
npm init -y
```

### Paso 6.3: Configurar ES Modules

Edita `package.json` y agrega:

```json
{
  "name": "supabase-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

### Paso 6.4: Instalar dependencias

```bash
npm install @supabase/supabase-js pg dotenv
```

#### ¿Qué instala cada paquete?

| Paquete | Descripción | Para qué sirve |
|---------|-------------|----------------|
| `@supabase/supabase-js` | Cliente oficial de Supabase | Conectar usando API de Supabase |
| `pg` | Cliente PostgreSQL (node-postgres) | Conexión directa a PostgreSQL |
| `dotenv` | Cargar variables de entorno | Leer archivo `.env` |

### Paso 6.5: Verificar instalación

```bash
npm list --depth=0
```

Deberías ver:

```
├── @supabase/supabase-js@2.39.0
├── dotenv@16.3.1
└── pg@8.11.3
```

---

## 7. Verificar Conexión

### Opción A: Test con Python

Crea `test_connection.py`:

```python
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

# Test con Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

response = supabase.table("usuarios").select("*").limit(1).execute()
print("✅ Conexión exitosa con Supabase!")
print(f"Primer usuario: {response.data[0] if response.data else 'No hay datos'}")
```

Ejecuta:

```bash
python test_connection.py
```

### Opción B: Test con JavaScript

Crea `test_connection.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .limit(1);

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('✅ Conexión exitosa con Supabase!');
  console.log('Primer usuario:', data[0] || 'No hay datos');
}
```

Ejecuta:

```bash
node test_connection.js
```

### Resultado esperado:

```
✅ Conexión exitosa con Supabase!
Primer usuario: { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', ... }
```

---

## 8. Solución de Problemas

### Error: "Connection refused" o "ECONNREFUSED"

**Causa**: Firewall o credenciales incorrectas.

**Solución**:
1. Verifica que copiaste bien el `DB_HOST` de Supabase
2. Revisa que la contraseña no tenga espacios al inicio/final
3. Asegúrate de estar conectado a Internet

### Error: "relation 'usuarios' does not exist"

**Causa**: La tabla no fue creada.

**Solución**:
1. Ve a Supabase → SQL Editor
2. Ejecuta nuevamente el script de crear tabla
3. Verifica en Table Editor que existe

### Error: "dotenv is not defined" (JavaScript)

**Causa**: Falta importar dotenv.

**Solución**:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

### Error: "ModuleNotFoundError: No module named 'supabase'"

**Causa**: No instalaste las dependencias de Python.

**Solución**:
```bash
pip install supabase psycopg2-binary python-dotenv
```

### Error: "Cannot find module '@supabase/supabase-js'"

**Causa**: No instalaste las dependencias de Node.

**Solución**:
```bash
npm install @supabase/supabase-js pg dotenv
```

### Error: SSL/TLS connection issues

**Causa**: Supabase requiere SSL.

**Solución para Python**:
```python
import psycopg2
conn = psycopg2.connect(
    ...,
    sslmode='require'
)
```

**Solución para JavaScript**:
```javascript
const pool = new Pool({
  ...,
  ssl: { rejectUnauthorized: false }
});
```

---

## 🎯 Checklist Final

Antes de empezar a programar, verifica:

- [ ] Proyecto creado en Supabase
- [ ] Tablas `usuarios` y `pedidos` creadas
- [ ] Contraseña de base de datos guardada
- [ ] Archivo `.env` creado con todas las credenciales
- [ ] `.env` agregado a `.gitignore`
- [ ] Dependencias Python instaladas (`pip list`)
- [ ] Dependencias JavaScript instaladas (`npm list`)
- [ ] Test de conexión ejecutado exitosamente

---

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Python Client Docs](https://supabase.com/docs/reference/python/introduction)
- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 🚀 Siguiente Paso

Ahora estás listo para usar los archivos:
- `supabase_python.py` - Cliente Supabase con Python
- `postgres_python.py` - Conexión directa PostgreSQL con Python
- `supabase_javascript.js` - Cliente Supabase con JavaScript
- `postgres_javascript.js` - Conexión directa PostgreSQL con JavaScript

¡Éxito en tu proyecto! 🎉
