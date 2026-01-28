# Arquitecturas de Software: Monolítica vs Microservicios

Este documento describe dos de los estilos de arquitectura de software más comunes: **arquitectura monolítica** y **arquitectura de microservicios**, sus ventajas y los casos de uso más adecuados para cada una.

---

## 🧱 ¿Qué es la arquitectura monolítica?

La **arquitectura monolítica** es un modelo de desarrollo de software tradicional en el que **toda la aplicación se construye y despliega como una sola unidad**.  
Todas las funciones empresariales —interfaz de usuario, lógica de negocio y acceso a datos— residen en un **único código base**.

En sistemas monolíticos, los distintos módulos están fuertemente acoplados y se ejecutan dentro del mismo proceso.

---

## ✅ Ventajas de la arquitectura monolítica

- **Desarrollo más sencillo**  
  Al existir una única base de código, la aplicación es más fácil de crear, entender y modificar, especialmente para equipos pequeños.

- **Despliegue simple**  
  El sistema se empaqueta como un único archivo o servicio ejecutable, lo que simplifica el proceso de despliegue y mantenimiento.

- **Depuración sin complicaciones**  
  Las pruebas end-to-end y la depuración son más directas, ya que se puede utilizar un sistema de registro centralizado sin necesidad de coordinar múltiples servicios.

- **Mayor seguridad inicial**  
  Al tratarse de un sistema cerrado, todo el procesamiento de datos ocurre dentro del mismo entorno, reduciendo la superficie de ataque frente a amenazas externas.

---

## 🧩 Casos de uso de la arquitectura monolítica

La arquitectura monolítica es ideal cuando se requiere simplicidad y rapidez:

- **Startups**  
  Las startups necesitan moverse rápido y optimizar recursos. Un monolito permite desarrollar, probar y lanzar productos de forma ágil y económica, sin la complejidad adicional de los microservicios.

- **Proyectos pequeños o prototipos**  
  Para aplicaciones simples o MVPs, una única base de código facilita el desarrollo sin necesidad de integrar múltiples sistemas o servicios distribuidos.

---

## 🔗 ¿Qué son los microservicios?

La **arquitectura de microservicios** es un estilo arquitectónico moderno y nativo de la nube en el que una aplicación se compone de **múltiples servicios pequeños, independientes y débilmente acoplados**.

Cada microservicio:
- Se enfoca en una función específica del negocio
- Puede desarrollarse, desplegarse y escalarse de manera independiente
- Se comunica con otros servicios mediante APIs o mensajería

---

## 🚀 Ventajas de la arquitectura de microservicios

- **Alta escalabilidad**  
  Los servicios pueden escalar de forma individual según la demanda, lo que los hace ideales para aplicaciones grandes y con cargas variables.

- **Orientada a la automatización**  
  Facilita la adopción de prácticas de **CI/CD**, permitiendo despliegues frecuentes y automatizados sin afectar todo el sistema.

- **Operación independiente**  
  Cada servicio se ejecuta en su propia “celda operativa”, evitando que fallos o cambios en un servicio impacten directamente en los demás.

---

## 🧠 Casos de uso de la arquitectura de microservicios

Los microservicios son más adecuados para sistemas complejos y en crecimiento:

- **Comercio electrónico**  
  Plataformas de e-commerce requieren alta disponibilidad, escalabilidad y la capacidad de evolucionar rápidamente sin afectar todo el sistema.

- **Plataformas de entretenimiento**  
  Empresas como Netflix migraron de monolitos a microservicios para soportar cargas variables a nivel global y mejorar la resiliencia del sistema.

- **Equipos técnicos especializados**  
  Debido a su complejidad, los microservicios requieren equipos con experiencia en sistemas distribuidos, automatización, monitoreo y DevOps.

---

## 🎯 Conclusión

No existe una arquitectura “mejor” en términos absolutos.  
La elección entre **monolito** y **microservicios** depende de factores como:

- Tamaño del equipo
- Complejidad del proyecto
- Presupuesto
- Escalabilidad esperada
- Tiempo de salida al mercado

👉 En muchos casos, **comenzar con un monolito y evolucionar gradualmente hacia microservicios** es una estrategia práctica y efectiva.


## Docs y videos complementarios
- https://www.ibm.com/mx-es/think/topics/monolithic-architecture
- https://www.youtube.com/watch?v=f6zXyq4VPP8