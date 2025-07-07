# 🚀 Guía de Despliegue en Railway - SmartDrive

Esta guía te ayudará a desplegar SmartDrive en Railway de manera rápida y sencilla.

## 📋 Prerrequisitos

1. **Cuenta en Railway**: [Regístrate aquí](https://railway.app)
2. **Cuenta en Supabase**: [Regístrate aquí](https://supabase.com)
3. **Repositorio en GitHub**: El código debe estar en un repositorio de GitHub

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración

### 2. Configurar Base de Datos

Ejecuta las siguientes consultas SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 5368709120, -- 5GB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de carpetas
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de archivos
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_type ON files(type);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas de seguridad para folders
CREATE POLICY "Users can view own folders" ON folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders" ON folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders" ON folders
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para files
CREATE POLICY "Users can view own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Configurar Storage

1. Ve a **Storage** en el dashboard de Supabase
2. Crea un bucket llamado `files`
3. Configura las políticas de acceso:

```sql
-- Política para subir archivos
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para ver archivos
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para eliminar archivos
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Obtener Credenciales

1. Ve a **Settings > API**
2. Copia:
   - `Project URL`
   - `anon public key`
   - `service_role key` (mantén esto seguro)

## 🚂 Despliegue en Railway

### 1. Conectar Repositorio

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway y selecciona tu repositorio

### 2. Configurar Variables de Entorno

En el dashboard de Railway, ve a **Variables** y agrega:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# App
NEXTAUTH_URL=https://tu-app.railway.app
NEXTAUTH_SECRET=genera_una_clave_secreta_aleatoria

# Configuración
MAX_FILE_SIZE=52428800
DEFAULT_STORAGE_LIMIT=5368709120
ADMIN_EMAIL=tu_email@dominio.com
```

### 3. Configurar Dominio (Opcional)

1. Ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

## 🔧 Configuración Post-Despliegue

### 1. Crear Usuario Administrador

1. Regístrate en tu aplicación desplegada
2. Ve a Supabase Dashboard > Authentication > Users
3. Encuentra tu usuario y edita los metadatos:

```json
{
  "role": "admin"
}
```

4. También actualiza la tabla profiles:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu_email@dominio.com';
```

### 2. Configurar Límites de Almacenamiento

Puedes ajustar los límites por defecto en la base de datos:

```sql
-- Cambiar límite por defecto a 10GB
UPDATE profiles SET storage_limit = 10737418240 WHERE role = 'user';

-- Límite ilimitado para admins
UPDATE profiles SET storage_limit = 1099511627776 WHERE role = 'admin';
```

## 🔍 Verificación del Despliegue

1. **Página de inicio**: Debe cargar correctamente
2. **Registro**: Crear una cuenta nueva
3. **Login**: Iniciar sesión
4. **Subida de archivos**: Probar subir un archivo
5. **Panel admin**: Acceder con cuenta de administrador

## 🐛 Solución de Problemas

### Error de Conexión a Supabase

- Verifica que las URLs y keys sean correctas
- Asegúrate de que las políticas RLS estén configuradas
- Revisa los logs en Railway Dashboard

### Error de Subida de Archivos

- Verifica la configuración del bucket en Supabase
- Revisa las políticas de Storage
- Confirma los límites de tamaño de archivo

### Error 500 en Producción

- Revisa los logs en Railway
- Verifica todas las variables de entorno
- Asegúrate de que la base de datos esté configurada

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs en Railway Dashboard
2. Verifica la configuración de Supabase
3. Consulta la documentación oficial de Railway y Supabase

## 🎉 ¡Listo!

Tu aplicación SmartDrive ahora está desplegada y lista para usar. Los usuarios pueden registrarse, subir archivos, organizarlos en carpetas y disfrutar de todas las funcionalidades implementadas.

**Una creación de DoValeLabs** 🚀

