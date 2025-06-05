
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