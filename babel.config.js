module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv', 
        {
          moduleName: '@env', // Define cómo se importan las variables
          path: '.env', // Especifica la ruta del archivo .env
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        }
      ]
    ],
  };
};
