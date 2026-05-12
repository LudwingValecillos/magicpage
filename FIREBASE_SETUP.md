# FIREBASE_SETUP.md

Datos que necesito de vos para enchufar Firebase al proyecto.
Completá los huecos `<RELLENAR>` y devolveme el archivo. Yo configuro el resto.

---

## 1. Proyecto Firebase

Pasos en https://console.firebase.google.com:

1. Crear proyecto (nombre sugerido: `magic-devoto` o el que prefieras).
2. **Plan**: Spark (gratis). Confirmado.
3. **Region**: `southamerica-east1` (São Paulo — más cerca de Argentina).
4. Habilitar **Firestore Database** → modo production → región igual a la del proyecto.
5. Habilitar **Storage** → modo production → región igual.
6. (Opcional, no para esta fase) Habilitar **Authentication** → método "Email/Password".

**Project ID generado por Firebase**: `<RELLENAR>`

---

## 2. App web registrada

En Project settings → "Tus apps" → Agregar app → Web (`</>`):

- Nickname app: `magic-web`
- **NO marcar** "Configurar también Firebase Hosting" (usamos Vercel).

Firebase te muestra un snippet con tu `firebaseConfig`. Copialos acá:

```
apiKey:            <RELLENAR>
authDomain:        <RELLENAR>
projectId:         <RELLENAR>
storageBucket:     <RELLENAR>
messagingSenderId: <RELLENAR>
appId:             <RELLENAR>
```

---

## 3. Datos del negocio

Para meter en `.env.local` y en `src/content/site.ts`. Los podés cambiar después sin tocar código.

| Variable | Valor |
|---|---|
| Marca / nombre tienda | `<RELLENAR — ej. "Magic" hasta que decidas nuevo nombre>` |
| Tagline corto | `Productos oficiales Disney y Marvel — ropa, juguetes y accesorios` (¿OK?) |
| Número WhatsApp (formato internacional sin `+`) | `<RELLENAR — ej. 5491155556666>` |
| Dirección local | `Quevedo 3365, C1417 CABA — Shopping Devoto` (¿OK?) |
| Horarios local | `<RELLENAR — ej. "Lun a Sáb 10-22hs · Dom 12-21hs">` |
| Email contacto | `<RELLENAR>` |
| Instagram URL | `https://instagram.com/magic.devoto` (¿OK?) |
| Facebook URL | `<RELLENAR o dejar vacío>` |
| TikTok URL | `<RELLENAR o dejar vacío>` |
| Maps embed `src` (solo la URL dentro de `src="..."`) | `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.703005379882!2d-58.51998072339833!3d-34.61167085791968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb7006daa6a61%3A0x8fa434faca93bc2d!2sMagic%20Store%20Devoto%20Shopping!5e0!3m2!1ses!2sar!4v1778604170714!5m2!1ses!2sar` |

---

## 4. Admin credentials (provisionales)

Hardcoded por ahora vía `.env.local`. Cuando quieras Firebase Auth real, lo cambio.

```
ADMIN_USER=<RELLENAR — ej. emiliano>
ADMIN_PASS=<RELLENAR — algo no obvio, mín. 8 chars>
```

---

## 5. Variables que voy a poner en `.env.local`

Tras tener todo lo de arriba, yo armo este archivo (no se commitea):

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Negocio
NEXT_PUBLIC_WHATSAPP_NUMBER=549...
NEXT_PUBLIC_BRAND_NAME=Magic

# Admin (server-side only, sin NEXT_PUBLIC_)
ADMIN_USER=...
ADMIN_PASS=...
```

Y replico las mismas variables en Vercel → Project Settings → Environment Variables.

---

## 6. Archivos de Firebase que voy a crear

```
firebase.json          config del CLI (rules + indexes)
.firebaserc            project id alias
firestore.rules        reglas Firestore
firestore.indexes.json composite indexes (si hacen falta)
storage.rules          reglas Storage
src/lib/firebase/
  ├─ client.ts         initializeApp + getFirestore + getStorage
  ├─ adapter.ts        FirebaseAdapter implements Adapter
  ├─ schema.ts         validación Zod antes de write
  └─ storage.ts        upload / delete imágenes con path determinístico
```

---

## 7. Estructura Firestore que voy a crear

```
/productos/{productoId}                  (id auto)
  ├─ nombre: string                      req, 1-80 chars
  ├─ precio: number                      req, >0
  ├─ categoria: "ropa"|"juguetes"|"accesorios"   req, enum
  ├─ marca: "disney"|"marvel"|"otra"     req, enum
  ├─ imagenes: Array<{
  │     url: string,
  │     storagePath: string
  │  }>                                  req, length >= 1
  ├─ descripcion: string                 opt, max 500
  ├─ oferta: boolean                     default false
  ├─ precioAnterior: number              opt (requerido si oferta=true)
  ├─ activo: boolean                     default true
  ├─ createdAt: serverTimestamp
  └─ updatedAt: serverTimestamp

/config/site                             singleton — datos editables del negocio
  ├─ whatsappNumero, direccion, horarios, mapsEmbedSrc,
  │  socials: { instagram, facebook, tiktok }
  └─ updatedAt
```

---

## 8. Reglas que voy a desplegar

`firestore.rules` — público lee `productos` activos, solo admin escribe.
`storage.rules` — público lee imágenes, solo admin sube. Límite 2MB, solo `image/*`.

(Hoy en Spark/dev son básicas; cuando habilites Firebase Auth refinamos por claims.)

---

## 9. Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init           # selecciono firestore + storage, NO hosting
firebase deploy --only firestore:rules,storage:rules
```

Vos NO tenés que correr nada de esto. Yo lo hago una vez que tenga las variables. Te pido sólo:
- Confirmar que tu cuenta Google tiene acceso owner al proyecto.
- Mandarme el archivo lleno.

---

## ✅ Checklist final antes de avisarme

- [ ] Proyecto creado en Firebase Console.
- [ ] Firestore + Storage habilitados.
- [ ] App web registrada y `firebaseConfig` arriba pegado.
- [ ] Sección 3 (datos negocio) completa.
- [ ] Sección 4 (admin user/pass) completa.

Cuando tengas todo, decime "Firebase listo" + pegame este archivo de vuelta. Sigo desde ahí.
