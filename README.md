
# FrontBarlink

Este es el repositorio del frontend para el proyecto Barlink, desarrollado utilizando Expo (React Native). La aplicación permite a los usuarios interactuar con bares y restaurantes, facilitando el flujo de pedidos, notificaciones, pagos y gestión de grupos, entre otras funciones.

## Estructura del Proyecto

### Raíz del Proyecto
- **`index.tsx`**: Archivo principal que inicializa la aplicación.

### Estructura de Carpetas

1. **`App/bar`**
   - **`auth`**: Contiene las pantallas relacionadas con la autenticación para usuarios de bar:
     - `BarConfirmEmailScreen.tsx`
     - `BarForgotPasswordScreen.tsx`
     - `BarNewPasswordScreen.tsx`
     - `BarSignInScreen.tsx`
     - `BarSignUpScreen.tsx`
   - **`notifications`**: Pantalla para gestionar notificaciones de bar:
     - `index.tsx`
   - **`orders`**: Maneja la visualización y gestión de pedidos:
     - `OrderDetail.tsx`
     - `Orders.tsx`
     - `ProductUnavailable.tsx`
     - `[id].tsx`

2. **`App/barAdmin`**
   - **`mainScreen`**: Pantalla principal para administradores de bar:
     - `index.tsx`

3. **`App/client`**
   - **`account`**: Pantallas para gestionar la cuenta del cliente:
     - `AccountSettingsScreen.tsx`
     - `ChangePasswordScreen.tsx`
     - `UpdateProfileScreen.tsx`
   - **`auth`**: Contiene las pantallas relacionadas con la autenticación para clientes:
     - `ClientConfirmEmailScreen.tsx`
     - `ClientForgotPasswordScreen.tsx`
     - `ClientNewPasswordScreen.tsx`
     - `ClientSignInScreen.tsx`
     - `ClientSignUpScreen.tsx`
   - **`bar-details/[barId]`**: Manejo de los detalles del bar y flujos de pedido:
     - `ClientNotification.tsx`
     - `index.tsx`
     - `manage-item.tsx`
     - `OrderConfirmationScreen.tsx`
     - `OrderDetailScreen.tsx`
     - `OrdersHistoryScreen.tsx`
     - `OrderSummaryScreen.tsx`
     - `PaymentMethodScreen.tsx`
   - **`recommendations`**: Pantalla para mostrar recomendaciones:
     - `RecommendationsScreen.tsx`
   - **`scan`**: Maneja el escaneo de QR y la invitación a clientes:
     - `index.tsx`
     - `InviteClientsScreen.tsx`

4. **`App/Kitchen`**
   - **`Notifications`**: Manejo de notificaciones para la cocina:
     - `index.tsx`
   - **`Orders`**: Gestión de pedidos en cocina:
     - `KitchenOrders.tsx`
     - `[id].tsx`

5. **`App/waiter`**
   - Pantallas para los meseros:
     - `WaiterHomeScreen.tsx`
     - `WaiterOrdersScreen.tsx`
     - `WaiterTablesScreen.tsx`

6. **Otros**
   - **`_layout.tsx`**: Archivo de configuración global para el diseño de la aplicación.

## Requisitos Previos
1. Node.js (v16 o superior)
2. Expo CLI
3. Tener configurado el backend del proyecto [Repositorio Backend](https://github.com/snowcaz/ProyectoBarlink)

## Instalación
1. Clona este repositorio:
   ```
   git clone https://github.com/snowcaz/FrontBarlink.git
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Ejecuta el proyecto:
   ```
   npx expo start -c
   ```

## Autor
- **snowcaz** ([Repositorio GitHub](https://github.com/snowcaz/FrontBarlink))

## Contribuciones
Si deseas contribuir, realiza un fork de este repositorio, realiza tus cambios y envía un pull request.

## Licencia
Este proyecto está bajo la licencia MIT.
