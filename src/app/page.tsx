import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Cloud, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SmartDrive</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Registrarse
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tu gestor de archivos
              <span className="text-blue-600 block">en la nube</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Organiza, gestiona y accede a todos tus archivos desde cualquier lugar. 
              Una plataforma profesional y segura para tu contenido digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Comenzar gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/login" 
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/hero-illustration.png"
              alt="SmartDrive - Gestor de archivos en la nube"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Almacenamiento Seguro</h3>
            <p className="text-gray-600">
              Tus archivos están protegidos con encriptación de nivel empresarial y respaldos automáticos.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Acceso Rápido</h3>
            <p className="text-gray-600">
              Sube, descarga y organiza tus archivos con una interfaz intuitiva y velocidad optimizada.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Control Total</h3>
            <p className="text-gray-600">
              Gestiona permisos, organiza en carpetas y mantén el control completo de tu contenido.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para organizar tus archivos?
          </h3>
          <p className="text-gray-600 mb-6">
            Únete a miles de usuarios que ya confían en SmartDrive para gestionar su contenido digital.
          </p>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Crear cuenta gratuita
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  )
}

