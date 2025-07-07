# 🌟 SmartDrive - Gestor de Archivos en la Nube

**Una creación de DoValeLabs**

SmartDrive es una aplicación web profesional que funciona como un gestor de archivos en la nube, similar a Google Drive. Permite a los usuarios subir, visualizar, organizar y gestionar archivos de manera segura y eficiente.

![SmartDrive Banner](public/hero-illustration.png)

## ✨ Características Principales

### 📦 Gestión de Archivos
- **Subida múltiple**: Arrastra y suelta múltiples archivos
- **Tipos soportados**: Imágenes, videos, audio, documentos (PDF, DOCX, TXT)
- **Progreso en tiempo real**: Visualiza el progreso de subida
- **Organización**: Crea carpetas y organiza tus archivos
- **Vista previa**: Visualización integrada de archivos

### 🧑‍💻 Sistema de Usuarios
- **Autenticación segura**: Login y registro con Supabase Auth
- **Perfiles personalizados**: Cada usuario tiene su espacio privado
- **Control de acceso**: Solo puedes ver y gestionar tus archivos
- **Límites de almacenamiento**: Control de cuotas por usuario

### 🔍 Búsqueda Avanzada
- **Filtros múltiples**: Por nombre, tipo, fecha
- **Búsqueda instantánea**: Resultados en tiempo real
- **Ordenamiento**: Por fecha, nombre, tamaño, tipo
- **Vistas flexibles**: Grid y lista

### 👨‍💼 Panel de Administración
- **Dashboard completo**: Estadísticas del sistema
- **Gestión de usuarios**: Ver, editar, eliminar usuarios
- **Métricas detalladas**: Uso de almacenamiento, actividad
- **Control total**: Administra todos los aspectos del sistema

### 🎨 Diseño Moderno
- **Interfaz limpia**: Diseño minimalista y profesional
- **Responsive**: Adaptado para móvil y desktop
- **Tema consistente**: Colores azules y grises elegantes
- **Micro-interacciones**: Animaciones suaves y feedback visual

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **TailwindCSS**: Estilos utilitarios y responsive
- **Radix UI**: Componentes accesibles y profesionales
- **Lucide React**: Iconografía moderna y consistente

### Backend
- **Next.js API Routes**: Endpoints RESTful integrados
- **Supabase**: Base de datos PostgreSQL y autenticación
- **Supabase Storage**: Almacenamiento de archivos en la nube
- **Row Level Security**: Seguridad a nivel de base de datos

### Despliegue
- **Railway**: Plataforma de despliegue optimizada
- **Docker**: Containerización para consistencia
- **GitHub**: Control de versiones y CI/CD

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/smartdrive.git
cd smartdrive
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

4. **Configurar base de datos**
- Ejecuta las consultas SQL del archivo `DEPLOYMENT.md` en Supabase
- Configura el bucket de Storage llamado `files`

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
smartdrive/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (dashboard)/       # Dashboard principal
│   │   ├── admin/             # Panel de administración
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base
│   │   └── specific/         # Componentes específicos
│   ├── lib/                  # Utilidades y configuración
│   └── types/                # Definiciones TypeScript
├── public/                   # Archivos estáticos
├── DEPLOYMENT.md            # Guía de despliegue
└── README.md               # Este archivo
```

## 🔧 Configuración de Supabase

### Base de Datos
El proyecto utiliza las siguientes tablas:
- `profiles`: Perfiles de usuario
- `folders`: Carpetas de organización
- `files`: Metadatos de archivos

### Storage
- Bucket `files` para almacenar archivos
- Políticas RLS para seguridad
- URLs públicas para acceso directo

### Autenticación
- Email/Password authentication
- Creación automática de perfiles
- Roles de usuario (user/admin)

## 🚀 Despliegue en Producción

Consulta el archivo `DEPLOYMENT.md` para una guía completa de despliegue en Railway.

### Pasos Rápidos:
1. Configura Supabase (base de datos + storage)
2. Conecta tu repositorio a Railway
3. Configura variables de entorno
4. ¡Despliega!

## 🔐 Seguridad

- **Row Level Security**: Cada usuario solo accede a sus datos
- **Autenticación JWT**: Tokens seguros de Supabase
- **Validación de archivos**: Tipos y tamaños permitidos
- **Headers de seguridad**: Protección contra ataques comunes
- **Variables de entorno**: Credenciales seguras

## 📊 Funcionalidades Avanzadas

### Vista Previa de Archivos
- **Imágenes**: Visualización directa
- **Videos**: Reproductor integrado
- **Audio**: Reproductor de audio
- **PDFs**: Visor de documentos
- **Otros**: Descarga directa

### Panel de Administración
- **Estadísticas en tiempo real**: Usuarios, archivos, almacenamiento
- **Gestión de usuarios**: CRUD completo
- **Métricas de uso**: Por tipo de archivo
- **Control de límites**: Almacenamiento por usuario

### Búsqueda Inteligente
- **Filtros avanzados**: Tipo, fecha, tamaño
- **Búsqueda instantánea**: Sin recargas
- **Resultados paginados**: Rendimiento optimizado
- **Ordenamiento flexible**: Múltiples criterios

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**DoValeLabs**
- Creador de soluciones web innovadoras
- Especializado en aplicaciones SaaS escalables

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Railway](https://railway.app/) - Plataforma de despliegue
- [Radix UI](https://www.radix-ui.com/) - Componentes primitivos

---

**Una creación de DoValeLabs** 🚀

¿Te gusta SmartDrive? ¡Dale una ⭐ al repositorio!

