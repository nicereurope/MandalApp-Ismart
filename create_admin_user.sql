-- Script SQL para crear el primer usuario administrador
-- Ejecuta esto DESPUÉS de registrar un usuario en la aplicación

-- 1. Primero, registra un usuario en la aplicación (por ejemplo: admin@example.com)
-- 2. Copia el UUID del usuario desde la tabla auth.users
-- 3. Ejecuta este script reemplazando el UUID

-- Paso 1: Ver todos los usuarios registrados
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Paso 2: Actualizar el rol a 'admin' para un usuario específico
-- REEMPLAZA 'USER_UUID_AQUI' con el ID del usuario que quieres hacer admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_UUID_AQUI';

-- Paso 3: Verificar que el cambio se aplicó correctamente
SELECT id, email, role, created_at 
FROM profiles 
WHERE role = 'admin';

-- Ejemplo de uso:
-- Si el usuario con email admin@example.com tiene UUID: 123e4567-e89b-12d3-a456-426614174000
-- 
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = '123e4567-e89b-12d3-a456-426614174000';
