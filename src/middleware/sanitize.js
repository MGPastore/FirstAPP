const sanitizeInput = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (typeof req.body[key] === 'string') {
            // Escapar caracteres especiales para prevenir inyecciones SQL
            req.body[key] = sanitizeString(req.body[key]);
          }
        }
      }
    }
    
    next();
  };
  
  const sanitizeString = (value) => {
    // Escapar comillas simples y dobles
    value = value.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    // Eliminar comandos SQL como comentarios
    value = value.replace(/\/\*.*\*\//g, '');
  
    // Eliminar palabras clave SQL
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'TABLE', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'JOIN'
    ];
  
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      value = value.replace(regex, '');
    });
  
    return value;
  };
  
  module.exports = sanitizeInput;
  