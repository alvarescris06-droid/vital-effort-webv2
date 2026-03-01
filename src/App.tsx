import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Instagram, 
  Mail, 
  Dumbbell, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight, 
  X, 
  ShieldAlert, 
  Lock, 
  LockKeyhole,
  CreditCard, 
  Landmark, 
  CheckCircle2, 
  Star, 
  Activity, 
  FileText, 
  AlertTriangle, 
  Scale, 
  CreditCard as BillingIcon, 
  UserCheck, 
  Phone, 
  ShieldCheck,
  ChevronRight,
  Wallet,
  Building2,
  QrCode
} from 'lucide-react';

const App: React.FC = () => {
  // --- SISTEMA UNIFICADO VIP & DESCUENTOS ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authStep, setAuthStep] = useState<'form' | 'verification'>('form');
  const [userAuth, setUserAuth] = useState({ email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);

  // --- ESTADOS DE INTERFAZ ---
  const [userData, setUserData] = useState({ nombre: '', celular: '' });
  const [modalType, setModalType] = useState<'none' | 'terms' | 'privacy'>('none');
  const [view, setView] = useState<'landing' | 'checkout'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [showCookies, setShowCookies] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardData, setCardData] = useState({ name: '', number: '', date: '', cvv: '' });
  const [isVerified, setIsVerified] = useState(false);

  // --- DATOS SEGUROS (Actualizados: Llave de negocio y Documento eliminado) ---
  const secureData = { 
    b: "MDA5MTczMzkwMQ==", // Nueva Llave de Negocio: 0091733901
    n: "MzE0Mzk0ODQzNQ=="  // Nequi se mantiene igual
  };
  const decode = (str: string) => atob(str);

  // --- CONFIGURACIÓN DE CONTACTO ---
  const phoneNumber = "573143948435";
  const instagramUser = "vital_effort";
  const gmailAddress = "vital.effort05@gmail.com";
  const logoPath = "/logo.png";

  // --- DETECTOR AUTOMÁTICO DE RETORNO (CORREGIDO) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'approved' || params.get('payment_id')) {
      setIsVerified(true);
      // APAGAMOS EL LOGIN: Si tienes una variable para el login, la forzamos
      // En tu caso, lo más efectivo es forzar la vista de checkout
      setView('checkout'); 
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- LÓGICA DE CONTROL DE COOKIES ---
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Aparece 2 segundos después de cargar la página
      const timer = setTimeout(() => setShowCookies(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      setAuthStep('verification');
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === 'VITAL2026') {
      setHasDiscount(true);
      setIsLoggedIn(true);
      setAuthStep('form');
    } else {
      alert('Código incorrecto. Intenta con VITAL2026 para obtener tu beneficio.');
    }
  };

  // --- LÓGICA DE ENVÍO DE DATOS (TRACKING) ---
  const handleCardPayment = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Links estándar (Precio Full)
    const mercadoPagoLinks: { [key: string]: string } = {
      "PLAN MENSUAL": "https://mpago.li/1t3pnQW",
      "PLAN TRIMESTRAL": "https://mpago.li/2bF4nbU",
      "PLAN ANUAL": "https://mpago.li/13V28ns",
      "EFFORT NUTRITION": "https://mpago.li/1bS6Pvk",
      "EFFORT BIOMEASURE": "https://mpago.li/1fgAE7h",
      "VITAL TRAINING": "https://mpago.li/2RmPY4J"
    };

    // Links con 10% OFF
    const mercadoPagoLinksDiscount: { [key: string]: string } = {
      "PLAN MENSUAL": "https://mpago.li/2fH8LwH",
      "PLAN TRIMESTRAL": "https://mpago.li/14KP3Xo",
      "PLAN ANUAL": "https://mpago.li/13RqNsi",
      "EFFORT NUTRITION": "https://mpago.li/1ZYjB4c",
      "EFFORT BIOMEASURE": "https://mpago.li/1hr6Zi8",
      "VITAL TRAINING": "https://mpago.li/1dCVAJ3"
    };

    const planName = selectedPlan?.name.toUpperCase() || "";
    const checkoutUrl = mercadoPagoLinks[planName];

    if (!checkoutUrl) {
      alert("Error: No se encontró el enlace de cobro para: " + planName);
      return;
    }

    setIsProcessing(true);

    try {
      await fetch("https://formspree.io/f/mbdaqzld", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Asunto: "🔥 NUEVO INTENTO DE INSCRIPCIÓN",
          Cliente: userData.nombre.toUpperCase(),
          WhatsApp: `https://wa.me/57${userData.celular}`,
          Plan_Elegido: selectedPlan?.name,
          Inversion: hasDiscount ? selectedPlan!.price * 0.9 : selectedPlan!.price,
          Moneda: "COP",
          Estado_Pasarela: "Redirigido a Mercado Pago",
          Fecha: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })
        }),
      });
      setPaymentSuccess(true);
      setIsProcessing(false);
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 3000);
    } catch (error) {
      setIsProcessing(false);
      alert("Error de conexión. Intenta de nuevo.");
    }
  };

  const handlePlanSelection = (name: string, price: number) => {
    setSelectedPlan({ name, price });
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const zapLink = (plan: string) => 
    `https://wa.me/${phoneNumber}?text=Hola%20Vital%20Effort,%20estoy%20interesado%20en%20el%20${plan}.`;

    // --- FUNCIÓN DEL MODAL LEGAL PREMIUM (CONTENIDO COMPLETO) ---
  const renderLegalModal = () => {
    if (modalType === 'none') return null;

    const isTerms = modalType === 'terms';
    
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
        {/* Fondo con desenfoque profundo */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setModalType('none')}></div>
        
        {/* Contenedor Principal con Borde Neon Sutil */}
        <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)] border-t-amber-500/30">
          
          {/* Encabezado de Impacto */}
          <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-black to-zinc-900">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-amber-500/20">
                {isTerms ? <Scale className="text-black -rotate-3" size={30} /> : <ShieldCheck className="text-black -rotate-3" size={30} />}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-[1000] uppercase italic tracking-tighter leading-none">
                  {isTerms ? 'Términos y' : 'Políticas de'} <br />
                  <span className="text-amber-500">{isTerms ? 'Condiciones' : 'Privacidad'}</span>
                </h2>
              </div>
            </div>
            <button 
              onClick={() => setModalType('none')} 
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all group"
            >
              <X size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          {/* Cuerpo del Documento (Texto Íntegro) */}
          <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {isTerms ? (
                <>
                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">RIESGO DEL USO DEL PRODUCTO</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed font-medium">
                      <p>El contenido de este sitio web no reemplaza la atención y el diagnóstico médico directo, personal y profesional. Ninguno de los planes de comidas o programas de ejercicios debe realizarse o usarse sin la autorización previa de su médico o proveedor de atención médica. La información contenida en el mismo no pretende proporcionar consejos específicos de salud física o mental, ni ningún otro tipo de consejo, para ningún individuo o empresa y no debe confiarse en ese sentido. No somos profesionales médicos y nada en este sitio web debe malinterpretarse en el sentido de lo contrario.</p>
                      <p>Puede haber riesgos asociados con la participación en las actividades mencionadas en nuestro sitio para personas con mala salud o con condiciones de salud física o mental preexistentes. Debido a que existen estos riesgos, no participará en ningún plan de comidas que le ofrezcamos si tiene problemas de salud o tiene una condición mental o física preexistente. Si elige participar en estos riesgos, lo hace por su propia voluntad y acuerdo, asumiendo consciente y voluntariamente todos los riesgos asociados con tales actividades dietéticas. Estos riesgos también pueden existir para aquellos que actualmente gozan de buena salud.</p>
                      <p>Como con cualquier programa de ejercicios, usted asume ciertos riesgos para su salud y seguridad. Cualquier forma de programa de ejercicios puede causar lesiones, y nuestros programas no son una excepción. Es posible que te lesiones haciendo los ejercicios de tu programa, especialmente si los haces de forma deficiente. Aunque se incluye una instrucción completa en el formulario para cada ejercicio.</p>
                      <p>Tenga en cuenta que nuestros programas (como cualquier otro programa de ejercicios) implican un riesgo de lesiones. Si elige participar en estos riesgos, lo hace por su propia voluntad y acuerdo, asumiendo consciente y voluntariamente todos los riesgos asociados con dichas actividades de ejercicio. Estos riesgos también pueden existir para aquellos que actualmente gozan de buena salud.</p>
                      <p>No somos médicos. Nuestros consejos, ya sea en nuestro sitio web, en nuestros planes de comidas, programas de ejercicios o mediante entrenamiento por correo electrónico, no pretenden sustituir el consejo médico. Debe consultar a su médico antes de comenzar CUALQUIER plan de comidas o programa de ejercicios, sin excepciones. Está utilizando nuestros planes, programas, entrenamientos y entrenamiento bajo su propio riesgo y no somos responsables de ninguna lesión o problema de salud que pueda experimentar o incluso la muerte como resultado del uso de nuestros programas.</p>
                      <p className="text-white font-bold italic bg-white/5 p-4 rounded-xl border-l-4 border-white">Es de aclarar que nosotros no somos responsables de ningún tipo de lesiones o problemas de salud que puedas experimentar, o incluso la muerte por el resultado de usar uno de nuestros productos o servicios.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">RESULTADOS GENERALMENTE ESPERADOS</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Aunque nuestros productos y servicios están destinados a implementarse por completo, a veces no lo son, lo que podría resultar en una falta de progreso/resultados para el usuario. Si implementa nuestros productos y servicios correctamente, debería ver resultados asombrosos, sin embargo, debe negarse que incluso cuando los consumidores implementen completamente cualquier producto o servicio de nosotros, es posible que no obtengan los resultados que esperaban y también es posible que no pierdan grasa ni ganen músculo ni logren ningún resultado positivo de ningún tipo.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">TESTIMONIO DE DESCARGO DE RESPONSABILIDAD</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Todas las transformaciones y testimonios son reales. Sin embargo, debe negarse que estos testimonios no pretenden representar resultados típicos con nuestros planes de comidas y programas de entrenamiento. Están pensados como un escaparate de lo que las personas más motivadas y dedicadas pueden lograr siguiendo nuestros planes de comidas y programas de entrenamiento personalizados. Sus resultados pueden variar y es posible que no obtenga los mismos resultados en comparación con otra persona al usar nuestros servicios debido a las diferencias en su historial de ejercicio individual, genética y motivación/dedicación personal. Los resultados finales que obtenga dependerán de la persona y del esfuerzo que ponga.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">INFORMACIÓN IMPORTANTE DE FACTURACIÓN</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Si adquieres nuestro Programa, serás automáticamente cargado cada periodo y vas a continuar recibiendo nuevas actualizaciones de los planes de comidas y de los programas de entrenamiento por el tiempo que hayas escogido permanecer como cliente.</p>
                      <p>Con todos nuestros Servicios En Línea tenemos una opción de reembolso del 100% del dinero abonado de 14 días - Si en los próximos 14 días de tu compra inicial no te sientes feliz o satisfecho con alguna de tus compras con nosotros (servicio de suscripción o sin suscripción) por cualquier razón, simplemente solicita un reembolso completo contactando al Equipo de Ayuda al Cliente. Serás reembolsado y tu suscripción será cancelada. Sin embargo, si compras el programa durante un periodo promocional y has redimido esa promoción (ej. suplementos, ropa, audífonos) no eres elegible para un reembolso.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">CANCELACIÓN DE TU SUSCRIPCIÓN</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Puedes cancelar tu suscripción en cualquier momento, sin embargo sujeta a 7 días de aviso previo. En orden de cancelar tu suscripción simplemente envía un correo electrónico a soporte. Si tienes alguna pregunta, por favor envíanos un mensaje al correo. Puedes contactar al Equipo de Ayuda al Cliente por vital.effort06@gmail.com y estaremos más que felices por responder cualquiera de tus preguntas.</p>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">SU PRIVACIDAD ES IMPORTANTE</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Estamos totalmente comprometidos con la protección de la privacidad de los visitantes y clientes de nuestro sitio, apreciamos y respetamos plenamente la importancia de la privacidad en Internet. No divulgaremos información sobre nuestros clientes a terceros, excepto en el caso de que sea parte de un servicio para usted, por ejemplo. organizar el envío de un producto, realizar comprobaciones de crédito y otros controles de seguridad. Para fines de investigación y creación de perfiles de los clientes, o cuando tengamos su permiso expreso para hacerlo.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">TU CONSENTIMIENTO</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>No venderemos su nombre, dirección, dirección de correo electrónico, información de su tarjeta de crédito o información personal a ningún tercero (excluyendo a los socios a los que usted pueda haber vinculado a nuestro sitio) sin su permiso.</p>
                      <p className="font-bold text-white uppercase italic underline decoration-amber-500">COMUNICACIÓN Y MARKETING:</p>
                      <p>Si ha realizado una compra en mi tienda, es posible que ocasionalmente le envíe actualizaciones de nuestros nuevos productos, noticias y ofertas especiales por correo electrónico. Todos nuestros clientes tienen la opción de optar por no recibir comunicaciones de marketing de parte mía y / o terceros seleccionados. Si no desea continuar recibiendo promociones de mi parte y / o de terceros seleccionados al finalizar la compra.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">COOKIES Y REMARKETING</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed font-medium">
                      <p>Una cookie es un pequeño archivo de información que se envía a su computadora y se almacena en su disco duro. Si se ha registrado con nosotros, su computadora almacenará una cookie de identificación que le ahorrará tiempo cada vez que vuelva a visitar nuestro sitio, al recordar su dirección de correo electrónico. Puede cambiar la configuración de su navegador para evitar que las cookies se almacenen en su computadora sin su consentimiento explícito.</p>
                      <p className="font-bold text-white uppercase italic underline decoration-amber-500">REMARKETING DE GOOGLE:</p>
                      <p>Este sitio web utiliza el servicio de remarketing de Google AdWords para anunciarse en sitios web de terceros (incluido Google) a los visitantes anteriores de nuestro sitio. Podría significar que anunciamos a visitantes anteriores que no completaron una tarea en nuestro sitio, por ejemplo, utilizando el formulario de contacto para realizar una consulta. Los proveedores de terceros, incluido Google, usan cookies para publicar anuncios basados en las visitas anteriores de alguien a nuestro sitio. Por supuesto, cualquier información recopilada se usará de acuerdo con nuestra propia política de privacidad y la política de privacidad de Google.</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-widest border-l-4 border-amber-500 pl-4">VERIFICANDO TUS DETALLES Y CONTACTO</h3>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>Nuestros procedimientos de seguridad significan que podemos solicitar una prueba de identidad antes de revelar información. Esta prueba de identidad se basará en su dirección de correo electrónico y contraseña enviada al registrarse. Recomendamos encarecidamente que no utilice la función de memoria de contraseña del navegador.</p>
                      <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 mt-8">
                        <p className="text-white font-black uppercase italic mb-2 text-center">CONTACTENOS</p>
                        <p className="text-center text-sm">Si tiene alguna pregunta o comentario, no dude en ponerse en contacto con el servicio de atención al cliente a través de <span className="text-amber-500 font-bold">vital.effort06@gmail.com</span>.</p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>

          {/* Acción Final de Cierre */}
          <div className="p-8 border-t border-white/5 bg-black flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Vital Effort • High Performance System</p>
            <button 
              onClick={() => setModalType('none')} 
              className="bg-white text-black px-12 py-5 rounded-2xl font-[1000] uppercase italic hover:bg-amber-500 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              CERRAR DOCUMENTO
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500 selection:text-black relative">
      {renderLegalModal()}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 10px;
        }
      `}</style>

      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] w-full max-w-[450px] space-y-8 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-amber-500 rounded-3xl mx-auto flex items-center justify-center rotate-3 shadow-lg shadow-amber-500/20">
                <LockKeyhole size={40} className="text-black -rotate-3" />
              </div>
              <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter mt-6">Área VIP</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {authStep === 'form' ? 'Ingresa a la comunidad Vital Effort' : 'Verifica tu identidad'}
              </p>
            </div>

            {authStep === 'form' ? (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <input 
                    type="email" placeholder="CORREO ELECTRÓNICO" 
                    className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-sm uppercase text-white"
                    onChange={(e) => setUserAuth({...userAuth, email: e.target.value})}
                    required
                  />
                  <input 
                    type="password" placeholder="CONTRASEÑA" 
                    className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-sm uppercase text-white"
                    onChange={(e) => setUserAuth({...userAuth, password: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-amber-500 text-black py-5 rounded-2xl font-[1000] uppercase italic hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                  {isRegistering ? 'Registrarme y obtener 10% OFF' : 'Iniciar Sesión'}
                </button>
                <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors py-2">
                  {isRegistering ? '¿Ya tienes cuenta? Entra aquí' : '¿Eres nuevo? Regístrate para un 10% OFF'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold text-amber-500 uppercase">Verificación</p>
                  <p className="text-[10px] text-gray-400 font-medium">Usa el código: VITAL2026</p>
                </div>
                <input 
                  type="text" placeholder="CÓDIGO"
                  className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-2xl text-center text-2xl font-black tracking-[0.2em] outline-none focus:border-green-500 text-white"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-green-500 text-black py-5 rounded-2xl font-[1000] uppercase italic hover:bg-green-400 transition-all shadow-lg shadow-green-500/20">
                  Verificar Código
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <>
          <nav className="bg-black/80 backdrop-blur-md border-b border-amber-500/10 py-6 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4 md:gap-6 group cursor-pointer" onClick={() => setView('landing')}>
                <img src={logoPath} alt="Logo" className="h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col justify-center border-l-2 border-amber-500/30 pl-4 md:pl-6 text-left">
                  <h1 className="text-2xl md:text-4xl font-[1000] tracking-tighter leading-none italic uppercase">
                    VITAL<span className="text-amber-500">EFFORT</span>
                  </h1>
                  <p className="text-amber-500/60 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mt-1">High Performance</p>
                </div>
              </div>
              
              {view === 'checkout' && (
                <button 
                  onClick={() => setView('landing')}
                  className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all border border-white/10"
                >
                  <X size={16} /> Volver
                </button>
              )}
            </div>
          </nav>

          {view === 'landing' ? (
            <>
              <header className="py-28 px-6 text-center border-b border-white/5 overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] -z-10"></div>
                <div className="max-w-5xl mx-auto">
                  <div className="inline-block bg-amber-500/10 border border-amber-500/40 text-amber-500 px-6 py-2 rounded-full text-sm font-black mb-10 tracking-[0.2em] uppercase animate-bounce-subtle">
                    ENTRENAMIENTO BASADO EN EVIDENCIA CIENTÍFICA
                  </div>
                  <h2 className="text-6xl md:text-[110px] font-[1000] uppercase tracking-tighter leading-[0.85] mb-10 italic">
                    EL ESFUERZO <br />
                    <span className="text-amber-500 text-glow">TE DA VIDA</span>
                  </h2>
                  <p className="text-xl md:text-3xl text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
                    Entrena con propósito, vive con disciplina y Evoluciona con ciencia. Programas de alto rendimiento diseñados para transformar tu biologia.
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <a 
                      href="#planes" 
                      className="group relative inline-flex items-center gap-4 bg-white text-black font-[1000] py-6 px-16 rounded-2xl text-2xl hover:bg-amber-500 transition-all shadow-2xl active:scale-95"
                    >
                      <Zap size={30} fill="currentColor" className="group-hover:animate-pulse" />
                      VER PROGRAMAS
                    </a>
                  </div>
                </div>
              </header>

              <div className="bg-amber-500 py-10 overflow-hidden">
                <div className="animate-marquee">
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className="text-black font-[1000] italic text-4xl uppercase tracking-tighter mx-10 flex items-center gap-6">
                      <Star fill="currentColor" size={30} /> 
                      Resultados Reales 
                      <Activity size={30} /> 
                      Ciencia Aplicada
                    </span>
                  ))}
                </div>
              </div>

              <section id="planes" className="py-32 px-6 bg-[#0a0a0a] relative">
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="text-center mb-24">
                    <h3 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter mb-4">
                      NUESTROS <span className="text-amber-500">PROGRAMAS</span>
                    </h3>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">Elige el nivel de tu evolución</p>
                    <div className="h-1.5 w-48 bg-amber-500 mx-auto mt-8 rounded-full"></div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Plan Mensual */}
                    <div className="bg-[#111] p-12 rounded-[3.5rem] border border-white/5 flex flex-col hover:border-amber-500/30 transition-all group">
                      <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <Dumbbell size={32} />
                      </div>
                      <h4 className="text-3xl font-[1000] uppercase italic text-white mb-2">Mensual</h4>
                      <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Enfoque Integral</p>
                      <div className="flex items-baseline gap-1 mb-10">
                        <span className="text-6xl font-[1000] text-white tracking-tighter">$70</span>
                        <span className="text-gray-500 font-bold uppercase text-sm">USD / Mes</span>
                      </div>
                      <ul className="space-y-6 mb-16 flex-grow">
                        {[
                          {t: "Acceso a la instalacion", d: "Mensualidad incluida para clases presenciales, no aplican clases online."},
                          {t: "Nutrición Inteligente", d: "Plan basado en tu estado nutricional."},
                          {t: "Entrenamiento a Medida", d: "Basado en tus objetivos y nivel actual."},
                          {t: "Acompañamiento", d: "Chat directo para dudas y ajustes."},
                          {t: "Análisis de Progreso", d: "Revisiones mensuales de métricas."}
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 text-sm leading-relaxed">
                            <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" /> 
                            <span className="text-gray-400">
                              <strong className="text-white uppercase italic block mb-1">{item.t}:</strong> 
                              {item.d}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handlePlanSelection("Plan Mensual", 70)}
                        className="w-full py-6 bg-white/5 text-white text-center font-[1000] rounded-2xl uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all border border-white/10"
                      >
                        Elegir Plan
                      </button>
                    </div>

                    {/* Plan Élite */}
                    <div className="bg-[#151515] p-12 rounded-[3.5rem] border-2 border-amber-500 flex flex-col relative transform lg:scale-105 shadow-[0_0_60px_rgba(245,158,11,0.15)] group">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-10 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                        MÁS RECOMENDADO
                      </div>
                      <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-black">
                        <Trophy size={32} />
                      </div>
                      <h4 className="text-4xl font-[1000] uppercase italic text-white mb-2 tracking-tighter">Élite</h4>
                      <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Transformación Radical</p>
                      <div className="flex items-baseline gap-1 mb-10">
                        <span className="text-7xl font-[1000] text-white tracking-tighter">$170</span>
                        <span className="text-gray-500 font-bold uppercase text-sm">USD / Trimestre</span>
                      </div>
                      <ul className="space-y-6 mb-16 flex-grow">
                        {[
                          {t: "TODO LO DEL MENSUAL", d: "Todos los beneficios estándar incluidos."},
                          {t: "Rehabilitación Física", d: "Especializado para prevenir lesiones."},
                          {t: "Suplementación", d: "Guía basada en evidencia cientifica."},
                          {t: "Acceso Prioritario", d: "Respuesta inmediata por WhatsApp."}
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 text-sm leading-relaxed">
                            <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" fill="currentColor" /> 
                            <span className="text-gray-300">
                              <strong className="text-white uppercase italic block mb-1">{item.t}:</strong> 
                              {item.d}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handlePlanSelection("Plan Élite", 170)}
                        className="w-full py-7 bg-amber-500 text-black text-center font-[1000] rounded-2xl uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-amber-500/20 text-lg"
                      >
                        Acceso Élite
                      </button>
                    </div>

                    {/* Plan Anual */}
                    <div className="bg-[#111] p-12 rounded-[3.5rem] border border-white/5 flex flex-col hover:border-amber-500/30 transition-all group">
                      <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <Users size={32} />
                      </div>
                      <h4 className="text-3xl font-[1000] uppercase italic text-white mb-2">Anual</h4>
                      <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Compromiso Total</p>
                      <div className="flex items-baseline gap-1 mb-10">
                        <span className="text-6xl font-[1000] text-white tracking-tighter">$520</span>
                        <span className="text-gray-500 font-bold uppercase text-sm">USD / Año</span>
                      </div>
                      <ul className="space-y-6 mb-16 flex-grow">
                        {[
                          {t: "Estilo de Vida", d: "Planificación de 12 meses continuos."},
                          {t: "Ahorro Máximo", d: "Obtienes 3 meses gratis comparado al mensual."},
                          {t: "Masterclass VIP", d: "Acceso a contenido exclusivo anual."},
                          {t: "Regalo de Bienvenida", d: "E-book Vital Effort incluido."}
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 text-sm leading-relaxed">
                            <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" /> 
                            <span className="text-gray-400">
                              <strong className="text-white uppercase italic block mb-1">{item.t}:</strong> 
                              {item.d}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handlePlanSelection("Plan Anual", 520)}
                        className="w-full py-6 bg-white/5 text-white text-center font-[1000] rounded-2xl uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all border border-white/10"
                      >
                        Elegir Anual
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- NUEVA SECCIÓN: SERVICIOS VITAL EFFORT --- */}
<section id="servicios" className="py-32 px-6 bg-black relative border-t border-white/5">
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-24">
      <h3 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter mb-4">
        SERVICIOS <span className="text-amber-500">VITAL EFFORT</span>
      </h3>
      <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">Precisión científica en cada variable</p>
      <div className="h-1.5 w-48 bg-amber-500 mx-auto mt-8 rounded-full"></div>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      {/* 1. VITAL NUTRITION */}
      <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 flex flex-col hover:border-amber-500/30 transition-all group shadow-2xl">
        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-black transition-colors">
          <Activity size={32} />
        </div>
        <h4 className="text-3xl font-[1000] uppercase italic text-white mb-2">VITAL NUTRITION</h4>
        <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Evaluación Bio-Individual</p>
        
        <ul className="space-y-4 mb-12 flex-grow">
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">👨🏻‍💻 Evaluación Bio-Individual:</strong> 
            ✔️ Análisis de Composición Corporal<br/>
            ✔️ Gasto Energético | Historial y Objetivos
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📊 Estrategia de Nutrientes:</strong> 
            ✔️ Distribución de Macros | Densidad de Micros<br/>
            ✔️ Fibra y Salud Intestinal
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🍲 Planificación de Comidas:</strong> 
            ✔️ Menús Diarios | Sistema de Equivalentes<br/>
            ✔️ Timing Nutricional
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">⚠️ Protocolo de Hidratación:</strong> 
            ✔️ Cálculo basado en peso y sudoración<br/>
            ✔️ Uso estratégico de electrolitos
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🧬 Guía de Suplementación:</strong> 
            ✔️ Vitaminas | Ayudas ergogénicas<br/>
            ✔️ Dosis y momentos ideales
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🧱 Herramientas de Vida:</strong> 
            ✔️ Lista de Compras | Guía "Comer Fuera"<br/>
            ✔️ Gestión de Ansiedad y Sueño
          </li>
          <li className="text-amber-500 text-[10px] font-black italic mt-4 uppercase">
            ⚡ "Tu nutrición es el combustible de tu victoria."
          </li>
        </ul>

        <button 
          onClick={() => handlePlanSelection("Vital Nutrition", 170000)}
          className="w-full py-5 bg-white/5 text-white font-[1000] rounded-2xl uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all border border-white/10 text-xs"
        >
          Solicitar Nutrición
        </button>
      </div>

      {/* 2. VITAL BIOMEASURE */}
      <div className="bg-[#151515] p-10 rounded-[3.5rem] border-2 border-amber-500 flex flex-col relative transform lg:scale-105 shadow-[0_0_60px_rgba(245,158,11,0.15)] group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
          NO ADIVINAMOS, MEDIMOS
        </div>
        <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-black">
          <Scale size={32} />
        </div>
        <h4 className="text-3xl font-[1000] uppercase italic text-white mb-2">VITAL BIOMEASURE</h4>
        <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Precisión Antropométrica</p>
        
        <ul className="space-y-4 mb-12 flex-grow">
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📏 Protocolo ISAK:</strong> 
            ✔️ Perfil de 8 Pliegues Cutáneos<br/>
            ✔️ 6 Perímetros | 2 Diámetros Óseos
          </li>
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">👨🏻‍💻 Análisis Pentacompartimental:</strong> 
            ✔️ Masa Muscular, Adiposa y Residual<br/>
            ✔️ Masa Ósea y Masa Piel
          </li>
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">⚕️ Índices de Salud y Riesgo:</strong> 
            ✔️ Índice Cintura-Cadera | Somatotipo<br/>
            ✔️ Relación Músculo/Grasa (M-G)
          </li>
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📈 Seguimiento y Cinética:</strong> 
            ✔️ Comparativa de pliegues absoluta<br/>
            ✔️ Predicción de peso ideal deportivo
          </li>
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📤 Entrega de Resultados:</strong> 
            ✔️ Gráficas de Evolución Temporales<br/>
            ✔️ Mapas de Calor Corporal y Metas
          </li>
          <li className="text-[11px] text-gray-300 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🎯 Aplicación Práctica:</strong> 
            ✔️ Ajuste de objetivos de entrenamiento<br/>
            ✔️ Validación de estrategia nutricional
          </li>
          <li className="text-amber-500 text-[10px] font-black italic mt-4 uppercase">
            🧬 "No adivinamos, medimos. Tu esfuerzo merece precisión."
          </li>
        </ul>

        <button 
          onClick={() => handlePlanSelection("Vital Biomeasure", 100000)}
          className="w-full py-6 bg-amber-500 text-black font-[1000] rounded-2xl uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-amber-500/20 text-sm"
        >
          Medir Mi Rendimiento
        </button>
      </div>

      {/* 3. VITAL TRAINING */}
      <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 flex flex-col hover:border-amber-500/30 transition-all group shadow-2xl">
        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-black transition-colors">
          <Zap size={32} />
        </div>
        <h4 className="text-3xl font-[1000] uppercase italic text-white mb-2">VITAL TRAINING</h4>
        <p className="text-amber-500 font-black mb-6 italic tracking-widest uppercase text-xs">Planificación 3 Meses</p>
        
        <ul className="space-y-4 mb-12 flex-grow">
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📉 Periodización Deportiva:</strong> 
            ✔️ Macro-Estructura personalizada<br/>
            ✔️ Mesociclos de fuerza y potencia
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">⚙️ Capacidades Físicas:</strong> 
            ✔️ Entrenamiento basado en RPE/RIR<br/>
            ✔️ Especificidad técnica deportiva
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🔥 Gestión de la Fatiga:</strong> 
            ✔️ Control de carga externa e interna<br/>
            ✔️ Protocolos de recuperación activa
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🔬 Evidencia Científica:</strong> 
            ✔️ Selección de ejercicios eficiente<br/>
            ✔️ Optimización de rango de movimiento
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">📱 Seguimiento Digital:</strong> 
            ✔️ Registro de progresiones de carga<br/>
            ✔️ Feedback constante de ejecución
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed uppercase font-medium">
            <strong className="text-white block mb-1">🔝 Peak Performance:</strong> 
            ✔️ Preparación para eventos o metas<br/>
            ✔️ Ajuste de volumen e intensidad
          </li>
          <li className="text-amber-500 text-[10px] font-black italic mt-4 uppercase">
            📊 "En Vital Effort, no entrenamos para cansarnos, entrenamos para ganar."
          </li>
        </ul>

        <button 
          onClick={() => handlePlanSelection("Vital Training", 200000)}
          className="w-full py-5 bg-white/5 text-white font-[1000] rounded-2xl uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all border border-white/10 text-xs"
        >
          Iniciar Entrenamiento
        </button>
      </div>
    </div>
  </div>
</section>

{/* TESTIMONIOS/FRASE */}
<section className="py-40 bg-white text-black px-6">
  <div className="max-w-6xl mx-auto text-center">
    <div className="flex justify-center gap-4 mb-10">
      {[...Array(5)].map((_, i) => <Star key={i} fill="black" size={30} />)}
    </div>
    <h3 className="text-4xl md:text-7xl font-[1000] uppercase italic tracking-tighter leading-tight mb-12">
      "NO ENTRENAMOS PARA VERNOS BIEN, ENTRENAMOS PARA SER <span className="underline decoration-amber-500 decoration-8">FUNCIONALMENTE SUPERIORES</span>."
    </h3>
    <div className="flex items-center justify-center gap-6">
      <div className="h-0.5 w-16 bg-black"></div>
      <p className="font-black uppercase tracking-[0.4em] text-xl">Vital Effort Team</p>
      <div className="h-0.5 w-16 bg-black"></div>
    </div>
  </div>
</section>

              {/* FAQ */}
              <section className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-16">
                    <h3 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter mb-4">
                      PREGUNTAS <span className="text-amber-500">FRECUENTES</span>
                    </h3>
                    <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full"></div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        q: "¿Para quién está diseñado el programa?",
                        a: "Para ti, sin importar tu punto de partida. He adaptado mi metodología para acompañar desde personas con discapacidad física que buscan autonomía y salud, hasta deportistas de élite que necesitan exprimir su rendimiento. Si tienes un cuerpo y un objetivo, diseño el camino para que llegues a él de forma segura y efectiva."
                      },
                      {
                        q: "¿Es seguro si tengo una lesión o condición física especial?",
                        a: "Es mi especialidad. Antes de empezar, realizo una valoración de tu movilidad para asegurar que cada movimiento sea terapéutico y no lesivo. Tu seguridad es mi prioridad absoluta."
                      },
                      {
                        q: "¿En qué me diferencio de otros programas?",
                        a: "En que no te entrego una rutina de 'copiar y pegar'. Mi valor real es la adaptabilidad extrema: mi experiencia trabajando con casos de rehabilitación y discapacidad me da un conocimiento técnico superior para ajustar cada ejercicio a tu biomecánica."
                      },
                      {
                        q: "¿Cómo sé que estoy haciendo bien el ejercicio si entreno virtual?",
                        a: "No te dejo solo frente a una pantalla. Utilizo corrección técnica en tiempo real mediante video o análisis de tus grabaciones. Mi ojo clínico detecta fallos de postura incluso a distancia para que entrenes con total seguridad."
                      },
                      {
                        q: "¿Necesito gimnasio para empezar?",
                        a: "No. Entreno con lo que tengas: desde el gimnasio más equipado hasta el salón de tu casa con implementos mínimos. El secreto no es la máquina, es cómo te enseño a mover tu cuerpo."
                      },
                      {
                        q: "¿Qué pasa si mi condición física cambia o me lesiono fuera del entreno?",
                        a: "Mi planificación es viva. Si un día amaneces con dolor o surge una limitación, ajusto la sesión en ese mismo instante. No te obligo a seguir un papel; adapto el entrenamiento a cómo se siente tu cuerpo cada día."
                      },
                      {
                        q: "¿Cuánto tiempo tardaré en ver resultados reales?",
                        a: "Depende de tu punto de partida, pero mi enfoque busca victorias rápidas. En las primeras 2 semanas notarás mejoras en tu energía y movilidad; los cambios físicos sólidos suelen consolidarse a partir de los 3 meses de constancia guiada."
                      }
                    ].map((item, index) => (
                      <div key={index} className="border border-white/5 rounded-3xl overflow-hidden bg-[#111] transition-all duration-300">
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                        >
                          <span className="font-bold uppercase italic tracking-tight text-lg pr-4">{item.q}</span>
                          <ChevronRight 
                            size={24} 
                            className={`text-amber-500 transition-transform duration-500 ${openFaq === index ? 'rotate-90' : 'rotate-0'}`} 
                          />
                        </button>
                        <div 
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="p-8 pt-0 text-gray-400 leading-relaxed border-t border-white/5 font-medium">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer id="contacto" className="bg-black py-32 px-6 border-t-4 border-amber-500">
                <div className="max-w-7xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                      <div className="flex items-center gap-8 group">
                        <img src={logoPath} alt="Logo" className="h-48 md:h-64 w-auto grayscale transition-all group-hover:grayscale-0" />
                        <h2 className="text-6xl md:text-8xl font-[1000] tracking-tighter italic uppercase text-white leading-none">
                          VITAL<br />
                          <span className="text-amber-500">EFFORT</span>
                        </h2>
                      </div>
                      <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-lg">
                        Únete a los cientos de atletas que han dejado de adivinar y han empezado a evolucionar con un sistema real.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-2xl font-[1000] uppercase italic mb-8 tracking-widest">Canales Oficiales</h4>
                      <div className="flex flex-col gap-4">
                        <a 
                          href={zapLink("General")} 
                          target="_blank" 
                          rel="noreferrer"
                          className="group bg-amber-500 text-black p-8 rounded-3xl flex justify-between items-center font-[1000] text-2xl uppercase italic hover:bg-white hover:scale-[1.02] transition-all shadow-2xl"
                        >
                          <div className="flex items-center gap-5">
                            <MessageCircle size={35} />
                            WhatsApp
                          </div>
                          <ArrowRight size={30} className="group-hover:translate-x-2 transition-transform" />
                        </a>
                        <div className="flex flex-col gap-6">
                          <a 
                            href={`https://instagram.com/${instagramUser}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase italic hover:bg-white/10 transition-all"
                          >
                            <span className="text-amber-500"><Instagram size={24} /></span> Instagram
                          </a>
                          <a 
                            href={`mailto:${gmailAddress}`} 
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase italic hover:bg-white/10 transition-all"
                          >
                            <span className="text-amber-500"><Mail size={24} /></span> Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-800 text-sm font-black tracking-[1em]">© 2026 VITAL EFFORT</p>
                    <div className="flex gap-10">
                      <button 
                        onClick={() => setModalType('terms')} 
                        className="text-gray-600 hover:text-amber-500 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Términos y Condiciones
                      </button>
                      <button 
                        onClick={() => setModalType('privacy')} 
                        className="text-gray-600 hover:text-amber-500 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Políticas de Privacidad
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="max-w-7xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-12">
                  {/* Datos del Cliente */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black font-[1000] text-xl italic">01</div>
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter">MIS <span className="text-amber-500">DATOS</span></h2>
                  </div>

                  <div className="bg-[#111] p-8 md:p-12 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Nombre Completo</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 focus:border-amber-500 outline-none transition-all font-bold text-white uppercase placeholder:text-gray-800"
                          placeholder="TU NOMBRE"
                          onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Correo Electrónico</label>
                        <input 
                          type="email" 
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 focus:border-amber-500 outline-none transition-all font-bold text-white uppercase placeholder:text-gray-800"
                          placeholder="TU@EMAIL.COM"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">WhatsApp de contacto</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                        <input 
                          type="tel" 
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 pl-16 focus:border-amber-500 outline-none transition-all font-bold text-white placeholder:text-gray-800"
                          placeholder="TU NÚMERO (INCLUYE CÓDIGO DE PAÍS)"
                          onChange={(e) => setUserData({...userData, celular: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div className="flex items-center gap-3 pt-6">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black font-[1000] text-xl italic">02</div>
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter">MÉTODO DE <span className="text-amber-500">PAGO</span></h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`group p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden ${
                        paymentMethod === 'card' ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 bg-[#111] hover:border-white/20'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        paymentMethod === 'card' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-500'
                      }`}>
                        <BillingIcon size={32} />
                      </div>
                      <div>
                        <span className="block font-[1000] uppercase italic text-xl">Tarjeta / PSE / Nequi</span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 block">Procesado por Mercado Pago Seguro</span>
                      </div>
                    </button>
                  </div>

                  {/* Pasarela de Mercado Pago */}
                  {paymentMethod === 'card' && (
                    <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] space-y-6 animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-4 border-b border-white/5 pb-4 text-amber-500">
                        <ShieldCheck size={30} />
                        <h4 className="font-[1000] uppercase italic text-xl">Pago Seguro en Colombia</h4>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Serás redirigido a la pasarela oficial de <span className="text-white font-bold">Mercado Pago</span>.
                          </p>
                          <div className="flex flex-wrap gap-2 py-2">
                            <span className="bg-white/5 text-[10px] px-3 py-1 rounded-full text-gray-400 border border-white/10 font-bold">PSE (NEQUI/DAVIPLATA)</span>
                            <span className="bg-white/5 text-[10px] px-3 py-1 rounded-full text-gray-400 border border-white/10 font-bold">TARJETAS CRÉDITO/DÉBITO</span>
                            <span className="bg-white/5 text-[10px] px-3 py-1 rounded-full text-gray-400 border border-white/10 font-bold">EFECTY</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleCardPayment()}
                          disabled={isProcessing}
                          className={`w-full py-6 rounded-2xl font-[1000] uppercase italic transition-all text-lg shadow-xl flex items-center justify-center gap-3 ${
                            isProcessing 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-amber-500 text-black hover:bg-white shadow-amber-500/10 hover:scale-[1.02]'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                              ABRIENDO PASARELA...
                            </>
                          ) : (
                            `PAGAR ${(hasDiscount ? selectedPlan!.price * 0.9 : selectedPlan!.price).toLocaleString()} USD`
                          )}
                        </button>
                        <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
                          <Lock size={10} className="inline mr-1 mb-0.5" /> Transacción protegida por Mercado Pago Colombia
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Columna Resumen */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black font-[1000] text-xl italic">03</div>
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter">RESUMEN</h2>
                  </div>

                  <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 sticky top-32 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-gray-500 font-black uppercase tracking-widest text-xs">Plan Seleccionado:</h4>
                      <div className="flex justify-between items-end">
                        <span className="text-3xl font-[1000] uppercase italic">{selectedPlan?.name}</span>
                        <span className="text-amber-500 font-[1000] text-2xl">${selectedPlan?.price} USD</span>
                      </div>
                    </div>

                    {hasDiscount && (
                      <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex justify-between items-center">
                        <span className="text-green-500 font-black uppercase text-[10px] tracking-tighter">Descuento VIP Aplicado</span>
                        <span className="text-green-500 font-black">- 10%</span>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold uppercase italic">Total a Pagar:</span>
                        <span className="text-4xl font-[1000] text-glow">
                          ${(hasDiscount ? selectedPlan!.price * 0.9 : selectedPlan!.price).toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pantalla de éxito de pago visual */}
          {paymentSuccess && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
              <div className="bg-[#111] border border-amber-500/30 p-10 rounded-[3rem] max-w-md w-full text-center space-y-6 shadow-2xl shadow-amber-500/20 border-t-amber-500">
                <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <CheckCircle2 size={50} className="text-black" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-[1000] uppercase italic text-white tracking-tighter">¡CUPÓ RESERVADO!</h3>
                  <p className="text-amber-500 font-black text-xs tracking-[0.2em] uppercase">
                    {userData.nombre.split(' ')[0]}, PREPÁRATE PARA EL CAMBIO
                  </p>
                </div>
                <p className="text-gray-400 font-medium italic text-sm leading-relaxed">
                  Estamos conectando con la pasarela oficial de <span className="text-white font-bold">Mercado Pago Colombia</span> para finalizar tu inscripción de forma segura.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          {/* Bienvenida Verificada */}
          {isVerified && (
            <div 
              className="fixed inset-0 z-[1000000] flex items-center justify-center p-6 bg-black animate-in fade-in duration-1000"
            >
              <div className="max-w-md w-full text-center space-y-10 animate-in zoom-in duration-700">
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-25"></div>
                  <div className="relative bg-amber-500 rounded-full w-full h-full flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.6)]">
                    <Zap size={60} className="text-black fill-current" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
                    BIENVENIDO AL <span className="text-amber-500">EQUIPO</span>
                  </h2>
                  <p className="text-amber-500/60 font-black text-sm tracking-[0.3em] uppercase">
                    Misión cumplida, GUERRERO
                  </p>
                  <p className="text-gray-400 font-medium italic text-lg leading-tight">
                    Tu acceso ha sido verificado. El Coach te espera para iniciar tu transformación.
                  </p>
                </div>

                <a 
                  href={`https://wa.me/573143948435?text=¡Hola! Acabo de unirme a Vital Effort por Mercado Pago. ¡Dime los pasos a seguir!`}
                  target="_blank"
                  className="group relative flex items-center justify-center gap-4 bg-green-500 hover:bg-green-400 text-black py-7 rounded-[2.5rem] font-[1000] uppercase italic text-2xl transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(34,197,94,0.4)]"
                >
                  <span>HABLAR CON EL COACH</span>
                  <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </a>

                <div className="pt-4">
                  <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
                    Vital Effort • High Performance
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cookies */}
          {showCookies && (
            <div className="fixed bottom-8 left-8 right-8 md:left-auto md:max-w-md z-[60] animate-in slide-in-from-bottom-10 duration-700">
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                <div className="flex gap-6 items-start">
                  <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-500 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                      Utilizamos tecnología para mejorar tu experiencia y asegurar que tu evolución sea rastreable.
                    </p>
                    <button 
                      onClick={() => {
                        localStorage.setItem('cookieConsent', 'true');
                        setShowCookies(false);
                      }}
                      className="w-full py-4 bg-white text-black font-black uppercase italic rounded-xl hover:bg-amber-500 transition-colors text-xs tracking-widest"
                    >
                      Aceptar y Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;