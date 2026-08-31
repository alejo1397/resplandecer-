// Punto de entrada de la capa de acceso a datos.
//
// Queries PUBLICAS (web publica): solo leen registros con estado = true.
export * from "./catalogo";
export * from "./contenido";
export * from "./clientes";

// Queries ADMINISTRATIVAS (panel admin): CRUD completo, ver src/lib/queries/admin/
