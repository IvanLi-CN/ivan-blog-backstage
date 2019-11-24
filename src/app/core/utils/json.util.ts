
export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
}

export function parseJSON(string) {
  if (!isJSON(string)) {
    return {};
  }
  let json = null;
  try {
    json = JSON.parse(string);
    if (json && typeof json == 'object') {
      for (var key in json) {
        if (json.hasOwnProperty(key)
          && (json[key] == null || json[key] == undefined || json[key] == '')) {
          delete json[key];
        }
      }
    } else {
      json = {};
    }
  } catch (e) {
    json = {};
  }
  return json;
}
