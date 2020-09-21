class ReducerHelper {
    genID() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-4" +
        S4().substr(0, 3) +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      ).toLowerCase();
    }
  
    getRandomDate() {
      let result = new Date();
      let random = Math.random();
      while(random < 0.2)
      {
        random = Math.random();
      }
      result.setDate(result.getDate() + random * 10);
      return result;
    }
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
  
  const instance = new ReducerHelper();
  export default instance;
  