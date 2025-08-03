# ✅ NextAuth Setup Notes 

## 1. Create Auth Folder and Files
- Create folder: `app/api/auth/[...nextauth]/`
- Add two files inside:
  - `options.ts` → contains and exports `authOptions`
  - `route.ts` → imports `authOptions` and passes it to NextAuth handler
  - Export handler as `GET` and `POST`

## 2. Define Auth Options (`options.ts`)
- Set up providers (e.g., GitHub, Google)
- Configure callbacks (e.g., modify session)
- Export the `authOptions` object

## 3. API Route Handler (`route.ts`)
- Import `NextAuth` and `authOptions`
- Initialize handler with `NextAuth(authOptions)`
- Export:
  ```ts
  export { handler as GET, handler as POST }

## 4. Create AuthProvider Component
- Path: context/AuthProvider.tsx
- Wrap children with SessionProvider from next-auth/react
- Use this provider in your root layout

## 5. Add Middleware for Route Protection
- Create middleware.ts at root
- Use withAuth to protect routes
- Configure matcher for protected paths
- Redirect unauthenticated users to login

## 6. Extend NextAuth Types
- Create file: types/next-auth.d.ts
- Extend Session and User interfaces to include custom fields
- Ensures type safety in authOptions and across the app

# ✅ Email sending

- Resend for sending emails
- configure email template usng react email 

