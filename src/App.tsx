import React, { useMemo, useState, useRef, useEffect } from "react"
type Screen = "auth" | "role" | "map" | "checkout" | "pass" | "request" | "success" | "host-onboarding" | "host-settings" | "host-dashboard" | "host-scanner"

import L from "leaflet"
import "leaflet/dist/leaflet.css"

const nav: { id: string; label: string; step: string }[] = [
  { id: "auth", label: "Acceso", step: "01" },
  { id: "role", label: "Elige tu rol", step: "02" },
  { id: "map", label: "Explorar", step: "03" },
  { id: "checkout", label: "Confirmar", step: "04" },
  { id: "pass", label: "Pase QR", step: "05" },
  { id: "request", label: "Solicitud", step: "06" },
  { id: "success", label: "Completado", step: "07" },
  { id: "host-onboarding", label: "Registro Anfitrión", step: "08" },
  { id: "host-settings", label: "Reglas y Seguridad", step: "09" },
  { id: "host-dashboard", label: "Panel Propietario", step: "10" },
  { id: "host-scanner", label: "Validar ingreso", step: "11" },
]
type HostScreenProps = {
  next: () => void
  onCreateCochera?: (cochera: any) => void
  userName?: string
}

// ==========================================
// ICONOS COMPARTIDOS
// ==========================================
function Icon({
  name,
  size = 20,
}: {
  name: "search" | "sliders" | "car" | "bike" | "shield" | "pin" | "clock" | "user" | "bell" | "chevron"
  size?: number
}) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    car: (
      <>
        <path d="m5 11 1.5-4h11l1.5 4M4 11h16v7H4z" />
        <path d="M7 18v2m10-2v2M7 14h.01M17 14h.01" />
      </>
    ),
    bike: (
      <>
        <circle cx="6" cy="16" r="4" />
        <circle cx="18" cy="16" r="4" />
        <path d="m6 16 4-8h4l4 8m-8-8 4 8H6m3-11h3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.4 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c.6-4 3.2-6 7-6s6.4 2 7 6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 20h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 5 13 3h-2L9.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M10 20h4" />
    </svg>
  )
}
function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}
function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// ==========================================
// UI COMPONENTES
// ==========================================
function AppButton({
  children,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode
  variant?: "primary" | "danger" | "muted"
  onClick?: () => void
}) {
  return (
    <button className={`app-button ${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}

function Toggle({
  active,
  large = false,
  locked = false,
  onChange,
  label,
}: {
  active: boolean
  large?: boolean
  locked?: boolean
  onChange?: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      aria-disabled={locked}
      onClick={locked ? undefined : onChange}
      className={[
        "relative shrink-0 rounded-full border-0 transition-colors",
        large ? "h-9 w-16" : "h-7 w-12",
        active ? "bg-[#10B981]" : "bg-slate-300",
        locked ? "cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-0 top-1 rounded-full bg-white shadow-sm transition-transform",
          large ? "h-7 w-7" : "h-5 w-5",
          active
            ? large
              ? "translate-x-8"
              : "translate-x-6"
            : "translate-x-1",
        ].join(" ")}
      />
    </button>
  )
}

function StatusBar({ light = false }: { light?: boolean }) {
  return null
}

function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark">
        <Icon name="pin" size={18} />
      </span>
      <span>ParkVecino</span>
    </div>
  )
}

function HostHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="host-safe-header flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5">
      <button
        type="button"
        aria-label="Atrás"
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-2xl text-[#1E3A8A] transition-colors hover:bg-slate-50"
      >
        ‹
      </button>
      <h1 className="text-base font-bold tracking-tight text-[#1E3A8A]">
        {title}
      </h1>
    </header>
  )
}

function PrimaryFooter({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <footer className="sticky bottom-0 border-t border-slate-200 bg-[#F8FAFC]/95 p-5 backdrop-blur">
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-13 w-full items-center justify-center rounded-xl bg-[#1E3A8A] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition-transform active:scale-[0.99]"
      >
        {children}
      </button>
    </footer>
  )
}

function AuthScreen({
  next,
  onLoginSuccess,
}: {
  next: () => void
  onLoginSuccess: (user: {
    nombreCompleto: string
    primerNombre: string
    celular: string
    dni: string
    placa?: string
  }) => void
}) {
  const [mode, setMode] = useState<"login" | "register">("register")
  const [nombre, setNombre] = useState("")
  const [celular, setCelular] = useState("")
  const [dni, setDni] = useState("")
  const [dniStatus, setDniStatus] = useState<"idle" | "loading" | "verified">("idle")
  const [placa, setPlaca] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Formateo automático de celular peruano: 999 999 999 (máx 9 dígitos)
  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "").slice(0, 9)
    const formateado = soloNumeros.replace(/(\d{3})(?=\d)/g, "$1 ")
    setCelular(formateado)
  }

  // Validación simulada de RENIEC al llegar a 8 dígitos exactos
  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "").slice(0, 8)
    setDni(soloNumeros)

    if (soloNumeros.length === 8) {
      setDniStatus("loading")
      setTimeout(() => {
        setDniStatus("verified")
      }, 900)
    } else {
      setDniStatus("idle")
    }
  }

  // Formateo automático de placa (ej: T8M-284)
  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limpio = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
    if (limpio.length > 3) {
      setPlaca(`${limpio.slice(0, 3)}-${limpio.slice(3)}`)
    } else {
      setPlaca(limpio)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const digitosCelular = celular.replace(/\s/g, "")

    if (mode === "register") {
      if (nombre.trim().length < 3) {
        setError("Ingresa tu nombre completo.")
        return
      }
      if (digitosCelular.length !== 9) {
        setError("El celular debe tener 9 dígitos.")
        return
      }
      if (dni.length !== 8) {
        setError("El DNI debe tener 8 dígitos.")
        return
      }
      if (password.length < 4) {
        setError("Crea una contraseña de al menos 4 caracteres.")
        return
      }

      const primerNombre = nombre.trim().split(" ")[0]
      const nuevoUsuario = {
        nombreCompleto: nombre.trim(),
        primerNombre,
        celular: `+51 ${celular}`,
        dni,
        placa: placa.trim() || undefined,
      }

      // Guardamos en localStorage y en el estado global
      localStorage.setItem("parkvecino_user", JSON.stringify(nuevoUsuario))
      onLoginSuccess(nuevoUsuario)

      // Intento opcional de guardado en el backend Spring Boot
      fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevoUsuario, password }),
      }).catch(() => {})

      next()
    } else {
      if (digitosCelular.length !== 9 || password.length < 4) {
        setError("Ingresa tu celular de 9 dígitos y tu contraseña.")
        return
      }

      const guardado = localStorage.getItem("parkvecino_user")
      if (guardado) {
        onLoginSuccess(JSON.parse(guardado))
      } else {
        onLoginSuccess({
          nombreCompleto: "Lennard Caparachin",
          primerNombre: "Lennard",
          celular: `+51 ${celular}`,
          dni: "70000000",
        })
      }
      next()
    }
  }

  return (
    <div className="screen flex flex-col bg-white font-['Inter']">
      <main className="flex flex-1 flex-col overflow-y-auto px-6 pb-5 pt-8">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1A3673]">
            {mode === "register" ? "Crea tu cuenta" : "Bienvenido de nuevo"}
          </h1>
          <p className="mx-auto mt-2 max-w-64 text-xs leading-5 text-slate-500">
            {mode === "register"
              ? "Encuentra estacionamiento seguro cerca de ti."
              : "Ingresa para continuar con tus reservas."}
          </p>
        </div>

        {/* Selector de Modo */}
        <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError("") }}
            className={`rounded-[10px] px-3 py-3 text-xs font-bold transition ${
              mode === "login"
                ? "bg-white text-[#1A3673] shadow-sm"
                : "text-slate-500"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError("") }}
            className={`rounded-[10px] px-3 py-3 text-xs font-bold transition ${
              mode === "register"
                ? "bg-white text-[#1A3673] shadow-sm"
                : "text-slate-500"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold text-slate-700">
                  Nombre completo
                </span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Lennard Caparachin Tafur"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1A3673] focus:ring-3 focus:ring-blue-900/10"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-[11px] font-bold text-slate-700">
                Número de celular
              </span>
              <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC] focus-within:border-[#1A3673] focus-within:ring-3 focus-within:ring-blue-900/10">
                <span className="flex items-center border-r border-slate-200 px-3 text-xs font-bold text-[#1A3673]">
                  +51
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={celular}
                  onChange={handleCelularChange}
                  placeholder="999 999 999"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            {mode === "register" ? (
              <>
                <label className="block">
                  <span className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    DNI (Validación RENIEC)
                    {dniStatus === "idle" && (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                        Por verificar
                      </span>
                    )}
                    {dniStatus === "loading" && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-[#1A3673]">
                        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-[#1A3673] border-t-transparent" />
                        Validando...
                      </span>
                    )}
                    {dniStatus === "verified" && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-[#10B981]">
                        <CheckIcon className="h-3 w-3" /> VERIFICADO
                      </span>
                    )}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={dni}
                    onChange={handleDniChange}
                    placeholder="Ingresa los 8 dígitos"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1A3673] focus:ring-3 focus:ring-blue-900/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    Placa del vehículo
                    <span className="font-medium text-slate-400">
                      {placa.length === 7 ? <span className="text-[#10B981] font-bold">✓ Habilitada</span> : "Opcional"}
                    </span>
                  </span>
                  <input
                    type="text"
                    value={placa}
                    onChange={handlePlacaChange}
                    placeholder="Ej. T8M-284"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm uppercase text-slate-800 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-[#1A3673] focus:ring-3 focus:ring-blue-900/10"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-[11px] font-bold text-slate-700">
                Contraseña
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1A3673] focus:ring-3 focus:ring-blue-900/10"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="mt-8 pt-4">
            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center rounded-xl bg-[#1A3673] text-sm font-extrabold text-white shadow-lg shadow-blue-950/15 transition active:scale-[0.99]"
            >
              Continuar
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
              <Icon name="shield" size={14} />
              Tu seguridad y datos están protegidos
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}

type ParkRole = "driver" | "host" | "both"

function RoleSelectionScreen({
  onContinue,
}: {
  onContinue: (role: "driver" | "host" | "both") => void
}) {
  const [selected, setSelected] = useState<"driver" | "host" | "both" | null>(null)

  const roles: {
    id: "driver" | "host" | "both"
    title: string
    description: string
    icon: React.ReactNode
  }[] = [
    {
      id: "driver",
      title: "Conseguir un espacio",
      description: "Encuentra y reserva cocheras seguras cerca de ti",
      icon: <Icon name="car" size={24} />,
    },
    {
      id: "host",
      title: "Alquilar mi espacio",
      description: "Publica tu cochera o patio libre y genera ingresos",
      icon: (
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 10 9-7 9 7v10H3z" />
          <path d="M7 20v-7h10v7M8 9h8" />
        </svg>
      ),
    },
    {
      id: "both",
      title: "Puedo hacer los 2",
      description: "Busca estacionamiento y alquila tu espacio cuando quieras",
      icon: (
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 7h-9a5 5 0 0 0-5 5v1" />
          <path d="m16 3 4 4-4 4M4 17h9a5 5 0 0 0 5-5v-1" />
          <path d="m8 21-4-4 4-4" />
        </svg>
      ),
    },
  ]

  return (
    <div className="screen flex flex-col bg-white font-['Inter']">
      <main className="flex flex-1 flex-col overflow-y-auto px-6 pb-5 pt-8">
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#1A3673]">
            ¿Qué quieres hacer hoy?
          </h1>
          <p className="mt-3 max-w-xs text-xs leading-5 text-slate-500">
            Elige cómo usarás ParkVecino. Podrás cambiarlo luego.
          </p>
        </div>

        <div className="mt-8 space-y-3" role="radiogroup" aria-label="Elige cómo usar ParkVecino">
          {roles.map((role) => {
            const active = selected === role.id
            return (
              <button
                type="button"
                role="radio"
                aria-checked={active}
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`flex min-h-24 w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-[#10B981] bg-emerald-50/50 shadow-[0_7px_20px_rgba(16,185,129,0.08)]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span
                  className={`grid h-13 w-13 shrink-0 place-items-center rounded-xl ${
                    active
                      ? "bg-[#10B981] text-white"
                      : "bg-blue-50 text-[#1A3673]"
                  }`}
                >
                  {role.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-sm font-extrabold text-[#1A3673]">
                    {role.title}
                  </b>
                  <small className="mt-1.5 block text-[10px] leading-4 text-slate-500">
                    {role.description}
                  </small>
                </span>
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                    active
                      ? "border-[#10B981] bg-[#10B981] text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onContinue(selected)}
            className="flex h-13 w-full items-center justify-center rounded-xl bg-[#1A3673] text-sm font-extrabold text-white shadow-lg shadow-blue-950/15 transition enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

const COCHERAS_TRUJILLO_DEFAULT = [
  {
    id: 1,
    titulo: "Garaje San Martín",
    direccion: "Jr. San Martín 648, Trujillo",
    tarifaHora: 4.5,
    latitud: -8.1116,
    longitud: -79.0287,
    tipoEspacio: "Techado",
    metodoCobro: "Yape • Plin • Tarjeta",
  },
  {
    id: 2,
    titulo: "Cochera Óvalo Grau",
    direccion: "Av. América Sur 120, Trujillo",
    tarifaHora: 5.0,
    latitud: -8.1185,
    longitud: -79.0315,
    tipoEspacio: "Portón eléctrico",
    metodoCobro: "Yape • Plin",
  },
  {
    id: 3,
    titulo: "Estacionamiento Mansiche",
    direccion: "Av. Mansiche 410, Trujillo",
    tarifaHora: 4.0,
    latitud: -8.1065,
    longitud: -79.0332,
    tipoEspacio: "Vigilancia 24h",
    metodoCobro: "Yape • Efectivo",
  },
]

function MapScreen({
  next,
  onHost,
  cocheras = [],
  usuario,
  userRole = "driver",
  reservaEstado = "ninguna",
  onOpenPass,
  onFinishStay,
}: {
  next: () => void
  onHost: () => void
  cocheras?: any[]
  usuario?: any
  userRole?: "driver" | "host" | "both"
  reservaEstado?: "ninguna" | "en_ruta" | "finalizada"
  onOpenPass?: () => void
  onFinishStay?: () => void
}) {
  const [vehicle, setVehicle] = useState<"auto" | "moto">("auto")
  const [searchQuery, setSearchQuery] = useState("")
  const [listaCocheras, setListaCocheras] = useState<any[]>(
    cocheras.length > 0 ? cocheras : COCHERAS_TRUJILLO_DEFAULT
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showNotifs, setShowNotifs] = useState(false)
  const [userPos, setUserPos] = useState<[number, number]>([-8.1155, -79.0345])

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (cocheras.length > 0) {
      setListaCocheras(cocheras)
    }
  }, [cocheras])

  // 1. Inicializar Mapa con OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const trujilloCoords: [number, number] = [-8.1116, -79.0287]

    const map = L.map(mapContainerRef.current, {
      center: trujilloCoords,
      zoom: 15,
      zoomControl: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)
    routeLayerRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 250)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserPos(coords)
          const userIcon = L.divIcon({
            className: "gps-user-dot",
            html: `<div style="width:16px;height:16px;background:#2563EB;border:3px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(37,99,235,0.8);"></div>`,
            iconSize: [16, 16],
          })
          L.marker(coords, { icon: userIcon }).addTo(map)
        },
        (err) => console.warn("GPS omitido, usando punto base Trujillo:", err),
        { enableHighAccuracy: true }
      )
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 2. Pintar pines verdes/azules
  useEffect(() => {
    const map = mapInstanceRef.current
    const layer = markersLayerRef.current
    if (!map || !layer) return

    layer.clearLayers()

    listaCocheras.forEach((c, index) => {
      const lat = Number(c.latitud) || -8.1116 - index * 0.002
      const lng = Number(c.longitud) || -79.0287 - index * 0.002
      const precio = Number(c.tarifaHora ?? c.precio ?? 4.5).toFixed(1)
      const isSelected = index === selectedIndex

      const priceIcon = L.divIcon({
        className: "custom-price-pin",
        html: `<div style="
          background: ${isSelected ? "#10B981" : "#1A3673"};
          color: white;
          font-weight: 800;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          white-space: nowrap;
          transform: ${isSelected ? "scale(1.18)" : "scale(1)"};
        ">S/${precio}</div>`,
        iconSize: [70, 32],
        iconAnchor: [35, 16],
      })

      const marker = L.marker([lat, lng], { icon: priceIcon })
      marker.on("click", () => {
        setSelectedIndex(index)
        map.flyTo([lat, lng], 16, { duration: 0.5 })
      })
      marker.addTo(layer)
    })
  }, [listaCocheras, selectedIndex])

  // 3. Dibujar ruta estilo InDrive / Google Maps cuando se aprueba la solicitud
  useEffect(() => {
    const map = mapInstanceRef.current
    const routeLayer = routeLayerRef.current
    if (!map || !routeLayer) return

    routeLayer.clearLayers()

    if (reservaEstado === "en_ruta") {
      const target = listaCocheras[selectedIndex] || COCHERAS_TRUJILLO_DEFAULT[0]
      const destCoords: [number, number] = [
        Number(target.latitud) || -8.1116,
        Number(target.longitud) || -79.0287,
      ]

      // Puntos intermedios simulando giro por calles de Trujillo
      const midPoint: [number, number] = [userPos[0], destCoords[1]]
      const rutaPuntos: [number, number][] = [userPos, midPoint, destCoords]

      const polyline = L.polyline(rutaPuntos, {
        color: "#10B981",
        weight: 6,
        opacity: 0.9,
        dashArray: "10, 8",
      }).addTo(routeLayer)

      // Marcador del auto del conductor
      const carIcon = L.divIcon({
        className: "driver-car-pin",
        html: `<div style="background:#1A3673;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.35);font-size:15px;">🚗</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
      L.marker(userPos, { icon: carIcon }).addTo(routeLayer)

      map.fitBounds(polyline.getBounds(), { padding: [70, 70] })
    }
  }, [reservaEstado, listaCocheras, selectedIndex, userPos])

  // 4. Búsqueda con fallback local si Java está apagado
  const handleBuscar = (texto: string) => {
    setSearchQuery(texto)
    fetch(`http://localhost:8080/api/cocheras/buscar?texto=${encodeURIComponent(texto)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListaCocheras(data)
          setSelectedIndex(0)
        }
      })
      .catch(() => {
        const filtradas = COCHERAS_TRUJILLO_DEFAULT.filter(
          (c) =>
            c.titulo.toLowerCase().includes(texto.toLowerCase()) ||
            c.direccion.toLowerCase().includes(texto.toLowerCase())
        )
        setListaCocheras(filtradas.length > 0 ? filtradas : COCHERAS_TRUJILLO_DEFAULT)
        setSelectedIndex(0)
      })
  }

  const handleFiltrarVehiculo = (tipo: "auto" | "moto") => {
    setVehicle(tipo)
    fetch(`http://localhost:8080/api/cocheras/filtrar?tipo=${tipo.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListaCocheras(data)
          setSelectedIndex(0)
        }
      })
      .catch(() => console.warn("Filtro local activo"))
  }

  const cocheraActual = listaCocheras[selectedIndex] || COCHERAS_TRUJILLO_DEFAULT[0]
  const titulo = cocheraActual?.titulo || "Garaje San Martín"
  const direccion = cocheraActual?.direccion || "Jr. San Martín 648, Trujillo"
  const precio = cocheraActual?.tarifaHora ?? 4.5
  const tipoEspacio = cocheraActual?.tipoEspacio || "Techado"
  const metodoCobro = cocheraActual?.metodoCobro || "Yape • Plin • Tarjeta"

  return (
    <div className="screen map-screen" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Capa Superior */}
      <div className="map-top" style={{ position: "relative", zIndex: 10, pointerEvents: "auto" }}>
        <div className="brand-row">
          <Logo />
          <div style={{ position: "relative" }}>
            <button
              className="icon-button"
              onClick={() => setShowNotifs(!showNotifs)}
              type="button"
            >
              <Icon name="bell" />
            </button>

            {showNotifs && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "46px",
                  width: "240px",
                  background: "white",
                  borderRadius: "14px",
                  padding: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  zIndex: 50,
                  fontSize: "12px",
                  color: "#1e293b",
                }}
              >
                <strong style={{ display: "block", marginBottom: "6px", color: "#1A3673" }}>
                  Notificaciones {usuario?.primerNombre ? `de ${usuario.primerNombre}` : ""}
                </strong>
                <div style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                  🟢 Garaje cercano disponible a 2 min.
                </div>
                <div style={{ padding: "6px 0" }}>
                  🛡️ Cuenta vecinal activa.
                </div>
              </div>
            )}
          </div>
        </div>

        {reservaEstado !== "en_ruta" && (
          <>
            <div className="search-bar" style={{ background: "white", display: "flex", alignItems: "center", padding: "0 12px" }}>
              <Icon name="search" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleBuscar(e.target.value)}
                placeholder="¿A dónde vas? (Ej. Mansiche)"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  padding: "10px 8px",
                  fontSize: "13px",
                  color: "#1e293b",
                }}
              />
              <button
                type="button"
                onClick={() => handleBuscar("")}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                title="Restaurar"
              >
                <Icon name="sliders" />
              </button>
            </div>

            <div className="chips">
              <button
                type="button"
                className={vehicle === "auto" ? "chip active" : "chip"}
                onClick={() => handleFiltrarVehiculo("auto")}
              >
                <Icon name="car" size={17} />
                Auto
              </button>
              <button
                type="button"
                className={vehicle === "moto" ? "chip active" : "chip"}
                onClick={() => handleFiltrarVehiculo("moto")}
              >
                <Icon name="bike" size={17} />
                Moto
              </button>
              {(userRole === "both" || userRole === "host") && (
                <button type="button" className="host-rent-pill" onClick={onHost}>
                  ¿Tienes cochera? <b>Alquílala</b>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tarjeta Inferior: Modo Navegación (Estilo InDrive) vs Modo Exploración */}
      {reservaEstado === "en_ruta" ? (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 20,
            background: "white",
            borderRadius: "24px",
            padding: "18px",
            boxShadow: "0 15px 35px rgba(15, 23, 42, 0.22)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#10B981", letterSpacing: "0.08em" }}>
                ● EN RUTA A TU COCHERA
              </span>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1A3673", margin: "2px 0" }}>
                {titulo}
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                4 min (1.2 km) · {direccion}
              </p>
            </div>
            <div style={{ background: "#eff6ff", color: "#1A3673", padding: "6px 10px", borderRadius: "12px", fontWeight: 800, fontSize: "13px" }}>
              S/ 9.50
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              type="button"
              onClick={onOpenPass}
              style={{
                padding: "12px",
                borderRadius: "14px",
                background: "#f1f5f9",
                color: "#1A3673",
                fontWeight: 800,
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ver Pase QR
            </button>
            <button
              type="button"
              onClick={onFinishStay}
              style={{
                padding: "12px",
                borderRadius: "14px",
                background: "#10B981",
                color: "white",
                fontWeight: 800,
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
              }}
            >
              Finalizar estadía
            </button>
          </div>
        </div>
      ) : (
        <div className="garage-card" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <div className="grabber" />
          <div className="garage-head">
            <div className="garage-photo">
              <div className="garage-door" />
              <span>2 min</span>
            </div>
            <div className="garage-info">
              <div className="eyebrow verified">
                <Icon name="shield" size={14} />
                ANFITRIÓN VERIFICADO
              </div>
              <h2>{titulo}</h2>
              <p>{direccion}</p>
              <div className="rating">
                <b>4.9</b> ★ <span>128 reseñas</span>
              </div>
            </div>
            <div className="price">
              <strong>S/ {Number(precio).toFixed(2)}</strong>
              <span>por hora</span>
              <small>{metodoCobro}</small>
            </div>
          </div>
          <div className="amenities">
            <span>{tipoEspacio}</span>
            <span>Cámara 24h</span>
            <span>Acceso amplio</span>
          </div>
          <AppButton onClick={next}>
            Reservar espacio <Icon name="chevron" size={18} />
          </AppButton>
        </div>
      )}
    </div>
  )
}

export function CheckoutScreen({
  next,
  back,
  cocheraSeleccionada,
  usuario,
}: {
  next: () => void
  back: () => void
  cocheraSeleccionada?: any
  usuario?: any
}) {
  const [arrival, setArrival] = useState("Ahora")
  const [duration, setDuration] = useState(2)
  const [payment, setPayment] = useState<"yape" | "plin">("yape")

  const tarifaHora = cocheraSeleccionada?.tarifaHora ?? 4.50
  const subtotal = duration * tarifaHora
  const comision = 0.50
  const total = subtotal + comision

  // Simulación del motor de reglas del anfitrión (Ej. si el usuario tiene DNI verificado y placa)
  // En tu backend real, esto lo validará Spring Boot contra la tabla de restricciones del Host.
  const cumpleFiltrosHost = usuario?.dni && usuario?.placa ? true : true // Por defecto lo simulamos apto

  const handleConfirmarReserva = () => {
    // Objeto listo para enviar a tu API de Java (SQL Server: tabla Reservas)
    const datosReserva = {
      idCochera: cocheraSeleccionada?.id || 1,
      horaLlegada: arrival,
      duracionHoras: duration,
      montoTotal: total,
      metodoPago: payment.toUpperCase(),
      estado: cumpleFiltrosHost ? "APROBADA_AUTOMATICA" : "PENDIENTE_APROBACION",
    }

    console.log("Enviando reserva a Java:", datosReserva)

    // Aquí llamarías a tu fetch POST hacia tu backend de Spring Boot:
    // fetch('http://localhost:8080/api/reservas', { method: 'POST', body: JSON.stringify(datosReserva)... })

    // Avanza a la siguiente pantalla (Pase QR o Pantalla de Espera)
    next()
  }

  const paymentMethods = [
    {
      id: "yape" as const,
      label: "Yape",
      detail: "Pago inmediato con código QR",
      icon: <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-700 text-sm font-extrabold text-white">Y</span>,
    },
    {
      id: "plin" as const,
      label: "Plin",
      detail: "Pago inmediato interbancario",
      icon: <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500 text-sm font-extrabold text-white">P</span>,
    },
  ]

  return (
    <div className="screen flex flex-col bg-[#F8FAFC] font-['Inter'] h-full w-full">
      {/* Header */}
      <header className="flex h-13 shrink-0 items-center border-b border-slate-200 bg-white px-4">
        <button
          type="button"
          onClick={back}
          aria-label="Volver al mapa"
          className="grid h-9 w-9 place-items-center rounded-xl text-2xl text-[#1A3673]"
        >
          ‹
        </button>
        <h1 className="flex-1 pr-9 text-center text-sm font-extrabold text-[#1A3673]">
          Confirmar reserva
        </h1>
      </header>

      {/* Contenido */}
      <main className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {/* Resumen Cochera */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#1A3673]">
              📍
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold text-[#1A3673]">
                {cocheraSeleccionada?.titulo || "Garaje San Martín"}
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">
                {cocheraSeleccionada?.direccion || "Jr. San Martín 648, Trujillo"}
              </p>
            </div>
            <div className="text-right">
              <strong className="block text-sm text-[#1A3673]">S/ {Number(tarifaHora).toFixed(2)}</strong>
              <span className="text-[9px] text-slate-400">/ hora</span>
            </div>
          </div>
        </section>

        {/* Tiempo y Duración */}
        <section>
          <h2 className="mb-3 text-sm font-extrabold text-[#1A3673]">
            Selecciona tu tiempo
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {["Ahora", "18:00", "19:00"].map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => setArrival(time)}
                className={`rounded-full border px-3 py-2.5 text-[11px] font-bold transition ${
                  arrival === time
                    ? "border-[#1A3673] bg-[#1A3673] text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                Duración
              </span>
              <strong className="mt-0.5 block text-xs text-slate-700">
                Tiempo reservado
              </strong>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDuration((v) => Math.max(1, v - 1))}
                className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-[#1A3673]"
              >
                −
              </button>
              <strong className="min-w-14 text-center text-sm text-[#1A3673]">
                {duration} {duration === 1 ? "hora" : "horas"}
              </strong>
              <button
                type="button"
                onClick={() => setDuration((v) => Math.min(8, v + 1))}
                className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-[#1A3673]"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Método de Pago (Solo Yape y Plin) */}
        <section>
          <h2 className="mb-3 text-sm font-extrabold text-[#1A3673]">
            Método de pago local (Perú)
          </h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setPayment(method.id)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition ${
                  payment === method.id
                    ? "border-[#1A3673] ring-2 ring-blue-900/5"
                    : "border-slate-200"
                }`}
              >
                {method.icon}
                <span className="flex-1">
                  <b className="block text-xs text-slate-800">{method.label}</b>
                  <small className="mt-0.5 block text-[9px] text-slate-400">
                    {method.detail}
                  </small>
                </span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${
                    payment === method.id
                      ? "border-[#1A3673]"
                      : "border-slate-300"
                  }`}
                >
                  {payment === method.id && (
                    <i className="h-2.5 w-2.5 rounded-full bg-[#1A3673]" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Desglose de Costos y Restricción de Seguridad */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <dl className="space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <dt>Subtotal ({duration}h)</dt>
              <dd className="font-semibold text-slate-700">
                S/ {subtotal.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between text-slate-500">
              <dt>Protección ParkVecino</dt>
              <dd className="font-semibold text-slate-700">S/ {comision.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-extrabold text-[#1A3673]">
              <dt>Total a Pagar</dt>
              <dd>S/ {total.toFixed(2)}</dd>
            </div>
          </dl>

          {/* Alerta inteligente de validación vecinal */}
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-[10px] font-bold text-[#10B981]">
            <span>🛡️</span>
            <span>
              {cumpleFiltrosHost 
                ? "¡Perfil verificado! Match automático con el anfitrión." 
                : "Tu solicitud requerirá validación manual del anfitrión."}
            </span>
          </div>
        </section>
      </main>

      {/* Footer Botón de Confirmación */}
      <footer className="shrink-0 border-t border-slate-200 bg-white px-5 pb-5 pt-3">
        <button
          type="button"
          onClick={handleConfirmarReserva}
          className="flex h-13 w-full items-center justify-center rounded-xl bg-[#1A3673] text-sm font-extrabold text-white shadow-lg shadow-blue-950/15 transition active:scale-[0.99]"
        >
          Confirmar y Pagar S/ {total.toFixed(2)} vía {payment.toUpperCase()}
        </button>
      </footer>
    </div>
  )
}



function PassScreen({ next, back }: { next: () => void; back: () => void }) {
  const [timeLeft, setTimeLeft] = useState(2700) // 45 minutos en segundos
  const [showSosModal, setShowSosModal] = useState(false)

  // Token dinámico único para el ingreso
  const tokenUnico = `PV-TRU-${Math.floor(100000 + Math.random() * 900000)}`

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `00:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="screen pass-screen flex flex-col bg-[#F8FAFC] font-['Inter'] h-full w-full relative">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <button
          type="button"
          onClick={back}
          className="grid h-9 w-9 place-items-center rounded-xl text-2xl text-[#1A3673] font-bold"
        >
          ‹
        </button>
        <span className="text-sm font-extrabold text-[#1A3673]">Pase de Acceso</span>
        <button 
          onClick={() => alert("Soporte ParkVecino Trujillo: +51 988 000 111")}
          className="text-xs font-bold text-[#1A3673]"
        >
          Ayuda
        </button>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto px-5 py-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] text-xs font-extrabold">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> RESERVA ACTIVA
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-[#1A3673]">Tu espacio está listo</h1>
          <p className="text-xs text-slate-500 mt-1">
            Muestra este código QR al anfitrión en la entrada.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 max-w-[260px] mx-auto relative flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 relative overflow-hidden shadow-inner">
            <div className="absolute inset-2 grid grid-cols-6 gap-1.5 opacity-90">
              {Array.from({ length: 36 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-xs ${i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-slate-800"}`} 
                />
              ))}
            </div>
            <div className="relative z-10 bg-[#1A3673] p-2.5 rounded-xl border-2 border-white shadow-lg">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          </div>
          <span className="mt-3 text-[11px] font-mono font-bold text-slate-400 tracking-wider">
            TOKEN: {tokenUnico}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 max-w-[300px] mx-auto">
          <span className="text-[10px] font-extrabold text-slate-400 tracking-widest block mb-1">
            TIEMPO PARA INGRESAR
          </span>
          <strong className="text-2xl font-black text-[#1A3673] font-mono">
            {formatTime(timeLeft)}
          </strong>
          <p className="text-[11px] text-slate-500 mt-1">
            ⏱️ Válido hasta las 7:30 p. m.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A3673] flex items-center justify-center font-bold">
            🚗
          </div>
          <div className="flex-1 min-w-0">
            <b className="block text-xs font-extrabold text-[#1A3673]">
              Garaje San Martín
            </b>
            <span className="text-[10px] text-slate-500 block truncate">
              Jr. San Martín 648 · Espacio A-02
            </span>
          </div>
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowSosModal(true)}
          className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold shadow-md flex items-center justify-center gap-2"
        >
          🚨 SOS Emergencia
        </button>
      </footer>

      {showSosModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold">
              🚨
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Centro de Asistencia ParkVecino</h3>
            <p className="text-xs text-slate-500">¿Tienes algún inconveniente en la cochera?</p>
            <div className="space-y-2 pt-2">
              <a href="tel:105" className="block w-full py-3 bg-red-500 text-white rounded-xl text-xs font-extrabold">
                Llamar a Emergencias (105)
              </a>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="w-full py-2 text-slate-400 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RequestScreen({ next, onReject }: { next: () => void; onReject: () => void }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleReject = () => {
    setIsClosing(true)
    setTimeout(() => {
      onReject()
    }, 350)
  }

  return (
    <div className="screen request-screen relative overflow-hidden">
      <div
        className={`dashboard-blur transition-all duration-300 ${
          isClosing ? "blur-none opacity-100 scale-100" : ""
        }`}
      >
        <Logo />
        <div className="host-greeting">Hola, María</div>
        <div className="fake-balance" />
        <div className="fake-card" />
        <div className="fake-card short" />
      </div>

      <div
        className={`modal-shade transition-opacity duration-300 ${
          isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      <section
        className={`request-modal transition-transform duration-300 ease-out ${
          isClosing ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="grabber" />
        <div className="modal-label">SOLICITUD DE INGRESO</div>

        <div className="driver-profile">
          <div className="avatar">
            DR
            <span className="online" />
          </div>
          <div>
            <h1>Diego Ramírez</h1>
            <p>Conductor · 24 viajes</p>
            <div className="rating">
              <b>4.9</b> ★ <span>Usuario destacado</span>
            </div>
          </div>
        </div>

        <div className="verification-list">
          <div>
            <span className="check">✓</span>
            <p>
              <b>Identidad RENIEC validada</b>
              <small>DNI termina en ••42 · Filtro automático OK</small>
            </p>
          </div>
          <div>
            <span className="check">✓</span>
            <p>
              <b>Placa limpia</b>
              <small>T8M-284 · Toyota Yaris gris</small>
            </p>
          </div>
        </div>

        <div className="arrival-row">
          <div>
            <span>LLEGADA ESTIMADA</span>
            <b>Ahora · Puerta principal</b>
          </div>
          <div className="earnings">
            <span>TU GANANCIA</span>
            <strong>S/ 3.80</strong>
          </div>
        </div>

        <div className="modal-actions">
          <AppButton variant="muted" onClick={handleReject}>
            RECHAZAR
          </AppButton>
          <AppButton onClick={next}>APROBAR INGRESO</AppButton>
        </div>

        <p className="safe-note">
          <Icon name="shield" size={15} /> Pago protegido por ParkVecino
        </p>
      </section>
    </div>
  )
}
function SuccessScreen({ restart }: { restart: () => void }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const options = ["Cochera segura", "Fácil acceso", "Anfitrión amable"]
  const toggle = (item: string) =>
    setFeedback((all) =>
      all.includes(item)
        ? all.filter((value) => value !== item)
        : [...all, item],
    )

  return (
    <div className="screen success-screen">
      <StatusBar />
      <main className="success-content">
        <div className="success-check">
          <span>✓</span>
        </div>
        <div className="success-kicker">RESERVA COMPLETADA</div>
        <h1>¡Estacionamiento finalizado!</h1>
        <p>Tu pago fue procesado de forma segura.</p>
        <section className="voucher">
          <div className="voucher-top">
            <div className="yape-mark">Y</div>
            <div>
              <span>PAGO COMPLETADO</span>
              <b>S/ 9.50 vía Yape</b>
            </div>
          </div>
          <div className="voucher-line" />
          <dl>
            <div>
              <dt>Reserva</dt>
              <dd>#PV-28419</dd>
            </div>
            <div>
              <dt>Duración</dt>
              <dd>2h 00m</dd>
            </div>
          </dl>
        </section>
        <section className="rating-section">
          <span>¿CÓMO FUE TU EXPERIENCIA?</span>
          <h2>¿Cómo estuvo la cochera de Rosa?</h2>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={star <= rating ? "selected" : ""}
                onClick={() => setRating(star)}
                aria-label={`${star} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="feedback-chips">
            {options.map((item) => (
              <button
                key={item}
                className={feedback.includes(item) ? "selected" : ""}
                onClick={() => toggle(item)}
              >
                {feedback.includes(item) ? "✓ " : ""}
                {item}
              </button>
            ))}
          </div>
        </section>
      </main>
      <div className="success-footer">
        <AppButton onClick={restart}>Volver al mapa</AppButton>
        <span>Tu opinión ayuda a cuidar la comunidad</span>
      </div>
    </div>
  )
}

export function HostOnboardingScreen({
  next,
  onCreateCochera,
}: HostScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<{ name: string; preview: string }[]>([])
  const [address, setAddress] = useState("")
  const [spaceType, setSpaceType] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [hourlyRate, setHourlyRate] = useState("4.50")
  const [payoutMethod, setPayoutMethod] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const MIN_PHOTOS = 3
  const MAX_PHOTOS = 6
  const MAX_SIZE_MB = 5
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (selectedFiles.length === 0) return

    setErrorMsg(null)

    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      setErrorMsg(`Puedes subir máximo ${MAX_PHOTOS} fotos por espacio.`)
      event.target.value = ""
      return
    }

    const validItems: { name: string; preview: string }[] = []

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg(`"${file.name}" no es válido. Usa solo JPG, PNG o WEBP.`)
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorMsg(`"${file.name}" supera el límite de ${MAX_SIZE_MB} MB.`)
        continue
      }
      validItems.push({
        name: file.name,
        preview: URL.createObjectURL(file),
      })
    }

    if (validItems.length > 0) {
      setPhotos((prev) => [...prev, ...validItems])
    }

    event.target.value = ""
  }

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => {
      const target = prev[indexToRemove]
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }

  const handleSubmit = () => {
    if (photos.length < MIN_PHOTOS) {
      setErrorMsg(`Sube al menos ${MIN_PHOTOS} fotos (tienes ${photos.length}).`)
      return
    }
    if (!address.trim()) {
      setErrorMsg("Ingresa la dirección exacta de tu espacio.")
      return
    }
    if (!spaceType) {
      setErrorMsg("Selecciona el tipo de espacio.")
      return
    }
    if (!vehicleType) {
      setErrorMsg("Selecciona qué vehículo admite.")
      return
    }
    const tarifaNum = Number(hourlyRate)
    if (Number.isNaN(tarifaNum) || tarifaNum < 1) {
      setErrorMsg("Ingresa una tarifa válida desde S/ 1.00.")
      return
    }
    if (!payoutMethod) {
      setErrorMsg("Selecciona cómo deseas recibir tus pagos.")
      return
    }

    setErrorMsg(null)

    const jitterLat = (Math.random() - 0.5) * 0.012
    const jitterLng = (Math.random() - 0.5) * 0.012

    const metodoTexto =
      payoutMethod === "yape"
        ? "Yape"
        : payoutMethod === "plin"
        ? "Plin"
        : "Cuenta Bancaria"

    const tipoTexto = spaceType === "techada" ? "Techada" : "Patio"

    const nuevaCochera = {
      id: Date.now(),
      titulo: `Cochera ${address.split(",")[0].trim()}`,
      direccion: address.trim(),
      tarifaHora: tarifaNum,
      latitud: -8.1116 + jitterLat,
      longitud: -79.0287 + jitterLng,
      tipoEspacio: tipoTexto,
      admite: vehicleType,
      metodoCobro: metodoTexto,
      fotos: photos.map((p) => p.preview),
    }

    fetch("http://localhost:8080/api/cocheras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCochera),
    }).catch(() => console.warn("Backend offline: cochera guardada en el MVP local"))

    onCreateCochera?.(nuevaCochera)
    next()
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F8FAFC] font-['Inter'] text-slate-900 w-full h-full relative">
      <HostHeader title="Registra tu espacio" onBack={next} />
      <main className="flex-1 space-y-6 overflow-y-auto px-5 py-5 pb-28">
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
          >
            <span className="flex h-full flex-col items-center justify-center gap-2.5 px-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100">
                <CameraIcon />
              </span>
              <span className="text-sm font-bold text-[#1E3A8A]">
                Subir fotos del espacio ({photos.length}/{MIN_PHOTOS} mín.)
              </span>
              <span className="max-w-64 text-xs leading-5 text-slate-500">
                Mínimo {MIN_PHOTOS} fotos claras (fachada, espacio y acceso). JPG, PNG o WEBP hasta {MAX_SIZE_MB} MB.
              </span>
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, idx) => (
                <div
                  key={`${photo.name}-${idx}`}
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    aria-label="Eliminar foto"
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/75 text-[11px] font-bold text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <section className="space-y-5">
          <div>
            <label
              htmlFor="host-address"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Dirección exacta
            </label>
            <input
              id="host-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Jr. San Martín 648, Trujillo"
              className="h-13 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1E3A8A] focus:ring-3 focus:ring-blue-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="space-type"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Tipo de espacio
            </label>
            <div className="relative">
              <select
                id="space-type"
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="h-13 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#1E3A8A] focus:ring-3 focus:ring-blue-900/10"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="techada">Techada</option>
                <option value="patio">Patio</option>
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="vehicle-type"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Admite
            </label>
            <div className="relative">
              <select
                id="vehicle-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="h-13 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#1E3A8A] focus:ring-3 focus:ring-blue-900/10"
              >
                <option value="" disabled>
                  Selecciona un vehículo
                </option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
                <option value="ambos">Auto y Moto</option>
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="hourly-rate"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Tarifa por hora (S/)
            </label>
            <div className="flex h-13 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[#1E3A8A] focus-within:ring-3 focus-within:ring-blue-900/10">
              <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-[#1E3A8A]">
                S/
              </span>
              <input
                id="hourly-rate"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                aria-label="Tarifa por hora en soles"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="payout-method"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Método para recibir tus pagos
            </label>
            <div className="relative">
              <select
                id="payout-method"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="h-13 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#1E3A8A] focus:ring-3 focus:ring-blue-900/10"
              >
                <option value="" disabled>
                  Yape o Plin 
                </option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
       
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon />
              </span>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Tus ganancias se transferirán automáticamente al finalizar cada reserva.
            </p>
          </div>
        </section>
      </main>

      <div className="absolute bottom-0 w-full">
        <PrimaryFooter onClick={handleSubmit}>Continuar</PrimaryFooter>
      </div>
    </div>
  )
}

export function HostSettingsScreen({ next }: HostScreenProps) {
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("22:00")

  const [rules, setRules] = useState([
    {
      id: "dni",
      label: "Exigir DNI validado (RENIEC)",
      active: true,
    },
    {
      id: "plate",
      label: "Exigir placa sin antecedentes",
      active: true,
    },
    {
      id: "yape",
      label: "Cobro automático por Yape",
      active: true,
    },
  ])

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F8FAFC] font-['Inter'] text-slate-900 w-full h-full relative">
      <HostHeader title="Tú tienes el control" onBack={next} />
      <main className="flex-1 space-y-7 overflow-y-auto px-5 py-6 mb-20">
        <section>
          <div className="mb-4">
            <span className="text-[11px] font-extrabold tracking-widest text-slate-400">
              DISPONIBILIDAD
            </span>
            <h2 className="mt-1 text-lg font-bold text-[#1E3A8A]">
              Define tus horarios
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="mb-2 block text-xs font-semibold text-slate-500">
                Inicio
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-transparent text-base font-bold text-[#1E3A8A] outline-none"
              />
            </label>
            <label className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="mb-2 block text-xs font-semibold text-slate-500">
                Fin
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-transparent text-base font-bold text-[#1E3A8A] outline-none"
              />
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Fuera de este horario, tu cochera no aparecerá en el mapa.
          </p>
        </section>

        <section>
          <div className="mb-4">
            <span className="text-[11px] font-extrabold tracking-widest text-slate-400">
              FILTROS Y REGLAS DE INGRESO
            </span>
            <h2 className="mt-1 text-lg font-bold text-[#1E3A8A]">
              Elige tus requisitos
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className={[
                  "flex min-h-18 items-center gap-4 px-4 py-4",
                  index < rules.length - 1 ? "border-b border-slate-100" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                    rule.active
                      ? "bg-emerald-50 text-[#10B981]"
                      : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  <CheckIcon />
                </span>
                <span className="flex-1 text-sm font-semibold leading-5 text-slate-700">
                  {rule.label}
                </span>
                <Toggle
                  active={rule.active}
                  label={`${rule.label}, ${rule.active ? "activado" : "desactivado"}`}
                  onChange={() => toggleRule(rule.id)}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-[#10B981]">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs font-semibold leading-5">
              Si el conductor cumple con todos los requisitos que actives, su
              reserva se aprobará automáticamente sin que tengas que aprobar
              solicitud por solicitud.
            </p>
          </div>
        </section>
      </main>
      <div className="absolute bottom-0 w-full">
        <PrimaryFooter onClick={next}>Publicar mi cochera</PrimaryFooter>
      </div>
    </div>
  )
}

export function HostDashboardScreen({ next, userName }: HostScreenProps) {
  const [available, setAvailable] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)
  const [showAllActivity, setShowAllActivity] = useState(false)

  const displayName = userName?.trim() || "Anfitrión"

  const notifications = [
    {
      id: 1,
      title: "Pago recibido por Yape",
      desc: "Diego R. (T1A-234) completó su estadía. +S/ 4.50 transferidos.",
      time: "Hace 12 min",
    },
    {
      id: 2,
      title: "Reserva aprobada automáticamente",
      desc: "Lucía C. cumplió tus requisitos (DNI y placa sin antecedentes).",
      time: "Hace 2 h",
    },
    {
      id: 3,
      title: "Cochera activa en el mapa",
      desc: "Tu espacio ya es visible para conductores cercanos en Trujillo.",
      time: "Hoy, 08:00",
    },
  ]

  const allActivity = [
    {
      initials: "DR",
      name: "Diego R.",
      plate: "T1A-234",
      duration: "1h 30m",
      date: "Hoy, 10:15 a. m.",
      amount: "+ S/ 4.50",
    },
    {
      initials: "LC",
      name: "Lucía C.",
      plate: "M4K-891",
      duration: "2h 00m",
      date: "Hoy, 08:05 a. m.",
      amount: "+ S/ 6.00",
    },
    {
      initials: "CM",
      name: "Carlos M.",
      plate: "T3B-512",
      duration: "3h 00m",
      date: "Ayer, 06:30 p. m.",
      amount: "+ S/ 13.50",
    },
    {
      initials: "AV",
      name: "Andrea V.",
      plate: "P2R-908",
      duration: "2h 30m",
      date: "Ayer, 02:10 p. m.",
      amount: "+ S/ 11.25",
    },
    {
      initials: "JP",
      name: "Jorge P.",
      plate: "T5L-119",
      duration: "2h 15m",
      date: "24 Nov, 04:45 p. m.",
      amount: "+ S/ 10.25",
    },
  ]

  return (
    <div className="flex min-h-full flex-col bg-[#F8FAFC] font-['Inter'] text-slate-900 w-full h-full relative overflow-hidden">
      <header className="host-dashboard-safe-header flex shrink-0 items-center justify-between px-5 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Panel de anfitrión
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1E3A8A]">
            Hola, {displayName}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Notificaciones"
          onClick={() => {
            setShowNotifications(true)
            setUnreadNotifications(false)
          }}
          className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#1E3A8A] shadow-sm transition active:scale-95"
        >
          <BellIcon />
          {unreadNotifications && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#10B981]" />
          )}
        </button>
      </header>

      <main className="flex-1 space-y-5 px-5 pb-8 overflow-y-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Estado de tu espacio
              </p>
              <h2 className="mt-2 text-base font-bold text-[#1E3A8A]">
                Mi cochera está:
              </h2>
              <p
                className={[
                  "mt-1 text-lg font-extrabold",
                  available ? "text-[#10B981]" : "text-slate-500",
                ].join(" ")}
              >
                {available ? "DISPONIBLE" : "NO DISPONIBLE"}
              </p>
            </div>
            <Toggle
              active={available}
              large
              label="Cambiar disponibilidad de la cochera"
              onChange={() => setAvailable(!available)}
            />
          </div>
          <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            {available
              ? "Tu espacio aparece en el mapa y puede recibir solicitudes."
              : "Tu espacio está oculto y no recibirá nuevas solicitudes."}
          </p>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-[#1E3A8A] p-5 text-white shadow-xl shadow-blue-950/15">
          <div className="absolute -top-12 -right-10 h-32 w-32 rounded-full border-[18px] border-white/5" />
          <p className="relative text-xs font-semibold text-blue-100">
            Ganancias de la semana
          </p>
          <p className="relative mt-3 text-4xl font-extrabold tracking-tight">
            S/ 45.50
          </p>
          <div className="relative mt-5 flex items-center gap-2 border-t border-white/15 pt-4">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#10B981] text-white">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs text-blue-100">
              Transferido automáticamente a Yape
            </span>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E3A8A]">
              Actividad reciente
            </h2>
            <button
              type="button"
              onClick={() => setShowAllActivity(true)}
              className="text-xs font-bold text-[#1E3A8A] hover:underline"
            >
              Ver todo
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {allActivity.slice(0, 2).map((item, index) => (
              <article
                key={item.plate}
                className={[
                  "flex items-center gap-3 p-4",
                  index < 1 ? "border-b border-slate-100" : "",
                ].join(" ")}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold text-[#1E3A8A]">
                  {item.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Placa {item.plate}
                    <span className="mx-1.5 text-slate-300">•</span>
                    {item.duration}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <span className="text-sm font-extrabold">{item.amount}</span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#10B981] text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          className="absolute inset-0 z-50 flex items-end bg-slate-900/45 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-white p-5 pb-7 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E3A8A]">
                  Notificaciones
                </h3>
                <p className="text-xs text-slate-500">
                  Alertas y movimientos de tu espacio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600"
              >
                ×
              </button>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#1E3A8A]">
                      {notif.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {notif.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-4 text-slate-600">
                    {notif.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAllActivity && (
        <div
          onClick={() => setShowAllActivity(false)}
          className="absolute inset-0 z-50 flex items-end bg-slate-900/45 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[82%] w-full flex-col rounded-t-3xl bg-white p-5 pb-6 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-slate-200" />
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E3A8A]">
                  Historial de alquileres
                </h3>
                <p className="text-xs text-slate-500">
                  {allActivity.length} conductores atendidos esta semana
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllActivity(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600"
              >
                ×
              </button>
            </div>
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
              {allActivity.map((item) => (
                <article
                  key={`${item.plate}-${item.date}`}
                  className="flex items-center gap-3 p-3.5"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold text-[#1E3A8A]">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800">
                      {item.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Placa {item.plate} • {item.duration}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#10B981]">
                    <span className="text-sm font-extrabold">{item.amount}</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#10B981] text-white">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}








function HostScannerScreen({
  back,
  next,
}: {
  back: () => void
  next: () => void
}) {
  const [manualEntry, setManualEntry] = useState(false)

  return (
    <div className="screen relative overflow-hidden bg-slate-950 font-['Inter'] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,#475569_0%,#1e293b_30%,#020617_76%)]" />
      <div className="absolute left-[-12%] top-[26%] h-44 w-56 rotate-12 rounded-[40px] bg-slate-500/20 blur-xl" />
      <div className="absolute right-[-18%] top-[34%] h-64 w-56 -rotate-12 rounded-[55px] bg-slate-400/15 blur-2xl" />
      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="relative z-10">
        <StatusBar light />
        <header className="flex h-14 items-center px-4">
          <button
            type="button"
            onClick={back}
            aria-label="Volver al panel"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl text-white backdrop-blur"
          >
            ‹
          </button>
          <h1 className="flex-1 pr-10 text-center text-sm font-extrabold text-white">
            Validar ingreso
          </h1>
        </header>
      </div>

      <main className="absolute inset-x-0 top-28 z-10 flex flex-col items-center px-6">
        <div className="rounded-full border border-white/15 bg-slate-950/55 px-4 py-2.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md">
          Escanea el pase QR del conductor
        </div>

        <div className="relative mt-8 h-56 w-56 overflow-hidden rounded-[28px] border-[3px] border-[#10B981] bg-transparent shadow-[0_0_0_999px_rgba(2,6,23,0.28),0_0_32px_rgba(16,185,129,0.34)]">
          <span className="absolute left-4 top-4 h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-4 top-4 h-7 w-7 rounded-tr-xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-4 left-4 h-7 w-7 rounded-bl-xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-4 right-4 h-7 w-7 rounded-br-xl border-b-4 border-r-4 border-white" />
          <span className="scanner-line absolute left-4 right-4 h-0.5 bg-[#10B981] shadow-[0_0_14px_3px_rgba(16,185,129,0.7)]" />
        </div>

        <p className="mt-5 flex items-center gap-2 text-[10px] font-medium text-white/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
          Buscando código QR...
        </p>
      </main>

      <section className="absolute inset-x-2 bottom-2 z-20 rounded-[26px] bg-white p-5 text-slate-900 shadow-2xl">
        {!manualEntry ? (
          <>
            <div className="flex items-center gap-3">
              <div className="relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-[#1A3673] text-sm font-extrabold text-white">
                DR
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#10B981]">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-extrabold tracking-wider text-[#10B981]">
                  CONDUCTOR VERIFICADO
                </span>
                <h2 className="mt-1 text-sm font-extrabold text-[#1A3673]">
                  Diego Ramírez
                </h2>
                <p className="mt-1 text-[10px] text-slate-500">
                  Toyota Yaris gris <span className="text-slate-300">•</span>{" "}
                  T8M-284
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-[#10B981]">
                <Icon name="shield" size={19} />
              </span>
            </div>

            <button
              type="button"
              onClick={() => setManualEntry(true)}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-[#1A3673] bg-white text-xs font-extrabold text-[#1A3673] transition active:bg-slate-50"
            >
              Ingresar código manual
            </button>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold tracking-wider text-[#10B981]">
                  VALIDACIÓN ALTERNATIVA
                </span>
                <h2 className="mt-1 text-sm font-extrabold text-[#1A3673]">
                  Ingresa el código del pase
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setManualEntry(false)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-lg text-slate-500"
                aria-label="Cerrar ingreso manual"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Ej. PV-28419"
              className="mt-4 h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-center text-sm font-bold uppercase tracking-widest text-[#1A3673] outline-none focus:border-[#1A3673]"
            />
            <button
              type="button"
              onClick={next}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-[#1A3673] text-xs font-extrabold text-white"
            >
              Validar código
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
//hola mundo ga
// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
export default function App() {
  const [screen, setScreen] = useState<string>("auth")
  const [reservaEstado, setReservaEstado] = useState<
    "ninguna" | "en_ruta" | "finalizada"
  >("ninguna")
  const [notificacion, setNotificacion] = useState<string | null>(null)

  const dispararNotificacion = (mensaje: string) => {
    setNotificacion(mensaje)
    setTimeout(() => setNotificacion(null), 4500)
  }

  const [userRole, setUserRole] = useState<"driver" | "host" | "both">("driver")

  // 1. Estado para guardar tus cocheras que vienen de Java y SQL Server
 const [cocheras, setCocheras] = useState<any[]>([])

  // NUEVO: Estado para guardar los datos del usuario logueado (ej. su primer nombre)
  const [usuario, setUsuario] = useState<{
    nombreCompleto: string
    primerNombre: string
    celular: string
    dni: string
    placa?: string
  } | null>(null)

  // 2. useEffect para consumir tu API apenas cargue la app
  useEffect(() => {
    fetch("http://localhost:8080/api/cocheras")
      .then((res) => res.json())
      .then((data) => {
        console.log("¡Cocheras cargadas desde Java:", data);
        setCocheras(data);
      })
      .catch((err) => console.error("Error conectando al backend:", err));
  }, []);

  const extendedNav = nav

  const current = useMemo(
    () => extendedNav.findIndex((item) => item.id === screen),
    [screen],
  )

  const next = () => {
    const nextIndex = current + 1
    if (nextIndex < extendedNav.length) {
      setScreen(extendedNav[nextIndex].id as any)
    } else {
      setScreen("map") // Reiniciar
    }
  }

  return (
    <div className="app-shell">
      <aside className="flow-panel">
        <Logo />
        <div className="flow-copy">
          <span>EXPERIENCIA O2O</span>
          <h1>
            Estacionar cerca,
            <br />
            sentirse seguro.
          </h1>
          <p>
            Un flujo simple que conecta conductores con espacios verificados en
            Trujillo.
          </p>
        </div>
        <nav>
          {extendedNav.map((item, index) => (
            <button
              key={item.id}
              className={screen === item.id ? "flow-link active" : "flow-link"}
              onClick={() => setScreen(item.id as any)}
            >
              <span>{item.step}</span>
              <div>
                <b>{item.label}</b>
                <small>
                  {
                    [
                      "Accede de forma segura",
                      "Define cómo usar la app",
                      "Encuentra un espacio",
                      "Revisa y paga tu reserva",
                      "Ingresa sin fricción",
                      "Controla quién entra",
                      "Cierra con confianza",
                      "Sube tus fotos",
                      "Fija tus reglas",
                      "Gana dinero seguro",
                      "Escanea el pase del conductor",
                    ][index]
                  }
                </small>
              </div>
            </button>
          ))}
        </nav>
        <div className="trust-line">
          <Icon name="shield" size={18} /> Red vecinal verificada
        </div>
      </aside>

      <div className="phone-wrap">
        <div className="phone relative">
  {notificacion && (
    <div className="absolute top-3 left-3 right-3 z-[2000] bg-[#1A3673] text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-400/30 flex items-center gap-3 animate-bounce">
      <span className="text-lg">🚗</span>
      <p className="text-xs font-bold leading-snug">{notificacion}</p>
    </div>
  )}

  {screen === "auth" && (
    <AuthScreen
      next={next}
      onLoginSuccess={(userData) => setUsuario(userData)}
    />
  )}

  {screen === "role" && (
    <RoleSelectionScreen
      onContinue={(role) => {
        setUserRole(role)
        setScreen(role === "host" ? "host-onboarding" : "map")
      }}
    />
  )}

  {screen === "map" && (
    <MapScreen
      next={next}
      onHost={() => setScreen("host-onboarding")}
      cocheras={cocheras}
      usuario={usuario}
      userRole={userRole}
      reservaEstado={reservaEstado}
      onOpenPass={() => setScreen("pass")}
      onFinishStay={() => {
        setReservaEstado("finalizada")
        setScreen("success")
        dispararNotificacion("🏁 Estacionamiento finalizado. Cuéntanos tu experiencia.")
      }}
    />
  )}

  {screen === "checkout" && (
    <CheckoutScreen
      next={next}
      back={() => setScreen("map")}
    />
  )}

  {screen === "pass" && (
    <PassScreen
      next={next}
      back={() => setScreen("checkout")}
    />
  )}

  {screen === "request" && (
    <RequestScreen
      next={() => {
        setReservaEstado("en_ruta")
        setScreen("map")
        dispararNotificacion("✅ ¡Solicitud aprobada en Garaje San Martín! Trazando ruta...")
      }}
      onReject={() => setScreen("host-dashboard")}
    />
  )}

  {screen === "success" && (
  <SuccessScreen
    restart={() => {
      setReservaEstado("ninguna")
      setScreen("map")
    }}
  />
)}
{screen === "host-onboarding" && (
  <HostOnboardingScreen
    next={next}
    onCreateCochera={(nueva) => {
      setCocheras((prev) => [nueva, ...prev])
    }}
  />
)}
  {screen === "host-settings" && <HostSettingsScreen next={next} />}
 {screen === "host-dashboard" && (
  <HostDashboardScreen next={next} userName={usuario?.primerNombre} />
)}
  {screen === "host-scanner" && (
    <HostScannerScreen
      next={next}
      back={() => setScreen("host-dashboard")}
    />
  )}
        </div>
        <div className="screen-counter">
          <span>{String(current + 1).padStart(2, "0")}</span> / 11
        </div>
      </div>
    </div>
  )
}