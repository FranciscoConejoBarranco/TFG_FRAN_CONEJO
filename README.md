# 📚 TFG - BUBOOKS

Este proyecto es el resultado de mi Trabajo de Fin de Grado y consiste en una aplicación web de biblioteca digital. Está desarrollada con **Symfony** para el backend, **Angular** para el frontend y utiliza **PostgreSQL** como base de datos. Todo funciona dentro de contenedores usando **Docker Compose**, así que no hace falta instalar nada raro en el ordenador.

---

## 🚀 Cómo desplegar la aplicación

### 1. Clona el repositorio

```

git clone git@github.com:FranciscoConejoBarranco/TFG_FRAN_CONEJO.git
cd TFG_FRAN_CONEJO

```


### 2. Arranca los contenedores

```

docker-compose up -d

```

La primera vez puede tardar un poco porque se descargan las imágenes y se instalan todas las dependencias.

### 3. Comprueba que todo está en marcha

```

docker ps

```

Deberían aparecer tres contenedores: uno para el backend (Symfony), otro para el frontend (Angular) y otro para la base de datos (PostgreSQL).

---

## 🌐 Acceso a la aplicación

- **Frontend Angular:**
[http://localhost:4200](http://localhost:4200)
- **Backend Symfony (API):**
[http://localhost:8000](http://localhost:8000)
- **Base de datos PostgreSQL:**
Está en el puerto 5432 (normalmente no hace falta acceder directamente).

Nada más levantar los contenedores, ya hay 100 libros cargados para poder probar la búsqueda y el resto de funcionalidades.

---

## 📂 Estructura del proyecto

- `symfony-backend`: Aquí está el código del backend y la API.
- `angular-frontend`: Todo el código del frontend en Angular.
- `docker/`: Archivos de configuración y scripts de inicialización.

---

## 🗃️ Datos de ejemplo

Al iniciar el proyecto, la base de datos se rellena automáticamente con 100 libros de ejemplo, incluyendo título, autor, género, sinopsis y la portada (imagen).

---

## 🔧 Comandos útiles

- **Ver logs en tiempo real:**

```

docker-compose logs -f

```

- **Entrar al contenedor de Angular:**

```

docker exec -it angular_frontend sh

```

- **Entrar al contenedor de Symfony:**

```

docker exec -it symfony_backend bash

```

- **Detener los servicios:**

```

docker-compose down

```

- **Eliminar todo (incluyendo datos de la base de datos):**

```

docker-compose down -v

```


---

## 📝 Notas

- El proyecto está pensado para funcionar igual en cualquier ordenador que tenga Docker.
- Si tienes problemas de permisos con las carpetas compartidas, puedes probar:

```

sudo chmod 775 -R nombre_carpeta

```

- Si algo no funciona, revisa los logs con `docker-compose logs -f`.

---

## 📎 Enlace al TFG

[Repositorio del TFG en GitHub](https://github.com/FranciscoConejoBarranco/TFG_FRAN_CONEJO)

---

Aquí tienes la ampliación del README con las instrucciones para restaurar la base de datos, las credenciales de los usuarios de prueba, y la explicación de la configuración del `.env` y Mailtrap. El texto está adaptado para que suene natural, formal y directo, como lo escribiría un estudiante para un TFG.

---

```markdown
# 📚 TFG - BUBOOKS

Este proyecto es el resultado de mi Trabajo de Fin de Grado y consiste en una aplicación web de biblioteca digital. Está desarrollada con **Symfony** para el backend, **Angular** para el frontend y utiliza **PostgreSQL** como base de datos. Todo funciona dentro de contenedores usando **Docker Compose**, así que no hace falta instalar nada raro en el ordenador.

---

## 🚀 Cómo desplegar la aplicación

### 1. Clona el repositorio

```

git clone git@github.com:FranciscoConejoBarranco/TFG_FRAN_CONEJO.git
cd TFG_FRAN_CONEJO

```

### 2. Arranca los contenedores

```

docker-compose up -d

```

La primera vez puede tardar un poco porque se descargan las imágenes y se instalan todas las dependencias.

### 3. Comprueba que todo está en marcha

```

docker ps

```

Deberían aparecer tres contenedores: uno para el backend (Symfony), otro para el frontend (Angular) y otro para la base de datos (PostgreSQL).

---

## 🌐 Acceso a la aplicación

- **Frontend Angular:**  
  [http://localhost:4200](http://localhost:4200)

- **Backend Symfony (API):**  
  [http://localhost:8000](http://localhost:8000)

- **Base de datos PostgreSQL:**  
  Está en el puerto 5432 (normalmente no hace falta acceder directamente).

Nada más levantar los contenedores, ya hay 100 libros cargados para poder probar la búsqueda y el resto de funcionalidades.

---

## 👤 Usuarios de prueba

Para probar todas las funcionalidades de la aplicación, puedes usar estos usuarios:

- **Usuario estándar de testing:**  
  - Correo: `fran@gmail.com`  
  - Contraseña: `123456`  
  - Permite explorar todas las posibilidades del usuario normal.

- **Usuario superadmin:**  
  - Correo: `gestor@gmail.com`  
  - Contraseña: `123456`  
  - Permite acceder a las vistas y funciones de administración.

---

## 🗄️ Restaurar la base de datos

Si necesitas restaurar la base de datos (por ejemplo, si partes de cero o quieres probar con los datos originales), puedes usar el archivo `backup_tfg.sql` que se encuentra en el repositorio.

### Pasos para restaurar desde Docker:

1. Asegúrate de que el contenedor de la base de datos está en marcha (`symfony_postgres`).
2. Ejecuta este comando desde la carpeta del proyecto:

```

docker exec -i symfony_postgres psql -U symfony -d symfony_db < backup_tfg.sql

```

Esto dejará la base de datos exactamente igual que en mi entorno de desarrollo.

---

## 📂 Estructura del proyecto

- `symfony-backend`: Aquí está el código del backend y la API.
- `angular-frontend`: Todo el código del frontend en Angular.
- `docker/`: Archivos de configuración y scripts de inicialización.

---

## 🗃️ Datos de ejemplo

Al iniciar el proyecto, la base de datos se rellena automáticamente con 100 libros de ejemplo, incluyendo título, autor, género, sinopsis y la portada (imagen).

---

## 🔧 Comandos útiles

- **Ver logs en tiempo real:**
```

docker-compose logs -f

```
- **Entrar al contenedor de Angular:**
```

docker exec -it angular_frontend sh

```
- **Entrar al contenedor de Symfony:**
```

docker exec -it symfony_backend bash

```
- **Detener los servicios:**
```

docker-compose down

```
- **Eliminar todo (incluyendo datos de la base de datos):**
```

docker-compose down -v

```

---

## ⚙️ Configuración del archivo `.env`

El archivo `.env` contiene las variables de entorno necesarias para que Symfony funcione correctamente. Por defecto, ya está configurado para este entorno de desarrollo, pero hay un apartado importante para el envío de correos:

```

MAILER_DSN=smtp://**:**@sandbox.smtp.mailtrap.io:2525

```

Estoy usando **Mailtrap** como servicio de correo para desarrollo, lo que permite simular el envío de emails sin usar cuentas reales.  
**IMPORTANTE:** Si quieres probar el envío de correos, deberás poner tus propias credenciales de Mailtrap en el `.env`. Puedes registrarte gratis en [mailtrap.io](https://mailtrap.io/) y copiar tus claves en el archivo.

---

## 📝 Notas

- El proyecto está pensado para funcionar igual en cualquier ordenador que tenga Docker.
- Si tienes problemas de permisos con las carpetas compartidas, puedes probar:
```

sudo chmod 775 -R nombre_carpeta

```
- Si algo no funciona, revisa los logs con `docker-compose logs -f`.

---

## 📎 Enlace al TFG

[Repositorio del TFG en GitHub](https://github.com/FranciscoConejoBarranco/TFG_FRAN_CONEJO)

---