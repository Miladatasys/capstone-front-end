declare module '*.png' {
    const value: any;
    export default value;
}  

// Declaración para las variables de entorno
declare module '@env' {
    export const API_URL: string;
    // Añade más variables de entorno si es necesario
}